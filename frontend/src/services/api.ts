import { TelemetryState, AlertRecord, FleetVehicle } from '../types';

const host = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost';
const API_BASE = `http://${host}:8000/api`;

export async function fetchLatestTelemetry(): Promise<TelemetryState | null> {
  try {
    const res = await fetch(`${API_BASE}/telemetry/latest`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function setBackendScenario(scenario: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/simulation/scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function controlBackendSimulation(action: string, speed?: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/simulation/control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, speed }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function startBackendGuidedDemo(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/simulation/guided-demo`, {
      method: 'POST',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function setOperatingMode(mode: 'DEMO_MODE' | 'LIVE_HARDWARE'): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/mode/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchFleet(): Promise<FleetVehicle[]> {
  try {
    const res = await fetch(`${API_BASE}/fleet`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    // Fallback default fleet list
    return [
      {
        id: "DUMPER_01",
        name: "CAT 777E Dumper #01 (Focus)",
        status: "ACTIVE",
        speed_kmh: 14.5,
        location: "Haul Ramp North - Sector 4",
        risk_level: "DYNAMIC",
        connection: "4G LTE (Online)",
        driver: "R. Kumar (ID: 4108)",
        payload_tons: 98.4
      },
      {
        id: "DUMPER_02",
        name: "Komatsu HD785 #02",
        status: "ACTIVE",
        speed_kmh: 9.2,
        location: "Crusher Loading Bay 2",
        risk_level: "WARNING",
        connection: "4G LTE (Online)",
        driver: "M. Soren (ID: 3290)",
        payload_tons: 92.0
      },
      {
        id: "DUMPER_03",
        name: "CAT 777E Dumper #03",
        status: "ACTIVE",
        speed_kmh: 16.8,
        location: "Overburden Dump Area C",
        risk_level: "SAFE",
        connection: "4G LTE (Online)",
        driver: "A. Tirkey (ID: 5512)",
        payload_tons: 0.0
      },
      {
        id: "SERVICE_01",
        name: "Safety Patrol / Service Truck #01",
        status: "PATROLLING",
        speed_kmh: 22.0,
        location: "Pit Access Road South",
        risk_level: "SAFE",
        connection: "4G LTE (Online)",
        driver: "S. Verma (Safety Officer)",
        payload_tons: 2.5
      }
    ];
  }
}

export async function fetchAlerts(): Promise<AlertRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return [
      {
        id: 1,
        timestamp: "23:41:02",
        severity: "CRITICAL",
        message: "Person detected on haul road corridor (2.1m)",
        category: "COLLISION_RISK",
        sms_sent: true,
        sms_details: "4G SMS dispatched to +91-98765-43210 (Mine Safety Control)"
      },
      {
        id: 2,
        timestamp: "23:40:57",
        severity: "WARNING",
        message: "Dumper #02 closing on haul road intersection at 7.4m",
        category: "PROXIMITY",
        sms_sent: false
      },
      {
        id: 3,
        timestamp: "23:40:42",
        severity: "CAUTION",
        message: "Monsoon fog: Optical visibility dropped below 35% threshold",
        category: "ENVIRONMENT",
        sms_sent: false
      },
      {
        id: 4,
        timestamp: "23:40:21",
        severity: "INFO",
        message: "NEO-6M GPS 3D fix locked (8 satellites active)",
        category: "LOCALIZATION",
        sms_sent: false
      }
    ];
  }
}
