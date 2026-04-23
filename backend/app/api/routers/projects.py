from typing import Any

from fastapi import APIRouter

from app.api.deps import SessionDep
from app.models.project import ProjectRead, ProjectsRead
from app.service.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=ProjectsRead)
def read_projects(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Read projects
    """

    projects_list, count = ProjectService(session).get_projects(skip, limit)
    projects = [ProjectRead.model_validate(project) for project in projects_list]
    return ProjectsRead(data=projects, count=count)
