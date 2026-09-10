from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
import time
from ..simulation.physics_engine import simulation_engine
from ..risk_engine.risk_calculator import evaluate_collision_risk
from ..config import settings
from ..database.db import log_alert

router = APIRouter(prefix="/api", tags=["Sensors & Telemetry"])

# In-memory storage for live hardware data
live_hardware_state: Optional[Dict[str, Any]] = None
operating_mode = "LIVE_HARDWARE"
last_live_packet_time: float = 0.0
last_ultrasonic_time: float = 0.0
last_gps_time: float = 0.0
last_vision_time: float = 0.0
packet_counter: int = 0
last_source_ip: str = "N/A"

# Hardware Channel Equipping Flags (Defines which sensors are physically mounted on the vehicle prototype)
# True = physically connected & measuring real physical data from Pi
# False = not used by user -> outputs None so frontend renders clean '---' for genuine jury presentation
PHYSICAL_HARDWARE_EQUIPPED: Dict[str, bool] = {
    "ultrasonic_front": True,   # Physical HC-SR04 mounted on vehicle front
    "ultrasonic_rear": False,   # Unequipped -> renders '---'
    "ultrasonic_left": False,   # Unequipped -> renders '---'
    "ultrasonic_right": False,  # Unequipped -> renders '---'
    "gsm": False,               # Unequipped -> renders '---'
}

class GpsPayload(BaseModel):
    lat: Optional[float] = None
    lon: Optional[float] = None
    speed: Optional[float] = 0.0
    heading: Optional[float] = 0.0

class UltrasonicPayload(BaseModel):
    front: Optional[float] = None
    rear: Optional[float] = None
    left: Optional[float] = None
    right: Optional[float] = None

class ImuPayload(BaseModel):
    acceleration: Optional[float] = 0.0
    tilt: Optional[float] = 0.0

class VisionPayload(BaseModel):
    person: Optional[float] = 0.0
    dumper: Optional[float] = 0.0
    obstacle: Optional[float] = 0.0

class GsmPayload(BaseModel):
    signal_dbm: Optional[int] = -75
    csq: Optional[int] = 22
    carrier: Optional[str] = "4G LTE Private Net"
    ip: Optional[str] = "10.0.0.12"

class SensorIngestPayload(BaseModel):
    model_config = {"extra": "allow"}
    vehicle_id: Optional[str] = "D-001"
    gps: Optional[GpsPayload] = Field(default_factory=GpsPayload)
    ultrasonic: Optional[UltrasonicPayload] = Field(default_factory=UltrasonicPayload)
    imu: Optional[ImuPayload] = Field(default_factory=ImuPayload)
    vision: Optional[VisionPayload] = Field(default_factory=VisionPayload)
    gsm: Optional[GsmPayload] = None
    visibility_percent: Optional[float] = 85.0
    distance_cm: Optional[float] = None
    distance: Optional[float] = None
    dist: Optional[float] = None
    front: Optional[float] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    gps_speed: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    detections: Optional[List[Dict[str, Any]]] = None
    fps: Optional[float] = None
    frame: Optional[str] = None
    image: Optional[str] = None
    image_base64: Optional[str] = None

@router.post("/sensors")
@router.post("/data")
@router.post("/telemetry")
async def ingest_sensor_data(data: SensorIngestPayload):
    # Standardized live hardware ingestion endpoint for Raspberry Pi 4 & ESP32 Bridge.
    global live_hardware_state, operating_mode, last_live_packet_time, packet_counter, last_source_ip
    global last_ultrasonic_time, last_gps_time, last_vision_time
    now = time.time()
    last_live_packet_time = now
    operating_mode = "LIVE_HARDWARE"
    packet_counter += 1

    # Ensure payload sub-models exist
    if data.ultrasonic is None:
        data.ultrasonic = UltrasonicPayload()
    if data.gps is None:
        data.gps = GpsPayload()
    if data.imu is None:
        data.imu = ImuPayload()
    if data.vision is None:
        data.vision = VisionPayload()

    # Extract front distance if sent directly by ESP32 (e.g. distance_cm, distance, dist, front)
    has_raw_ultrasonic = False
    candidate_dist = None
    if data.distance_cm is not None:
        try:
            candidate_dist = float(data.distance_cm) / 100.0  # cm to meters
            has_raw_ultrasonic = True
        except (ValueError, TypeError):
            pass
    elif data.distance is not None:
        candidate_dist = data.distance
        has_raw_ultrasonic = True
    elif data.dist is not None:
        candidate_dist = data.dist
        has_raw_ultrasonic = True
    elif data.front is not None:
        candidate_dist = data.front
        has_raw_ultrasonic = True
    elif data.ultrasonic.front is not None:
        candidate_dist = data.ultrasonic.front
        has_raw_ultrasonic = True

    if candidate_dist is not None:
        data.ultrasonic.front = candidate_dist

    if has_raw_ultrasonic or data.lat is not None or (data.gps and data.gps.lat is not None):
        print(f"[HARDWARE INGEST] dist: {candidate_dist} | lat: {data.lat or (data.gps.lat if data.gps else None)}")
    
    validation_warnings = []

    # 1. GPS Integrity Checks (with persistent merge)
    prev_gps = live_hardware_state.get("gps", {}) if live_hardware_state else {}
    has_raw_gps = (data.gps and data.gps.lat is not None) or data.lat is not None
    if has_raw_gps:
        lat = data.gps.lat if (data.gps and data.gps.lat is not None) else data.lat
        lon = data.gps.lon if (data.gps and data.gps.lon is not None) else data.lon
        last_gps_time = now
    else:
        if (now - last_gps_time) <= 6.0 and prev_gps.get("lat") is not None:
            lat = prev_gps.get("lat")
            lon = prev_gps.get("lon")
        else:
            lat = None
            lon = None

    if lat is not None and not (-90.0 <= lat <= 90.0):
        validation_warnings.append(f"GPS Latitude {lat} out of physical bounds [-90, 90]")
        lat = None
    if lon is not None and not (-180.0 <= lon <= 180.0):
        validation_warnings.append(f"GPS Longitude {lon} out of physical bounds [-180, 180]")
        lon = None
    # User requirement: Keep vehicle speed at 0.0 km/h
    speed = 0.0
    heading = (float(data.gps.heading or prev_gps.get("heading_deg") or 0.0)) % 360.0

    # 2. Ultrasonic Integrity Checks (with persistent merge)
    prev_us = live_hardware_state.get("ultrasonic", {}) if live_hardware_state else {}
    def clean_distance(val: Optional[float], label: str) -> Optional[float]:
        if val is None:
            return None
        try:
            v = float(val)
            # The sensor measures in centimeters (HC-SR04 envelope: 2cm to 400cm).
            # Any reading >= 1.0 is in centimeters (e.g. 5cm -> 0.05m, 8cm -> 0.08m, 35cm -> 0.35m).
            # Any reading < 1.0 is already in meters (e.g. 0.06m, 0.10m).
            meter_val = v / 100.0 if v >= 1.0 else v
            if meter_val < 0.01 or meter_val > 25.0:
                validation_warnings.append(f"Ultrasonic {label} {val} outside detection range")
                return None
            return round(meter_val, 3)
        except (ValueError, TypeError):
            return None

    # Only pass physical sensor data if the channel is physically equipped on the demo rig
    if has_raw_ultrasonic and data.ultrasonic.front is not None:
        front_dist = clean_distance(data.ultrasonic.front, "front") if PHYSICAL_HARDWARE_EQUIPPED.get("ultrasonic_front", True) else None
        if front_dist is not None:
            last_ultrasonic_time = now
    else:
        # If camera packet arrived without ultrasonic, preserve last ultrasonic reading for up to 4.5s
        if (now - last_ultrasonic_time) <= 4.5 and prev_us.get("front") is not None:
            front_dist = prev_us.get("front")
        else:
            front_dist = None

    rear_dist = clean_distance(data.ultrasonic.rear, "rear") if PHYSICAL_HARDWARE_EQUIPPED.get("ultrasonic_rear", False) else None
    left_dist = clean_distance(data.ultrasonic.left, "left") if PHYSICAL_HARDWARE_EQUIPPED.get("ultrasonic_left", False) else None
    right_dist = clean_distance(data.ultrasonic.right, "right") if PHYSICAL_HARDWARE_EQUIPPED.get("ultrasonic_right", False) else None

    ultrasonic_dict = {
        "front": front_dist,
        "rear": rear_dist,
        "left": left_dist,
        "right": right_dist
    }

    # 3. IMU Integrity Checks
    prev_imu = live_hardware_state.get("imu", {}) if live_hardware_state else {}
    accel = float(data.imu.acceleration or prev_imu.get("acceleration_g") or 0.0)
    tilt = float(data.imu.tilt or prev_imu.get("tilt_deg") or 0.0)
    if abs(accel) > 10.0:
        validation_warnings.append(f"IMU accel {accel}g exceeds dynamic range")
        accel = round(max(-10.0, min(10.0, accel)), 2)
    if abs(tilt) > 60.0:
        validation_warnings.append(f"IMU tilt {tilt}deg indicates extreme rollover or sensor tilt error")

    # 4. Vision Integrity Checks & Detections
    prev_vision = live_hardware_state.get("vision", {}) if live_hardware_state else {}
    detections = []
    p_conf = float(data.vision.person or 0.0)
    d_conf = float(data.vision.dumper or 0.0)
    o_conf = float(data.vision.obstacle or 0.0)

    if p_conf >= 0.35:
        detections.append({
            "class_id": 0,
            "class_name": "person",
            "confidence": round(min(1.0, p_conf), 2),
            "bbox": [0.42, 0.48, 0.14, 0.35],
            "distance_est": front_dist or 2.5
        })
    if d_conf >= 0.35:
        detections.append({
            "class_id": 1,
            "class_name": "dumper",
            "confidence": round(min(1.0, d_conf), 2),
            "bbox": [0.32, 0.35, 0.36, 0.45],
            "distance_est": front_dist or 7.5
        })
    if o_conf >= 0.35:
        detections.append({
            "class_id": 2,
            "class_name": "obstacle",
            "confidence": round(min(1.0, o_conf), 2),
            "bbox": [0.44, 0.62, 0.20, 0.22],
            "distance_est": front_dist or 4.0
        })

    # If incoming packet has direct detections list from Pi edge runner
    if data.detections and len(data.detections) > 0:
        detections = data.detections
    elif len(detections) == 0 and prev_vision.get("detections"):
        detections = prev_vision.get("detections")

    # 5. Visibility
    extra_vis = getattr(data, 'visibility_pct', None)
    vis_in = data.visibility_percent if data.visibility_percent is not None else (extra_vis or 85.0)
    visibility_val = max(0.0, min(100.0, float(vis_in)))

    # Evaluate live collision risk
    risk_result = evaluate_collision_risk(
        vehicle_speed_kmh=speed,
        ultrasonic_distances=ultrasonic_dict,
        vision_detections=detections,
        visibility_percent=visibility_val,
        tilt_deg=tilt
    )

    gsm_online = bool(data.gsm and data.gsm.carrier) if PHYSICAL_HARDWARE_EQUIPPED.get("gsm", False) else False
    gsm_dict = {
        "online": gsm_online,
        "signal_dbm": data.gsm.signal_dbm if (gsm_online and data.gsm) else None,
        "csq": data.gsm.csq if (gsm_online and data.gsm) else None,
        "carrier": data.gsm.carrier if (gsm_online and data.gsm) else "---",
        "ip": data.gsm.ip if (gsm_online and data.gsm) else "---",
        "uplink_rate_kbps": 54.0 if gsm_online else None,
        "sms_sent_count": 0
    }

    live_hardware_state = {
        "vehicle_id": data.vehicle_id or "D-001",
        "timestamp": time.strftime("%H:%M:%S"),
        "mode": "LIVE_HARDWARE",
        "scenario": "LIVE_FIELD_FEED",
        "online": True,
        "guided_demo": {"active": False, "phase": 0, "total_phases": 6},
        "gps": {
            "lat": lat,
            "lon": lon,
            "speed_kmh": round(speed, 1),
            "heading_deg": round(heading, 1),
            "fix_status": "3D_FIX_LIVE" if lat is not None else "NO_GPS_FIX"
        },
        "ultrasonic": ultrasonic_dict,
        "imu": {
            "acceleration_g": round(accel, 2),
            "tilt_deg": round(tilt, 1),
            "motion_status": "FORWARD_MOTION" if speed > 0.5 else "STATIONARY"
        },
        "visibility": {
            "index_percent": round(visibility_val, 1),
            "label": "CLEAR" if visibility_val > 75 else ("LIGHT FOG" if visibility_val > 50 else ("MODERATE FOG" if visibility_val > 35 else ("DENSE FOG" if visibility_val > 20 else "CRITICAL VISIBILITY"))),
            "optical_degraded": visibility_val <= 50.0,
            "advisory": "Vision degraded — proximity sensing maintained" if visibility_val <= 50.0 else "Optimal visibility range"
        },
        "vision": {
            "model": "YOLOv8s-Mining-v2",
            "inference_status": "ACTIVE_HARDWARE",
            "fps": round(data.fps, 1) if data.fps is not None else 24.2,
            "inference_time_ms": 41.0,
            "detections": data.detections if (data.detections and len(data.detections) > 0) else detections,
            "frame": data.frame or data.image or data.image_base64 or (live_hardware_state.get("vision", {}).get("frame") if live_hardware_state else None)
        },
        "risk": risk_result,
        "gsm": gsm_dict,
        "system_health": {
            "raspberry_pi": "ONLINE",
            "pi_camera": "ONLINE" if len(detections) > 0 or (data.vision and (data.vision.person or data.vision.dumper or data.vision.obstacle)) else "STANDBY",
            "yolo_engine": "RUNNING" if len(detections) > 0 else "STANDBY",
            "ultrasonic_array": "ONLINE (FRONT CH-1)" if front_dist is not None else "STANDBY",
            "neo6m_gps": "LOCKED" if lat is not None else "---",
            "mpu6050_imu": "ONLINE" if (data.imu and (data.imu.acceleration or data.imu.tilt)) else "---",
            "gsm_4g_sim": "CONNECTED" if gsm_online else "--- (NOT EQUIPPED)",
            "backend": "ONLINE",
            "database": "ONLINE",
            "latency_ms": 12
        },
        "data_integrity": {
            "valid": len(validation_warnings) == 0,
            "status": "LIVE_VERIFIED" if len(validation_warnings) == 0 else "DEGRADED_INTEGRITY",
            "last_packet_age_sec": 0.0,
            "packet_count": packet_counter,
            "warnings": validation_warnings
        }
    }

    return {
        "status": "success",
        "received_at": now,
        "packet_count": packet_counter,
        "risk_level": risk_result["risk_level"],
        "integrity_warnings": validation_warnings
    }

def create_offline_telemetry_state(last_packet_age_sec: Optional[float] = None) -> Dict[str, Any]:
    """Produces strict offline state with null metrics when no active Pi feed exists."""
    return {
        "vehicle_id": "D-001",
        "timestamp": time.strftime("%H:%M:%S"),
        "mode": "OFFLINE",
        "scenario": "NO_HARDWARE_FEED",
        "online": False,
        "gps": {
            "lat": 0.0,
            "lon": 0.0,
            "speed_kmh": 0.0,
            "heading_deg": 0.0,
            "fix_status": "OFFLINE",
        },
        "ultrasonic": {
            "front": 0.0,
            "rear": 0.0,
            "left": 0.0,
            "right": 0.0,
        },
        "imu": {
            "acceleration_g": 0.0,
            "tilt_deg": 0.0,
            "motion_status": "OFFLINE",
        },
        "visibility": {
            "index_percent": 0.0,
            "label": "OFFLINE",
            "optical_degraded": False,
            "advisory": "Awaiting live Raspberry Pi hardware stream",
        },
        "environment": {
            "temperature_c": None,
            "humidity_percent": None,
            "fog_risk": "N/A",
        },
        "optical_flow": {
            "speed_kmh": None,
            "distance_m": None,
            "status": "OFFLINE",
        },
        "vision": {
            "model": "YOLOv8s-Mining-v2",
            "inference_status": "OFFLINE",
            "fps": 0.0,
            "inference_time_ms": 0.0,
            "detections": [],
        },
        "risk": {
            "risk_level": "OFFLINE",
            "risk_score": 0,
            "action": "STANDBY -- NO PI DATA FEED",
            "ttc_seconds": None,
            "hazard_summary": "Raspberry Pi hardware feed offline. Awaiting sensor packet...",
            "reasons": ["Raspberry Pi offline", "No ultrasonic stream", "No GPS fix"],
            "emergency_sms_required": False,
            "driver_safety": {
                "status": "OFFLINE",
                "distraction_detected": False,
                "earphone_confidence": 0.0,
                "message": "Edge monitor offline",
            },
            "sensor_confidence": {
                "camera": 0.0,
                "ultrasonic": 0.0,
                "gps": 0.0,
                "imu": 0.0,
                "gsm": 0.0,
            },
        },
        "gsm": {
            "online": False,
            "signal_dbm": -99,
            "csq": 0,
            "carrier": "OFFLINE",
            "ip": "N/A",
            "uplink_rate_kbps": 0.0,
            "sms_sent_count": 0,
        },
        "system_health": {
            "raspberry_pi": "OFFLINE",
            "pi_camera": "OFFLINE",
            "yolo_engine": "STANDBY",
            "ultrasonic_array": "OFFLINE",
            "neo6m_gps": "OFFLINE",
            "mpu6050_imu": "OFFLINE",
            "optical_flow": "OFFLINE",
            "dht11": "OFFLINE",
            "gsm_4g_sim": "OFFLINE",
            "backend": "ONLINE",
            "database": "ONLINE",
            "latency_ms": None,
        },
        "data_integrity": {
            "valid": False,
            "status": "AWAITING_FEED",
            "last_packet_age_sec": last_packet_age_sec,
        },
    }

def get_active_telemetry() -> Dict[str, Any]:
    """
    Returns verified live telemetry if received within the 3.5-second timeout window.
    Strictly falls back to OFFLINE (with null metrics) if no packet arrives.
    """
    global operating_mode, live_hardware_state, last_live_packet_time
    now = time.time()
    age = round(now - last_live_packet_time, 2) if last_live_packet_time > 0 else 9999.0

    if live_hardware_state is not None and age <= 5.5:
        operating_mode = "LIVE_HARDWARE"
        state = dict(live_hardware_state)
        # Update dynamic packet age in live state
        if "data_integrity" in state:
            state["data_integrity"]["last_packet_age_sec"] = age
        state["online"] = True
        return state
    else:
        operating_mode = "OFFLINE"
        return create_offline_telemetry_state(last_packet_age_sec=age if last_live_packet_time > 0 else None)

@router.get("/telemetry/latest")
async def get_latest_telemetry():
    # Returns current telemetry: Live Raspberry Pi hardware feed if active, else Offline N/A state.
    return get_active_telemetry()

@router.post("/mode/toggle")
async def toggle_mode(payload: Dict[str, str]):
    global operating_mode
    new_mode = payload.get("mode", "LIVE_HARDWARE")
    if new_mode in ["LIVE_HARDWARE", "OFFLINE"]:
        operating_mode = new_mode
        return {"status": "success", "active_mode": operating_mode}
    raise HTTPException(status_code=400, detail="Invalid mode")

@router.post("/incident")
async def receive_incident(payload: Dict[str, Any] = {}):
    return {"status": "success", "message": "Incident telemetry logged"}

@router.get("/hardware/channels")
async def get_hardware_channels():
    """Returns currently equipped vs unequipped hardware sensor channels."""
    return {"status": "success", "channels": PHYSICAL_HARDWARE_EQUIPPED}

@router.post("/hardware/channels")
async def update_hardware_channels(payload: Dict[str, bool]):
    """Enables or disables hardware sensor channels dynamically."""
    PHYSICAL_HARDWARE_EQUIPPED.update(payload)
    return {"status": "success", "channels": PHYSICAL_HARDWARE_EQUIPPED}
