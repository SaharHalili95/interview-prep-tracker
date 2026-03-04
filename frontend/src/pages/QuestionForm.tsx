import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../services/api'
import { Question, Difficulty, Status } from '../types/Question'

const CATEGORIES = ['Array', 'String', 'Linked List', 'Stack', 'Queue', 'Tree', 'Graph', 'Dynamic Programming', 'Binary Search', 'Sorting', 'Hashing', 'Recursion', 'Backtracking', 'Greedy', 'Math', 'Two Pointers', 'Sliding Window', 'Bit Manipulation']

export default function QuestionForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!id)
  const [customCategory, setCustomCategory] = useState(false)
  const [form, setForm] = useState<Question>({
    title: '', description: '', difficulty: 'Easy', category: '', status: 'Not Started',
    leetcode_url: '', solution: '', notes: '',
  })

  useEffect(() => {
    if (!id) return
    api.getQuestions().then(qs => {
      const q = qs.find(q => q.id === id)
      if (q) {
        setForm(q)
        if (!CATEGORIES.includes(q.category)) setCustomCategory(true)
      }
    }).finally(() => setInitialLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (id) await api.updateQuestion(id, form)
      else await api.createQuestion(form)
      navigate('/questions')
    } finally {
      setLoading(false)
    }
  }

  const set = (field: keyof Question) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  if (initialLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/questions" className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Question' : 'Add New Question'}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{id ? 'Update question details' : 'Add a new coding question to track'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Basic Info</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title <span className="text-rose-500">*</span></label>
            <input type="text" value={form.title} onChange={set('title')} required
              placeholder="e.g. Two Sum"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-rose-500">*</span></label>
            <textarea value={form.description} onChange={set('description')} required rows={3}
              placeholder="Problem description..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 resize-none" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Difficulty <span className="text-rose-500">*</span></label>
              <select value={form.difficulty} onChange={set('difficulty')}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50">
                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-rose-500">*</span></label>
              {customCategory ? (
                <div className="flex gap-1">
                  <input type="text" value={form.category} onChange={set('category')} required
                    placeholder="Category name"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50" />
                  <button type="button" onClick={() => { setCustomCategory(false); setForm(p => ({ ...p, category: '' })) }}
                    className="px-2 text-gray-400 hover:text-gray-600">✕</button>
                </div>
              ) : (
                <select value={form.category} onChange={e => {
                  if (e.target.value === '__custom__') { setCustomCategory(true); setForm(p => ({ ...p, category: '' })) }
                  else setForm(p => ({ ...p, category: e.target.value }))
                }} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50">
                  <option value="">Select...</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  <option value="__custom__">+ Custom</option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select value={form.status} onChange={set('status')}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50">
                {(['Not Started', 'In Progress', 'Solved'] as Status[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">LeetCode URL</label>
            <input type="url" value={form.leetcode_url ?? ''} onChange={set('leetcode_url')}
              placeholder="https://leetcode.com/problems/..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50" />
          </div>
        </div>

        {/* Solution & Notes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Solution & Notes</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Solution</label>
            <textarea value={form.solution ?? ''} onChange={set('solution')} rows={6}
              placeholder="Paste your solution code here..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
            <textarea value={form.notes ?? ''} onChange={set('notes')} rows={3}
              placeholder="Time complexity, approach, edge cases..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 resize-none" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : (id ? '💾 Update' : '✅ Create')}
          </button>
          <Link to="/questions"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-medium text-sm transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
