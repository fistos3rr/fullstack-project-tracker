from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient

from sqlmodel import SQLModel, Session, create_engine
import app.models

from app.main import app

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:", echo=False)
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c