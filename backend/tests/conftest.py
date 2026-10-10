import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def auth_headers_user1():
    return {"Authorization": "Bearer demo-token-user-01"}

@pytest.fixture
def auth_headers_user2():
    return {"Authorization": "Bearer demo-token-user-02"}
