import uuid
from datetime import datetime

from sqlalchemy import DateTime
from sqlmodel import Field, SQLModel

from app.utils.datetime import get_datetime


class ProjectComment(SQLModel, table=True):
    __tablename__ = "project_comments"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: uuid.UUID = Field(
        foreign_key="projects.id",
        ondelete="SET NULL",
        index=True,
    )
    content: str = Field(max_length=255)
    created_at: datetime | None = Field(
        default_factory=get_datetime,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
