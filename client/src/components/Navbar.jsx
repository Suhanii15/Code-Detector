export function Navbar({ onReset }) {
  return (
    <header className="h-12 border-b border-gray-800 bg-gray-950 flex items-center px-4 gap-4 shrink-0">
      <button onClick={onReset} className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition-colors">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
        </svg>
        <span className="font-semibold text-sm tracking-tight">Code Detector</span>
      </button>
      <span className="text-xs text-gray-600 hidden sm:inline">Analyze GitHub repositories for bug-prone files</span>
    </header>
  )
}
