import uuid
from datetime import datetime

from sqlalchemy import DateTime
from sqlmodel import Column, Enum, Field, SQLModel

from app.utils.datetime import get_datetime
from app.models.status_enum import ProjectStatus


# Shared properties
class ProjectBase(SQLModel):
    name: str = Field(max_length=255)
    description: str = Field(max_length=255)

    # Enum handling in alembic with postgres enum
    status: ProjectStatus = Field(sa_column=Column(Enum(ProjectStatus)))


# Project database model
class Project(ProjectBase, table=True):
    __tablename__ = "projects"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime | None = Field(
        default_factory=get_datetime,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    updated_at: datetime | None = Field(
        default_factory=get_datetime,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
