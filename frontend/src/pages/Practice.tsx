import PracticeTimer from '../components/PracticeTimer'

export default function Practice() {
  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Practice Session</h1>
      <div className="max-w-lg mx-auto">
        <PracticeTimer />
      </div>
      <div className="mt-8 max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Tips for Effective Practice</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>&#8226; Use the 25-minute timer for full problem-solving sessions</li>
            <li>&#8226; Use 15 minutes for reviewing solutions and patterns</li>
            <li>&#8226; Use 5 minutes for quick concept review</li>
            <li>&#8226; Take breaks between sessions to maintain focus</li>
            <li>&#8226; Aim for at least 3 practice sessions per day</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
