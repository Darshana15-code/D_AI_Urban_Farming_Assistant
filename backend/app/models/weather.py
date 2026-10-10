from typing import List, Optional
from pydantic import BaseModel

class CurrentWeather(BaseModel):
    temp: int
    humidity: int
    precipitation: float
    wind_speed: int
    weather_code: int
    condition_text: str

class DailyWeather(BaseModel):
    date: str
    temp_max: int
    temp_min: int
    precip_prob: int
    precip_sum: float
    weather_code: int

class WeatherResponse(BaseModel):
    success: bool
    current: CurrentWeather
    daily: List[DailyWeather]
    attribution: str

class WateringRecommendationResponse(BaseModel):
    plant_id: str
    plant_name: str
    urgency: str
    label: str
    suggested_action: str
    reasons: List[str]
    weather_snapshot: dict
