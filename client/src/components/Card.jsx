export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-lg border border-gray-800 bg-gray-900/60 ${className}`}>
      {children}
    </div>
  )
}
