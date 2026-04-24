from tests.utils.utils import random_lower_string, random_project_status
from app.utils import get_datetime
from app.models.project_comment import ProjectCommentCreate
from app.models.status_enum import ProjectStatus
from app.service.project_comment_service import ProjectCommentService
from app.service.project_service import ProjectService
from fastapi.encoders import jsonable_encoder
from tests.utils.project import create_project

from sqlmodel import Session

def test_create_project_comment(db: Session) -> None:
    project = create_project(db)
    project_id = project.id
    content = random_lower_string()
    project_comment_in = ProjectCommentCreate(content=content)
    project_comment = ProjectCommentService(db).create_project_comment(project_comment_in, project_id)
    assert project_comment.content == content
    assert project_comment.project_id == project_id

def test_get_project_comment_list_by_id(db: Session) -> None:
    project = create_project(db)
    project_id = project.id
    content_1 = random_lower_string()
    content_2 = random_lower_string()
    project_comment_in = ProjectCommentCreate(content=content_1)
    project_comment = ProjectCommentService(db).create_project_comment(project_comment_in, project_id)
    project_comment_in = ProjectCommentCreate(content=content_2)
    project_comment = ProjectCommentService(db).create_project_comment(project_comment_in, project_id)
    project_comment_list, count = ProjectCommentService(db).get_project_comment_list_by_id(project_id)
    assert count >= 2

def test_delete_project_comment_by_id(db: Session) -> None:
    project = create_project(db)
    project_id = project.id
    content = random_lower_string()
    project_comment_in = ProjectCommentCreate(content=content)
    project_comment = ProjectCommentService(db).create_project_comment(project_comment_in, project_id)
    ProjectCommentService(db).delete_project_comment_by_id(project_comment.id)
    ProjectService(db).get_project_by_id(project_id)
    