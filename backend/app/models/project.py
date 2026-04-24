import uuid
from datetime import datetime

from sqlalchemy import DateTime
from sqlmodel import Column, Enum, Field, SQLModel

from app.models.status_enum import ProjectStatus
from app.utils import get_datetime


# Shared properties
class ProjectBase(SQLModel):
    name: str = Field(max_length=255)
    description: str = Field(max_length=255)

    # Enum handling in alembic with postgres enum
    status: ProjectStatus = Field(
        sa_column=Column(Enum(ProjectStatus, name="project_status"))
    )


# CRUD objects for API
class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(SQLModel):
    name: str | None = Field(default=None, max_length=255)
    description: str | None = Field(default=None, max_length=255)
    status: ProjectStatus | None = None


class ProjectRead(ProjectBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class ProjectListRead(SQLModel):
    data: list[ProjectRead]
    count: int


# Project database model
class Project(ProjectBase, table=True):
    __tablename__ = "projects"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(
        default_factory=get_datetime,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    updated_at: datetime = Field(
        default_factory=get_datetime,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
