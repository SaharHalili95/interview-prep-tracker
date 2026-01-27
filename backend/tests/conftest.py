import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock, patch
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture
def mock_questions_collection():
    """Mock MongoDB collection for testing."""
    mock_collection = MagicMock()

    # Sample test data
    sample_questions = [
        {
            "_id": "507f1f77bcf86cd799439011",
            "title": "Two Sum",
            "description": "Find two numbers that add up to target",
            "difficulty": "Easy",
            "category": "Array",
            "status": "Not Started",
            "leetcode_url": "https://leetcode.com/problems/two-sum/",
            "solution": None,
            "notes": None,
            "date_solved": None,
        },
        {
            "_id": "507f1f77bcf86cd799439012",
            "title": "Add Two Numbers",
            "description": "Add two numbers represented as linked lists",
            "difficulty": "Medium",
            "category": "Linked List",
            "status": "Solved",
            "leetcode_url": "https://leetcode.com/problems/add-two-numbers/",
            "solution": "def addTwoNumbers(l1, l2): pass",
            "notes": "Use carry variable",
            "date_solved": "2024-01-15T10:00:00",
        },
    ]

    mock_collection.sample_data = sample_questions
    return mock_collection


@pytest.fixture
def client(mock_questions_collection):
    """Create test client with mocked database."""
    with patch('database.questions_collection', mock_questions_collection):
        from main import app
        with TestClient(app) as test_client:
            yield test_client
