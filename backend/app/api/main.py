from typing import Any

from fastapi import APIRouter

from app.api.routers import project_change_logs, projects

api_router = APIRouter()


@api_router.get("/health")
def get_health() -> Any:
    return {"status": "healthy"}


api_router.include_router(projects.router)
api_router.include_router(project_change_logs.router)
