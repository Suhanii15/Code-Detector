import { MetricCard } from '../components/MetricCard'
import { Card } from '../components/Card'
import { RiskTable } from '../components/RiskTable'
import { FileDetailsPanel } from '../components/FileDetailsPanel'
import { RISK_COLORS } from '../utils/constants'
import { useState } from 'react'

export function Dashboard({ result, onBack }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const { owner, repo, analyzedAt, totalFiles, stats, files } = result

  const cards = [
    { label: 'Total Files', value: stats.total, color: 'text-gray-100' },
    { label: 'High Risk', value: stats.high, color: RISK_COLORS.high.text, bar: 'bg-red-500' },
    { label: 'Medium Risk', value: stats.medium, color: RISK_COLORS.medium.text, bar: 'bg-orange-500' },
    { label: 'Low Risk', value: stats.low, color: RISK_COLORS.low.text, bar: 'bg-green-500' },
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full px-4 py-5 space-y-5">
          {/* Repo summary */}
          <Card className="px-4 py-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-200">
                {owner}/<span className="font-semibold">{repo}</span>
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                {totalFiles} files &middot; Analyzed {new Date(analyzedAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={onBack}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
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
