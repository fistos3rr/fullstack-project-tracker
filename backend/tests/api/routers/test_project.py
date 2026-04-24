import uuid
from fastapi.testclient import TestClient

from sqlmodel import Session

from app.core.config import settings

from tests.utils.project import create_project
from tests.utils.utils import random_project_status, random_lower_string

from app.service.project_service import ProjectService
from app.service.project_log_service import ProjectChangeLogService
from app.models.status_enum import ProjectStatus

from app.http_errors import ErrorCode

def test_read_projects(client: TestClient, db: Session) -> None:
    create_project(db)
    create_project(db)
    r = client.get(f"{settings.API_V1_STR}/projects/")
    assert r.status_code == 200

    all_projects = r.json()
    
    assert len(all_projects["data"]) > 1
    assert "count" in all_projects
    for project in all_projects["data"]:
        assert "name" in project

def read_project_by_id(client: TestClient, db: Session) -> None:
    project = create_project(db)
    r = client.get(f"{settings.API_V1_STR}/projects/{project.id}")
    project_r = r.json()
    assert project_r
    assert project_r["project_id"] == project.id
    assert project_r["name"] == project.name
    assert project_r["description"] == project.description
    assert project_r["status"] == project.status

def read_project_by_id_not_found(client: TestClient, db: Session) -> None:
    r = client.get(f"{settings.API_V1_STR}/projects/{uuid.uuid4()}")
    assert r.status_code == 404
    assert r.detail.get("error_code") == ErrorCode.PROJECT_NOT_FOUND

def test_create_project(client: TestClient, db: Session) -> None:
    data = {
        "name": random_lower_string(),
        "description": random_lower_string(),
        "status": random_project_status(),
    }
    r = client.post(
        f"{settings.API_V1_STR}/projects/",
        json=data,
    )
    assert r.status_code == 201
    created_project = r.json()
    project = ProjectService(db).get_project_by_id(uuid.UUID(created_project["id"]))
    assert project
    assert project.name == data["name"]
    assert project.description == data["description"]
    assert project.status == data["status"]

def test_create_project_validation_error(client: TestClient, db: Session) -> None:
    data = {
        "name": random_lower_string(),
        "description": random_lower_string(),
        "status": "NO_SENSE",
    }
    r = client.post(
        f"{settings.API_V1_STR}/projects/",
        json=data,
    )
    assert r.status_code == 422

def test_patch_project(client: TestClient, db: Session) -> None:
    data = {
        "name": random_lower_string(),
        "description": random_lower_string(),
        "status": ProjectStatus.ACTIVE,
    }
    project_id = client.post(
        f"{settings.API_V1_STR}/projects/",
        json=data,
    ).json()["id"]
    
    data = {
        "name": random_lower_string(),
        "description": random_lower_string(),
        "status": ProjectStatus.PLANNED,
    }
    r = client.patch(
        f"{settings.API_V1_STR}/projects/{project_id}",
        json=data,
    )
    updated_data = r.json()
    projects, count = ProjectChangeLogService(db).get_project_log_list_by_id(uuid.UUID(updated_data["id"]))
    assert count > 2


