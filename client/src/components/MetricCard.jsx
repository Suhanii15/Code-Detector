export function MetricCard({ label, value, sub, className = '' }) {
  return (
    <div className={`rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-3 ${className}`}>
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <div className="text-xl font-semibold text-gray-100">{value}</div>
      {sub && <div className="text-xs text-gray-600 mt-0.5">{sub}</div>}
    </div>
  )
}
