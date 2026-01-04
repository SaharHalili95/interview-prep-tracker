from motor.motor_asyncio import AsyncIOMotorClient
from os import getenv
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = getenv("MONGODB_URI", "mongodb://localhost:27017/interview_prep")

client = AsyncIOMotorClient(MONGODB_URI)
db = client.interview_prep
questions_collection = db.questions
