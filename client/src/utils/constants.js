export const RISK_COLORS = {
  high: { bg: 'bg-red-50/80', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', bar: 'bg-red-500' },
  medium: { bg: 'bg-orange-50/80', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500', bar: 'bg-orange-500' },
  low: { bg: 'bg-green-50/80', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500', bar: 'bg-green-500' },
}

export const RISK_THRESHOLDS = { high: 0.7, medium: 0.4 }

export const LOADING_MESSAGES = [
  'Fetching repository',
  'Extracting metrics',
  'Running ML analysis',
  'Generating report',
]
