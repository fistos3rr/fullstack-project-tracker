from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.api.main import api_router
from app.core.config import settings
from app.http_errors import (
    ErrorCode,
    raise_bad_request,
    raise_internal_error,
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.all_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
