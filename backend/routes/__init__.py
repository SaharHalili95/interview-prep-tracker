from fastapi import APIRouter

from routes import health, questions, stats

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(questions.router)
api_router.include_router(stats.router)
