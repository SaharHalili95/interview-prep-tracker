import pytest
from unittest.mock import MagicMock, patch, AsyncMock
from bson import ObjectId
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class TestQuestionHelper:
    """Tests for question_helper function."""

    def test_question_helper_converts_objectid(self):
        """Test that question_helper converts ObjectId to string."""
        # Mock the database module before importing main
        mock_collection = MagicMock()

        with patch.dict('sys.modules', {'database': MagicMock(questions_collection=mock_collection)}):
            # Now import main with mocked database
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
        mock_collection = MagicMock()

        with patch.dict('sys.modules', {'database': MagicMock(questions_collection=mock_collection)}):
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


class TestAPIEndpoints:
    """Tests for API endpoints using TestClient."""

    @pytest.fixture
    def client(self):
        """Create test client with mocked database."""
        # Create mock for the questions_collection
        mock_collection = MagicMock()

        # Mock the database module
        mock_db_module = MagicMock()
        mock_db_module.questions_collection = mock_collection

        with patch.dict('sys.modules', {'database': mock_db_module}):
            # Import app after mocking
            from main import app
            from fastapi.testclient import TestClient

            with TestClient(app) as test_client:
                yield test_client

    def test_root_endpoint(self, client):
        """Test that root endpoint returns correct message."""
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "Interview Prep Tracker API"}

    def test_create_question_missing_fields(self, client):
        """Test that creating question without required fields returns 422."""
        response = client.post("/questions", json={})
        assert response.status_code == 422

    def test_create_question_missing_title(self, client):
        """Test that creating question without title returns 422."""
        response = client.post("/questions", json={
            "description": "Test",
            "difficulty": "Easy",
            "category": "Array"
        })
        assert response.status_code == 422

    def test_update_question_invalid_id(self, client):
        """Test that updating with invalid ObjectId returns 400."""
        response = client.put("/questions/invalid-id", json={"title": "New Title"})
        assert response.status_code == 400
        assert "Invalid question ID" in response.json()["detail"]

    def test_delete_question_invalid_id(self, client):
        """Test that deleting with invalid ObjectId returns 400."""
        response = client.delete("/questions/invalid-id")
        assert response.status_code == 400
        assert "Invalid question ID" in response.json()["detail"]
