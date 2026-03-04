import { useEffect, useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'
import { Question, Difficulty, Status } from '../types/Question'

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Easy: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  Medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  Hard: 'bg-rose-100 text-rose-700 border border-rose-200',
}
const STATUS_STYLES: Record<Status, string> = {
  Solved: 'bg-emerald-100 text-emerald-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  'Not Started': 'bg-gray-100 text-gray-600',
}

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => { api.getQuestions().then(setQuestions) }, [])

  const categories = useMemo(() => Array.from(new Set(questions.map(q => q.category))).sort(), [questions])

  const filtered = useMemo(() => questions.filter(q => {
    if (search && !q.title.toLowerCase().includes(search.toLowerCase()) && !q.category.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilter !== 'all' && q.category !== categoryFilter) return false
    if (statusFilter !== 'all' && q.status !== statusFilter) return false
    if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false
    return true
  }), [questions, search, categoryFilter, statusFilter, difficultyFilter])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this question?')) return
    await api.deleteQuestion(id)
    setQuestions(qs => qs.filter(q => q.id !== id))
  }

  const handleStatusChange = async (id: string, status: Status) => {
    await api.updateQuestion(id, { status })
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, status } : q))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Questions</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} of {questions.length} questions</p>
        </div>
        <Link
          to="/add"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
        >
          <span>➕</span> Add Question
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="🔍 Search questions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
          />
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50">
            <option value="all">All Statuses</option>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Solved</option>
          </select>
          <select value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50">
            <option value="all">All Difficulties</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500 font-medium">No questions match your filters</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting the search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Question</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Difficulty</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(q => (
                  <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 text-sm">{q.title}</div>
                      {q.leetcode_url && (
                        <a href={q.leetcode_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-indigo-500 hover:text-indigo-700 mt-0.5 inline-flex items-center gap-1">
                          🔗 LeetCode
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">{q.category}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${DIFFICULTY_STYLES[q.difficulty]}`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={q.status}
                        onChange={e => handleStatusChange(q.id!, e.target.value as Status)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-indigo-400 ${STATUS_STYLES[q.status]}`}
                      >
                        <option>Not Started</option>
                        <option>In Progress</option>
                        <option>Solved</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button onClick={() => navigate(`/edit/${q.id}`)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mr-4 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(q.id!)}
                        className="text-rose-500 hover:text-rose-700 text-sm font-medium transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
