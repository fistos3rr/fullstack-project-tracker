from typing import Any

from fastapi import APIRouter

from app.api.routers import projects

api_router = APIRouter()

@api_router.get("/health")
def get_health() -> Any:
    return {"status": "healthy"}


api_router.include_router(projects.router)

