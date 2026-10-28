from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from services.question_service import InvalidQuestionId, QuestionNotFound


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(QuestionNotFound)
    async def question_not_found(request: Request, exc: QuestionNotFound):
        return JSONResponse(status_code=404, content={"detail": "Question not found"})

    @app.exception_handler(InvalidQuestionId)
    async def invalid_question_id(request: Request, exc: InvalidQuestionId):
        return JSONResponse(status_code=400, content={"detail": "Invalid question ID"})
