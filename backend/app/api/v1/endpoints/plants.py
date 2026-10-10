from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user, AuthenticatedUser
from app.models.plant import PlantCreate, PlantUpdate, PlantResponse, PlantListResponse
from app.services.db_service import db_service

router = APIRouter()

@router.get("", response_model=PlantListResponse)
def list_plants(current_user: AuthenticatedUser = Depends(get_current_user)):
    """Retrieves all plants belonging to the authenticated user."""
    plants = db_service.get_plants_for_user(current_user.id)
    return {"total": len(plants), "plants": plants}

@router.post("", response_model=PlantResponse, status_code=status.HTTP_201_CREATED)
def create_plant(
    plant_in: PlantCreate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """Registers a new tomato plant for the authenticated user."""
    record = db_service.create_plant(current_user.id, plant_in.model_dump())
    return record

@router.get("/{plant_id}", response_model=PlantResponse)
def get_plant(
    plant_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """Retrieves detailed profile of a specific plant owned by user."""
    plant = db_service.get_plant_by_id(plant_id, current_user.id)
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plant '{plant_id}' not found or does not belong to your account."
        )
    return plant

@router.patch("/{plant_id}", response_model=PlantResponse)
def update_plant(
    plant_id: str,
    updates: PlantUpdate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """Updates attributes of a specific user plant."""
    updated = db_service.update_plant(plant_id, current_user.id, updates.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plant '{plant_id}' not found or cannot be modified."
        )
    return updated

@router.delete("/{plant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plant(
    plant_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """Deletes a plant and its associated scan and watering history."""
    success = db_service.delete_plant(plant_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plant '{plant_id}' not found or cannot be removed."
        )
    return None
