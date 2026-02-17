import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'
import { Question, Difficulty, Status } from '../types/Question'

export default function QuestionForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!id)
  const [formData, setFormData] = useState<Question>({
    title: '',
    description: '',
    difficulty: 'Easy' as Difficulty,
    category: '',
    status: 'Not Started' as Status,
    leetcode_url: '',
    solution: '',
    notes: '',
  })

  useEffect(() => {
    if (id) {
      loadQuestion(id)
    }
  }, [id])

  const loadQuestion = async (questionId: string) => {
    try {
      const questions = await api.getQuestions()
      const question = questions.find(q => q.id === questionId)
      if (question) {
        setFormData(question)
      }
    } catch (error) {
      console.error('Failed to load question:', error)
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (id) {
        await api.updateQuestion(id, formData)
      } else {
        await api.createQuestion(formData)
      }
      navigate('/questions')
    } catch (error) {
      console.error('Failed to save question:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {id ? 'Edit Question' : 'Add New Question'}
      </h1>

      {initialLoading ? (
        <div className="text-center py-8">Loading question...</div>
      ) : (
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty *
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g., Array, String"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Solved">Solved</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="leetcode_url" className="block text-sm font-medium text-gray-700 mb-2">
              LeetCode URL
            </label>
            <input
              type="url"
              id="leetcode_url"
              name="leetcode_url"
              value={formData.leetcode_url}
              onChange={handleChange}
              placeholder="https://leetcode.com/problems/..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-2">
              Solution
            </label>
            <textarea
              id="solution"
              name="solution"
              value={formData.solution}
              onChange={handleChange}
              rows={6}
              className="w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-sm"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : id ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/questions')}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      )}
    </div>
  )
}
