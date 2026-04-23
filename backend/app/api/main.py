from fastapi import APIRouter

from app.api.routers import projects

api_router = APIRouter()
api_router.include_router(projects.router)
