from fastapi.testclient import TestClient


def test_health(
    client: TestClient
) -> None:
    response = client.get("http://localhost:8000/api/v1/health")
    assert response.status_code == 200