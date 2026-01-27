import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock, patch
from bson import ObjectId
from datetime import datetime
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class TestRootEndpoint:
    """Tests for root endpoint."""

    def test_root_returns_message(self):
        """Test that root endpoint returns correct message."""
        # Create mock collection
        mock_collection = MagicMock()

        with patch('database.questions_collection', mock_collection):
            from main import app
            client = TestClient(app)
            response = client.get("/")

            assert response.status_code == 200
            assert response.json() == {"message": "Interview Prep Tracker API"}


class TestQuestionsEndpoints:
    """Tests for questions CRUD endpoints."""

    @pytest.fixture
    def mock_db(self):
        """Setup mock database."""
        mock_collection = AsyncMock()
        return mock_collection

    def test_get_questions_empty(self):
        """Test getting questions when database is empty."""
        mock_collection = MagicMock()

        # Mock async iterator that yields nothing
        async def empty_iterator():
            return
            yield  # Make it a generator

        mock_collection.find = MagicMock(return_value=empty_iterator())

        with patch('database.questions_collection', mock_collection):
            # Need to reimport to pick up the mock
            import importlib
            import main
            importlib.reload(main)

            client = TestClient(main.app)
            # Note: This test verifies the endpoint exists and returns 200
            # Full async testing would require pytest-asyncio
            response = client.get("/questions")
            assert response.status_code == 200

    def test_create_question_validation(self):
        """Test question creation validation."""
        mock_collection = MagicMock()

        with patch('database.questions_collection', mock_collection):
            import importlib
            import main
            importlib.reload(main)

            client = TestClient(main.app)

            # Missing required fields should return 422
            response = client.post("/questions", json={})
            assert response.status_code == 422

            # Missing title
            response = client.post("/questions", json={
                "description": "Test",
                "difficulty": "Easy",
                "category": "Array"
            })
            assert response.status_code == 422

    def test_update_question_invalid_id(self):
        """Test updating with invalid ObjectId format."""
        mock_collection = MagicMock()

        with patch('database.questions_collection', mock_collection):
            import importlib
            import main
            importlib.reload(main)

            client = TestClient(main.app)

            # Invalid ObjectId format
            response = client.put("/questions/invalid-id", json={"title": "New"})
            assert response.status_code == 400
            assert "Invalid question ID" in response.json()["detail"]

    def test_delete_question_invalid_id(self):
        """Test deleting with invalid ObjectId format."""
        mock_collection = MagicMock()

        with patch('database.questions_collection', mock_collection):
            import importlib
            import main
            importlib.reload(main)

            client = TestClient(main.app)

            # Invalid ObjectId format
            response = client.delete("/questions/invalid-id")
            assert response.status_code == 400
            assert "Invalid question ID" in response.json()["detail"]


class TestStatsEndpoint:
    """Tests for stats endpoint."""

    def test_stats_endpoint_exists(self):
        """Test that stats endpoint exists and returns 200."""
        mock_collection = MagicMock()

        # Mock count_documents
        mock_collection.count_documents = AsyncMock(return_value=0)

        # Mock aggregate
        async def empty_aggregate():
            return
            yield

        mock_collection.aggregate = MagicMock(return_value=empty_aggregate())

        with patch('database.questions_collection', mock_collection):
            import importlib
            import main
            importlib.reload(main)

            client = TestClient(main.app)
            response = client.get("/stats")
            assert response.status_code == 200


class TestQuestionHelper:
    """Tests for question_helper function."""

    def test_question_helper_converts_objectid(self):
        """Test that question_helper converts ObjectId to string."""
        from main import question_helper

        test_question = {
            "_id": ObjectId("507f1f77bcf86cd799439011"),
            "title": "Test",
            "description": "Test desc",
            "difficulty": "Easy",
            "category": "Array",
            "status": "Not Started",
            "leetcode_url": None,
            "solution": None,
            "notes": None,
            "date_solved": None,
        }

        result = question_helper(test_question)

        assert result["id"] == "507f1f77bcf86cd799439011"
        assert isinstance(result["id"], str)
        assert "_id" not in result

    def test_question_helper_handles_optional_fields(self):
        """Test that question_helper handles missing optional fields."""
        from main import question_helper

        # Question without optional fields
        test_question = {
            "_id": ObjectId("507f1f77bcf86cd799439011"),
            "title": "Test",
            "description": "Test desc",
            "difficulty": "Easy",
            "category": "Array",
            "status": "Not Started",
        }

        result = question_helper(test_question)

        assert result["leetcode_url"] is None
        assert result["solution"] is None
        assert result["notes"] is None
        assert result["date_solved"] is None
