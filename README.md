# FOG-SAFE: Mining Dumper Multi-Sensor Collision Avoidance System

Real-Time Telemetry Gateway, AI Sensor Fusion, and Command Center for Heavy Mining Dumpers operating in dense monsoon fog.

---

## 🌐 Network Host & Port Reference (Host IDs)

Below are the official network host addresses, ports, and endpoints for both the **Frontend** and **Backend**:

| Service | Environment | Host Address / URL | Protocol | Role / Description |
|---|---|---|---|---|
| **Backend Server** | Localhost | `http://localhost:8000` | HTTP | FastAPI Core Telemetry & Risk Engine |
| **Backend Server** | Network / LAN | `http://<LAPTOP_IP>:8000` | HTTP | Accessible across local Wi-Fi / Hotspot / Pi |
| **WebSocket Stream** | Localhost | `ws://localhost:8000/ws/telemetry` | WebSocket | High-frequency 20Hz telemetry stream |
| **WebSocket Stream** | Network / LAN | `ws://<LAPTOP_IP>:8000/ws/telemetry` | WebSocket | Live telemetry feed for remote dashboards |
| **API Documentation** | Localhost | `http://localhost:8000/docs` | HTTP | Interactive Swagger UI API explorer |
| **Hardware Ingest** | Network / Pi | `http://<LAPTOP_IP>:8000/api/sensors` | HTTP POST | Sensor ingestion for Raspberry Pi 4 |
| **Frontend Dashboard** | Localhost | `http://localhost:5173` | HTTP | Vite React Web Dashboard |
| **Frontend Dashboard** | Network / LAN | `http://<LAPTOP_IP>:5173` | HTTP | Accessible from mobile, tablet, or external PC |

> **Note:** Replace `<LAPTOP_IP>` with your machine's local IPv4 address (found by typing `ipconfig` in PowerShell/CMD, e.g. `192.168.1.45`).

---

## 🚀 Quick Start (On-Demand)

### 1. Start Everything with 1 Click
Double-click:
```text
start_full_dashboard.bat
```
This launches both the **FastAPI Backend (:8000)** and **Vite Frontend (:5173)** in separate windows.

### 2. Start Backend Server Only
Double-click:
```text
start_laptop_server.bat
```
*(Or run `python backend/run.py`)*

### 3. Start Frontend Dashboard Only
```bash
cd frontend
npm run dev -- --host
```

---

## 🛑 How to Turn the Server OFF
* **Press `Ctrl + C`** in the terminal window, **OR**
* **Simply close the command window**.
* The server will immediately shut down and stop listening on port 8000.

---

## 📡 Raspberry Pi Edge Node Connection
To stream live hardware sensors (Camera, Ultrasonic array, GPS, IMU, GSM) from your Raspberry Pi to this laptop server:

In `pi_edge_client.py` on your Raspberry Pi:
```python
SERVER_URL = "http://<LAPTOP_IP>:8000/api/sensors"
```

For complete wiring diagrams and 4G modem configuration, refer to [docs/RASPBERRY_PI_SETUP.md](docs/RASPBERRY_PI_SETUP.md).
