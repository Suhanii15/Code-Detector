import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../components/Card'
import { LoadingState } from '../components/LoadingState'
import { LOADING_MESSAGES } from '../utils/constants'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

const stageColors = ['#3b82f6', '#8b5cf6', '#f97316', '#22c55e']

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
    <div className="flex-1 flex flex-col min-h-0 relative bg-page">

      {/* Brand mark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-6 pt-5"
      >
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span className="text-sm font-medium tracking-tight">Code Detector</span>
        </button>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
        <motion.div
          className="w-full max-w-lg"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Gradient bar */}
          <motion.div variants={item} className="h-1 w-14 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mb-6" />

          <motion.h1 variants={item} className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
            Analyze a repository
          </motion.h1>
          <motion.p variants={item} className="text-sm text-gray-500 mb-8 leading-relaxed">
            Enter a GitHub URL to scan for bug-prone files using ML-powered analysis.
          </motion.p>

          {/* Input card */}
          <motion.div variants={item}>
            <div className="rounded-xl border border-gray-200/70 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_-1px_rgba(0,0,0,0.06)]">
              <form onSubmit={handleSubmit} className="flex gap-2 p-1">
                <div className="flex-1 flex items-center gap-2 pl-3">
                  <svg className="w-4 h-4 shrink-0 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="https://github.com/owner/repo"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    className="flex-1 bg-transparent border-0 px-0 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none disabled:opacity-50"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-100 disabled:text-gray-400 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shrink-0"
                  whileHover={!loading && url.trim() ? { scale: 1.02 } : {}}
                  whileTap={!loading && url.trim() ? { scale: 0.98 } : {}}
                >
                  {loading ? 'Analyzing...' : 'Analyze'}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Feature badges */}
          <motion.div variants={item} className="flex items-center justify-center gap-4 mt-4">
            {[
              { label: 'ML-Powered', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label: 'GitHub Analysis', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
              { label: 'Risk Detection', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100/60 border border-gray-200/50">
                <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={badge.icon} />
                </svg>
                <span className="text-[11px] font-medium text-gray-500 tracking-tight">{badge.label}</span>
              </div>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-600 text-xs mt-3"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {loading && (
            <motion.div variants={item} className="mt-8 space-y-3">
              <LoadingState />
              {/* Stage dots */}
              <div className="flex items-center justify-center gap-2">
                {LOADING_MESSAGES.map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor: i <= msgIndex ? stageColors[i] : '#d1d5db',
                    }}
                  />
                ))}
              </div>
              <motion.p
                key={msgIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-gray-500 text-center"
              >
                {LOADING_MESSAGES[msgIndex]}
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
