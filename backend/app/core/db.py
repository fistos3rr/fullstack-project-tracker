from sqlmodel import create_engine, SQLModel

from app.core.config import settings
import app.models

#engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

engine = create_engine(settings.SQLLITE_TEST_DB_URI, echo=False)

def init_db() -> None:
    SQLModel.metadata.create_all(engine)
    
    
