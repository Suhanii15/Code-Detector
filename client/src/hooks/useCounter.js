import { useState, useEffect, useRef } from 'react'

export function useCounter(target, duration = 800) {
  const [value, setValue] = useState(target === 0 ? 0 : 0)
  const frame = useRef(null)

  useEffect(() => {
    if (frame.current) cancelAnimationFrame(frame.current)
    if (target === 0) {
      setValue(0)
      return
    }

    const start = performance.now()
    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      setValue(Math.round(progress * target))
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick)
      }
    }

    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [target, duration])

  return value
}
