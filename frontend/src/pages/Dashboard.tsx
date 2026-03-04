import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { Stats } from '../types/Question'

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard: 'bg-rose-100 text-rose-700',
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.getStats().then(setStats).finally(() => setLoading(false)) }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const solved = stats?.solved ?? 0
  const total = stats?.total ?? 0
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0

  const statCards = [
    { label: 'Total Questions', value: total, color: 'from-indigo-500 to-violet-600', icon: '📚' },
    { label: 'Solved', value: solved, color: 'from-emerald-500 to-teal-600', icon: '✅' },
    { label: 'In Progress', value: stats?.in_progress ?? 0, color: 'from-amber-500 to-orange-500', icon: '🔄' },
    { label: 'Not Started', value: stats?.not_started ?? 0, color: 'from-slate-500 to-gray-600', icon: '📌' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Track your interview preparation progress</p>
        </div>
        <Link
          to="/add"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
        >
          <span>➕</span> Add Question
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white shadow-lg`}>
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="text-3xl font-bold">{card.value}</div>
            <div className="text-white/80 text-sm mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
          <h2 className="text-base font-semibold text-gray-700 mb-4 self-start">Overall Progress</h2>
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="52" fill="none" stroke="#e0e7ff" strokeWidth="12" />
              <circle
                cx="64" cy="64" r="52" fill="none"
                stroke="url(#pg)" strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{pct}%</span>
              <span className="text-xs text-gray-500">solved</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">{solved} of {total} questions solved</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">By Category</h2>
          <div className="space-y-3">
            {(stats?.by_category.length ?? 0) === 0 && <p className="text-gray-400 text-sm">No data yet</p>}
            {stats?.by_category.map(cat => (
              <div key={cat.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{cat.category}</span>
                  <span className="text-gray-500">{cat.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((cat.count / (total || 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">By Difficulty</h2>
          <div className="space-y-3">
            {(stats?.by_difficulty.length ?? 0) === 0 && <p className="text-gray-400 text-sm">No data yet</p>}
            {stats?.by_difficulty.map(d => (
              <div key={d.difficulty} className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${DIFFICULTY_COLORS[d.difficulty] ?? 'bg-gray-100 text-gray-700'}`}>
                  {d.difficulty}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        d.difficulty === 'Easy' ? 'bg-emerald-500' :
                        d.difficulty === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min((d.count / (total || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-4 text-right">{d.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
