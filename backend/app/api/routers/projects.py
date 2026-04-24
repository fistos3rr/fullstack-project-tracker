import uuid
from typing import Any

from fastapi import APIRouter, status

from app.api.deps import SessionDep
from app.models.project import (
    ProjectCreate,
    ProjectListRead,
    ProjectRead,
    ProjectUpdate,
)
from app.service.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=ProjectListRead)
def read_projects(
    session: SessionDep, skip: int = 0, limit: int = 100
) -> Any:
    """
    Read projects.
    """

    projects_list, count = ProjectService(session).get_projects(
        skip, limit
    )
    projects = [
        ProjectRead.model_validate(project) for project in projects_list
    ]
    return ProjectListRead(data=projects, count=count)


@router.get("/{id}", response_model=ProjectRead)
def read_project_by_id(session: SessionDep, id: uuid.UUID) -> Any:
    """
    Read a specific project by id.
    """
    result = ProjectService(session).get_project_by_id(id)
    return ProjectRead.model_validate(result)


@router.post(
    "/", response_model=ProjectRead, status_code=status.HTTP_201_CREATED
)
def create_project(session: SessionDep, project_in: ProjectCreate) -> Any:
    """
    Create project.
    """
    result = ProjectService(session).create_project(project_in)
    return ProjectRead.model_validate(result)


@router.patch("/{id}", response_model=ProjectRead)
def update_project(
    session: SessionDep,
    id: uuid.UUID,
    project_in: ProjectUpdate,
) -> Any:
    """
    Update a project.
    """
    result = ProjectService(session).update_project(id, project_in)
    return ProjectRead.model_validate(result)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_project(
    session: SessionDep,
    id: uuid.UUID,
) -> None:
    """
    Delete a project
    """
    ProjectService(session).delete_project_by_id(id)
    return None
