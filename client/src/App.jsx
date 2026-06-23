import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold">Vite + React + Tailwind</h1>
      <button
        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition cursor-pointer text-lg font-medium"
        onClick={() => setCount((c) => c + 1)}
      >
        Count is {count}
      </button>
    </div>
  )
}

export default App
