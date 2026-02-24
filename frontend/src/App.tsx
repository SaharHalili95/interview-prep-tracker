import { Routes, Route, Link } from 'react-router-dom'
import Questions from './pages/Questions'
import QuestionForm from './pages/QuestionForm'
import Dashboard from './pages/Dashboard'
import Practice from './pages/Practice'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 text-gray-900 font-medium">
                Dashboard
              </Link>
              <Link to="/questions" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                Questions
              </Link>
              <Link to="/add" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                Add Question
              </Link>
              <Link to="/practice" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                Practice Timer
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/add" element={<QuestionForm />} />
          <Route path="/edit/:id" element={<QuestionForm />} />
          <Route path="/practice" element={<Practice />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
