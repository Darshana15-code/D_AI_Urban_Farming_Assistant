from typing import List, Optional
from pydantic import BaseModel

class CareGuidanceResponse(BaseModel):
    condition_code: str
    condition_name: str
    scientific_name: str
    status: str
    severity: str
    summary: str
    symptoms: List[str]
    immediate_actions: List[str]
    why_it_matters: Optional[str] = None
    when_to_do_it: Optional[str] = None
    prevention: List[str]
    organic_treatment: List[str]
    chemical_guidance: List[str]
    sources: List[str]
