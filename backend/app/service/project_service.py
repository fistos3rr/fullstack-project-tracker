import uuid
from typing import Any, Sequence

from sqlmodel import Session, func, select

from app.models.project import (
    Project,
    ProjectCreate,
    ProjectUpdate,
)
from app.models.project_change_log import ProjectChangeLog
from app.models.status_enum import ProjectStatus
from app.utils import get_datetime, get_field_changes


class ProjectService:
    def __init__(self, session: Session):
        self.session = session

    def _log_project_changes(
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

    def create_project(
        self,
        project_create: ProjectCreate,
    ) -> Project:
        db_obj = Project.model_validate(project_create)
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj

    def get_project_by_id(
        self,
        project_id: uuid.UUID,
    ) -> Project:
        db_project = self.session.get(Project, project_id)
        if not db_project:
            raise ValueError("Project not found!")
        return db_project

    def update_project(
        self, project_id: uuid.UUID, project_update: ProjectUpdate
    ) -> Project:
        db_project = self.get_project_by_id(project_id)
        old_state = db_project.model_dump()
        update_data = db_project.model_dump(exclude_unset=True)
        if not update_data:
            return db_project
        update_data["updated_at"] = get_datetime()
        for field, value in update_data.items():
            setattr(db_project, field, value)

        self.session.add(db_project)
        self.session.flush()

        changes = get_field_changes(old_state, db_project.model_dump())

        if changes:
            self._log_project_changes(project_id, changes)

        self.session.commit()
        self.session.refresh(db_project)
        return db_project

    def get_projects(
        self,
        skip: int = 0,
        limit: int = 10,
        status: ProjectStatus | None = None,
    ) -> tuple[Sequence[Project], int]:
        query = select(Project)

        if status:
            query = query.where(Project.status == status)

        count_query = select(func.count()).select_from(Project)
        if status:
            count_query = count_query.where(Project.status == status)

        projects = self.session.exec(query.offset(skip).limit(limit)).all()
        count = self.session.exec(count_query).one()
        return projects, count

    def delete_project_by_id(self, project_id: uuid.UUID) -> bool:
        db_project = self.get_project_by_id(project_id)
        self.session.delete(db_project)
        self.session.commit()
        return True
