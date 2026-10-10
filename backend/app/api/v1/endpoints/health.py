from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/health")
def health_check():
    """Health check endpoint indicating service operational readiness."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "capabilities": {
            "ml_inference": True,
            "care_guidance": True,
            "open_meteo_weather": True,
            "database": True
        }
    }
