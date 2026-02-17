import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { Question, Difficulty, Status } from '../types/Question'

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadQuestions()
  }, [])

  useEffect(() => {
    filterQuestions()
  }, [questions, categoryFilter, statusFilter, difficultyFilter])

  const loadQuestions = async () => {
    try {
      const data = await api.getQuestions()
      setQuestions(data)
    } catch (error) {
      console.error('Failed to load questions:', error)
    }
  }

  const filterQuestions = () => {
    let filtered = questions

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(q => q.category === categoryFilter)
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(q => q.status === statusFilter)
    }
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(q => q.difficulty === difficultyFilter)
    }

    setFilteredQuestions(filtered)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setDeletingId(id)
      try {
        await api.deleteQuestion(id)
        loadQuestions()
      } catch (error) {
        console.error('Failed to delete question:', error)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const categories = useMemo(() => Array.from(new Set(questions.map(q => q.category))), [questions])

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
    }
  }

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Solved': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Not Started': return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Questions</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Solved">Solved</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredQuestions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No questions found. Try adjusting your filters or add a new question.
                </td>
              </tr>
            ) : filteredQuestions.map((question) => (
              <tr key={question.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{question.title}</div>
                  {question.leetcode_url && (
                    <a
                      href={question.leetcode_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      LeetCode
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {question.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(question.status)}`}>
                    {question.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => navigate(`/edit/${question.id}`)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(question.id!)}
                    disabled={deletingId === question.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === question.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
