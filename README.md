# Interview Prep Tracker

![CI](https://github.com/SaharHalili95/interview-prep-tracker/actions/workflows/ci.yml/badge.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

A full-stack application to track coding interview questions and preparation progress.

## Tech Stack

**Backend:** FastAPI + MongoDB
**Frontend:** React + TypeScript + Vite + Tailwind CSS

## Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB running locally or MongoDB Atlas

## Installation & Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MongoDB connection string
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Usage

1. Start MongoDB
2. Start the backend server
3. Start the frontend development server
4. Open `http://localhost:5173` in your browser

## Features

- Add/Edit/Delete interview questions
- Filter by category, difficulty, and status
- Track progress with dashboard statistics
- Link to LeetCode problems
- Save solutions and notes

## Docker

Run the entire application with Docker:

```bash
docker-compose up --build
```

This will start:
- Backend API at `http://localhost:8000`
- Frontend at `http://localhost:5173`
- MongoDB at `localhost:27017`

## Testing

```bash
cd backend
pip install -r requirements.txt
pytest tests/ -v
```

## License

MIT
