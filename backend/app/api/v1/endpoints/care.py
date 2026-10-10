from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.core.security import get_current_user, AuthenticatedUser
from app.models.care import CareGuidanceResponse
from app.services.care_service import care_service
from app.services.db_service import db_service

router = APIRouter()

@router.get("/{condition_code}", response_model=CareGuidanceResponse)
def get_condition_guidance(condition_code: str, lang: str = Query("en")):
    """Retrieves verified agronomic guidance for a specific condition code."""
    guidance = care_service.get_guidance(condition_code, lang=lang)
    return guidance

@router.get("/plant/{plant_id}", response_model=CareGuidanceResponse)
def get_plant_care_guidance(
    plant_id: str,
    lang: str = Query("en"),
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """Retrieves care guidance based on the plant's most recent diagnostic scan."""
    plant = db_service.get_plant_by_id(plant_id, current_user.id)
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plant '{plant_id}' not found."
        )

    user_scans = db_service.get_scans_for_user(current_user.id)
    plant_scans = [s for s in user_scans if s.get("plant_id") == plant_id]
    
    condition_code = plant_scans[0]["condition_code"] if plant_scans else "tomato_healthy"
    return care_service.get_guidance(condition_code, lang=lang)
