export function Navbar({ onReset }) {
  return (
    <header className="h-24 border-b border-gray-200 bg-white flex items-center px-4 gap-4 shrink-0">
      <button onClick={onReset} className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        </svg>
        <span className="font-semibold  text-lg tracking-tight">Code Detector</span>
      </button>
      <span className="text-sm text-gray-400 hidden sm:inline">Analyze GitHub repositories for bug-prone files</span>
    </header>
  )
}
