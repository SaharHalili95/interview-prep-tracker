import pytest
from datetime import datetime
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import Question, QuestionUpdate, Difficulty, Status


class TestDifficultyEnum:
    """Tests for Difficulty enum."""

    def test_difficulty_values(self):
        """Test that all difficulty levels exist."""
        assert Difficulty.EASY == "Easy"
        assert Difficulty.MEDIUM == "Medium"
        assert Difficulty.HARD == "Hard"

    def test_difficulty_from_string(self):
        """Test creating difficulty from string."""
        assert Difficulty("Easy") == Difficulty.EASY
        assert Difficulty("Medium") == Difficulty.MEDIUM
        assert Difficulty("Hard") == Difficulty.HARD

    def test_invalid_difficulty_raises_error(self):
        """Test that invalid difficulty raises ValueError."""
        with pytest.raises(ValueError):
            Difficulty("Invalid")


class TestStatusEnum:
    """Tests for Status enum."""

    def test_status_values(self):
        """Test that all status values exist."""
        assert Status.NOT_STARTED == "Not Started"
        assert Status.IN_PROGRESS == "In Progress"
        assert Status.SOLVED == "Solved"

    def test_status_from_string(self):
        """Test creating status from string."""
        assert Status("Not Started") == Status.NOT_STARTED
        assert Status("In Progress") == Status.IN_PROGRESS
        assert Status("Solved") == Status.SOLVED


class TestQuestionModel:
    """Tests for Question model."""

    def test_create_minimal_question(self):
        """Test creating a question with minimal required fields."""
        question = Question(
            title="Two Sum",
            description="Find two numbers",
            difficulty=Difficulty.EASY,
            category="Array"
        )
        assert question.title == "Two Sum"
        assert question.description == "Find two numbers"
        assert question.difficulty == Difficulty.EASY
        assert question.category == "Array"
        assert question.status == Status.NOT_STARTED  # Default value

    def test_create_full_question(self):
        """Test creating a question with all fields."""
        now = datetime.now()
        question = Question(
            id="123",
            title="Two Sum",
            description="Find two numbers",
            difficulty=Difficulty.EASY,
            category="Array",
            status=Status.SOLVED,
            leetcode_url="https://leetcode.com/problems/two-sum/",
            solution="def twoSum(): pass",
            notes="Use hashmap",
            date_solved=now
        )
        assert question.id == "123"
        assert question.leetcode_url == "https://leetcode.com/problems/two-sum/"
        assert question.solution == "def twoSum(): pass"
        assert question.notes == "Use hashmap"
        assert question.date_solved == now

    def test_question_default_status(self):
        """Test that default status is NOT_STARTED."""
        question = Question(
            title="Test",
            description="Test desc",
            difficulty=Difficulty.EASY,
            category="Test"
        )
        assert question.status == Status.NOT_STARTED

    def test_question_optional_fields_are_none(self):
        """Test that optional fields default to None."""
        question = Question(
            title="Test",
            description="Test desc",
            difficulty=Difficulty.EASY,
            category="Test"
        )
        assert question.id is None
        assert question.leetcode_url is None
        assert question.solution is None
        assert question.notes is None
        assert question.date_solved is None


class TestQuestionUpdateModel:
    """Tests for QuestionUpdate model."""

    def test_update_single_field(self):
        """Test updating a single field."""
        update = QuestionUpdate(title="New Title")
        assert update.title == "New Title"
        assert update.description is None
        assert update.difficulty is None

    def test_update_multiple_fields(self):
        """Test updating multiple fields."""
        update = QuestionUpdate(
            title="New Title",
            status=Status.SOLVED,
            notes="Completed!"
        )
        assert update.title == "New Title"
        assert update.status == Status.SOLVED
        assert update.notes == "Completed!"

    def test_update_all_fields_optional(self):
        """Test that all fields are optional."""
        update = QuestionUpdate()
        assert update.title is None
        assert update.description is None
        assert update.difficulty is None
        assert update.category is None
        assert update.status is None
        assert update.leetcode_url is None
        assert update.solution is None
        assert update.notes is None
        assert update.date_solved is None

    def test_model_dump_excludes_unset(self):
        """Test that model_dump with exclude_unset works correctly."""
        update = QuestionUpdate(title="New Title", status=Status.SOLVED)
        dumped = update.model_dump(exclude_unset=True)
        assert "title" in dumped
        assert "status" in dumped
        assert "description" not in dumped
