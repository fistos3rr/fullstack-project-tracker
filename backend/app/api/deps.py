import uuid
from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from sqlmodel import Session

from app.core.db import engine
from app.service.project_service import ProjectService


def get_db() -> Generator[Session, None, None]:
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception as e:
        print(e)
        session.rollback()
        raise
    finally:
        session.close()


SessionDep = Annotated[Session, Depends(get_db)]


def check_project_exists(
    project_id: uuid.UUID, session: SessionDep
) -> uuid.UUID:
    ProjectService(session).check_exists(project_id)
    return project_id


ProjectExistsDep = Annotated[uuid.UUID, Depends(check_project_exists)]
