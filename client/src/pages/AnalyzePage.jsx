import { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { LoadingState } from '../components/LoadingState'
import { LOADING_MESSAGES } from '../utils/constants'

export function AnalyzePage({ onAnalyze, loading, error }) {
  const [url, setUrl] = useState('')
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    if (!loading) { setMsgIndex(0); return }
    const interval = setInterval(() => {
      setMsgIndex((i) => (i < LOADING_MESSAGES.length - 1 ? i + 1 : i))
    }, 2500)
    return () => clearInterval(interval)
  }, [loading])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!url.trim()) return
    onAnalyze(url.trim())
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <h1 className="text-xl font-semibold text-gray-100 mb-1">Analyze Repository</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter a GitHub repository URL to scan for bug-prone files.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="https://github.com/owner/repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-gray-100 text-sm font-medium px-5 py-2 rounded-md transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
        {loading && <LoadingState message={LOADING_MESSAGES[msgIndex]} />}
      </div>
    </div>
  )
}
