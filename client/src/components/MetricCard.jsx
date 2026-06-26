import { useCounter } from '../hooks/useCounter'

export function MetricCard({ label, value, sub, className = '' }) {
  const count = useCounter(typeof value === 'number' ? value : 0)

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 transition-all duration-200 hover:-translate-y-1 cursor-pointer">
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <div className={`text-xl font-semibold tabular-nums text-gray-900 ${className}`}>{count}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}
