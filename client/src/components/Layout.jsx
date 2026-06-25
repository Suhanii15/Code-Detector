export function Layout({ children, onReset }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 flex flex-col">
      <children />
    </div>
  )
}
