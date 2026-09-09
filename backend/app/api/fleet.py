from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/api/fleet", tags=["Fleet Overview"])

@router.get("")
async def get_fleet_status() -> List[Dict[str, Any]]:
    """Returns status of all active vehicles in the mining sector."""
    return [
        {
            "id": "DUMPER_01",
            "name": "CAT 777E Dumper #01 (Focus)",
            "status": "ACTIVE",
            "speed_kmh": 14.5,
            "location": "Haul Ramp North - Sector 4",
            "risk_level": "DYNAMIC",
            "connection": "4G LTE (Online)",
            "driver": "R. Kumar (ID: 4108)",
            "payload_tons": 98.4
        },
        {
            "id": "DUMPER_02",
            "name": "Komatsu HD785 #02",
            "status": "ACTIVE",
            "speed_kmh": 9.2,
            "location": "Crusher Loading Bay 2",
            "risk_level": "WARNING",
            "connection": "4G LTE (Online)",
            "driver": "M. Soren (ID: 3290)",
            "payload_tons": 92.0
        },
        {
            "id": "DUMPER_03",
            "name": "CAT 777E Dumper #03",
            "status": "ACTIVE",
            "speed_kmh": 16.8,
            "location": "Overburden Dump Area C",
            "risk_level": "SAFE",
            "connection": "4G LTE (Online)",
            "driver": "A. Tirkey (ID: 5512)",
            "payload_tons": 0.0
        },
        {
            "id": "SERVICE_01",
            "name": "Safety Patrol / Service Truck #01",
            "status": "PATROLLING",
            "speed_kmh": 22.0,
            "location": "Pit Access Road South",
            "risk_level": "SAFE",
            "connection": "4G LTE (Online)",
            "driver": "S. Verma (Safety Officer)",
            "payload_tons": 2.5
        }
    ]
