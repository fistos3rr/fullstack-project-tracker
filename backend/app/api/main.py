from typing import Any

from fastapi import APIRouter

from app.api.routers import project_change_logs, project_comments, projects

api_router = APIRouter()


api_router.include_router(projects.router)
api_router.include_router(project_change_logs.router)
api_router.include_router(project_comments.router)
