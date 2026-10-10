import os
from typing import List
from pydantic import BaseModel

class Settings(BaseModel):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "FloraPulse AI - Urban Farming Backend"
    VERSION: str = "1.0.0"
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")
    
    # Mode flags
    ALLOW_DEMO_TOKENS: bool = os.getenv("ALLOW_DEMO_TOKENS", "true").lower() in ("true", "1")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
    
    # ML & Storage
    MAX_IMAGE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]
    DATA_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

    @property
    def is_cloud_mode(self) -> bool:
        return bool(self.SUPABASE_URL and self.SUPABASE_ANON_KEY)

settings = Settings()
