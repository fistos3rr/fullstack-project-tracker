import uuid
from datetime import datetime

from sqlalchemy import DateTime
from sqlmodel import Field, SQLModel

from app.utils import get_datetime


class ProjectChangeLog(SQLModel, table=True):
    __tablename__ = "project_change_logs"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: uuid.UUID = Field(
        foreign_key="projects.id",
        ondelete="CASCADE",
        index=True,
    )
    changed_at: datetime | None = Field(
        default_factory=get_datetime,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    field_name: str
    old_value: str
    new_value: str


class ProjectChangeLogListRead(SQLModel):
    data: list[ProjectChangeLog]
    count: int
