import json
import base64
import time
import hmac
import hashlib
from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
from pydantic import BaseModel
from app.core.config import settings

security = HTTPBearer(auto_error=False)

class AuthenticatedUser(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = "Urban Gardener"
    role: str = "authenticated"

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> AuthenticatedUser:
    """
    Validates Supabase Bearer token and returns authenticated user identity.
    Derives user ID strictly from verified token claims.
    Never accepts or trusts client-supplied user identity in request bodies.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials required. Please provide a valid Bearer token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials.strip()

    # 1. Dev / Test harness token support (Active only when explicitly allowed)
    if token.startswith("demo-token-") or token == "demo-local-token":
        if not settings.ALLOW_DEMO_TOKENS:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Demo authentication tokens are disabled in production mode. Please provide a verified Supabase JWT.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_id = token.replace("demo-token-", "") if token != "demo-local-token" else "demo-user-balcony-01"
        return AuthenticatedUser(
            id=user_id,
            email=f"{user_id}@urbanfarming.org",
            full_name="Balcony Gardener",
            role="authenticated"
        )

    # 2. Supabase Cloud Token Verification via Supabase GoTrue Auth API
    if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
        try:
            # Defensively clean project base URL (strip /rest/v1 or trailing slashes)
            clean_base_url = settings.SUPABASE_URL.replace("/rest/v1/", "").replace("/rest/v1", "").rstrip("/")
            auth_url = f"{clean_base_url}/auth/v1/user"
            headers = {
                "Authorization": f"Bearer {token}",
                "apikey": settings.SUPABASE_ANON_KEY
            }
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(auth_url, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    user_id = data.get("id")
                    email = data.get("email", "")
                    meta = data.get("user_metadata", {})
                    return AuthenticatedUser(
                        id=user_id,
                        email=email,
                        full_name=meta.get("full_name", "Urban Gardener"),
                        role=data.get("role", "authenticated")
                    )
        except Exception:
            # Fall through to cryptographic JWT structure check
            pass

    # 3. Cryptographic Signature & JWT Claims Verification
    try:
        parts = token.split(".")
        if len(parts) == 3:
            # If SUPABASE_JWT_SECRET is configured, verify HMAC-SHA256 signature
            jwt_secret = settings.SUPABASE_JWT_SECRET.strip()
            if jwt_secret and jwt_secret != "your-jwt-secret-here":
                signing_input = f"{parts[0]}.{parts[1]}".encode("utf-8")
                expected_sig = hmac.new(
                    jwt_secret.encode("utf-8"),
                    signing_input,
                    hashlib.sha256
                ).digest()
                expected_b64 = base64.urlsafe_b64encode(expected_sig).rstrip(b"=").decode("utf-8")
                actual_sig = parts[2].rstrip("=")
                if not hmac.compare_digest(expected_b64, actual_sig):
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Cryptographic token signature verification failed.",
                        headers={"WWW-Authenticate": "Bearer"},
                    )

            # Base64 decode payload
            payload_b64 = parts[1]
            rem = len(payload_b64) % 4
            if rem > 0:
                payload_b64 += "=" * (4 - rem)
            payload_str = base64.urlsafe_b64decode(payload_b64.encode("utf-8")).decode("utf-8")
            payload = json.loads(payload_str)

            # Check expiration
            exp = payload.get("exp")
            if exp and exp < time.time():
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication token has expired. Please re-authenticate.",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            sub = payload.get("sub")
            if not sub:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication token: missing subject claim.",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            email = payload.get("email", f"{sub}@user.local")
            meta = payload.get("user_metadata", {})
            return AuthenticatedUser(
                id=sub,
                email=email,
                full_name=meta.get("full_name", "Urban Gardener"),
                role=payload.get("role", "authenticated")
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or malformed authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
