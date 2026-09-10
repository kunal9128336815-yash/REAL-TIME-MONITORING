import os
from pydantic import BaseModel
from typing import List, Optional

class Settings(BaseModel):
    # Proximity & Collision Thresholds (in meters)
    warning_distance: float = 8.0
    critical_distance: float = 3.5
    stop_distance: float = 2.0
    
    # Time To Collision Thresholds (in seconds)
    ttc_warning_threshold: float = 4.0
    ttc_critical_threshold: float = 2.0
    
    # Visibility Thresholds (percentage 0-100)
    dense_fog_threshold: float = 35.0
    critical_visibility_threshold: float = 20.0
    
    # Vehicle Speed Limits (km/h)
    max_haul_road_speed: float = 30.0
    fog_speed_limit: float = 15.0
    
    # GSM 4G SIM Configuration
    gsm_enabled: bool = True
    gsm_carrier: str = "MineLink 4G Private APN"
    emergency_sms_recipient: str = "+91-98765-43210 (Mine Safety Control)"
    sms_alerts_enabled: bool = True
    
    # Simulation
    simulation_update_interval_ms: int = 400
    demo_mode: bool = True
    
    # Raspberry Pi 4 Hardware Endpoint
    pi_endpoint_url: str = os.getenv("PI_ENDPOINT_URL", "http://192.168.137.94:5000/data")
    pi_polling_enabled: bool = False  # Disabled because Pi pushes directly to laptop on port 8000
    pi_polling_interval_sec: float = 0.35

settings = Settings()
