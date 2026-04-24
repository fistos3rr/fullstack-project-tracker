import uuid
from datetime import datetime

from sqlalchemy import DateTime
from sqlmodel import Field, SQLModel

from app.utils import get_datetime


class ProjectCommentBase(SQLModel):
    content: str = Field(max_length=255)


class ProjectCommentCreate(ProjectCommentBase):
    pass


class ProjectComment(ProjectCommentBase, table=True):
    __tablename__ = "project_comments"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: uuid.UUID = Field(
        foreign_key="projects.id",
        ondelete="CASCADE",
        index=True,
    )
    created_at: datetime | None = Field(
        default_factory=get_datetime,
        sa_type=DateTime(timezone=True),  # type: ignore
    )


class ProjectCommentRead(ProjectCommentBase):
    id: uuid.UUID
    project_id: uuid.UUID
    created_at: datetime


class ProjectCommentListRead(SQLModel):
    data: list[ProjectCommentRead]
    count: int
