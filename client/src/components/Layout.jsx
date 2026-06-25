export function Layout({ children, onReset }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-700 flex flex-col">
      <children />
    </div>
  )
}
