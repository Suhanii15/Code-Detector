import { useState, useMemo } from 'react'
import { Badge } from './Badge'
import { RISK_COLORS } from '../utils/constants'

function formatRiskScore(score) {
  return (score * 100).toFixed(0)
}

const LEVELS = ['high', 'medium', 'low']

function SortIcon({ col, sortBy, sortDir }) {
  if (sortBy !== col) return <span className="text-gray-300 ml-1 font-sans">&#8597;</span>
  return <span className="text-blue-600 ml-1 font-sans">{sortDir === 'asc' ? '&#8593;' : '&#8595;'}</span>
}

const COLUMNS = [
  { key: 'path', label: 'File', align: 'text-left', sortable: false, width: '' },
  { key: 'riskScore', label: 'Risk', align: 'text-right', sortable: true, width: 'w-16' },
  { key: 'riskLevel', label: 'Level', align: 'text-right', sortable: true, width: 'w-16' },
  { key: 'complexity', label: 'Complexity', align: 'text-right', sortable: true, width: 'w-20' },
  { key: 'churn_rate', label: 'Churn', align: 'text-right', sortable: true, width: 'w-16' },
]

export function RiskTable({ files, onSelect, selectedPath }) {
  const [sortBy, setSortBy] = useState('riskScore')
  const [sortDir, setSortDir] = useState('desc')
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState(null)

  const toggleLevel = (level) => {
    setLevelFilter((prev) => (prev === level ? null : level))
  }

  const sorted = useMemo(() => {
    let list = [...files]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((f) => f.path.toLowerCase().includes(q))
    }
    if (levelFilter) {
      list = list.filter((f) => f.riskLevel === levelFilter)
    }
    list.sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      if (typeof aVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    })
    return list
  }, [files, sortBy, sortDir, search, levelFilter])

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortDir('desc')
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-500"
        />
        <div className="flex gap-1">
          {LEVELS.map((level) => {
            const active = levelFilter === level
            const c = RISK_COLORS[level]
            return (
              <button
                key={level}
                onClick={() => toggleLevel(level)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                  active
                    ? `${c.bg} ${c.text} ${c.border}`
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-700'
                }`}
              >
                {level}
              </button>
            )
          })}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`${col.align} py-2 pr-4 font-medium ${col.sortable ? 'cursor-pointer select-none' : ''} ${col.width || ''}`}
                  onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                >
                  {col.label}
                  {col.sortable && <SortIcon col={col.key} sortBy={sortBy} sortDir={sortDir} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((f) => (
              <tr
                key={f.path}
                className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${selectedPath === f.path ? 'bg-blue-50' : ''}`}
                onClick={() => onSelect?.(f)}
              >
                <td className="py-2.5 pr-4 text-gray-700 font-mono text-xs truncate max-w-[400px]">{f.path}</td>
                <td className="py-2.5 px-4 text-right text-gray-800 tabular-nums">{formatRiskScore(f.riskScore)}%</td>
                <td className="py-2.5 pl-4 text-right"><Badge level={f.riskLevel}>{f.riskLevel}</Badge></td>
                <td className="py-2.5 px-4 text-right text-gray-800 tabular-nums">{f.complexity}</td>
                <td className="py-2.5 pl-4 text-right text-gray-800 tabular-nums">{f.churn_rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <p className="text-center text-gray-400 py-8 text-sm">No files match your search.</p>
        )}
      </div>
    </div>
  )
}
