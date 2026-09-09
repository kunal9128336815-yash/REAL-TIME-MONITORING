import math
import time
from typing import Dict, Any, List
from ..risk_engine.risk_calculator import evaluate_collision_risk
from ..config import settings
from ..database.db import log_alert

# Haul road waypoint coordinates in open-cast mine pit
WAYPOINTS = [
    {"lat": 22.71960, "lon": 75.85770, "elevation": 320.0},
    {"lat": 22.72020, "lon": 75.85840, "elevation": 315.0},
    {"lat": 22.72095, "lon": 75.85930, "elevation": 308.0},
    {"lat": 22.72180, "lon": 75.86010, "elevation": 300.0},
    {"lat": 22.72250, "lon": 75.86070, "elevation": 292.0},
    {"lat": 22.72310, "lon": 75.86140, "elevation": 285.0},
    {"lat": 22.72240, "lon": 75.86220, "elevation": 288.0},
    {"lat": 22.72140, "lon": 75.86150, "elevation": 295.0},
    {"lat": 22.72050, "lon": 75.86030, "elevation": 305.0},
    {"lat": 22.71980, "lon": 75.85880, "elevation": 314.0},
]

class MiningSimulationEngine:
    def __init__(self):
        self.running = True
        self.sim_speed = 1.0
        self.scenario = "NORMAL_OPERATION"
        self.step = 0
        self.last_sms_sent_time = 0
        
        # Guided Demo state
        self.guided_demo_active = False
        self.guided_demo_phase = 1
        self.guided_demo_phase_start = 0
        
        # Kinematic state
        self.waypoint_idx = 0
        self.lat = WAYPOINTS[0]["lat"]
        self.lon = WAYPOINTS[0]["lon"]
        self.speed = 14.5  # km/h
        self.heading = 45.0  # degrees
        self.tilt = 2.1  # degrees
        self.accel = 0.38  # g
        
        # Environmental state
        self.visibility = 92.0
        
        # Ultrasonic distances (meters)
        self.ultrasonic = {
            "front": 12.4,
            "rear": 16.8,
            "left": 6.8,
            "right": 7.4
        }
        
        # Vision detections
        self.vision_detections: List[Dict[str, Any]] = []
        
        # GSM 4G SIM State
        self.gsm = {
            "online": True,
            "signal_dbm": -74,
            "csq": 24,  # 0-31 scale
            "carrier": "MineLink 4G Private APN",
            "ip": "10.144.28.105",
            "uplink_rate_kbps": 48.5,
            "sms_sent_count": 0
        }
        
    def set_scenario(self, scenario_name: str):
        self.scenario = scenario_name
        self.step = 0
        self.guided_demo_active = False
        
    def start_guided_demo(self):
        self.guided_demo_active = True
        self.guided_demo_phase = 1
        self.guided_demo_phase_start = time.time()
        self.set_scenario("NORMAL_OPERATION")

    def update(self) -> Dict[str, Any]:
        if not self.running:
            return self.get_state()
            
        self.step += 1
        dt = 0.4 * self.sim_speed
        
        # Check guided demo phase progression
        if self.guided_demo_active:
            elapsed = time.time() - self.guided_demo_phase_start
            # Phase transitions roughly every 12 seconds
            if elapsed > 12 and self.guided_demo_phase == 1:
                self.guided_demo_phase = 2
                self.set_scenario("DENSE_FOG")
            elif elapsed > 24 and self.guided_demo_phase == 2:
                self.guided_demo_phase = 3
                self.set_scenario("OBSTACLE_AHEAD")
            elif elapsed > 36 and self.guided_demo_phase == 3:
                self.guided_demo_phase = 4
                self.set_scenario("PERSON_ON_ROAD")
            elif elapsed > 48 and self.guided_demo_phase == 4:
                self.guided_demo_phase = 5
                self.set_scenario("DUMPER_APPROACHING")
            elif elapsed > 60 and self.guided_demo_phase == 5:
                self.guided_demo_phase = 6
                self.set_scenario("NORMAL_OPERATION")
            elif elapsed > 72 and self.guided_demo_phase == 6:
                self.guided_demo_active = False
                
        # 1. Update Haul Road GPS Position along waypoints
        target_wp = WAYPOINTS[(self.waypoint_idx + 1) % len(WAYPOINTS)]
        cur_wp = WAYPOINTS[self.waypoint_idx]
        d_lat = target_wp["lat"] - self.lat
        d_lon = target_wp["lon"] - self.lon
        dist_to_target = math.hypot(d_lat, d_lon)
        
        if dist_to_target < 0.00015:
            self.waypoint_idx = (self.waypoint_idx + 1) % len(WAYPOINTS)
        else:
            speed_ratio = (self.speed / 3600.0) * 0.00008 * self.sim_speed
            self.lat += (d_lat / dist_to_target) * speed_ratio
            self.lon += (d_lon / dist_to_target) * speed_ratio
            self.heading = (math.degrees(math.atan2(d_lon, d_lat)) + 360) % 360

        # Subtle natural IMU variations
        self.tilt = round(2.0 + 0.6 * math.sin(self.step * 0.1), 1)
        self.accel = round(0.40 + 0.08 * math.cos(self.step * 0.15), 2)
        
        # GSM signal minor jitter
        self.gsm["signal_dbm"] = int(-74 + 3 * math.sin(self.step * 0.08))
        self.gsm["uplink_rate_kbps"] = round(48.5 + 4.2 * math.cos(self.step * 0.2), 1)

        # 2. Scenario-specific physics & vision handling
        if self.scenario == "NORMAL_OPERATION":
            self.speed = 18.2 + 1.2 * math.sin(self.step * 0.2)
            self.visibility = 94.0 + 2.0 * math.sin(self.step * 0.1)
            self.ultrasonic["front"] = round(12.5 + 1.5 * math.sin(self.step * 0.15), 1)
            self.ultrasonic["rear"] = round(17.0 + 1.0 * math.cos(self.step * 0.1), 1)
            self.ultrasonic["left"] = round(6.5 + 0.5 * math.sin(self.step * 0.3), 1)
            self.ultrasonic["right"] = round(7.2 + 0.6 * math.cos(self.step * 0.25), 1)
            self.vision_detections = []

        elif self.scenario == "DENSE_FOG":
            # Fog smoothly rolls in: 92% down to 24%
            self.visibility = max(24.0, 92.0 - (self.step * 1.8))
            self.speed = max(11.0, 18.0 - (self.step * 0.3))
            # Critical demonstration rule: Ultrasonic sensing remains stable in fog!
            self.ultrasonic["front"] = round(9.8 + 0.8 * math.sin(self.step * 0.2), 1)
            self.ultrasonic["rear"] = round(14.2 + 0.6 * math.sin(self.step * 0.1), 1)
            self.ultrasonic["left"] = round(5.8 + 0.4 * math.sin(self.step * 0.15), 1)
            self.ultrasonic["right"] = round(6.4 + 0.5 * math.cos(self.step * 0.15), 1)
            self.vision_detections = []

        elif self.scenario == "PERSON_ON_ROAD":
            self.visibility = 38.0  # monsoon mist
            # Person detected ahead, distance closing
            approach = min(self.step * 0.4, 7.5)
            front_d = max(2.1, 9.6 - approach)
            self.ultrasonic["front"] = round(front_d, 1)
            self.ultrasonic["left"] = 4.2
            self.ultrasonic["right"] = 5.8
            self.ultrasonic["rear"] = 14.0
            
            # If closer, vehicle driver reacts and brakes
            if front_d < 3.5:
                self.speed = max(0.0, self.speed - 2.5)
            else:
                self.speed = 13.0
                
            self.vision_detections = [{
                "class_id": 0,
                "class_name": "person",
                "confidence": 0.92,
                "bbox": [0.42, 0.48, 0.14, 0.35],  # normalized [x, y, w, h]
                "distance_est": front_d
            }]

        elif self.scenario == "DUMPER_APPROACHING":
            self.visibility = 42.0
            # Distance drops: 14.5 -> 10.8 -> 7.4 -> 4.8m
            approach = min(self.step * 0.55, 10.0)
            front_d = max(4.6, 14.6 - approach)
            self.ultrasonic["front"] = round(front_d, 1)
            self.ultrasonic["left"] = 3.8
            self.ultrasonic["right"] = 4.2
            self.ultrasonic["rear"] = 15.2
            self.speed = max(5.0, 16.0 - self.step * 0.4)
            
            self.vision_detections = [{
                "class_id": 1,
                "class_name": "dumper",
                "confidence": 0.95,
                "bbox": [0.32, 0.35, 0.36, 0.45],
                "distance_est": front_d
            }]

        elif self.scenario == "OBSTACLE_AHEAD":
            self.visibility = 55.0
            approach = min(self.step * 0.4, 7.0)
            front_d = max(3.4, 10.4 - approach)
            self.ultrasonic["front"] = round(front_d, 1)
            self.ultrasonic["left"] = 3.2
            self.ultrasonic["right"] = 6.8
            self.ultrasonic["rear"] = 16.0
            self.speed = 12.0
            
            self.vision_detections = [{
                "class_id": 2,
                "class_name": "obstacle",
                "confidence": 0.86,
                "bbox": [0.44, 0.62, 0.20, 0.22],
                "distance_est": front_d
            }]

        elif self.scenario == "MULTI_HAZARD":
            self.visibility = 22.0  # Extreme dense fog
            front_d = max(3.1, 8.5 - min(self.step * 0.35, 5.4))
            self.ultrasonic["front"] = round(front_d, 1)
            self.ultrasonic["left"] = 2.4  # Flank obstacle
            self.ultrasonic["right"] = 3.1
            self.ultrasonic["rear"] = 12.0
            self.speed = max(4.0, 14.0 - self.step * 0.3)
            
            self.vision_detections = [
                {
                    "class_id": 1,
                    "class_name": "dumper",
                    "confidence": 0.82,  # degraded by fog
                    "bbox": [0.28, 0.30, 0.40, 0.48],
                    "distance_est": front_d
                },
                {
                    "class_id": 0,
                    "class_name": "person",
                    "confidence": 0.74,  # degraded by fog
                    "bbox": [0.12, 0.52, 0.12, 0.30],
                    "distance_est": 2.4
                }
            ]

        # 3. Compute Risk and Sensor Fusion
        risk_result = evaluate_collision_risk(
            vehicle_speed_kmh=self.speed,
            ultrasonic_distances=self.ultrasonic,
            vision_detections=self.vision_detections,
            visibility_percent=self.visibility,
            tilt_deg=self.tilt
        )
        
        # Check if emergency SMS broadcast should be recorded
        if risk_result["emergency_sms_required"] and (time.time() - self.last_sms_sent_time > 15):
            self.last_sms_sent_time = time.time()
            self.gsm["sms_sent_count"] += 1
            sms_msg = f"[CRITICAL EMERGENCY] Dumper #01: {risk_result['hazard_summary']} at Lat {self.lat:.5f}, Lon {self.lon:.5f}. STOP commanded."
            log_alert(
                severity="CRITICAL",
                message=risk_result["hazard_summary"],
                category="COLLISION",
                sms_sent=True,
                sms_details=f"Dispatched via 4G SIM ({self.gsm['carrier']}) to {settings.emergency_sms_recipient}"
            )

        return self.get_state(risk_result)

    def get_state(self, risk_result: Dict[str, Any] = None) -> Dict[str, Any]:
        if risk_result is None:
            risk_result = evaluate_collision_risk(
                vehicle_speed_kmh=self.speed,
                ultrasonic_distances=self.ultrasonic,
                vision_detections=self.vision_detections,
                visibility_percent=self.visibility,
                tilt_deg=self.tilt
            )
            
        return {
            "vehicle_id": "DUMPER_01",
            "timestamp": time.strftime("%H:%M:%S"),
            "mode": "DEMO_MODE",
            "scenario": self.scenario,
            "guided_demo": {
                "active": self.guided_demo_active,
                "phase": self.guided_demo_phase,
                "total_phases": 6
            },
            "gps": {
                "lat": round(self.lat, 6),
                "lon": round(self.lon, 6),
                "speed_kmh": round(self.speed, 1),
                "heading_deg": round(self.heading, 1),
                "fix_status": "3D_FIX_8_SATS"
            },
            "ultrasonic": self.ultrasonic,
            "imu": {
                "acceleration_g": self.accel,
                "tilt_deg": self.tilt,
                "motion_status": "FORWARD_MOTION" if self.speed > 0.5 else "STATIONARY"
            },
            "visibility": {
                "index_percent": round(self.visibility, 1),
                "label": "CLEAR" if self.visibility > 75 else ("LIGHT FOG" if self.visibility > 50 else ("MODERATE FOG" if self.visibility > 35 else ("DENSE FOG" if self.visibility > 20 else "CRITICAL VISIBILITY"))),
                "optical_degraded": self.visibility <= 50.0,
                "advisory": "Vision degraded — proximity sensing maintained" if self.visibility <= 50.0 else "Optimal visibility range"
            },
            "vision": {
                "model": "YOLOv8s-Mining-v2",
                "inference_status": "ACTIVE",
                "fps": 28.5,
                "inference_time_ms": 34.2,
                "detections": self.vision_detections
            },
            "risk": risk_result,
            "gsm": self.gsm,
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
                "latency_ms": 14
            }
        }

simulation_engine = MiningSimulationEngine()
