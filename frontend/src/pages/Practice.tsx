import PracticeTimer from '../components/PracticeTimer'

const TIPS = [
  { icon: '🧠', title: 'Understand First', desc: 'Read the problem twice, identify edge cases before writing code.' },
  { icon: '📐', title: 'Plan Your Approach', desc: 'Explain your approach out loud (even to yourself) before coding.' },
  { icon: '⏱️', title: '25-Min Sessions', desc: 'Use Pomodoro technique — 25 min focus, 5 min break.' },
  { icon: '🔁', title: 'Review & Repeat', desc: "Revisit problems you've solved to reinforce patterns." },
  { icon: '📊', title: 'Track Progress', desc: 'Log every attempt — solved, in-progress, and stuck.' },
  { icon: '🎯', title: 'Target Weak Areas', desc: 'Focus more time on categories with fewer solved questions.' },
]

export default function Practice() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Practice Session</h1>
        <p className="text-gray-500 text-sm mt-1">Use timed sessions for focused problem-solving practice</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <PracticeTimer />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <span>💡</span> Practice Tips
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {TIPS.map(tip => (
              <div key={tip.title} className="flex gap-3 p-3 rounded-xl hover:bg-indigo-50/50 transition-colors">
                <span className="text-xl mt-0.5">{tip.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{tip.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{tip.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
