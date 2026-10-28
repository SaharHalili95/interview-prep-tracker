import database
from services.question_service import QuestionService


def get_question_service() -> QuestionService:
    return QuestionService(database.questions_collection)
