# Interview Prep Tracker

A client-side coding interview preparation tracker built with React and TypeScript. Track questions, monitor progress, and link directly to LeetCode problems - all in the browser with no backend required.

**Live demo:** https://saharhalili95.github.io/interview-prep-tracker/

## Features

- Add, edit, and delete interview questions
- Filter by category, difficulty, and status
- Direct links to LeetCode problems
- Dashboard with progress statistics
- Save solutions and notes per question
- Sample questions loaded automatically on first use
- All data persisted in browser localStorage

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- localStorage (no backend or database required)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Backend API

`backend/` holds a separate REST API for the same data, built with FastAPI and MongoDB. The hosted demo does not use it: the frontend keeps everything in localStorage.

```
backend/
├── main.py                       # App setup and router registration
├── routes/                       # HTTP layer; __init__.py combines the routers
│   ├── questions.py              # CRUD on /questions
│   └── stats.py                  # GET /stats
├── services/question_service.py  # MongoDB access
├── errors.py                     # Maps service errors to 400/404
└── tests/                        # pytest against an in-memory MongoDB (mongomock-motor)
```

```bash
cd backend
pip install -r requirements.txt
pytest
MONGODB_URI=mongodb://localhost:27017/interview_prep uvicorn main:app --reload
```

## Build and Deploy

```bash
npm run build
npm run preview
```

The app is deployed as a static site on GitHub Pages.

## License

MIT
