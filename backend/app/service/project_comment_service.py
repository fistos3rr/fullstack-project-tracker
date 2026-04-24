import uuid
from typing import Sequence

from sqlmodel import Session, func, select

from app.http_errors import ErrorCode, raise_not_found
from app.models.project_comment import ProjectComment, ProjectCommentCreate


class ProjectCommentService:
    def __init__(self, session: Session):
        self.session = session

    def create_project_comment(
        self,
        project_comment_create: ProjectCommentCreate,
        project_id: uuid.UUID,
    ) -> ProjectComment:
        project_comment_data = project_comment_create.model_dump(
            exclude_unset=True
        )
        project_comment_data["project_id"] = project_id
        db_obj = ProjectComment(**project_comment_data)
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj

    def get_project_comment_list_by_id(
        self,
        project_id: uuid.UUID,
        skip: int = 0,
        limit: int = 10,
    ) -> tuple[Sequence[ProjectComment], int]:
        query = select(ProjectComment).where(
            ProjectComment.project_id == project_id
        )

        count_query = (
            select(func.count())
            .select_from(ProjectComment)
            .where(ProjectComment.project_id == project_id)
        )

        project_comments = self.session.exec(
            query.offset(skip).limit(limit)
        ).all()
        count = self.session.exec(count_query).one()
        if count == 0:
            raise_not_found(
                f"Comments for project with id = {project_id} not found!",
                ErrorCode.COMMENT_NOT_FOUND,
            )
        return project_comments, count

    def delete_project_comment_by_id(self, id: uuid.UUID) -> bool:
        db_project_comment = self.session.get(ProjectComment, id)

        if not db_project_comment:
            raise_not_found(
                "Project comment not found!",
                ErrorCode.COMMENT_NOT_FOUND,
            )

        self.session.delete(db_project_comment)
        self.session.commit()
        return True
