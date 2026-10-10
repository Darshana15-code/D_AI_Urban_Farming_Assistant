from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, Field

class PlantBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Plant nickname")
    species: str = Field(default="Solanum lycopersicum", description="Botanical species")
    variety: Optional[str] = Field(default="Cherry Tomato (Super Sweet 100)", description="Cultivar variety")
    planting_date: Optional[date] = Field(default_factory=date.today, description="Date planted")
    growing_location: str = Field(default="balcony", description="balcony, terrace, indoor_window, patio, garden_bed")
    container_type: str = Field(default="terracotta_pot", description="terracotta_pot, grow_bag, plastic_pot, raised_bed, ground")
    sunlight: str = Field(default="full_sun", description="full_sun, partial_shade, low_light")
    notes: Optional[str] = Field(default="", description="Gardener notes")
    image_url: Optional[str] = Field(default="", description="Plant avatar image URL")

class PlantCreate(PlantBase):
    pass

class PlantUpdate(BaseModel):
    name: Optional[str] = None
    variety: Optional[str] = None
    planting_date: Optional[date] = None
    growing_location: Optional[str] = None
    container_type: Optional[str] = None
    sunlight: Optional[str] = None
    health_status: Optional[str] = None
    notes: Optional[str] = None
    image_url: Optional[str] = None

class PlantResponse(PlantBase):
    id: str
    user_id: str
    health_status: str = "unscanned"
    last_watered: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class PlantListResponse(BaseModel):
    total: int
    plants: List[PlantResponse]
