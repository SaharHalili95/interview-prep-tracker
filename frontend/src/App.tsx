import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Questions from './pages/Questions'
import QuestionForm from './pages/QuestionForm'
import Dashboard from './pages/Dashboard'
import Practice from './pages/Practice'

const NAV = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/questions', label: 'Questions', icon: '📝' },
  { to: '/add', label: 'Add Question', icon: '➕' },
  { to: '/practice', label: 'Practice', icon: '⏱️' },
]

function NavLink({ to, label, icon }: { to: string; label: string; icon: string }) {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-white/20 text-white shadow-lg'
          : 'text-indigo-200 hover:bg-white/10 hover:text-white'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
    </Link>
  )
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-indigo-700 to-violet-800 flex flex-col shadow-2xl transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl shadow">
              💡
            </div>
            <div>
              <div className="text-white font-bold text-base leading-tight">Interview Prep</div>
              <div className="text-indigo-300 text-xs">Tracker</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV.map(n => <NavLink key={n.to} {...n} />)}
        </nav>
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-indigo-300 text-xs text-center">Data saved locally in your browser</p>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-gray-800">💡 Interview Prep Tracker</span>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/add" element={<QuestionForm />} />
            <Route path="/edit/:id" element={<QuestionForm />} />
            <Route path="/practice" element={<Practice />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
