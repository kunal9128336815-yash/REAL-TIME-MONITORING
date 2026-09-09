from fastapi import APIRouter
from typing import Dict, Any
from ..config import settings, Settings

router = APIRouter(prefix="/api/settings", tags=["Threshold Settings"])

@router.get("")
async def get_settings() -> Dict[str, Any]:
    return settings.model_dump()

@router.post("")
async def update_settings(new_settings: Dict[str, Any]) -> Dict[str, Any]:
    for key, value in new_settings.items():
        if hasattr(settings, key):
            setattr(settings, key, value)
    return {"status": "success", "updated_settings": settings.model_dump()}
