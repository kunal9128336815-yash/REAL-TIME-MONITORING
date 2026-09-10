from fastapi import APIRouter
from typing import List, Dict, Any
from app.api import sensors

router = APIRouter(prefix="/api/fleet", tags=["Fleet Overview"])

@router.get("")
async def get_fleet_status() -> List[Dict[str, Any]]:
    """Returns status of vehicles. Only D-001 is active; others are OFFLINE."""
    is_live = sensors.live_hardware_state is not None and sensors.operating_mode == "LIVE_HARDWARE"
    live_speed = 0.0
    live_risk = "OFFLINE"

    if is_live and sensors.live_hardware_state:
        gps_info = sensors.live_hardware_state.get("gps", {})
        risk_info = sensors.live_hardware_state.get("risk", {})
        live_speed = gps_info.get("speed_kmh") or 0.0
        live_risk = risk_info.get("risk_level", "SAFE")

    return [
        {
            "id": "DUMPER_01",
            "name": "CAT 777E Dumper #01 (Active Hardware Rig)",
            "status": "ACTIVE" if is_live else "OFFLINE",
            "speed_kmh": round(live_speed, 1),
            "location": "Pit Alpha - Haul Road 2" if is_live else "Test Bench (Hardware Rig)",
            "risk_level": live_risk,
            "connection": "ESP32 + Pi 4 (Live)" if is_live else "OFFLINE (No Active Feed)",
            "driver": "Ramesh Kumar (ID #849)",
            "payload_tons": 85.4 if is_live else 0.0
        },
        {
            "id": "DUMPER_02",
            "name": "Komatsu HD785 #02",
            "status": "OFFLINE",
            "speed_kmh": 0.0,
            "location": "Maintenance Bay 3 (Parked)",
            "risk_level": "OFFLINE",
            "connection": "OFFLINE (Depot)",
            "driver": "Vikram Singh (ID #712)",
            "payload_tons": 0.0
        },
        {
            "id": "DUMPER_03",
            "name": "CAT 777E Dumper #03",
            "status": "OFFLINE",
            "speed_kmh": 0.0,
            "location": "South Fueling Station (Parked)",
            "risk_level": "OFFLINE",
            "connection": "OFFLINE (Depot)",
            "driver": "Anil Sharma (ID #521)",
            "payload_tons": 0.0
        },
        {
            "id": "DUMPER_04",
            "name": "Dumper D-004",
            "status": "OFFLINE",
            "speed_kmh": 0.0,
            "location": "Workshop Bay 1 (Parked)",
            "risk_level": "OFFLINE",
            "connection": "OFFLINE (Depot)",
            "driver": "Mohd. Salim (ID #639)",
            "payload_tons": 0.0
        }
    ]

