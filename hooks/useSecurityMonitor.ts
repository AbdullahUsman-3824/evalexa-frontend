'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const MAX_VIOLATIONS = 2
// A single tab switch fires both `visibilitychange` and `blur`.
// Ignore violations that arrive within this window so they count once.
const DEBOUNCE_MS = 1500

export function useSecurityMonitor(isActive: boolean) {
  const [violationCount, setViolationCount] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [isTerminated, setIsTerminated] = useState(false)
  const countRef = useRef(0)
  const lastViolationRef = useRef(0)
  const activeRef = useRef(isActive)

  useEffect(() => {
    activeRef.current = isActive
  }, [isActive])

  const logViolation = useCallback(() => {
    if (!activeRef.current || countRef.current >= MAX_VIOLATIONS) return

    const now = Date.now()
    if (now - lastViolationRef.current < DEBOUNCE_MS) return
    lastViolationRef.current = now

    const newCount = countRef.current + 1
    countRef.current = newCount
    setViolationCount(newCount)

    if (newCount >= MAX_VIOLATIONS) {
      setIsTerminated(true)
      setShowWarning(false)
    } else {
      setShowWarning(true)
    }
  }, [])

  useEffect(() => {
    if (!isActive) return

    const onVisibility = () => {
      if (document.hidden) logViolation()
    }
    const onBlur = () => logViolation()
    const onContextMenu = (e: Event) => e.preventDefault()

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('blur', onBlur)
    document.addEventListener('contextmenu', onContextMenu)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('contextmenu', onContextMenu)
    }
  }, [isActive, logViolation])

  const dismissWarning = useCallback(() => setShowWarning(false), [])

  return {
    violationCount,
    showWarning,
    isTerminated,
    dismissWarning,
  }
}