from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class PredictionItem(BaseModel):
    condition_code: str
    condition_name: str
    confidence: float

class ScanResponse(BaseModel):
    id: str
    user_id: str
    plant_id: Optional[str] = None
    image_url: str
    condition_code: str
    condition_name: str
    confidence: float
    is_inconclusive: bool = False
    top_predictions: List[PredictionItem] = []
    notes: Optional[str] = ""
    created_at: datetime
    explanation: Optional[str] = None

    model_config = {"from_attributes": True}

class ScanListResponse(BaseModel):
    total: int
    scans: List[ScanResponse]
