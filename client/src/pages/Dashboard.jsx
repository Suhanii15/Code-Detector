import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { MetricCard } from '../components/MetricCard'
import { Card } from '../components/Card'
import { RiskTable } from '../components/RiskTable'
import { FileDetailsPanel } from '../components/FileDetailsPanel'
import { HealthRing } from '../components/HealthRing'
import { RISK_COLORS } from '../utils/constants'
import { useState } from 'react'

function computeHealth(stats) {
  const highPct = stats.total > 0 ? (stats.high / stats.total) * 100 : 0
  const medPct = stats.total > 0 ? (stats.medium / stats.total) * 100 : 0
  if (highPct > 15) return { label: 'Poor', color: 'text-red-700', hex: '#ef4444', dot: 'bg-red-500', bg: 'bg-red-50', border: 'border-red-200' }
  if (highPct > 5 || medPct > 20) return { label: 'Moderate', color: 'text-orange-700', hex: '#f97316', dot: 'bg-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' }
  return { label: 'Good', color: 'text-green-700', hex: '#22c55e', dot: 'bg-green-500', bg: 'bg-green-50', border: 'border-green-200' }
}

function computeInsights(files) {
  if (!files?.length) return null
  const totalLoc = files.reduce((s, f) => s + (f.loc || 0), 0)
  const avgComplexity = (files.reduce((s, f) => s + (f.complexity || 0), 0) / files.length).toFixed(1)
  const avgChurn = (files.reduce((s, f) => s + (f.churn_rate || 0), 0) / files.length).toFixed(1)
  const avgBugFix = (files.reduce((s, f) => s + (f.bug_fix_pct || 0), 0) / files.length * 100).toFixed(0)
  const riskyFile = files.reduce((max, f) => f.riskScore > (max?.riskScore || 0) ? f : max, null)
  const highCount = files.filter(f => f.riskLevel === 'high').length
  const highLoc = files.filter(f => f.riskLevel === 'high').reduce((s, f) => s + (f.loc || 0), 0)
  return { totalLoc, avgComplexity, avgChurn, avgBugFix, riskyFile, highCount, highLoc }
}

export function Dashboard({ result, onBack }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const { owner, repo, analyzedAt, totalFiles, stats, hotspots, files } = result
  const health = computeHealth(stats)
  const insights = useMemo(() => computeInsights(files), [files])

  const cards = [
    { label: 'Total Files', value: stats.total, color: '' },
    { label: 'High Risk', value: stats.high, color: RISK_COLORS.high.text },
    { label: 'Medium Risk', value: stats.medium, color: RISK_COLORS.medium.text },
    { label: 'Low Risk', value: stats.low, color: RISK_COLORS.low.text },
  ]

  const healthPct = health.label === 'Good' ? 85 : health.label === 'Moderate' ? 50 : 25

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Minimal header */}
      <div className="border-b border-gray-200 bg-white px-4 py-2.5 flex items-center gap-3 shrink-0">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span className="text-sm font-medium tracking-tight">Code Detector</span>
        </button>
        <span className="text-xs text-gray-300 hidden sm:inline">&middot;</span>
        <span className="text-xs text-gray-400 hidden sm:inline truncate">{owner}/{repo}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full px-4 py-5 space-y-5">
          {/* Repo summary + health */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Card className="px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md border ${health.bg} ${health.border} shrink-0`}>
                <HealthRing pct={healthPct} size={28} strokeWidth={3} color={health.hex} />
                <span className={`text-xs font-medium ${health.color}`}>{health.label}</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-medium text-gray-900 truncate">
                  {owner}/<span className="font-semibold">{repo}</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {totalFiles} files &middot; Analyzed {new Date(analyzedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            >
              New analysis
            </button>
          </Card>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {cards.map((c) => (
              <MetricCard key={c.label} label={c.label} value={c.value} className={c.color} />
            ))}
          </div>

          {/* Risk bar */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
            <Card className="p-4">
            <div className="text-xs text-gray-500 mb-2">Risk Distribution</div>
            <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
              {['high', 'medium', 'low'].map((level) => {
                const pct = stats.total > 0 ? (stats[level] / stats.total) * 100 : 0
                if (pct === 0) return null
                return <div key={level} className={`${RISK_COLORS[level].bar} animate-bar-grow`} style={{ width: `${pct}%` }} />
              })}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              {['high', 'medium', 'low'].map((level) => (
                <span key={level} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${RISK_COLORS[level].dot}`} />
                  {level} ({stats[level]})
                </span>
              ))}
            </div>
          </Card>
          </motion.div>

          {/* Repository Insights */}
          {insights && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}>
              <Card className="p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">Repository Insights</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Total LOC</div>
                    <div className="text-base font-semibold text-gray-900 tabular-nums">{insights.totalLoc.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Avg Complexity</div>
                    <div className="text-base font-semibold text-gray-900 tabular-nums">{insights.avgComplexity}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Avg Churn</div>
                    <div className="text-base font-semibold text-gray-900 tabular-nums">{insights.avgChurn}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Bug Fix Rate</div>
                    <div className="text-base font-semibold text-gray-900 tabular-nums">{insights.avgBugFix}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">High Risk LOC</div>
                    <div className="text-base font-semibold text-red-700 tabular-nums">{insights.highLoc.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Riskiest File</div>
                    <div className="text-sm font-mono text-gray-900 truncate max-w-[140px]" title={insights.riskyFile?.path}>
                      {insights.riskyFile?.path || '-'}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Hotspots */}
          {hotspots?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
              <Card className="p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">Risk Hotspots</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {hotspots.map((h, i) => (
                  <motion.div
                    key={h.path}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.06 }}
                    className="rounded border border-gray-200 bg-gray-50/50 px-3 py-2.5"
                  >
                    <div className="text-xs font-mono text-gray-700 truncate mb-2" title={h.path}>{h.path}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-semibold text-gray-900 tabular-nums">{(h.averageRisk * 100).toFixed(0)}%</span>
                      <span className="text-[11px] text-gray-400">avg risk</span>
                    </div>
                    <div className="flex gap-3 mt-1.5 text-[11px] text-gray-500">
                      <span>{h.fileCount} files</span>
                      {h.highRiskCount > 0 && <span className="text-red-600">{h.highRiskCount} high</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
          )}

          {/* Table + Side panel */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.3 }} className="flex flex-col lg:flex-row gap-0 lg:gap-5">
            <div className="flex-1 min-w-0">
              <Card className="p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">Files</div>
                <RiskTable files={files} onSelect={setSelectedFile} selectedPath={selectedFile?.path} />
              </Card>
            </div>
            {selectedFile && (
              <FileDetailsPanel file={selectedFile} onClose={() => setSelectedFile(null)} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
