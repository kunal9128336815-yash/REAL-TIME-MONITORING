# FOG-SAFE: Hardware & API Integration Reference

This document provides technical documentation for the REST and WebSocket interfaces connecting the **Raspberry Pi 4 Edge Node** (onboard the mining dumper) to the **Central Mine Command Server**.

---

## 1. Edge Hardware Ingestion Endpoint

### `POST /api/sensors`

Sent periodically (e.g., 5 Hz – 10 Hz) by the onboard Python script running on Raspberry Pi 4 over the **SIM7600 4G LTE SIM Module** or local haul-road Wi-Fi mesh.

#### Request Headers:
```http
Content-Type: application/json
X-Vehicle-ID: DUMPER_01
X-API-Key: mining-safety-mesh-key-2026
```

#### JSON Payload:
```json
{
  "vehicle_id": "DUMPER_01",
  "gps": {
    "lat": 22.71960,
    "lon": 75.85770,
    "speed": 14.5,
    "heading": 45.2
  },
  "ultrasonic": {
    "front": 4.2,
    "rear": 12.8,
    "left": 7.4,
    "right": 9.1
  },
  "imu": {
    "acceleration": 0.42,
    "tilt": 2.1
  },
  "vision": {
    "person": 0.92,
    "dumper": 0.00,
    "obstacle": 0.00,
    "earphone": 0.00
  },
  "gsm": {
    "signal_dbm": -74,
    "csq": 24,
    "carrier": "MineLink 4G Private APN",
    "ip": "10.144.28.105"
  },
  "visibility_percent": 34.0
}
```

#### Response:
```json
{
  "status": "success",
  "received_at": 1773079800.12,
  "risk_level": "CRITICAL"
}
```

---

## 2. Real-Time Telemetry Stream

### `WebSocket /ws/telemetry`

High-frequency bi-directional WebSocket connection streaming vehicle dynamics, collision risk calculations, bounding boxes, and system health status.

#### Broadcast Payload:
```json
{
  "vehicle_id": "DUMPER_01",
  "timestamp": "23:41:02",
  "mode": "DEMO_MODE",
  "scenario": "PERSON_ON_ROAD",
  "gps": {
    "lat": 22.7202,
    "lon": 75.8584,
    "speed_kmh": 12.8,
    "heading_deg": 48.0,
    "fix_status": "3D_FIX_8_SATS"
  },
  "ultrasonic": {
    "front": 2.8,
    "rear": 14.2,
    "left": 4.2,
    "right": 5.8
  },
  "imu": {
    "acceleration_g": 0.45,
    "tilt_deg": 2.1,
    "motion_status": "FORWARD_MOTION"
  },
  "visibility": {
    "index_percent": 32.0,
    "label": "DENSE FOG",
    "optical_degraded": true,
    "advisory": "Vision degraded — proximity sensing maintained"
  },
  "vision": {
    "model": "YOLOv8s-Mining-v2",
    "inference_status": "ACTIVE",
    "fps": 28.5,
    "inference_time_ms": 34.2,
    "detections": [
      {
        "class_id": 0,
        "class_name": "person",
        "confidence": 0.92,
        "bbox": [0.42, 0.48, 0.14, 0.35],
        "distance_est": 2.8
      }
    ]
  },
  "risk": {
    "risk_level": "CRITICAL",
    "action": "STOP VEHICLE IMMEDIATELY",
    "ttc_seconds": 1.9,
    "hazard_summary": "Personnel in haul corridor at 2.8m",
    "reasons": [
      "Person detected ahead (92% conf)",
      "Proximity critical: 2.8 m",
      "TTC: 1.9 sec"
    ],
    "emergency_sms_required": true,
    "driver_safety": {
      "status": "SAFE",
      "distraction_detected": false,
      "earphone_confidence": 0.0,
      "message": "Driver attentive — no distraction detected"
    },
    "sensor_confidence": {
      "camera": 38.0,
      "ultrasonic": 98.0,
      "gps": 94.0,
      "imu": 99.0,
      "gsm": 92.0
    }
  },
  "gsm": {
    "online": true,
    "signal_dbm": -74,
    "csq": 24,
    "carrier": "MineLink 4G Private APN",
    "ip": "10.144.28.105",
    "uplink_rate_kbps": 48.5,
    "sms_sent_count": 1
  }
}
```

---

## 3. Simulation & Scenario Control Endpoints

### `POST /api/simulation/scenario`
Body: `{"scenario": "DENSE_FOG"}`  
Supported: `NORMAL_OPERATION`, `DENSE_FOG`, `PERSON_ON_ROAD`, `DUMPER_APPROACHING`, `OBSTACLE_AHEAD`, `DRIVER_EARPHONE_DETECTED`, `MULTI_HAZARD`.

### `POST /api/simulation/guided-demo`
Starts the 6-phase 75-second automated judge presentation sequence.

### `POST /api/simulation/control`
Body: `{"action": "start"|"pause"|"reset", "speed": 1.0|2.0|5.0}`
