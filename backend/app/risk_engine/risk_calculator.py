from typing import Dict, Any, List, Tuple
from ..config import settings

def calculate_sensor_confidence(visibility: float, hardware_online: Dict[str, bool] = None) -> Dict[str, float]:
    """
    Computes signal quality / confidence metrics for each sensor subsystem.
    Key Innovation: When optical visibility drops due to fog, Camera confidence drops,
    while Ultrasonic proximity sensing remains physically stable.
    """
    if hardware_online is None:
        hardware_online = {"camera": True, "ultrasonic": True, "gps": True, "imu": True, "gsm": True}
        
    # Camera confidence directly degraded by fog/particles
    # In 100% visibility -> 95-98% confidence
    # In 20% dense fog -> 25-35% confidence
    camera_conf = max(15.0, min(98.0, visibility * 0.85 + 12.0)) if hardware_online.get("camera", True) else 0.0
    
    # Ultrasonic is acoustic (sound waves) — largely independent of optical fog
    ultrasonic_conf = 98.0 if hardware_online.get("ultrasonic", True) else 0.0
    
    # GPS depends on satellite lock
    gps_conf = 94.0 if hardware_online.get("gps", True) else 0.0
    
    # IMU accelerometer/gyro is internal mechanical
    imu_conf = 99.0 if hardware_online.get("imu", True) else 0.0
    
    # GSM 4G cellular link
    gsm_conf = 92.0 if hardware_online.get("gsm", True) else 0.0
    
    return {
        "camera": round(camera_conf, 1),
        "ultrasonic": round(ultrasonic_conf, 1),
        "gps": round(gps_conf, 1),
        "imu": round(imu_conf, 1),
        "gsm": round(gsm_conf, 1)
    }

def evaluate_collision_risk(
    vehicle_speed_kmh: float,
    ultrasonic_distances: Dict[str, float],
    vision_detections: List[Dict[str, Any]],
    visibility_percent: float,
    tilt_deg: float = 1.2
) -> Dict[str, Any]:
    """
    Transparent, explainable multi-sensor collision risk engine.
    Calculates Time-To-Collision (TTC), severity level, actionable directive,
    and detailed explainability breakdown for judges and operators.
    """
    f_d = ultrasonic_distances.get("front")
    r_d = ultrasonic_distances.get("rear")
    l_d = ultrasonic_distances.get("left")
    rg_d = ultrasonic_distances.get("right")

    front_dist = f_d if f_d is not None and f_d > 0 else 99.0
    rear_dist = r_d if r_d is not None and r_d > 0 else 99.0
    left_dist = l_d if l_d is not None and l_d > 0 else 99.0
    right_dist = rg_d if rg_d is not None and rg_d > 0 else 99.0
    
    valid_dists = [d for d in [f_d, r_d, l_d, rg_d] if d is not None and d > 0]
    flank_dists = [d for d in [l_d, rg_d] if d is not None and d > 0]
    min_flank_dist = min(flank_dists) if flank_dists else 99.0
    min_dist = min(valid_dists) if valid_dists else 99.0
    
    # Convert vehicle speed km/h to m/s
    speed_ms = vehicle_speed_kmh * (1000.0 / 3600.0)
    
    # Analyze vision detections
    person_det = next((d for d in vision_detections if d.get("class_name") == "person"), None)
    dumper_det = next((d for d in vision_detections if d.get("class_name") == "dumper"), None)
    obstacle_det = next((d for d in vision_detections if d.get("class_name") == "obstacle"), None)
    earphone_det = next((d for d in vision_detections if d.get("class_name") == "earphone"), None)
    
    # Estimate closing speed towards front obstacle
    closing_speed_ms = speed_ms
    if dumper_det:
        # If oncoming dumper, add relative approach speed
        closing_speed_ms += 3.5  # oncoming vehicle adding closing speed
        
    # Calculate Time-To-Collision (TTC)
    if closing_speed_ms > 0.5 and front_dist < 25.0:
        ttc = front_dist / closing_speed_ms
    else:
        ttc = None  # No immediate forward collision
        
    reasons: List[str] = []
    risk_level = "SAFE"
    action = "ALL CLEAR — PROCEED SAFELY"
    hazard_summary = "Haul road unobstructed"
    emergency_sms_required = False
    
    # 1. Check critical immediate hazards
    if person_det and front_dist <= 5.0:
        risk_level = "CRITICAL"
        action = "STOP VEHICLE IMMEDIATELY"
        hazard_summary = f"Personnel in haul corridor at {front_dist:.1f}m"
        reasons.append(f"Person detected ahead ({person_det.get('confidence', 0.9):.0%} conf)")
        reasons.append(f"Proximity critical: {front_dist:.1f} m")
        if ttc is not None:
            reasons.append(f"TTC: {ttc:.1f} sec")
        emergency_sms_required = True
        
    elif front_dist <= settings.stop_distance or (ttc is not None and ttc <= settings.ttc_critical_threshold):
        risk_level = "CRITICAL"
        action = "STOP VEHICLE IMMEDIATELY"
        hazard_summary = f"Impending collision at {front_dist:.1f}m"
        reasons.append(f"Critical proximity: {front_dist:.1f} m")
        if ttc is not None:
            reasons.append(f"TTC critical: {ttc:.1f} sec")
        if dumper_det:
            reasons.append(f"Oncoming dumper ({dumper_det.get('confidence', 0.9):.0%} conf)")
        emergency_sms_required = True
        
    # 2. Check Warning level
    elif (ttc is not None and ttc <= settings.ttc_warning_threshold) or front_dist <= settings.critical_distance or (person_det and front_dist <= 8.0):
        risk_level = "WARNING"
        action = "APPLY BRAKES — REDUCE SPEED"
        if person_det:
            hazard_summary = f"Person detected on roadway ({front_dist:.1f}m)"
            reasons.append(f"Person detected at {front_dist:.1f} m")
        elif dumper_det:
            hazard_summary = f"Heavy vehicle approaching ({front_dist:.1f}m)"
            reasons.append(f"Oncoming dumper at {front_dist:.1f} m")
        else:
            hazard_summary = f"Proximity warning ahead ({front_dist:.1f}m)"
            reasons.append(f"Front proximity threshold reached: {front_dist:.1f} m")
            
        if ttc is not None:
            reasons.append(f"TTC: {ttc:.1f} sec")
            
    # 3. Check Caution level
    elif front_dist <= settings.warning_distance or obstacle_det or min_flank_dist <= 3.0 or visibility_percent <= settings.dense_fog_threshold:
        risk_level = "CAUTION"
        action = "MAINTAIN CAUTION — SCAN BLIND SPOTS"
        if obstacle_det:
            hazard_summary = f"Obstacle on haul road ({front_dist:.1f}m)"
            reasons.append(f"Static obstacle detected ({obstacle_det.get('confidence', 0.8):.0%} conf)")
        elif min_flank_dist <= 3.0:
            side = "Left" if left_dist < right_dist else "Right"
            hazard_summary = f"Flank proximity warning ({side}: {min_flank_dist:.1f}m)"
            reasons.append(f"{side} flank clearance narrow: {min_flank_dist:.1f} m")
        elif visibility_percent <= settings.dense_fog_threshold:
            hazard_summary = f"Dense monsoon fog ({visibility_percent:.0f}% visibility)"
            reasons.append(f"Visibility degraded to {visibility_percent:.0f}% — relying on ultrasonic fusion")
        else:
            hazard_summary = f"Front vehicle within {front_dist:.1f}m"
            reasons.append(f"Front distance: {front_dist:.1f} m")
            
    else:
        reasons.append(f"Front clearance clear: {front_dist:.1f} m")
        reasons.append(f"Visibility: {visibility_percent:.0f}%")
        reasons.append(f"Speed: {vehicle_speed_kmh:.1f} km/h")
        
    # Driver safety evaluation
    driver_distraction = False
    driver_status = "SAFE"
    driver_message = "Driver attentive — cabin clear"
    driver_confidence = 0.0
        
    sensor_conf = calculate_sensor_confidence(visibility_percent)

    score_map = {
        "CRITICAL": 92,
        "WARNING": 68,
        "CAUTION": 40,
        "SAFE": 12,
        "OFFLINE": 0
    }
    risk_score = score_map.get(risk_level, 0)
    
    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "action": action,
        "ttc_seconds": round(ttc, 1) if ttc is not None else None,
        "hazard_summary": hazard_summary,
        "reasons": reasons,
        "emergency_sms_required": emergency_sms_required,
        "driver_safety": {
            "status": driver_status,
            "distraction_detected": driver_distraction,
            "earphone_confidence": round(driver_confidence, 2),
            "message": driver_message
        },
        "sensor_confidence": sensor_conf
    }
