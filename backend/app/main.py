from fastapi import FastAPI, Request
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.api.main import api_router
from app.core.config import settings
from app.http_errors import (
    ErrorCode,
    raise_bad_request,
    raise_internal_error,
)

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.exception_handler(SQLAlchemyError)
def sqlalchemy_error_handler(
    request: Request, exc: SQLAlchemyError
) -> None:
    raise_internal_error(
        msg="Database error", code=ErrorCode.DATABASE_ERROR
    )


@app.exception_handler(IntegrityError)
def integrity_error_handler(request: Request, exc: IntegrityError) -> None:
    raise_bad_request(msg="Integrity error")
