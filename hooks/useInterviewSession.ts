'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

export interface Answer {
  questionId: string
  blob: Blob
  skipped: boolean
  uploadStatus: 'pending' | 'uploading' | 'success' | 'failed'
}

const STORAGE_PREFIX = 'evalexa:interview-session'

/**
 * Clears any interview session data persisted in the browser.
 * Pass a token to clear just that interview, or call with no
 * arguments to clear every stored interview session.
 */
export function clearStoredInterviewSession(token?: string): void {
  if (typeof window === 'undefined') return

  const stores: Storage[] = []
  try {
    stores.push(window.sessionStorage, window.localStorage)
  } catch {
    return // storage unavailable (private mode, blocked, etc.)
  }

  for (const store of stores) {
    try {
      if (token) {
        store.removeItem(`${STORAGE_PREFIX}:${token}`)
      } else {
        Object.keys(store)
          .filter(key => key.startsWith(STORAGE_PREFIX))
          .forEach(key => store.removeItem(key))
      }
    } catch {
      // ignore storage errors
    }
  }
}

export function useInterviewSession(
  questions: { id: string; maxDurationSeconds: number }[]
) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [isNextCooling, setIsNextCooling] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const coolingRef = useRef(false)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearElapsed = useCallback(() => {
    if (elapsedRef.current) {
      clearInterval(elapsedRef.current)
      elapsedRef.current = null
    }
  }, [])

  const startSession = useCallback(() => {
    clearElapsed() // guards against double start (React Strict Mode)
    elapsedRef.current = setInterval(() => {
      setElapsed(s => s + 1)
    }, 1000)
  }, [clearElapsed])

  const stopSession = useCallback(() => clearElapsed(), [clearElapsed])

  const submitAndAdvance = useCallback(
    async (blob: Blob, skipped = false) => {
      if (coolingRef.current) return
      coolingRef.current = true
      setIsNextCooling(true)

      const questionId = questions[currentIndex].id

      setAnswers(prev => [
        ...prev.filter(a => a.questionId !== questionId),
        { questionId, blob, skipped, uploadStatus: 'uploading' },
      ])

      // Simulate async upload (replace with real API call later)
      timeoutsRef.current.push(
        setTimeout(() => {
          setAnswers(prev =>
            prev.map(a =>
              a.questionId === questionId ? { ...a, uploadStatus: 'success' } : a
            )
          )
        }, 1500)
      )

      if (currentIndex >= questions.length - 1) {
        clearElapsed()
        setIsCompleted(true)
      } else {
        setCurrentIndex(i => i + 1)
      }

      // 5s cooldown before the next submit is allowed
      timeoutsRef.current.push(
        setTimeout(() => {
          coolingRef.current = false
          setIsNextCooling(false)
        }, 5000)
      )
    },
    [currentIndex, questions, clearElapsed]
  )

  // Cleanup on unmount
  useEffect(() => {
    const timeouts = timeoutsRef
    return () => {
      clearElapsed()
      timeouts.current.forEach(clearTimeout)
      timeouts.current = []
    }
  }, [clearElapsed])

  const answeredCount = answers.filter(a => !a.skipped).length
  const skippedCount = answers.filter(a => a.skipped).length

  return {
    currentIndex,
    currentQuestion: questions[currentIndex],
    isCompleted,
    isNextCooling,
    elapsed,
    answers,
    answeredCount,
    skippedCount,
    startSession,
    stopSession,
    submitAndAdvance,
  }
}