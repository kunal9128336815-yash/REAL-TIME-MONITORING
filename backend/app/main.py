from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import logging
from .database.db import init_db
from .api import sensors, simulation, fleet, alerts, settings as settings_api, pi_bridge
from .simulation.physics_engine import simulation_engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mining_backend")

app = FastAPI(
    title="FOG-SAFE: Mining Dumper Multi-Sensor Collision Avoidance API",
    description="Backend API and Real-Time Telemetry Gateway for Mining Dumpers in Dense Monsoon Fog",
    version="2.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Mount API routers
app.include_router(sensors.router)
app.include_router(simulation.router)
app.include_router(fleet.router)
app.include_router(alerts.router)
app.include_router(settings_api.router)
app.include_router(pi_bridge.router)

@app.on_event("startup")
async def startup_tasks():
    pi_bridge.start_pi_bridge()
    logger.info(f"FOG-SAFE Telemetry Gateway started. Pi Hardware Bridge initialized.")

@app.get("/api/status")
async def get_system_status():
    return {
        "status": "ONLINE",
        "system": "FOG-SAFE AI Collision Avoidance Engine",
        "mode": sensors.operating_mode,
        "version": "2.0.0",
        "modules": {
            "risk_engine": "ACTIVE",
            "physics_simulation": "ACTIVE",
            "gsm_gateway": "ACTIVE",
            "db_persistence": "ACTIVE"
        }
    }

@app.post("/data")
@app.post("/api/telemetry")
@app.post("/data/api/telemetry")
async def root_data_ingest(data: sensors.SensorIngestPayload):
    return await sensors.ingest_sensor_data(data)

# Active WebSocket connections
active_connections: list[WebSocket] = []

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    logger.info(f"WebSocket client connected. Total clients: {len(active_connections)}")
    
    try:
        while True:
            # Real-time hardware telemetry with strict 3.5s offline fallback
            telemetry = sensors.get_active_telemetry()
            await websocket.send_text(json.dumps(telemetry))
            
            # Check incoming client messages (e.g. scenario triggers from client)
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=0.35)
                msg = json.loads(data)
                if msg.get("type") == "SET_SCENARIO":
                    simulation_engine.set_scenario(msg.get("scenario", "NORMAL_OPERATION"))
                elif msg.get("type") == "START_GUIDED_DEMO":
                    simulation_engine.start_guided_demo()
            except asyncio.TimeoutError:
                pass
                
            await asyncio.sleep(0.05)
            
    except (WebSocketDisconnect, Exception) as e:
        logger.info(f"WebSocket client disconnected: {e}")
        if websocket in active_connections:
            active_connections.remove(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
