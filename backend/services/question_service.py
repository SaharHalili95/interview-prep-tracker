from datetime import datetime

from bson import ObjectId
from bson.errors import InvalidId

from models import Question, QuestionUpdate, Status

OPTIONAL_FIELDS = ("leetcode_url", "solution", "notes", "date_solved")


class QuestionNotFound(Exception):
    pass


class InvalidQuestionId(Exception):
    pass


class QuestionService:
    """Reads and writes interview questions in MongoDB."""

    def __init__(self, collection):
        self.collection = collection

    async def list_all(self) -> list[dict]:
        return [to_response(question) async for question in self.collection.find()]

    async def create(self, question: Question) -> dict:
        result = await self.collection.insert_one(question.model_dump(exclude={"id"}))
        return to_response(await self.collection.find_one({"_id": result.inserted_id}))

    async def update(self, question_id: str, question_update: QuestionUpdate) -> dict:
        object_id = parse_id(question_id)
        changes = question_update.model_dump(exclude_unset=True)
        if changes.get("status") == Status.SOLVED:
            changes.setdefault("date_solved", datetime.now())

        if changes:
            result = await self.collection.update_one({"_id": object_id}, {"$set": changes})
            if result.matched_count == 0:
                raise QuestionNotFound

        question = await self.collection.find_one({"_id": object_id})
        if question is None:
            raise QuestionNotFound
        return to_response(question)

    async def delete(self, question_id: str) -> None:
        result = await self.collection.delete_one({"_id": parse_id(question_id)})
        if result.deleted_count == 0:
            raise QuestionNotFound

    async def stats(self) -> dict:
        return {
            "total": await self.collection.count_documents({}),
            "solved": await self.collection.count_documents({"status": Status.SOLVED}),
            "in_progress": await self.collection.count_documents({"status": Status.IN_PROGRESS}),
            "not_started": await self.collection.count_documents({"status": Status.NOT_STARTED}),
            "by_category": await self._count_by("category"),
            "by_difficulty": await self._count_by("difficulty"),
        }

    async def _count_by(self, field: str) -> list[dict]:
        pipeline = [{"$group": {"_id": f"${field}", "count": {"$sum": 1}}}]
        return [{field: group["_id"], "count": group["count"]} async for group in self.collection.aggregate(pipeline)]


def parse_id(question_id: str) -> ObjectId:
    try:
        return ObjectId(question_id)
    except InvalidId:
        raise InvalidQuestionId


def to_response(question: dict) -> dict:
    return {
        "id": str(question["_id"]),
        "title": question["title"],
        "description": question["description"],
        "difficulty": question["difficulty"],
        "category": question["category"],
        "status": question["status"],
        **{field: question.get(field) for field in OPTIONAL_FIELDS},
    }
