# FloraPulse AI — API Specification (v1.0)

## Overview
FloraPulse AI provides a secure REST API for tomato foliar disease diagnostics, weather-informed watering guidance, and urban garden management.

- **Base URL**: `http://localhost:8000/api/v1`
- **Authentication**: Bearer token via `Authorization: Bearer <token>`
- **Content-Type**: `application/json` (except `/scans` which accepts `multipart/form-data`)

---

## Endpoints

### 1. System Health
- **`GET /health`**
  - **Summary**: Verify operational status of the service, ML inference engine, and database.
  - **Auth**: None
  - **Response 200**:
    ```json
    {
      "status": "healthy",
      "service": "FloraPulse AI - Urban Farming Backend",
      "version": "1.0.0",
      "timestamp": "2026-10-10T06:03:12Z",
      "capabilities": {
        "ml_inference": true,
        "care_guidance": true,
        "open_meteo_weather": true,
        "database": true
      }
    }
    ```

### 2. Plants Management
- **`GET /plants`**
  - **Summary**: List all plants owned by the authenticated user.
  - **Auth**: Required
  - **Response 200**: `{ "total": 2, "plants": [ ... ] }`

- **`POST /plants`**
  - **Summary**: Register a new plant.
  - **Auth**: Required
  - **Request Body**:
    ```json
    {
      "name": "Balcony Sweet 100",
      "species": "Solanum lycopersicum",
      "variety": "Cherry Tomato (Super Sweet 100)",
      "planting_date": "2026-08-15",
      "growing_location": "balcony",
      "container_type": "terracotta_pot",
      "sunlight": "full_sun",
      "notes": "South railing vine"
    }
    ```
  - **Response 201**: Created plant object.

- **`GET /plants/{plant_id}`**
  - **Summary**: Retrieve a single plant by ID (enforces user isolation).
  - **Auth**: Required
  - **Response 200**: Plant object.
  - **Response 404**: Not found or belongs to another user.

- **`PATCH /plants/{plant_id}`**
  - **Summary**: Update plant attributes.
  - **Auth**: Required
  - **Response 200**: Updated plant object.

- **`DELETE /plants/{plant_id}`**
  - **Summary**: Delete plant and cascade delete associated scans and logs.
  - **Auth**: Required
  - **Response 204**: No content.

### 3. AI Disease Scans
- **`POST /scans`**
  - **Summary**: Upload a leaf image, execute real convolutional model inference, calibrate confidence, and persist diagnostic result.
  - **Auth**: Required
  - **Request**: `multipart/form-data`
    - `file`: Image file (JPG, PNG, WebP; max 10MB)
    - `plant_id` (optional): UUID of associated plant
    - `notes` (optional): String notes
  - **Response 201**:
    ```json
    {
      "id": "scan-uuid",
      "user_id": "user-uuid",
      "plant_id": "plant-uuid",
      "image_url": "data:image/jpeg;base64,...",
      "condition_code": "tomato_early_blight",
      "condition_name": "Early Blight",
      "confidence": 0.892,
      "is_inconclusive": false,
      "top_predictions": [
        { "condition_code": "tomato_early_blight", "condition_name": "Early Blight", "confidence": 0.892 },
        { "condition_code": "tomato_target_spot", "condition_name": "Target Spot", "confidence": 0.078 }
      ],
      "explanation": "Calibrated deep vision inference matched characteristic lesion morphology.",
      "created_at": "2026-10-10T06:05:00Z"
    }
    ```

- **`GET /scans`**
  - **Summary**: List all scans for authenticated user.
  - **Auth**: Required
  - **Response 200**: `{ "total": 1, "scans": [ ... ] }`

- **`GET /scans/{scan_id}`**
  - **Summary**: Retrieve specific scan by ID.
  - **Auth**: Required
  - **Response 200**: Scan object.

### 4. Irrigation & Watering Logs
- **`POST /plants/{plant_id}/watering-logs`**
  - **Summary**: Record watering event and observed soil moisture.
  - **Auth**: Required
  - **Request Body**:
    ```json
    {
      "amount_ml": 500,
      "soil_condition_before": "dry",
      "notes": "Early morning bottom watering"
    }
    ```
  - **Response 201**: Watering log record.

- **`GET /plants/{plant_id}/watering-logs`**
  - **Summary**: Retrieve watering logs for plant.
  - **Auth**: Required
  - **Response 200**: `{ "total": 3, "logs": [ ... ] }`

### 5. Weather & Recommendations
- **`GET /weather`**
  - **Summary**: Retrieve live Open-Meteo current and daily forecasts.
  - **Auth**: None
  - **Query Params**: `lat` (float), `lon` (float)
  - **Response 200**: `{ "success": true, "current": { "temp": 29, ... }, "daily": [ ... ] }`

- **`GET /weather/recommendation/{plant_id}`**
  - **Summary**: Compute explainable watering recommendation combining live weather with plant container and balcony shelter context.
  - **Auth**: Required
  - **Response 200**:
    ```json
    {
      "plant_id": "plant-uuid",
      "plant_name": "Balcony Roma",
      "urgency": "water_today",
      "label": "Water Recommended Today",
      "suggested_action": "Water deeply in early morning hours before peak sun.",
      "reasons": [
        "High temperature (34°C) accelerates transpiration and root water consumption.",
        "Porous terracotta clay breathes and evaporates moisture from pot walls faster than plastic."
      ]
    }
    ```

### 6. Reviewed Care Guidance
- **`GET /care/{condition_code}`**
  - **Summary**: Retrieve verified agricultural research protocols (ICAR, TNAU, UC Davis IPM, Cornell) for any condition.
  - **Auth**: None
  - **Response 200**: Care guidance object with symptoms, immediate actions, bio-controls, cultural prevention, chemical guidance, and sources.
