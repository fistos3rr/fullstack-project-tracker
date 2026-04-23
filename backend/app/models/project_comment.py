import uuid
from datetime import datetime

from app.models.datetime import datetime_field
from app.models.project import Project

from sqlmodel import SQLModel, Field, Relationship


class ProjectComment(SQLModel, table=True):
    __tablename__ = "project_comments"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: uuid.UUID = Field(
        foreign_key="projects.id",
        ondelete="SET NULL",
        index=True,
    )
    content: str = Field(max_length=255)
    created_at: datetime | None = datetime_field()
    