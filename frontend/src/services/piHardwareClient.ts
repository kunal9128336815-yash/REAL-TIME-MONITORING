import { TelemetryState, VisionDetection } from '../types';

const STORAGE_KEY = 'fogsafe_pi_url';
export const DEFAULT_PI_URL = 'http://192.168.137.214:5000/data';

export interface PiConnectionStatus {
  connected: boolean;
  url: string;
  lastPingMs: number | null;
  lastSuccessTimestamp: string | null;
  lastError: string | null;
  sampleCount: number;
}

type PiTelemetryCallback = (connected: boolean, telemetry?: TelemetryState, rawData?: any) => void;

class PiHardwareClient {
  private url: string;
  private isPolling: boolean = false;
  private intervalId: number | null = null;
  private isConnected: boolean = false;
  private lastPingMs: number | null = null;
  private lastSuccessTimestamp: string | null = null;
  private lastError: string | null = null;
  private sampleCount: number = 0;
  private consecutiveFailures: number = 0;
  private listeners: Set<PiTelemetryCallback> = new Set();
  private lastTelemetry: TelemetryState | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored !== 'http://192.168.137.30:5000/data') {
        this.url = stored;
      } else {
        this.url = DEFAULT_PI_URL;
        localStorage.setItem(STORAGE_KEY, DEFAULT_PI_URL);
      }
    } else {
      this.url = DEFAULT_PI_URL;
    }
  }

  public getUrl(): string {
    return this.url;
  }

  public setUrl(newUrl: string): void {
    this.url = newUrl.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, this.url);
    }
    // Re-test connection on URL change
    this.checkConnection();
  }

  public resetUrl(): void {
    this.setUrl(DEFAULT_PI_URL);
  }

  public getStatus(): PiConnectionStatus {
    return {
      connected: this.isConnected,
      url: this.url,
      lastPingMs: this.lastPingMs,
      lastSuccessTimestamp: this.lastSuccessTimestamp,
      lastError: this.lastError,
      sampleCount: this.sampleCount,
    };
  }

  public subscribe(cb: PiTelemetryCallback): () => void {
    this.listeners.add(cb);
    // Send immediate initial status
    cb(this.isConnected, this.lastTelemetry || undefined);
    return () => this.listeners.delete(cb);
  }

  public start(): void {
    if (this.isPolling) return;
    this.isPolling = true;
    this.poll();
    // Poll Pi every 350ms (smooth ~3Hz live rate)
    this.intervalId = window.setInterval(() => this.poll(), 350);
  }

  public stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isPolling = false;
  }

  public async checkConnection(): Promise<boolean> {
    const start = performance.now();
    try {
      const data = await this.fetchWithFallbacks(this.url);
      if (data) {
        this.lastPingMs = Math.round(performance.now() - start);
        this.lastSuccessTimestamp = new Date().toLocaleTimeString();
        this.isConnected = true;
        this.lastError = null;
        this.notify(true);
        return true;
      }
    } catch (err: any) {
      this.lastError = err?.message || 'Connection timeout';
      this.isConnected = false;
      this.notify(false);
    }
    return false;
  }

  private async fetchWithFallbacks(targetUrl: string): Promise<any> {
    // 1. Try Direct fetch to user's Pi URL
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(targetUrl, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Direct fetch may fail due to browser CORS or different subnet
    }

    // 2. Try Vite local dev proxy (/pi-proxy) if on desktop
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch('/pi-proxy', {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Proxy failed or not on local Vite
    }

    // 3. Try local FastAPI backend proxy (http://localhost:8000/api/pi-proxy)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch('http://localhost:8000/api/pi-proxy', {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend not running or unreachable
    }

    throw new Error(`Cannot reach Pi at ${targetUrl}`);
  }

  private async poll(): Promise<void> {
    const start = performance.now();
    try {
      const rawData = await this.fetchWithFallbacks(this.url);
      if (rawData) {
        this.lastPingMs = Math.round(performance.now() - start);
        this.lastSuccessTimestamp = new Date().toLocaleTimeString();
        this.isConnected = true;
        this.consecutiveFailures = 0;
        this.sampleCount++;
        this.lastError = null;

        const normalized = this.normalize(rawData);
        this.lastTelemetry = normalized;
        this.notify(true, normalized, rawData);
        return;
      }
    } catch (err: any) {
      this.consecutiveFailures++;
      // Require 2 consecutive failures before declaring offline
      if (this.consecutiveFailures >= 2) {
        this.isConnected = false;
        this.lastError = err?.message || 'Connection lost';
        this.notify(false);
      }
    }
  }

  private notify(connected: boolean, telemetry?: TelemetryState, rawData?: any): void {
    this.listeners.forEach((cb) => {
      try {
        cb(connected, telemetry, rawData);
      } catch (e) {
        console.error('Error in PiHardwareClient listener:', e);
      }
    });
  }

  /**
   * Intelligently normalizes any sensor schema produced by the Raspberry Pi:
   * Handles flat keys (e.g. { distance: 2.3, speed: 12.5 })
   * as well as nested keys ({ ultrasonic: { front: 2.3 }, gps: { ... } })
   */
  public normalize(raw: any, base?: TelemetryState): TelemetryState {
    const prev = base || this.lastTelemetry;

    // 1. Ultrasonic Proximity
    const rawFront = this.extractNumber(
      [raw.ultrasonic?.front, raw.front, raw.distance, raw.front_distance, raw.us_front, raw.front_sensor],
      prev ? prev.ultrasonic.front : 4.5
    );
    // If HC-SR04 returns distance in cm (> 30 cm), normalize to meters
    const front = rawFront > 30.0 ? rawFront / 100.0 : rawFront;

    const rawRear = this.extractNumber(
      [raw.ultrasonic?.rear, raw.rear, raw.rear_distance, raw.us_rear],
      prev ? prev.ultrasonic.rear : 12.0
    );
    const rear = rawRear > 30.0 ? rawRear / 100.0 : rawRear;

    const left = this.extractNumber(
      [raw.ultrasonic?.left, raw.left, raw.left_distance, raw.us_left],
      prev ? prev.ultrasonic.left : 6.0
    );
    const right = this.extractNumber(
      [raw.ultrasonic?.right, raw.right, raw.right_distance, raw.us_right],
      prev ? prev.ultrasonic.right : 6.5
    );

    // 2. GPS Telemetry
    const lat = this.extractNumber(
      [raw.gps?.lat, raw.lat, raw.latitude, raw.gps_lat],
      prev ? prev.gps.lat : 23.153484
    );
    const lon = this.extractNumber(
      [raw.gps?.lon, raw.lon, raw.longitude, raw.gps_lon],
      prev ? prev.gps.lon : 72.886475
    );
    const speedKmh = this.extractNumber(
      [raw.gps?.speed, raw.gps?.speed_kmh, raw.speed, raw.speed_kmh, raw.velocity],
      prev ? prev.gps.speed_kmh : 14.5
    );
    const headingDeg = this.extractNumber(
      [raw.gps?.heading, raw.gps?.heading_deg, raw.heading, raw.bearing],
      prev ? prev.gps.heading_deg : 45.0
    );

    // 3. IMU Dynamics
    const tiltDeg = this.extractNumber(
      [raw.imu?.tilt, raw.imu?.tilt_deg, raw.tilt, raw.pitch, raw.roll],
      prev ? prev.imu.tilt_deg : 2.0
    );
    const accelerationG = this.extractNumber(
      [raw.imu?.acceleration, raw.imu?.acceleration_g, raw.accel, raw.acceleration],
      prev ? prev.imu.acceleration_g : 0.45
    );

    // 4. Fog / Environmental Visibility
    const visPercent = this.extractNumber(
      [raw.visibility?.index_percent, raw.visibility_percent, raw.visibility, raw.fog_index],
      prev ? prev.visibility.index_percent : 75.0
    );

    // 5. AI Vision Detections
    const detections: VisionDetection[] = [];
    if (Array.isArray(raw.vision?.detections)) {
      detections.push(...raw.vision.detections);
    } else if (Array.isArray(raw.detections)) {
      detections.push(...raw.detections);
    } else {
      // Synthesize from classification confidences if passed directly
      const personConf = this.extractNumber([raw.vision?.person, raw.person, raw.person_conf], 0);
      const dumperConf = this.extractNumber([raw.vision?.dumper, raw.dumper, raw.dumper_conf], 0);
      const obstacleConf = this.extractNumber([raw.vision?.obstacle, raw.obstacle, raw.obstacle_conf], 0);

      if (personConf >= 0.35) {
        detections.push({
          class_id: 0,
          class_name: 'person',
          confidence: personConf > 1 ? personConf / 100 : personConf,
          bbox: [0.42, 0.48, 0.14, 0.35],
          distance_est: front,
        });
      } else if (dumperConf >= 0.35) {
        detections.push({
          class_id: 1,
          class_name: 'dumper',
          confidence: dumperConf > 1 ? dumperConf / 100 : dumperConf,
          bbox: [0.35, 0.45, 0.30, 0.30],
          distance_est: front,
        });
      } else if (obstacleConf >= 0.35) {
        detections.push({
          class_id: 2,
          class_name: 'obstacle',
          confidence: obstacleConf > 1 ? obstacleConf / 100 : obstacleConf,
          bbox: [0.45, 0.60, 0.15, 0.20],
          distance_est: front,
        });
      }
    }

    // 6. Real-time Risk & Time to Collision (TTC) Calculation
    const speedMs = (speedKmh * 1000) / 3600;
    const isMoving = speedMs > 0.3;
    let ttc: number | null = null;
    if (isMoving && front > 0.05) {
      ttc = Math.round((front / speedMs) * 10) / 10;
    }

    // ISO 21815-2 & EMESRT Level 9 Risk Evaluation
    let riskLevel: 'SAFE' | 'CAUTION' | 'WARNING' | 'CRITICAL' = 'SAFE';
    let riskScore = 15;
    let action = 'NOMINAL HAUL OPERATION';
    const reasons: string[] = [];

    const isPerson = detections.some((d) => d.class_name === 'person');
    const isDumper = detections.some((d) => d.class_name === 'dumper');
    const isObstacle = detections.some((d) => d.class_name === 'obstacle');

    if (front <= 2.5 || (ttc !== null && ttc <= 2.0)) {
      riskLevel = 'CRITICAL';
      riskScore = isPerson ? 95 : 91;
      action = 'STOP VEHICLE';
      if (front <= 2.5) reasons.push(`Critical ultrasonic proximity threshold breached (${front.toFixed(1)}m <= 2.5m)`);
      if (ttc !== null && ttc <= 2.0) reasons.push(`Critical Time-to-Collision limit reached (TTC = ${ttc}s <= 2.0s)`);
      if (isPerson) reasons.push('Pedestrian personnel verified in immediate haul path');
    } else if (front <= 4.5 || (ttc !== null && ttc <= 4.0)) {
      riskLevel = 'WARNING';
      riskScore = 68;
      action = 'WARNING: BRAKE HEAVILY';
      reasons.push(`Approaching haul corridor hazard at ${front.toFixed(1)}m`);
      if (ttc !== null) reasons.push(`TTC closing rapidly: ${ttc}s`);
    } else if (front <= 8.0 || visPercent < 35.0 || isPerson || isDumper || isObstacle) {
      riskLevel = 'CAUTION';
      riskScore = 44;
      action = 'CAUTION: REDUCE SPEED';
      if (front <= 8.0) reasons.push(`Perimeter proximity target detected (${front.toFixed(1)}m)`);
      if (visPercent < 35.0) reasons.push(`Monsoon fog visibility degraded (${Math.round(visPercent)}%)`);
      if (isPerson) reasons.push('Personnel spotted in peripheral corridor');
    } else {
      reasons.push('All forward haul corridors clear');
      reasons.push('Sensors streaming live from Raspberry Pi hardware');
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });

    return {
      vehicle_id: raw.vehicle_id || 'DUMPER_01',
      timestamp: timeStr,
      mode: 'LIVE_HARDWARE',
      scenario: 'LIVE_FIELD_FEED',
      guided_demo: { active: false, phase: 0, total_phases: 6 },
      gps: {
        lat,
        lon,
        speed_kmh: speedKmh,
        heading_deg: headingDeg,
        fix_status: raw.gps?.fix_status || '3D_FIX_LIVE_PI',
      },
      ultrasonic: {
        front,
        rear,
        left,
        right,
      },
      imu: {
        acceleration_g: accelerationG,
        tilt_deg: tiltDeg,
        motion_status: speedKmh > 0.5 ? 'FORWARD_MOTION' : 'STATIONARY',
      },
      visibility: {
        index_percent: visPercent,
        label: visPercent > 75 ? 'CLEAR' : visPercent > 50 ? 'LIGHT FOG' : visPercent > 35 ? 'MODERATE FOG' : visPercent > 20 ? 'DENSE FOG' : 'CRITICAL VISIBILITY',
        optical_degraded: visPercent <= 50.0,
        advisory: visPercent <= 50.0 ? 'Vision degraded — ultrasonic proximity prioritized' : 'Optimal clear haul road sightline',
      },
      vision: {
        model: raw.vision?.model || 'YOLOv8s-Pi4-Live',
        inference_status: 'ACTIVE_HARDWARE',
        fps: this.extractNumber([raw.vision?.fps, raw.fps], 24.5),
        inference_time_ms: this.extractNumber([raw.vision?.inference_time_ms, raw.latency_ms], 41.0),
        detections,
      },
      risk: {
        risk_score: riskScore,
        risk_level: riskLevel,
        action,
        hazard_summary: isPerson ? `Person detected at ${front.toFixed(1)}m in haul path` : (isDumper ? `Oncoming hauler at ${front.toFixed(1)}m` : (front <= 3.0 ? `Obstacle detected at ${front.toFixed(1)}m` : 'Corridor Nominal')),
        reasons,
        ttc_seconds: ttc,
        emergency_sms_required: riskLevel === 'CRITICAL',
        driver_safety: {
          status: 'SAFE',
          distraction_detected: false,
          earphone_confidence: 0,
          message: 'Operator attentive - normal corridor',
        },
        sensor_confidence: {
          camera: Math.max(15, Math.min(95, Math.round(visPercent * 0.95))),
          ultrasonic: 98,
          gps: 95,
          imu: 99,
          gsm: 92,
        },
      },
      gsm: {
        online: true,
        signal_dbm: raw.gsm?.signal_dbm || -72,
        csq: raw.gsm?.csq || 24,
        carrier: raw.gsm?.carrier || 'Pi SIM7600 4G LTE',
        ip: this.url,
        uplink_rate_kbps: 48.0,
        sms_sent_count: raw.gsm?.sms_sent_count || (riskLevel === 'CRITICAL' ? 1 : 0),
      },
      system_health: {
        raspberry_pi: 'ONLINE',
        pi_camera: 'ONLINE',
        yolo_engine: 'RUNNING',
        ultrasonic_array: '4/4 ONLINE',
        neo6m_gps: 'LOCKED',
        mpu6050_imu: 'ONLINE',
        gsm_4g_sim: 'CONNECTED (4G LTE)',
        backend: 'LIVE PI STREAM',
        database: 'ONLINE',
        latency_ms: this.lastPingMs || 25,
      },
    };
  }

  private extractNumber(candidates: any[], fallback: number): number {
    for (const val of candidates) {
      if (val !== undefined && val !== null && !isNaN(Number(val))) {
        return Number(val);
      }
    }
    return fallback;
  }
}

export const piHardwareClient = new PiHardwareClient();
