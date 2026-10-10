from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.core.security import get_current_user, AuthenticatedUser
from app.models.weather import WeatherResponse, WateringRecommendationResponse
from app.services.weather_service import weather_service, DEFAULT_COORDINATES
from app.services.db_service import db_service

router = APIRouter()

@router.get("", response_model=WeatherResponse)
async def get_weather(
    lat: float = Query(default=DEFAULT_COORDINATES["latitude"], ge=-90.0, le=90.0),
    lon: float = Query(default=DEFAULT_COORDINATES["longitude"], ge=-180.0, le=180.0),
):
    """Retrieves current weather and 3-day forecast from Open-Meteo."""
    data = await weather_service.get_forecast(lat, lon)
    return data

@router.get("/recommendation/{plant_id}", response_model=WateringRecommendationResponse)
async def get_plant_watering_recommendation(
    plant_id: str,
    lat: float = Query(default=DEFAULT_COORDINATES["latitude"]),
    lon: float = Query(default=DEFAULT_COORDINATES["longitude"]),
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """
    Computes explainable watering recommendations for a specific plant
    combining live Open-Meteo weather with plant container and balcony shelter context.
    """
    plant = db_service.get_plant_by_id(plant_id, current_user.id)
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plant '{plant_id}' not found in your garden."
        )

    weather = await weather_service.get_forecast(lat, lon)
    recommendation = weather_service.calculate_watering_recommendation(plant, weather)
    return recommendation
