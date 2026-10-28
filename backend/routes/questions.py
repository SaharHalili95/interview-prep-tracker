from fastapi import APIRouter, Depends

from dependencies import get_question_service
from models import Question, QuestionUpdate
from services.question_service import QuestionService

router = APIRouter(prefix="/questions", tags=["questions"])


@router.get("", response_model=list[dict])
async def list_questions(service: QuestionService = Depends(get_question_service)):
    return await service.list_all()


@router.post("", response_model=dict)
async def create_question(question: Question, service: QuestionService = Depends(get_question_service)):
    return await service.create(question)


@router.put("/{question_id}", response_model=dict)
async def update_question(
    question_id: str,
    question_update: QuestionUpdate,
    service: QuestionService = Depends(get_question_service),
):
    return await service.update(question_id, question_update)


@router.delete("/{question_id}")
async def delete_question(question_id: str, service: QuestionService = Depends(get_question_service)):
    await service.delete(question_id)
    return {"message": "Question deleted successfully"}
