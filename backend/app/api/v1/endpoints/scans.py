import base64
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from app.core.security import get_current_user, AuthenticatedUser
from app.models.scan import ScanResponse, ScanListResponse
from app.services.ml_inference import inference_engine
from app.services.db_service import db_service

router = APIRouter()

ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@router.post("", response_model=ScanResponse, status_code=status.HTTP_201_CREATED)
async def create_scan(
    file: UploadFile = File(...),
    plant_id: Optional[str] = Form(None),
    notes: Optional[str] = Form(""),
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """
    Uploads a tomato leaf photo, executes real convolutional inference with
    calibrated temperature scaling, and records the diagnostic result.
    """
    # 1. Validate MIME type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{file.content_type}'. Supported formats: JPG, PNG, WebP."
        )

    # 2. Read bytes & validate size
    image_bytes = await file.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of 10MB."
        )

    # 3. Validate plant ownership if plant_id provided
    if plant_id:
        plant = db_service.get_plant_by_id(plant_id, current_user.id)
        if not plant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Associated plant '{plant_id}' not found in your garden."
            )

    # 4. Run real ML inference
    try:
        prediction = inference_engine.predict(image_bytes)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference pipeline failure: {str(e)}"
        )

    # 5. Image reference (data URL for direct rendering or private storage ref)
    b64_data = base64.b64encode(image_bytes).decode("utf-8")
    image_data_url = f"data:{file.content_type};base64,{b64_data}"

    # 6. Save scan in database
    scan_record = db_service.create_scan(
        user_id=current_user.id,
        data={
            "plant_id": plant_id,
            "image_url": image_data_url,
            "condition_code": prediction["condition_code"],
            "condition_name": prediction["condition_name"],
            "confidence": prediction["confidence"],
            "is_inconclusive": prediction["is_inconclusive"],
            "top_predictions": prediction["top_predictions"],
            "notes": notes or ""
        }
    )

    scan_record["explanation"] = prediction["explanation"]
    return scan_record

@router.get("", response_model=ScanListResponse)
def list_scans(current_user: AuthenticatedUser = Depends(get_current_user)):
    """Retrieves all diagnostic scans performed by the authenticated user."""
    scans = db_service.get_scans_for_user(current_user.id)
    return {"total": len(scans), "scans": scans}

@router.get("/{scan_id}", response_model=ScanResponse)
def get_scan(
    scan_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """Retrieves a specific scan result owned by the user."""
    scan = db_service.get_scan_by_id(scan_id, current_user.id)
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan '{scan_id}' not found or belongs to another gardener."
        )
    return scan

@router.get("/plant/{plant_id}", response_model=ScanListResponse)
def get_plant_scans(
    plant_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """Retrieves diagnostic scan history for a specific plant."""
    plant = db_service.get_plant_by_id(plant_id, current_user.id)
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plant '{plant_id}' not found."
        )
    user_scans = db_service.get_scans_for_user(current_user.id)
    plant_scans = [s for s in user_scans if s.get("plant_id") == plant_id]
    return {"total": len(plant_scans), "scans": plant_scans}
