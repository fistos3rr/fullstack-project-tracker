from app.models.project import Project
from sqlmodel import Session
from tests.utils.utils import random_lower_string, random_project_status
from app.models.status_enum import ProjectStatus
from app.models.project import ProjectCreate
from app.service.project_service import ProjectService

def create_project(session: Session, status: ProjectStatus = None) -> Project:
    name = random_lower_string()
    description = random_lower_string()
    if not status:
        status = random_project_status()
    project_in = ProjectCreate(name=name, description=description, status=status)
    return ProjectService(session).create_project(project_in)