import { RISK_COLORS } from '../utils/constants'

export function Badge({ level, children }) {
  const c = RISK_COLORS[level] || RISK_COLORS.low
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium ${c.bg} ${c.text} ${c.border} border`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {children || level}
    </span>
  )
}
