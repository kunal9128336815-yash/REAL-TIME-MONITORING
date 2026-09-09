from fastapi import APIRouter
from typing import List, Dict, Any
from ..database.db import get_recent_alerts

router = APIRouter(prefix="/api/alerts", tags=["Alert Center"])

@router.get("")
async def fetch_alerts() -> List[Dict[str, Any]]:
    alerts = get_recent_alerts(limit=30)
    if not alerts:
        # Provide representative initial operational alerts
        return [
            {
                "id": 1,
                "timestamp": "23:41:02",
                "severity": "CRITICAL",
                "message": "Person detected on haul road corridor (2.1m)",
                "category": "COLLISION_RISK",
                "sms_sent": 1,
                "sms_details": "4G SMS dispatched to +91-98765-43210 (Mine Safety Control)"
            },
            {
                "id": 2,
                "timestamp": "23:40:57",
                "severity": "WARNING",
                "message": "Dumper #02 closing on haul road intersection at 7.4m",
                "category": "PROXIMITY",
                "sms_sent": 0,
                "sms_details": None
            },
            {
                "id": 3,
                "timestamp": "23:40:42",
                "severity": "CAUTION",
                "message": "Monsoon fog: Optical visibility dropped below 35% threshold",
                "category": "ENVIRONMENT",
                "sms_sent": 0,
                "sms_details": None
            },
            {
                "id": 4,
                "timestamp": "23:40:21",
                "severity": "INFO",
                "message": "NEO-6M GPS 3D fix locked (8 satellites active)",
                "category": "LOCALIZATION",
                "sms_sent": 0,
                "sms_details": None
            },
            {
                "id": 5,
                "timestamp": "23:39:55",
                "severity": "INFO",
                "message": "SIM7600 4G LTE uplink established (-74 dBm, CSQ: 24)",
                "category": "TELEMETRY",
                "sms_sent": 0,
                "sms_details": None
            }
        ]
    return alerts
