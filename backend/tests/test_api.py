import io
from fastapi import status

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

def create_test_image_bytes(color=(40, 160, 60), size=(224, 224), format="JPEG"):
    """Generates valid image bytes for testing."""
    if HAS_PIL:
        img = Image.new("RGB", size, color=color)
        buf = io.BytesIO()
        img.save(buf, format=format)
        return buf.getvalue()
    else:
        # Minimal valid test JPEG header with specified color bytes
        color_bytes = bytes([color[0], color[1], color[2]])
        return (
            b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00"
            b"\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.' \",#\x1c\x1c(7),01444\x1f'9=82<.342"
            b"\xff\xc0\x00\x0b\x08\x00d\x00d\x01\x01\x11\x00"
            b"\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b"
            b"\xff\xda\x00\x08\x01\x01\x00\x00?\x00"
            + color_bytes * 500
            + b"\xff\xd9"
        )

# -----------------------------------------------------------------------------
# 1. HEALTH CHECKS
# -----------------------------------------------------------------------------
def test_health_endpoint(client):
    res = client.get("/api/v1/health")
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert data["status"] == "healthy"
    assert "capabilities" in data
    assert data["capabilities"]["ml_inference"] is True

# -----------------------------------------------------------------------------
# 2. SECURITY & AUTHENTICATION ENFORCEMENT
# -----------------------------------------------------------------------------
def test_unauthenticated_request_rejected(client):
    # Attempting to fetch plants without token must return 401
    res = client.get("/api/v1/plants")
    assert res.status_code == status.HTTP_401_UNAUTHORIZED
    assert "detail" in res.json()

def test_invalid_bearer_token_rejected(client):
    res = client.get("/api/v1/plants", headers={"Authorization": "Bearer invalid.jwt.structure"})
    assert res.status_code == status.HTTP_401_UNAUTHORIZED

# -----------------------------------------------------------------------------
# 3. PLANT CRUD & STRICT USER ISOLATION
# -----------------------------------------------------------------------------
def test_plant_crud_and_user_isolation(client, auth_headers_user1, auth_headers_user2):
    # User 1 creates a plant
    new_plant_data = {
        "name": "Terrace Roma Hybrid",
        "species": "Solanum lycopersicum",
        "variety": "Roma VF",
        "planting_date": "2026-09-01",
        "growing_location": "terrace",
        "container_type": "terracotta_pot",
        "sunlight": "full_sun",
        "notes": "Testing isolation"
    }
    create_res = client.post("/api/v1/plants", json=new_plant_data, headers=auth_headers_user1)
    assert create_res.status_code == status.HTTP_201_CREATED
    plant = create_res.json()
    plant_id = plant["id"]
    assert plant["name"] == "Terrace Roma Hybrid"
    assert plant["user_id"] == "user-01"

    # User 1 can view the plant
    get_res = client.get(f"/api/v1/plants/{plant_id}", headers=auth_headers_user1)
    assert get_res.status_code == status.HTTP_200_OK
    assert get_res.json()["id"] == plant_id

    # User 2 CANNOT view User 1's plant (Strict isolation!)
    user2_get_res = client.get(f"/api/v1/plants/{plant_id}", headers=auth_headers_user2)
    assert user2_get_res.status_code == status.HTTP_404_NOT_FOUND

    # User 2 CANNOT update User 1's plant
    user2_update_res = client.patch(
        f"/api/v1/plants/{plant_id}",
        json={"name": "Hacked Name"},
        headers=auth_headers_user2
    )
    assert user2_update_res.status_code == status.HTTP_404_NOT_FOUND

    # User 2 CANNOT delete User 1's plant
    user2_delete_res = client.delete(f"/api/v1/plants/{plant_id}", headers=auth_headers_user2)
    assert user2_delete_res.status_code == status.HTTP_404_NOT_FOUND

    # User 1 updates their plant
    update_res = client.patch(
        f"/api/v1/plants/{plant_id}",
        json={"notes": "Updated notes"},
        headers=auth_headers_user1
    )
    assert update_res.status_code == status.HTTP_200_OK
    assert update_res.json()["notes"] == "Updated notes"

    # User 1 deletes their plant
    delete_res = client.delete(f"/api/v1/plants/{plant_id}", headers=auth_headers_user1)
    assert delete_res.status_code == status.HTTP_204_NO_CONTENT

# -----------------------------------------------------------------------------
# 4. REAL ML DISEASE INFERENCE & UNCERTAINTY
# -----------------------------------------------------------------------------
def test_ml_inference_healthy_leaf(client, auth_headers_user1):
    # Create green leaf image bytes (dominant chlorophyll)
    green_leaf_bytes = create_test_image_bytes(color=(30, 195, 40))
    
    files = {"file": ("healthy_leaf.jpg", green_leaf_bytes, "image/jpeg")}
    data = {"notes": "Test healthy sample"}
    res = client.post("/api/v1/scans", files=files, data=data, headers=auth_headers_user1)
    
    assert res.status_code == status.HTTP_201_CREATED
    scan = res.json()
    assert scan["condition_code"] == "tomato_healthy"
    assert scan["confidence"] >= 0.65
    assert len(scan["top_predictions"]) == 3
    assert scan["is_inconclusive"] is False
    assert "explanation" in scan

def test_ml_inference_inconclusive_handling(client, auth_headers_user1):
    # Gray / ambiguous non-foliar image bytes (low contrast, ambiguous color)
    gray_bytes = create_test_image_bytes(color=(128, 128, 128))
    files = {"file": ("ambiguous.jpg", gray_bytes, "image/jpeg")}
    res = client.post("/api/v1/scans", files=files, headers=auth_headers_user1)
    assert res.status_code == status.HTTP_201_CREATED
    scan = res.json()
    assert scan["is_inconclusive"] is True
    assert "ambiguous" in scan["explanation"].lower() or scan["confidence"] < 0.65

def test_ml_inference_invalid_file_rejected(client, auth_headers_user1):
    # Non-image payload
    files = {"file": ("text.txt", b"This is not a picture", "text/plain")}
    res = client.post("/api/v1/scans", files=files, headers=auth_headers_user1)
    assert res.status_code == status.HTTP_400_BAD_REQUEST

# -----------------------------------------------------------------------------
# 5. WATERING LOGS
# -----------------------------------------------------------------------------
def test_watering_log_flow(client, auth_headers_user1):
    # First create plant
    plant_data = {"name": "Balcony Micro-Tom", "growing_location": "indoor_window"}
    p_res = client.post("/api/v1/plants", json=plant_data, headers=auth_headers_user1)
    plant_id = p_res.json()["id"]

    # Log watering
    log_data = {"amount_ml": 400, "soil_condition_before": "dry", "notes": "Morning irrigation"}
    res = client.post(f"/api/v1/plants/{plant_id}/watering-logs", json=log_data, headers=auth_headers_user1)
    assert res.status_code == status.HTTP_201_CREATED
    log = res.json()
    assert log["amount_ml"] == 400
    assert log["plant_id"] == plant_id

    # Retrieve logs
    list_res = client.get(f"/api/v1/plants/{plant_id}/watering-logs", headers=auth_headers_user1)
    assert list_res.status_code == status.HTTP_200_OK
    assert list_res.json()["total"] >= 1

# -----------------------------------------------------------------------------
# 6. WEATHER & REASONING RULES
# -----------------------------------------------------------------------------
def test_weather_and_recommendation_flow(client, auth_headers_user1):
    # Weather forecast
    w_res = client.get("/api/v1/weather")
    assert w_res.status_code == status.HTTP_200_OK
    w_data = w_res.json()
    assert "current" in w_data
    assert "daily" in w_data

    # Create plant
    p_res = client.post(
        "/api/v1/plants",
        json={"name": "Balcony Roma", "growing_location": "balcony", "container_type": "terracotta_pot"},
        headers=auth_headers_user1
    )
    plant_id = p_res.json()["id"]

    # Recommendation
    rec_res = client.get(f"/api/v1/weather/recommendation/{plant_id}", headers=auth_headers_user1)
    assert rec_res.status_code == status.HTTP_200_OK
    rec = rec_res.json()
    assert rec["plant_id"] == plant_id
    assert "label" in rec
    assert "suggested_action" in rec
    assert len(rec["reasons"]) > 0

# -----------------------------------------------------------------------------
# 7. CARE GUIDANCE
# -----------------------------------------------------------------------------
def test_care_guidance_retrieval(client):
    res = client.get("/api/v1/care/tomato_early_blight")
    assert res.status_code == status.HTTP_200_OK
    guidance = res.json()
    assert guidance["condition_name"] == "Early Blight"
    assert len(guidance["symptoms"]) > 0
    assert len(guidance["immediate_actions"]) > 0
    assert len(guidance["sources"]) > 0
