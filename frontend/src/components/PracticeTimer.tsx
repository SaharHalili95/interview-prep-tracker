import { useState, useEffect, useCallback } from 'react'

interface PracticeTimerProps {
  onSessionComplete?: () => void
}

const PRESETS = [
  { label: '25 min', minutes: 25 },
  { label: '15 min', minutes: 15 },
  { label: '5 min', minutes: 5 },
]

const SESSIONS_KEY = 'practice-timer-sessions'

function loadSessionsToday(): number {
  try {
    const saved = localStorage.getItem(SESSIONS_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      if (data.date === new Date().toDateString()) return data.count
    }
  } catch { /* ignore */ }
  return 0
}

function saveSessionsToday(count: number) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify({
    date: new Date().toDateString(),
    count,
  }))
}

function playCompletionSound() {
  try {
    const audioCtx = new AudioContext()
    ;[0, 200, 400].forEach(delay => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.frequency.value = 800
      gain.gain.value = 0.3
      osc.start(audioCtx.currentTime + delay / 1000)
      osc.stop(audioCtx.currentTime + delay / 1000 + 0.15)
    })
  } catch { /* audio not available */ }
}

export default function PracticeTimer({ onSessionComplete }: PracticeTimerProps) {
  const [duration, setDuration] = useState(25 * 60)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsToday, setSessionsToday] = useState(loadSessionsToday)
  const [showCustom, setShowCustom] = useState(false)
  const [customMinutes, setCustomMinutes] = useState('')

  const incrementSessions = useCallback(() => {
    const newCount = sessionsToday + 1
    setSessionsToday(newCount)
    saveSessionsToday(newCount)
  }, [sessionsToday])

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          playCompletionSound()
          incrementSessions()
          onSessionComplete?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, incrementSessions, onSessionComplete])

  const selectPreset = (minutes: number) => {
    const secs = minutes * 60
    setDuration(secs)
    setTimeLeft(secs)
    setIsRunning(false)
    setShowCustom(false)
  }

  const applyCustom = () => {
    const mins = parseInt(customMinutes)
    if (mins > 0 && mins <= 120) {
      selectPreset(mins)
      setCustomMinutes('')
      setShowCustom(false)
    }
  }

  const toggleRunning = () => {
    if (timeLeft <= 0) {
      setTimeLeft(duration)
    }
    setIsRunning(r => !r)
  }

  const reset = () => {
    setIsRunning(false)
    setTimeLeft(duration)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = duration > 0 ? timeLeft / duration : 0
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  const getColor = () => {
    if (progress > 0.5) return '#22c55e'
    if (progress > 0.25) return '#eab308'
    return '#ef4444'
  }

  const isComplete = timeLeft === 0 && duration > 0

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Preset Buttons */}
      <div className="flex gap-2 justify-center mb-6">
        {PRESETS.map(p => (
          <button
            key={p.minutes}
            onClick={() => selectPreset(p.minutes)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              duration === p.minutes * 60 && !showCustom
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showCustom ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Custom
        </button>
      </div>

      {showCustom && (
        <div className="flex gap-2 justify-center mb-4">
          <input
            type="number"
            value={customMinutes}
            onChange={e => setCustomMinutes(e.target.value)}
            placeholder="Minutes"
            min={1}
            max={120}
            className="w-24 px-3 py-2 border border-gray-300 rounded-md text-center text-sm"
          />
          <button
            onClick={applyCustom}
            disabled={!customMinutes || parseInt(customMinutes) <= 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Set
          </button>
        </div>
      )}

      {/* Timer Display */}
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 192 192">
            <circle cx="96" cy="96" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle
              cx="96"
              cy="96"
              r={radius}
              fill="none"
              stroke={isComplete ? '#22c55e' : getColor()}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isComplete ? (
              <div className="text-center">
                <div className="text-2xl mb-1">🎉</div>
                <div className="text-sm font-medium text-green-600">Done!</div>
              </div>
            ) : (
              <div className="text-4xl font-bold text-gray-900 font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center mb-6">
        <button
          onClick={toggleRunning}
          className={`px-6 py-2.5 rounded-lg font-medium text-white transition-colors ${
            isRunning
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isRunning ? 'Pause' : timeLeft === 0 ? 'Restart' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Session Counter */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          <span>Sessions completed today:</span>
          <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold">
            {sessionsToday}
          </span>
        </div>
      </div>
    </div>
  )
}
