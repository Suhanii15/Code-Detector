function getRiskFactors(file) {
  const factors = []
  if (file.complexity > 30) factors.push({ reason: 'High cyclomatic complexity', detail: `${file.complexity} paths exceeds 30 threshold`, severity: file.complexity > 60 ? 'critical' : 'warning' })
  if (file.churn_rate > 20) factors.push({ reason: 'High churn rate', detail: `${file.churn_rate} recent commits — frequently changed`, severity: file.churn_rate > 35 ? 'critical' : 'warning' })
  if (file.comment_density < 0.05) factors.push({ reason: 'Low comment density', detail: `${(file.comment_density * 100).toFixed(1)}% — under 5%`, severity: 'warning' })
  if (file.bug_fix_pct > 0.2) factors.push({ reason: 'High bug fix ratio', detail: `${(file.bug_fix_pct * 100).toFixed(0)}% of commits are fixes`, severity: file.bug_fix_pct > 0.3 ? 'critical' : 'warning' })
  if (file.unique_authors > 4) factors.push({ reason: 'Many unique authors', detail: `${file.unique_authors} authors — coordination risk`, severity: file.unique_authors > 7 ? 'critical' : 'warning' })
  if (file.loc > 500) factors.push({ reason: 'Large file', detail: `${file.loc} lines exceeds 500`, severity: file.loc > 1000 ? 'critical' : 'warning' })
  return factors
}

function RiskBar({ score, level }) {
  const pct = Math.round(score * 100)
  const color = level === 'high' ? '#ef4444' : level === 'medium' ? '#f97316' : '#22c55e'
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${level === 'high' ? 'text-red-600' : level === 'medium' ? 'text-orange-600' : 'text-green-600'}`}>
        {pct}%
      </span>
    </div>
  )
}

export function FileDetailsPanel({ file, onClose }) {
  if (!file) return null

  const factors = getRiskFactors(file)

  const metrics = [
    { label: 'Lines of Code', value: file.loc.toLocaleString() },
    { label: 'Cyclomatic Complexity', value: file.complexity },
    { label: 'Churn Rate', value: file.churn_rate },
    { label: 'Bug Fix Ratio', value: (file.bug_fix_pct * 100).toFixed(0) + '%' },
    { label: 'Comment Density', value: (file.comment_density * 100).toFixed(1) + '%' },
    { label: 'Unique Authors', value: file.unique_authors },
  ]

  return (
    <div className="w-full lg:w-80 xl:w-96 border-l border-gray-200 bg-white shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 truncate">File Details</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="px-4 py-3">
        <p className="font-mono text-xs text-gray-700 break-all mb-4">{file.path}</p>

        {/* Risk score bar */}
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1.5">Risk Score</div>
          <RiskBar score={file.riskScore} level={file.riskLevel} />
        </div>

        {/* Why is this file risky? */}
        {factors.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">Why is this file risky?</div>
            <div className="space-y-1.5">
              {factors.map((f, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 px-2.5 py-1.5 rounded border ${
                    f.severity === 'critical' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <svg
                    className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${f.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    {f.severity === 'critical' ? (
                      <>
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                      </>
                    ) : (
                      <>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                      </>
                    )}
                  </svg>
                  <div>
                    <div className={`text-xs font-medium ${f.severity === 'critical' ? 'text-red-700' : 'text-amber-700'}`}>{f.reason}</div>
                    <div className="text-[11px] text-gray-500">{f.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(factors.length === 0) && (
          <div className="mb-4 px-2.5 py-2 rounded border border-green-200 bg-green-50">
            <p className="text-xs text-green-700">No significant risk factors detected.</p>
          </div>
        )}

        {file.recommendations?.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">Recommendations</div>
            <ul className="space-y-1">
              {file.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="text-blue-600 mt-0.5 shrink-0">&bull;</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-xs text-gray-500 mb-2">Metrics</div>
        <div className="space-y-2">
          {metrics.map((m) => (
            <div key={m.label} className="flex justify-between items-center py-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-500">{m.label}</span>
              <span className="text-xs text-gray-800 font-medium tabular-nums">{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
