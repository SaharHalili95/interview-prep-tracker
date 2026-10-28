from fastapi import APIRouter, Depends

from dependencies import get_question_service
from services.question_service import QuestionService

router = APIRouter(tags=["stats"])


@router.get("/stats")
async def get_stats(service: QuestionService = Depends(get_question_service)):
    return await service.stats()
