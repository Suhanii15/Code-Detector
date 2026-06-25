export const RISK_COLORS = {
  high: { bg: 'bg-red-950/40', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-500', bar: 'bg-red-500' },
  medium: { bg: 'bg-orange-950/40', text: 'text-orange-400', border: 'border-orange-500/30', dot: 'bg-orange-500', bar: 'bg-orange-500' },
  low: { bg: 'bg-green-950/40', text: 'text-green-400', border: 'border-green-500/30', dot: 'bg-green-500', bar: 'bg-green-500' },
}

export const RISK_THRESHOLDS = { high: 0.7, medium: 0.4 }

export const LOADING_MESSAGES = [
  'Fetching repository',
  'Extracting metrics',
  'Running ML analysis',
  'Generating report',
]
