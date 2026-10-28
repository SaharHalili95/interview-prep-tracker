import os
import sys

import pytest
from fastapi.testclient import TestClient
from mongomock_motor import AsyncMongoMockClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dependencies import get_question_service  # noqa: E402
from main import app  # noqa: E402
from services.question_service import QuestionService  # noqa: E402

TWO_SUM = {
    "title": "Two Sum",
    "description": "Find two numbers that add up to target",
    "difficulty": "Easy",
    "category": "Array",
    "leetcode_url": "https://leetcode.com/problems/two-sum/",
}


@pytest.fixture
def client():
    collection = AsyncMongoMockClient().interview_prep.questions
    app.dependency_overrides[get_question_service] = lambda: QuestionService(collection)
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def created(client):
    return client.post("/questions", json=TWO_SUM).json()
