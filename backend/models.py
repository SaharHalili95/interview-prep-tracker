from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class Difficulty(str, Enum):
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"


class Status(str, Enum):
    NOT_STARTED = "Not Started"
    IN_PROGRESS = "In Progress"
    SOLVED = "Solved"


class Question(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    difficulty: Difficulty
    category: str
    status: Status = Status.NOT_STARTED
    leetcode_url: Optional[str] = None
    solution: Optional[str] = None
    notes: Optional[str] = None
    date_solved: Optional[datetime] = None

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Two Sum",
                "description": "Find two numbers that add up to target",
                "difficulty": "Easy",
                "category": "Array",
                "status": "Not Started",
                "leetcode_url": "https://leetcode.com/problems/two-sum/",
            }
        }


class QuestionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[Difficulty] = None
    category: Optional[str] = None
    status: Optional[Status] = None
    leetcode_url: Optional[str] = None
    solution: Optional[str] = None
    notes: Optional[str] = None
    date_solved: Optional[datetime] = None
