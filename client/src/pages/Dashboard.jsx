import { MetricCard } from '../components/MetricCard'
import { Card } from '../components/Card'
import { RiskTable } from '../components/RiskTable'
import { FileDetailsPanel } from '../components/FileDetailsPanel'
import { RISK_COLORS } from '../utils/constants'
import { useState } from 'react'

function computeHealth(stats) {
  const highPct = stats.total > 0 ? (stats.high / stats.total) * 100 : 0
  const medPct = stats.total > 0 ? (stats.medium / stats.total) * 100 : 0
  if (highPct > 15) return { label: 'Poor', color: 'text-red-400', dot: 'bg-red-500', bg: 'bg-red-950/40', border: 'border-red-500/30' }
  if (highPct > 5 || medPct > 20) return { label: 'Moderate', color: 'text-orange-400', dot: 'bg-orange-500', bg: 'bg-orange-950/40', border: 'border-orange-500/30' }
  return { label: 'Good', color: 'text-green-400', dot: 'bg-green-500', bg: 'bg-green-950/40', border: 'border-green-500/30' }
}

export function Dashboard({ result, onBack }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const { owner, repo, analyzedAt, totalFiles, stats, hotspots, files } = result
  const health = computeHealth(stats)

  const cards = [
    { label: 'Total Files', value: stats.total, color: 'text-gray-100' },
    { label: 'High Risk', value: stats.high, color: RISK_COLORS.high.text },
    { label: 'Medium Risk', value: stats.medium, color: RISK_COLORS.medium.text },
    { label: 'Low Risk', value: stats.low, color: RISK_COLORS.low.text },
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full px-4 py-5 space-y-5">
          {/* Repo summary + health */}
          <Card className="px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${health.bg} ${health.border} shrink-0`}>
                <span className={`w-2 h-2 rounded-full ${health.dot}`} />
                <span className={`text-xs font-medium ${health.color}`}>{health.label}</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-medium text-gray-200 truncate">
                  {owner}/<span className="font-semibold">{repo}</span>
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  {totalFiles} files &middot; Analyzed {new Date(analyzedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors shrink-0"
            >
              New analysis
            </button>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {cards.map((c) => (
              <MetricCard key={c.label} label={c.label} value={c.value} className={c.color} />
            ))}
          </div>

          {/* Risk bar */}
          <Card className="p-4">
            <div className="text-xs text-gray-500 mb-2">Risk Distribution</div>
            <div className="flex h-2 rounded-full overflow-hidden bg-gray-800">
              {['high', 'medium', 'low'].map((level) => {
                const pct = stats.total > 0 ? (stats[level] / stats.total) * 100 : 0
                if (pct === 0) return null
                return <div key={level} className={RISK_COLORS[level].bar} style={{ width: `${pct}%` }} />
              })}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-600">
              {['high', 'medium', 'low'].map((level) => (
                <span key={level} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${RISK_COLORS[level].dot}`} />
                  {level} ({stats[level]})
                </span>
              ))}
            </div>
          </Card>

          {/* Hotspots */}
          {hotspots?.length > 0 && (
            <Card className="p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">Risk Hotspots</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {hotspots.map((h) => (
                  <div key={h.path} className="rounded border border-gray-800 bg-gray-900/40 px-3 py-2.5">
                    <div className="text-xs font-mono text-gray-300 truncate mb-2" title={h.path}>{h.path}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-semibold text-gray-100 tabular-nums">{(h.averageRisk * 100).toFixed(0)}%</span>
                      <span className="text-[11px] text-gray-600">avg risk</span>
                    </div>
                    <div className="flex gap-3 mt-1.5 text-[11px] text-gray-600">
                      <span>{h.fileCount} files</span>
                      {h.highRiskCount > 0 && <span className="text-red-400">{h.highRiskCount} high</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Table + Side panel */}
          <div className="flex flex-col lg:flex-row gap-0 lg:gap-5">
            <div className="flex-1 min-w-0">
              <Card className="p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">Files</div>
                <RiskTable files={files} onSelect={setSelectedFile} selectedPath={selectedFile?.path} />
              </Card>
            </div>
            {selectedFile && (
              <FileDetailsPanel file={selectedFile} onClose={() => setSelectedFile(null)} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
