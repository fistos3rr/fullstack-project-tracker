import uuid
from datetime import datetime

from app.models.datetime import datetime_field
from app.models.project import Project

from sqlmodel import SQLModel, Field, Relationship


class ProjectChangeLog(SQLModel, table=True):
    __tablename__ = "project_change_logs"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: uuid.UUID = Field(
        foreign_key="projects.id",
        ondelete="SET NULL",
        index=True,
    )
    changed_at: datetime | None = datetime_field()
    field_name: str
    old_value: str
    new_value: str
    changed_at: datetime | None = datetime_field()
    