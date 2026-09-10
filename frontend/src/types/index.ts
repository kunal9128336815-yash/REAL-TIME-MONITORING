export type RiskLevel = 'SAFE' | 'CAUTION' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

export type DetailModalType = 
  | 'risk'
  | 'vision'
  | 'digital_twin'
  | 'map'
  | 'fusion'
  | 'ultrasonic'
  | 'visibility'
  | 'driver'
  | 'alert'
  | 'fleet'
  | null;

export type ScenarioType = 
  | 'NORMAL_OPERATION'
  | 'DENSE_FOG'
  | 'PERSON_ON_ROAD'
  | 'DUMPER_APPROACHING'
  | 'OBSTACLE_AHEAD'
  | 'MULTI_HAZARD'
  | 'NO_HARDWARE_FEED';

export interface GpsData {
  lat: number;
  lon: number;
  speed_kmh: number;
  heading_deg: number;
  fix_status: string;
}

export interface UltrasonicData {
  front: number;
  rear: number;
  left: number;
  right: number;
}

export interface ImuData {
  acceleration_g: number;
  tilt_deg: number;
  motion_status: string;
}

export interface VisibilityData {
  index_percent: number;
  label: 'CLEAR' | 'LIGHT FOG' | 'MODERATE FOG' | 'DENSE FOG' | 'CRITICAL VISIBILITY' | 'OFFLINE';
  optical_degraded: boolean;
  advisory: string;
}

export interface VisionDetection {
  class_id: number; // 0: person, 1: dumper, 2: obstacle
  class_name: 'person' | 'dumper' | 'obstacle';
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, w, h] normalized 0-1
  distance_est: number;
}

export interface VisionData {
  model: string;
  inference_status: string;
  fps: number;
  inference_time_ms: number;
  detections: VisionDetection[];
}

export interface DriverSafetyData {
  status: 'SAFE' | 'WARNING' | 'OFFLINE';
  distraction_detected: boolean;
  earphone_confidence: number;
  message: string;
}

export interface SensorConfidence {
  camera: number;
  ultrasonic: number;
  gps: number;
  imu: number;
  gsm: number;
}

export interface RiskData {
  risk_level: RiskLevel;
  risk_score: number; // 0-100
  action: string;
  ttc_seconds: number | null;
  hazard_summary: string;
  reasons: string[];
  emergency_sms_required: boolean;
  driver_safety: DriverSafetyData;
  sensor_confidence: SensorConfidence;
}

export interface GsmData {
  online: boolean;
  signal_dbm: number;
  csq: number; // 0-31
  carrier: string;
  ip: string;
  uplink_rate_kbps: number;
  sms_sent_count: number;
}

export interface SystemHealthData {
  raspberry_pi: string;
  pi_camera: string;
  yolo_engine: string;
  ultrasonic_array: string;
  neo6m_gps: string;
  mpu6050_imu: string;
  gsm_4g_sim: string;
  backend: string;
  database: string;
  latency_ms: number | null;
}

export interface DataIntegrityData {
  valid: boolean;
  status: string;
  last_packet_age_sec?: number | null;
  packet_count?: number;
  warnings?: string[];
}

export interface GuidedDemoState {
  active: boolean;
  phase: number;
  total_phases: number;
  phase_title?: string;
  time_remaining?: number;
}

export interface TelemetryState {
  vehicle_id: string;
  timestamp: string;
  mode: 'DEMO_MODE' | 'LIVE_HARDWARE' | 'OFFLINE';
  scenario: ScenarioType | string;
  online?: boolean;
  guided_demo: GuidedDemoState;
  gps: GpsData;
  ultrasonic: UltrasonicData;
  imu: ImuData;
  visibility: VisibilityData;
  vision: VisionData;
  risk: RiskData;
  gsm: GsmData;
  system_health: SystemHealthData;
  data_integrity?: DataIntegrityData;
}

export interface AlertRecord {
  id: number;
  timestamp: string;
  severity: 'CRITICAL' | 'WARNING' | 'CAUTION' | 'INFO';
  message: string;
  category: string;
  sms_sent: boolean;
  sms_details?: string;
}

export interface FleetVehicle {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PATROLLING' | 'MAINTENANCE' | 'OFFLINE';
  speed_kmh: number;
  location: string;
  risk_level: 'SAFE' | 'CAUTION' | 'WARNING' | 'CRITICAL' | 'DYNAMIC';
  connection: string;
  driver: string;
  payload_tons: number;
}

export interface HistoricalDataPoint {
  time: string;
  speed: number;
  ttc: number;
  visibility: number;
  front_distance: number;
  risk_numeric: number; // 0: Safe, 1: Caution, 2: Warning, 3: Critical
}
