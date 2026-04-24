from tests.utils.utils import random_lower_string, random_project_status
from app.utils import get_datetime
from app.models.project import ProjectCreate, ProjectUpdate
from app.models.status_enum import ProjectStatus
from app.service.project_service import ProjectService
from fastapi.encoders import jsonable_encoder

from sqlmodel import Session

def test_create_project(db: Session) -> None:
    name = random_lower_string()
    description = random_lower_string()
    status = random_project_status()
    project_in = ProjectCreate(name=name, description=description, status=status)
    project = ProjectService(db).create_project(project_in)
    assert project.name == name
    assert project.description == description

def test_get_project_by_id(db: Session) -> None:
    name = random_lower_string()
    description = random_lower_string()
    status = random_project_status()
    project_in = ProjectCreate(name=name, description=description, status=status)
    project = ProjectService(db).create_project(project_in)
    project_2 = ProjectService(db).get_project_by_id(project.id)
    assert project_2
    assert project.name == project_2.name
    assert jsonable_encoder(project) == jsonable_encoder(project_2)

def test_update_project(db: Session) -> None:
    name = random_lower_string()
    description = random_lower_string()
    status = ProjectStatus.ACTIVE
    project_in = ProjectCreate(name=name, description=description, status=status)
    project = ProjectService(db).create_project(project_in)
    new_name = random_lower_string()
    new_description = random_lower_string()
    project_in_update = ProjectUpdate(name=new_name, description=new_description, status=status)
    project = ProjectService(db).update_project(project.id, project_in_update)
    project_2 = ProjectService(db).get_project_by_id(project.id)
    assert project_2
    assert project.name == project_2.name
    assert project_2.name == new_name
    assert project_2.description == new_description

def test_get_projects(db: Session) -> None:
    name = random_lower_string()
    description = random_lower_string()
    status = ProjectStatus.ACTIVE
    project_in = ProjectCreate(name=name, description=description, status=status)
    ProjectService(db).create_project(project_in)
    ProjectService(db).create_project(project_in)
    projects, count = ProjectService(db).get_projects()
    assert count >= 2

def test_check_exists(db: Session) -> None:
    name = random_lower_string()
    description = random_lower_string()
    status = ProjectStatus.ACTIVE
    project_in = ProjectCreate(name=name, description=description, status=status)
    project = ProjectService(db).create_project(project_in)
    ProjectService(db).check_exists(project.id)

def test_delete_project(db: Session) -> None:
    name = random_lower_string()
    description = random_lower_string()
    status = random_project_status()
    project_in = ProjectCreate(name=name, description=description, status=status)
    project = ProjectService(db).create_project(project_in)
    ProjectService(db).delete_project_by_id(project.id)