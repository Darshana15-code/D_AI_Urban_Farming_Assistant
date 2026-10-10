from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

class WateringLogCreate(BaseModel):
    amount_ml: int = Field(..., gt=0, le=10000, description="Volume in milliliters")
    soil_condition_before: str = Field(default="dry", description="dry, slightly_moist, wet")
    notes: Optional[str] = Field(default="", description="Watering notes or fertilizer additives")

class WateringLogResponse(BaseModel):
    id: str
    user_id: str
    plant_id: str
    amount_ml: int
    soil_condition_before: str
    notes: Optional[str] = ""
    logged_at: datetime

    model_config = {"from_attributes": True}

class WateringLogListResponse(BaseModel):
    total: int
    logs: List[WateringLogResponse]
