'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export function useQuestionTimer(maxSeconds: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(maxSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const remainingRef = useRef(maxSeconds)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onExpireRef.current = onExpire
  })

  const start = useCallback(() => setIsRunning(true), [])
  const stop = useCallback(() => setIsRunning(false), [])

  const reset = useCallback((newMax: number) => {
    remainingRef.current = newMax
    setRemaining(newMax)
    setIsRunning(false)
  }, [])

  // Tick + expiry both live in the interval callback (no setState in the effect body)
  useEffect(() => {
    if (!isRunning) return

    const id = setInterval(() => {
      const next = Math.max(remainingRef.current - 1, 0)
      remainingRef.current = next
      setRemaining(next)

      if (next === 0) {
        clearInterval(id)
        setIsRunning(false)
        onExpireRef.current()
      }
    }, 1000)

    return () => clearInterval(id)
  }, [isRunning])

  const formattedTime = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(
    remaining % 60
  ).padStart(2, '0')}`

  const isWarning = remaining <= 10 && remaining > 0

  const colorClass =
    remaining <= 5 ? 'text-red-400' : remaining <= 10 ? 'text-amber-400' : 'text-white'

  const animClass =
    remaining <= 5
      ? 'animate-[pulse_0.4s_ease-in-out_infinite]'
      : remaining <= 10
      ? 'animate-[pulse_0.8s_ease-in-out_infinite]'
      : ''

  return {
    remaining,
    formattedTime,
    isWarning,
    colorClass,
    animClass,
    start,
    stop,
    reset,
  }
}