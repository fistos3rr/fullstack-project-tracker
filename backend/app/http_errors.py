from enum import StrEnum

from fastapi import HTTPException, status


class ErrorCode(StrEnum):
    NOT_FOUND = "NOT_FOUND"
    PROJECT_NOT_FOUND = "PROJECT_NOT_FOUND"
    COMMENT_NOT_FOUND = "COMMENT_NOT_FOUND"
    LOG_NOT_FOUND = "LOG_NOT_FOUND"
    BAD_REQUEST = "BAD_REQUEST"
    PROJECT_COMPLETED = "PROJECT_COMPLETED"
    INTERNAL_ERROR = "INTERNAL_ERROR"
    DATABASE_ERROR = "DATABASE_ERROR"


def raise_http_exception(
    msg: str, code: ErrorCode, status_code: int
) -> None:
    raise HTTPException(
        status_code=status_code,
        detail={"message": msg, "error_code": code},
    )


def raise_not_found(
    msg: str, code: ErrorCode = ErrorCode.NOT_FOUND
) -> None:
    raise_http_exception(msg, code, status.HTTP_404_NOT_FOUND)


def raise_bad_request(
    msg: str, code: ErrorCode = ErrorCode.BAD_REQUEST
) -> None:
    raise_http_exception(msg, code, status.HTTP_400_BAD_REQUEST)


def raise_internal_error(
    msg: str = "Internal error", code: ErrorCode = ErrorCode.INTERNAL_ERROR
) -> None:
    raise_http_exception(msg, code, status.HTTP_500_INTERNAL_SERVER_ERROR)
