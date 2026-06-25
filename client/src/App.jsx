import { useState, useCallback } from 'react'
import { AnalyzePage } from './pages/AnalyzePage'
import { Dashboard } from './pages/Dashboard'
import api from './services/api'

function parseUrl(url) {
  const m = url.match(/github\.com\/([^\/]+)\/([^\/]+?)(?:\/|\.git|$)/)
  if (!m) return null
  return { owner: m[1], repo: m[2].replace(/\.git$/, '') }
}

export default function App() {
  const [view, setView] = useState('analyze')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = useCallback(async (url) => {
    const parsed = parseUrl(url)
    if (!parsed) {
      setError('Invalid GitHub URL. Use format: https://github.com/owner/repo')
      return
    }
    try{
      setError(null)
      setLoading(true)
      setView("analyze")

      const res = await api.post("/analyze",{
        repoUrl : url,
      })
      setResult(res.data)
      setView("dashboard")
    }
    catch(err){
      console.error(err)
      setError(
        err.response?.data?.error || "Analysis failed"
      )
    }
    finally{
      setLoading(false)
    }
  },[])

  const handleReset = useCallback(() => {
    setView('analyze')
    setResult(null)
    setError(null)
    setLoading(false)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700 flex flex-col">
      <div className="flex-1 flex flex-col min-h-0">
        {view === 'dashboard' && result ? (
          <Dashboard result={result} onBack={handleReset} />
        ) : (
          <AnalyzePage onAnalyze={handleAnalyze} loading={loading} error={error} />
        )}
      </div>
    </div>
  )
}
