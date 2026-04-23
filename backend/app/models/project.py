import uuid
from datetime import datetime

from app.models.status_enum import ProjectStatus
from app.models.datetime import datetime_field

from sqlmodel import SQLModel, Field, Enum, Column 





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
    created_at: datetime | None = datetime_field()
    updated_at: datetime | None = datetime_field()