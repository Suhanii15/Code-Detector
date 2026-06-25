function getRiskFactors(file) {
  const factors = []
  if (file.complexity > 30) factors.push({ reason: 'High cyclomatic complexity', detail: `${file.complexity} paths exceeds 30 threshold` })
  if (file.churn_rate > 20) factors.push({ reason: 'High churn rate', detail: `${file.churn_rate} recent commits — frequently changed` })
  if (file.comment_density < 0.05) factors.push({ reason: 'Low comment density', detail: `${(file.comment_density * 100).toFixed(1)}% — under 5%` })
  if (file.bug_fix_pct > 0.2) factors.push({ reason: 'High bug fix ratio', detail: `${(file.bug_fix_pct * 100).toFixed(0)}% of commits are fixes` })
  if (file.unique_authors > 4) factors.push({ reason: 'Many unique authors', detail: `${file.unique_authors} authors — coordination risk` })
  if (file.loc > 500) factors.push({ reason: 'Large file', detail: `${file.loc} lines exceeds 500` })
  return factors
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
    <div className="w-full lg:w-80 xl:w-96 border-l border-gray-800 bg-gray-900/80 shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <h3 className="text-sm font-medium text-gray-200 truncate">File Details</h3>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-300 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="px-4 py-3">
        <p className="font-mono text-xs text-gray-300 break-all mb-4">{file.path}</p>

        {factors.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">Risk Factors</div>
            <div className="space-y-1.5">
              {factors.map((f, i) => (
                <div key={i} className="flex items-start gap-2 px-2.5 py-1.5 rounded bg-red-950/30 border border-red-800/30">
                  <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <div>
                    <div className="text-xs font-medium text-red-300">{f.reason}</div>
                    <div className="text-[11px] text-gray-500">{f.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {file.recommendations?.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">Recommendations</div>
            <ul className="space-y-1">
              {file.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                  <span className="text-blue-400 mt-0.5 shrink-0">&bull;</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-xs text-gray-500 mb-2">Metrics</div>
        <div className="space-y-2">
          {metrics.map((m) => (
            <div key={m.label} className="flex justify-between items-center py-1.5 border-b border-gray-800/50">
              <span className="text-xs text-gray-500">{m.label}</span>
              <span className="text-xs text-gray-200 font-medium tabular-nums">{m.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-800">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Risk Score</span>
            <span className={`text-sm font-semibold tabular-nums ${file.riskLevel === 'high' ? 'text-red-400' : file.riskLevel === 'medium' ? 'text-orange-400' : 'text-green-400'}`}>
              {(file.riskScore * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
