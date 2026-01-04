import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Stats } from '../types/Question'

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await api.getStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Total Questions</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">{stats?.total || 0}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Solved</div>
          <div className="mt-2 text-3xl font-semibold text-green-600">{stats?.solved || 0}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">In Progress</div>
          <div className="mt-2 text-3xl font-semibold text-yellow-600">{stats?.in_progress || 0}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Not Started</div>
          <div className="mt-2 text-3xl font-semibold text-gray-600">{stats?.not_started || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">By Category</h2>
          <div className="space-y-3">
            {stats?.by_category.map((cat) => (
              <div key={cat.category} className="flex justify-between items-center">
                <span className="text-gray-700">{cat.category}</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">By Difficulty</h2>
          <div className="space-y-3">
            {stats?.by_difficulty.map((diff) => (
              <div key={diff.difficulty} className="flex justify-between items-center">
                <span className="text-gray-700">{diff.difficulty}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  diff.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  diff.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {diff.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
