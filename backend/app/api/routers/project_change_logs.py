import uuid
from typing import Any

from fastapi import APIRouter

from app.api.deps import SessionDep
from app.models.project_change_log import (
    ProjectChangeLog,
    ProjectChangeLogListRead,
)
from app.service.project_log_service import ProjectChangeLogService

router = APIRouter(
    prefix="/projects/{project_id}/logs", tags=["project-change-logs"]
)


@router.get("", response_model=ProjectChangeLogListRead)
def read_project_logs(
    session: SessionDep,
    project_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Read project logs.
    """

    projects_list, count = ProjectChangeLogService(
        session
    ).get_project_log_list_by_id(project_id, skip, limit)
    projects = [
        ProjectChangeLog.model_validate(project)
        for project in projects_list
    ]
    return ProjectChangeLogListRead(data=projects, count=count)
