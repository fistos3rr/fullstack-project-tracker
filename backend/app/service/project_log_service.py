import uuid
from typing import Any, Sequence

from sqlmodel import Session, desc, func, select

from app.models.project_change_log import ProjectChangeLog
from app.utils import get_datetime


class ProjectChangeLogService:
    def __init__(self, session: Session):
        self.session = session

    def log_project_changes(
        self, project_id: uuid.UUID, changes: list[dict[str, Any]]
    ) -> None:
        for change in changes:
            self.session.add(
                ProjectChangeLog(
                    project_id=project_id,
                    field_name=change["field_name"],
                    old_value=change["old_value"],
                    new_value=change["new_value"],
                    changed_at=get_datetime(),
                )
            )

    def get_project_log_list_by_id(
        self,
        project_id: uuid.UUID,
        skip: int = 0,
        limit: int = 10,
    ) -> tuple[Sequence[ProjectChangeLog], int]:
        query = select(ProjectChangeLog).where(
            ProjectChangeLog.project_id == project_id
        )
        query = query.order_by(desc(ProjectChangeLog.changed_at))
        count_query = (
            select(func.count())
            .select_from(ProjectChangeLog)
            .where(ProjectChangeLog.project_id == project_id)
        )

        projects = self.session.exec(query.offset(skip).limit(limit)).all()
        count = self.session.exec(count_query).one()
        return projects, count
