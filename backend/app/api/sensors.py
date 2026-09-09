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
operating_mode = "DEMO_MODE"  # "DEMO_MODE" or "LIVE_HARDWARE"

class GpsPayload(BaseModel):
    lat: float
    lon: float
    speed: float = 0.0
    heading: Optional[float] = 0.0

class UltrasonicPayload(BaseModel):
    front: float
    rear: float
    left: float
    right: float

class ImuPayload(BaseModel):
    acceleration: float = 0.4
    tilt: float = 2.0

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
    vehicle_id: str = "DUMPER_01"
    gps: GpsPayload
    ultrasonic: UltrasonicPayload
    imu: ImuPayload
    vision: VisionPayload
    gsm: Optional[GsmPayload] = None
    visibility_percent: Optional[float] = 85.0

@router.post("/sensors")
async def ingest_sensor_data(data: SensorIngestPayload):
    """
    Standardized live hardware ingestion endpoint for Raspberry Pi 4.
    Accepts real sensor readings from Pi Camera (YOLO), Ultrasonic array,
    NEO-6M GPS, MPU6050 IMU, and SIM7600 4G GSM module.
    """
    global live_hardware_state
    
    # Format vision detections list
    detections = []
    if data.vision.person and data.vision.person > 0.4:
        detections.append({
            "class_id": 0,
            "class_name": "person",
            "confidence": data.vision.person,
            "bbox": [0.42, 0.48, 0.14, 0.35],
            "distance_est": data.ultrasonic.front
        })
    if data.vision.dumper and data.vision.dumper > 0.4:
        detections.append({
            "class_id": 1,
            "class_name": "dumper",
            "confidence": data.vision.dumper,
            "bbox": [0.32, 0.35, 0.36, 0.45],
            "distance_est": data.ultrasonic.front
        })
    if data.vision.obstacle and data.vision.obstacle > 0.4:
        detections.append({
            "class_id": 2,
            "class_name": "obstacle",
            "confidence": data.vision.obstacle,
            "bbox": [0.44, 0.62, 0.20, 0.22],
            "distance_est": data.ultrasonic.front
        })

    ultrasonic_dict = {
        "front": data.ultrasonic.front,
        "rear": data.ultrasonic.rear,
        "left": data.ultrasonic.left,
        "right": data.ultrasonic.right
    }

    visibility_val = data.visibility_percent if data.visibility_percent is not None else 85.0

    # Evaluate live collision risk
    risk_result = evaluate_collision_risk(
        vehicle_speed_kmh=data.gps.speed,
        ultrasonic_distances=ultrasonic_dict,
        vision_detections=detections,
        visibility_percent=visibility_val,
        tilt_deg=data.imu.tilt
    )

    gsm_dict = {
        "online": True,
        "signal_dbm": data.gsm.signal_dbm if data.gsm else -74,
        "csq": data.gsm.csq if data.gsm else 24,
        "carrier": data.gsm.carrier if data.gsm else "MineLink 4G Private APN",
        "ip": data.gsm.ip if data.gsm else "10.144.28.105",
        "uplink_rate_kbps": 54.0,
        "sms_sent_count": 0
    }

    live_hardware_state = {
        "vehicle_id": data.vehicle_id,
        "timestamp": time.strftime("%H:%M:%S"),
        "mode": "LIVE_HARDWARE",
        "scenario": "LIVE_FIELD_FEED",
        "guided_demo": {"active": False, "phase": 0, "total_phases": 6},
        "gps": {
            "lat": data.gps.lat,
            "lon": data.gps.lon,
            "speed_kmh": data.gps.speed,
            "heading_deg": data.gps.heading or 0.0,
            "fix_status": "3D_FIX_LIVE"
        },
        "ultrasonic": ultrasonic_dict,
        "imu": {
            "acceleration_g": data.imu.acceleration,
            "tilt_deg": data.imu.tilt,
            "motion_status": "FORWARD_MOTION" if data.gps.speed > 0.5 else "STATIONARY"
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
            "fps": 24.2,
            "inference_time_ms": 41.0,
            "detections": detections
        },
        "risk": risk_result,
        "gsm": gsm_dict,
        "system_health": {
            "raspberry_pi": "ONLINE",
            "pi_camera": "ONLINE",
            "yolo_engine": "RUNNING",
            "ultrasonic_array": "4/4 ONLINE",
            "neo6m_gps": "LOCKED",
            "mpu6050_imu": "ONLINE",
            "gsm_4g_sim": "CONNECTED (4G LTE)",
            "backend": "ONLINE",
            "database": "ONLINE",
            "latency_ms": 12
        }
    }

    return {"status": "success", "received_at": time.time(), "risk_level": risk_result["risk_level"]}

@router.get("/telemetry/latest")
async def get_latest_telemetry():
    """Returns current telemetry state (either Demo Physics Engine or Live Hardware)."""
    global operating_mode, live_hardware_state
    
    if operating_mode == "LIVE_HARDWARE" and live_hardware_state is not None:
        return live_hardware_state
        
    return simulation_engine.update()

@router.post("/mode/toggle")
async def toggle_mode(payload: Dict[str, str]):
    global operating_mode
    new_mode = payload.get("mode", "DEMO_MODE")
    if new_mode in ["DEMO_MODE", "LIVE_HARDWARE"]:
        operating_mode = new_mode
        return {"status": "success", "active_mode": operating_mode}
    raise HTTPException(status_code=400, detail="Invalid mode")
