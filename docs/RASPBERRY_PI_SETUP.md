# Raspberry Pi 4 Edge Integration & Hardware Setup Guide

This guide describes how to connect physical hardware to the **Raspberry Pi 4 Model B (4GB/8GB)** and stream telemetry to the **FOG-SAFE Command Center**.

---

## 1. Bill of Materials (BOM)

| Component | Model / Spec | Interface to Pi 4 | Role in System |
|---|---|---|---|
| Single Board Computer | Raspberry Pi 4 Model B (4GB/8GB) | - | Central Edge Controller & YOLO Engine |
| Optical Camera | Raspberry Pi Camera Module V2 (8MP) | CSI Ribbon Cable | Forward perception (YOLOv8 classes 0-3) |
| Ultrasonic Array | 4x JSN-SR04T (Waterproof Industrial) or HC-SR04 | GPIO (Trig/Echo + Resistor divider) | 360° Proximity sensing (Fog resilient) |
| GNSS Module | u-blox NEO-6M GPS | UART (TX/RX -> GPIO 15/14) | Haul-road coordinates & ground speed |
| IMU Sensor | MPU-6050 (6-DOF Gyro/Accel) | I2C (SDA/SCL -> GPIO 2/3) | Vehicle chassis pitch, roll & tilt |
| Cellular Modem | SIMCom SIM7600G-H 4G LTE Cat-4 HAT | USB 2.0 / UART | Long-range pit-to-command telemetry & SMS |
| Power Regulation | 12V/24V to 5V 5A Buck Converter | Pi USB-C | Clean power from dumper battery |

---

## 2. Hardware Wiring Diagram

```
                 RASPBERRY PI 4 MODEL B
               ┌────────────────────────┐
               │                        │
  Pi Camera ───┤ [CSI Port]             │
               │                        │
  NEO-6M GPS   │                        │
    TX ────────┤ GPIO 15 (RXD0)         │
    RX ────────┤ GPIO 14 (TXD0)         │
               │                        │
  MPU-6050 IMU │                        │
    SDA ───────┤ GPIO 2 (SDA)           │
    SCL ───────┤ GPIO 3 (SCL)           │
               │                        │
  ULTRASONIC   │                        │
    Front Trig ┤ GPIO 23                │
    Front Echo ┤ GPIO 24 (via 1k/2k div)│
    Rear Trig  ┤ GPIO 17                │
    Rear Echo  ┤ GPIO 27 (via 1k/2k div)│
    Left Trig  ┤ GPIO 5                 │
    Left Echo  ┤ GPIO 6  (via 1k/2k div)│
    Right Trig ┤ GPIO 19                │
    Right Echo ┤ GPIO 26 (via 1k/2k div)│
               │                        │
  SIM7600 4G   │                        │
    USB Port ──┤ [USB 3.0/2.0 Port]     │
               └────────────────────────┘
```

> [!CAUTION]
> **Echo Pin Voltage Dividers:**  
> HC-SR04 Echo pins output 5V logic. Raspberry Pi GPIO pins are strictly 3.3V tolerant. Always use a voltage divider (1kΩ in series and 2kΩ to GND) on each Echo line to step down the signal to ~3.3V.

---

## 3. SIM7600 4G LTE Configuration

1. Connect the SIM7600 HAT to the Pi via micro-USB.
2. Verify modem detection:
   ```bash
   lsusb
   # Bus 001 Device 004: ID 1e0e:9001 Qualcomm / SIMCom Wireless Solutions Co., Ltd.
   ```
3. Enable 4G QMI/WWAN interface:
   ```bash
   sudo qmicli -d /dev/cdc-wdm0 --dms-set-operating-mode='online'
   sudo qmi-network /dev/cdc-wdm0 start
   sudo udhcpc -q -f -i wwan0
   ```
4. Verify AT Commands via `/dev/ttyUSB2`:
   ```text
   AT+CSQ         # Check signal quality (Target: 18-31)
   AT+CREG?       # Check network registration
   AT+CMGS="+919876543210" # Test SMS dispatch
   ```

---

## 4. Edge Python Script (`pi_edge_client.py`)

Run this script on the Raspberry Pi 4 to read live sensors and stream to the command server:

```python
import time
import json
import requests
import cv2
from ultralytics import YOLO

SERVER_URL = "http://<COMMAND_CENTER_IP>:8000/api/sensors"
VEHICLE_ID = "DUMPER_01"

# Load lightweight YOLO model
model = YOLO("yolov8n.pt")  # or custom trained mining weights

def read_ultrasonic():
    # Return distances in meters from GPIO pins
    return {"front": 5.4, "rear": 12.1, "left": 6.2, "right": 7.0}

def read_gps():
    # Parse NMEA sentences from /dev/ttyAMA0
    return {"lat": 22.71960, "lon": 75.85770, "speed": 14.2, "heading": 45.0}

def read_imu():
    # Read pitch/accel from MPU6050 via smbus2
    return {"acceleration": 0.42, "tilt": 2.1}

def get_gsm_status():
    return {"signal_dbm": -74, "csq": 24, "carrier": "MineLink 4G Private APN", "ip": "10.144.28.105"}

def run_vision_inference(frame):
    results = model(frame, verbose=False)[0]
    conf_dict = {"person": 0.0, "dumper": 0.0, "obstacle": 0.0, "earphone": 0.0}
    for box in results.boxes:
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])
        if cls_id == 0: conf_dict["person"] = max(conf_dict["person"], conf)
        elif cls_id == 1: conf_dict["dumper"] = max(conf_dict["dumper"], conf)
        elif cls_id == 2: conf_dict["obstacle"] = max(conf_dict["obstacle"], conf)
        elif cls_id == 3: conf_dict["earphone"] = max(conf_dict["earphone"], conf)
    return conf_dict

def main():
    cap = cv2.VideoCapture(0)
    print(f"[*] Edge node {VEHICLE_ID} transmitting to {SERVER_URL} via 4G LTE...")
    while True:
        ret, frame = cap.read()
        vision_confs = run_vision_inference(frame) if ret else {"person": 0, "dumper": 0, "obstacle": 0, "earphone": 0}
        
        payload = {
            "vehicle_id": VEHICLE_ID,
            "gps": read_gps(),
            "ultrasonic": read_ultrasonic(),
            "imu": read_imu(),
            "vision": vision_confs,
            "gsm": get_gsm_status(),
            "visibility_percent": 65.0
        }
        
        try:
            requests.post(SERVER_URL, json=payload, timeout=0.5)
        except Exception as e:
            print(f"[!] Transmission retry: {e}")
            
        time.sleep(0.2)

if __name__ == "__main__":
    main()
```
