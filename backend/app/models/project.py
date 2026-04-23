import uuid
from datetime import datetime, timezone

from app.models.status_enum import ProjectStatus

from sqlalchemy import DateTime
from sqlmodel import SQLModel, Field, Enum, Column 


def get_datetime_utc() -> datetime:
    return datetime.now(timezone.utc)


# Shared properties
class ProjectBase(SQLModel):
    name: str = Field(max_length=255)
    description: str = Field(max_length=255)
    status: ProjectStatus = Field(sa_column=Column(Enum(ProjectStatus)))


# Database model
class Project(ProjectBase, table=True):
    __tablename__ = "projects"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    updated_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )