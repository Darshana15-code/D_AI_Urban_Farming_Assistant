from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import health, plants, scans, watering, care, weather

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligent API for tomato foliar diagnostics, weather-informed watering, and urban gardening."
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local development on any port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register versioned routers
api_prefix = settings.API_V1_STR
app.include_router(health.router, prefix=api_prefix, tags=["Health"])
app.include_router(plants.router, prefix=f"{api_prefix}/plants", tags=["Plants"])
app.include_router(scans.router, prefix=f"{api_prefix}/scans", tags=["AI Disease Scans"])
app.include_router(watering.router, prefix=f"{api_prefix}/plants", tags=["Watering Logs"])
app.include_router(care.router, prefix=f"{api_prefix}/care", tags=["Care Guidance"])
app.include_router(weather.router, prefix=f"{api_prefix}/weather", tags=["Weather & Irrigation"])

@app.get("/")
def root():
    return {
        "message": "Welcome to FloraPulse AI Backend",
        "docs": "/docs",
        "health": f"{api_prefix}/health",
        "version": settings.VERSION
    }
