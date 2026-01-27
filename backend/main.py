from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from typing import List
from datetime import datetime

from models import Question, QuestionUpdate, Status
from database import questions_collection

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup and shutdown events."""
    # Startup
    logger.info("Interview Prep Tracker API starting...")
    logger.info("Connected to MongoDB")
    yield
    # Shutdown
    logger.info("Application shutting down...")


app = FastAPI(
    title="Interview Prep Tracker API",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def question_helper(question: dict) -> dict:
    return {
        "id": str(question["_id"]),
        "title": question["title"],
        "description": question["description"],
        "difficulty": question["difficulty"],
        "category": question["category"],
        "status": question["status"],
        "leetcode_url": question.get("leetcode_url"),
        "solution": question.get("solution"),
        "notes": question.get("notes"),
        "date_solved": question.get("date_solved"),
    }


@app.get("/")
async def root():
    return {"message": "Interview Prep Tracker API"}


@app.get("/questions", response_model=List[dict])
async def get_questions():
    questions = []
    async for question in questions_collection.find():
        questions.append(question_helper(question))
    return questions


@app.post("/questions", response_model=dict)
async def create_question(question: Question):
    question_dict = question.model_dump(exclude={"id"})
    result = await questions_collection.insert_one(question_dict)
    new_question = await questions_collection.find_one({"_id": result.inserted_id})
    return question_helper(new_question)


@app.put("/questions/{question_id}", response_model=dict)
async def update_question(question_id: str, question_update: QuestionUpdate):
    try:
        obj_id = ObjectId(question_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid question ID")

    update_data = question_update.model_dump(exclude_unset=True)

    if "status" in update_data and update_data["status"] == Status.SOLVED:
        if "date_solved" not in update_data:
            update_data["date_solved"] = datetime.now()

    if len(update_data) > 0:
        result = await questions_collection.update_one(
            {"_id": obj_id}, {"$set": update_data}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Question not found")

    updated_question = await questions_collection.find_one({"_id": obj_id})
    return question_helper(updated_question)


@app.delete("/questions/{question_id}")
async def delete_question(question_id: str):
    try:
        obj_id = ObjectId(question_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid question ID")

    result = await questions_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Question not found")

    return {"message": "Question deleted successfully"}


@app.get("/stats")
async def get_stats():
    total = await questions_collection.count_documents({})
    solved = await questions_collection.count_documents({"status": Status.SOLVED})
    in_progress = await questions_collection.count_documents({"status": Status.IN_PROGRESS})
    not_started = await questions_collection.count_documents({"status": Status.NOT_STARTED})

    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}}
    ]
    category_stats = []
    async for stat in questions_collection.aggregate(pipeline):
        category_stats.append({"category": stat["_id"], "count": stat["count"]})

    difficulty_pipeline = [
        {"$group": {"_id": "$difficulty", "count": {"$sum": 1}}}
    ]
    difficulty_stats = []
    async for stat in questions_collection.aggregate(difficulty_pipeline):
        difficulty_stats.append({"difficulty": stat["_id"], "count": stat["count"]})

    return {
        "total": total,
        "solved": solved,
        "in_progress": in_progress,
        "not_started": not_started,
        "by_category": category_stats,
        "by_difficulty": difficulty_stats,
    }
