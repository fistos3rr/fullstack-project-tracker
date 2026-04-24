from tests.utils.utils import random_lower_string, random_project_status
from app.utils import get_datetime
from app.models.project_change_log import ProjectChangeLog
from app.models.status_enum import ProjectStatus
from app.models.project import ProjectUpdate
from app.service.project_comment_service import ProjectCommentService
from app.service.project_log_service import ProjectChangeLogService
from app.service.project_service import ProjectService
from fastapi.encoders import jsonable_encoder
from tests.utils.project import create_project

from sqlmodel import Session


def test_logs(db: Session) -> None:
    status = ProjectStatus.ACTIVE
    project = create_project(db, status)
    project_id = project.id
    name = project.name
    description = project.description
    new_name = random_lower_string()
    new_description = random_lower_string()
    project_in_update = ProjectUpdate(name=new_name, description=new_description, status=status)
    project = ProjectService(db).update_project(project.id, project_in_update)
    
    logs, count = ProjectChangeLogService(db).get_project_log_list_by_id(project_id)
    assert count == 2