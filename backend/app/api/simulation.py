from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..simulation.physics_engine import simulation_engine

router = APIRouter(prefix="/api/simulation", tags=["Simulation Control"])

class ScenarioRequest(BaseModel):
    scenario: str

class ControlRequest(BaseModel):
    action: str  # "start", "pause", "reset"
    speed: Optional[float] = 1.0

VALID_SCENARIOS = [
    "NORMAL_OPERATION",
    "DENSE_FOG",
    "PERSON_ON_ROAD",
    "DUMPER_APPROACHING",
    "OBSTACLE_AHEAD",
    "MULTI_HAZARD"
]

@router.post("/scenario")
async def trigger_scenario(req: ScenarioRequest):
    if req.scenario not in VALID_SCENARIOS:
        raise HTTPException(status_code=400, detail=f"Invalid scenario. Must be one of {VALID_SCENARIOS}")
    simulation_engine.set_scenario(req.scenario)
    return {"status": "success", "active_scenario": req.scenario}

@router.post("/control")
async def control_simulation(req: ControlRequest):
    if req.action == "start":
        simulation_engine.running = True
    elif req.action == "pause":
        simulation_engine.running = False
    elif req.action == "reset":
        simulation_engine.step = 0
        simulation_engine.set_scenario("NORMAL_OPERATION")
        simulation_engine.running = True
        
    if req.speed is not None and req.speed > 0:
        simulation_engine.sim_speed = req.speed
        
    return {
        "status": "success",
        "running": simulation_engine.running,
        "speed": simulation_engine.sim_speed,
        "scenario": simulation_engine.scenario
    }

@router.post("/guided-demo")
async def start_guided_demo():
    simulation_engine.start_guided_demo()
    return {"status": "success", "guided_demo_started": True, "initial_scenario": "NORMAL_OPERATION"}
