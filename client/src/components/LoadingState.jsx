import { motion } from 'framer-motion'

const spinTransition = { repeat: Infinity, duration: 0.8, ease: 'linear' }

export function LoadingState() {
  return (
    <div className="flex items-center justify-center">
      <motion.svg
        className="h-5 w-5 text-blue-600"
        viewBox="0 0 24 24"
        fill="none"
        animate={{ rotate: 360 }}
        transition={spinTransition}
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </motion.svg>
    </div>
  )
}
