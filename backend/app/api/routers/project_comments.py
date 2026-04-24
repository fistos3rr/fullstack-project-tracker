import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, status

from app.api.deps import ProjectExistsDep, SessionDep
from app.models.project_comment import (
    ProjectCommentCreate,
    ProjectCommentListRead,
    ProjectCommentRead,
)
from app.service.project_comment_service import ProjectCommentService

router = APIRouter(
    prefix="/projects/{project_id}/comments", tags=["project-comments"]
)


@router.get("", response_model=ProjectCommentListRead)
def read_project_comments(
    session: SessionDep,
    project_id: ProjectExistsDep,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Read project comments.
    """

    projects_list, count = ProjectCommentService(
        session
    ).get_project_comment_list_by_id(project_id, skip, limit)
    projects = [
        ProjectCommentRead.model_validate(project)
        for project in projects_list
    ]
    return ProjectCommentListRead(data=projects, count=count)


@router.post("", response_model=ProjectCommentRead)
def create_project_comment(
    session: SessionDep,
    project_in: ProjectCommentCreate,
    project_id: ProjectExistsDep,
) -> Any:
    result = ProjectCommentService(session).create_project_comment(
        project_in
    )
    return ProjectCommentRead.model_validate(result)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_project(
    session: SessionDep,
    id: uuid.UUID,
    project_id: ProjectExistsDep,
) -> Any:
    """
    Delete a project
    """
    if not ProjectCommentService(session).delete_project_comment_by_id(id):
        raise HTTPException(status_code=404, detail="Project not found")

    return None
