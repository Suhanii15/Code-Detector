export function FileDetailsPanel({ file, onClose }) {
  if (!file) return null

  const metrics = [
    { label: 'Lines of Code', value: file.loc.toLocaleString() },
    { label: 'Cyclomatic Complexity', value: file.complexity },
    { label: 'Churn Rate', value: file.churn_rate },
    { label: 'Comment Density', value: (file.comment_density * 100).toFixed(1) + '%' },
    { label: 'Unique Authors', value: file.unique_authors },
    { label: 'Risk Score', value: (file.riskScore * 100).toFixed(0) + '%' },
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
        <div className="space-y-2">
          {metrics.map((m) => (
            <div key={m.label} className="flex justify-between items-center py-1.5 border-b border-gray-800/50">
              <span className="text-xs text-gray-500">{m.label}</span>
              <span className="text-xs text-gray-200 font-medium tabular-nums">{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
