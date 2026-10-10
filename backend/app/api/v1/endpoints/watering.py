from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user, AuthenticatedUser
from app.models.watering import WateringLogCreate, WateringLogResponse, WateringLogListResponse
from app.services.db_service import db_service

router = APIRouter()

@router.post("/{plant_id}/watering-logs", response_model=WateringLogResponse, status_code=status.HTTP_201_CREATED)
def log_watering(
    plant_id: str,
    log_in: WateringLogCreate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """Records an irrigation event and soil condition for a user-owned plant."""
    plant = db_service.get_plant_by_id(plant_id, current_user.id)
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plant '{plant_id}' not found in your garden."
        )

    log_record = db_service.create_watering_log(
        user_id=current_user.id,
        plant_id=plant_id,
        data=log_in.model_dump()
    )
    return log_record

@router.get("/{plant_id}/watering-logs", response_model=WateringLogListResponse)
def get_watering_logs(
    plant_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """Retrieves watering logs history for a specific plant."""
    plant = db_service.get_plant_by_id(plant_id, current_user.id)
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plant '{plant_id}' not found in your garden."
        )

    logs = db_service.get_watering_logs_for_plant(plant_id, current_user.id)
    return {"total": len(logs), "logs": logs}
