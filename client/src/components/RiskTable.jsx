import { useState, useMemo } from 'react'
import { Badge } from './Badge'
import { RISK_COLORS } from '../utils/constants'

function formatRiskScore(score) {
  return (score * 100).toFixed(0)
}

const LEVELS = ['high', 'medium', 'low']

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

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <span className="text-gray-700 ml-1">&#8597;</span>
    return <span className="text-blue-400 ml-1">{sortDir === 'asc' ? '&#8593;' : '&#8595;'}</span>
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-blue-500/50"
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
                    : 'bg-gray-800/60 border-gray-700 text-gray-500 hover:text-gray-300'
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
            <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
              <th className="text-left py-2 pr-4 font-medium">File</th>
              <th className="text-right py-2 px-4 font-medium cursor-pointer select-none" onClick={() => toggleSort('riskScore')}>
                Risk Score <SortIcon col="riskScore" />
              </th>
              <th className="text-right py-2 pl-4 font-medium cursor-pointer select-none" onClick={() => toggleSort('riskLevel')}>
                Level <SortIcon col="riskLevel" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((f) => (
              <tr
                key={f.path}
                className={`border-b border-gray-800/60 hover:bg-gray-800/40 cursor-pointer transition-colors ${selectedPath === f.path ? 'bg-blue-950/20' : ''}`}
                onClick={() => onSelect?.(f)}
              >
                <td className="py-2.5 pr-4 text-gray-300 font-mono text-xs truncate max-w-[400px]">{f.path}</td>
                <td className="py-2.5 px-4 text-right text-gray-200 tabular-nums">{formatRiskScore(f.riskScore)}%</td>
                <td className="py-2.5 pl-4 text-right"><Badge level={f.riskLevel}>{f.riskLevel}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <p className="text-center text-gray-600 py-8 text-sm">No files match your search.</p>
        )}
      </div>
    </div>
  )
}
