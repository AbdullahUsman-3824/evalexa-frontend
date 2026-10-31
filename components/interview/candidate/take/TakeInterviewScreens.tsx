'use client'

import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { XCircle, X } from 'lucide-react'

import { useInterviewSession } from '@/hooks/useInterviewSession'
import { useQuestionTimer } from '@/hooks/useQuestionTimer'
import { useMediaRecorder } from '@/hooks/useMediaRecorder'
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor'
import type { InterviewQuestion } from '@/lib/mock-interview'

import { InterviewTopBar } from './InterviewTopBar'
import { QuestionCard } from './QuestionCard'
import { CameraPreview } from './CameraPreview'
import { SecurityWarningModal } from './SecurityWarningModal'
import { CompletionScreen } from './CompletionScreen'

interface TakeInterviewScreenProps {
  questions: InterviewQuestion[]
  candidateName: string
  /** Stream obtained in the Device step (owned/stopped by the setup screen). */
  stream: MediaStream | null
  jobTitle?: string
  company?: string
  /** Called once when the interview completes or is terminated (e.g. to stop camera). */
  onFinish?: () => void
}

export function TakeInterviewScreen({
  questions,
  candidateName,
  stream,
  jobTitle = 'Frontend Developer',
  company = 'TechCorp Inc.',
  onFinish,
}: TakeInterviewScreenProps) {
  const [showInfo, setShowInfo] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const session = useInterviewSession(questions)
  const recorder = useMediaRecorder(stream)
  const security = useSecurityMonitor(hasStarted && !session.isCompleted)

  const currentQ = questions[session.currentIndex]
  const maxSeconds = currentQ?.maxDurationSeconds ?? 120

  const { submitAndAdvance, startSession } = session
  const { startRecording, stopRecording } = recorder

  const advance = useCallback(
    async (skipped: boolean) => {
      timer.stop()
      const blob = await stopRecording()
      await submitAndAdvance(blob, skipped)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `timer` is declared below and its methods are stable
    [stopRecording, submitAndAdvance]
  )

  const timer = useQuestionTimer(maxSeconds, () => {
    void advance(false)
  })

  const { reset: resetTimer, start: startTimer, stop: stopTimer } = timer

  // Auto-start on mount
  useEffect(() => {
    setHasStarted(true)
  }, [])

  // Start session clock
  useEffect(() => {
    if (hasStarted) startSession()
  }, [hasStarted, startSession])

  // Start recording + timer whenever the question changes
  useEffect(() => {
    if (!hasStarted || session.isCompleted || !currentQ) return
    startRecording()
    resetTimer(maxSeconds)
    startTimer()
  }, [
    session.currentIndex,
    hasStarted,
    session.isCompleted,
    currentQ,
    maxSeconds,
    startRecording,
    resetTimer,
    startTimer,
  ])

  // Stop everything if terminated
  useEffect(() => {
    if (!security.isTerminated) return
    stopTimer()
    session.stopSession()
    void stopRecording()
  }, [security.isTerminated, stopTimer, stopRecording, session])

  // Notify parent when finished (so it can stop camera tracks)
  useEffect(() => {
    if (session.isCompleted || security.isTerminated) onFinish?.()
  }, [session.isCompleted, security.isTerminated, onFinish])

  if (security.isTerminated) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="font-display text-white text-2xl font-bold">Interview Terminated</h2>
          <p className="text-white/60 text-sm leading-relaxed mt-3">
            Your interview was ended due to multiple security violations. Your recorded answers
            have been saved. Please contact the recruiter for further assistance.
          </p>
          <div className="mt-4 text-white/20 text-xs">
            <span className="font-display font-bold text-white/30">Eval</span>
            <span className="font-display font-bold text-cyan/40">exa</span>
          </div>
        </div>
      </div>
    )
  }

  if (session.isCompleted) {
    return (
      <CompletionScreen
        candidateName={candidateName}
        totalQuestions={questions.length}
        answeredCount={session.answeredCount}
        skippedCount={session.skippedCount}
        elapsed={session.elapsed}
      />
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F172A] select-none">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, rgba(96,165,250,0.06) 0%, transparent 65%)`,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-7xl opacity-20 select-none"
          >
            🤖
          </motion.div>
          <p className="text-white/15 text-xs mt-2 tracking-widest uppercase">
            Virtual Interviewer
          </p>
        </div>
      </div>

      <InterviewTopBar
        elapsed={session.elapsed}
        isRecording={recorder.isRecording}
        questionIndex={session.currentIndex}
        totalQuestions={questions.length}
        onInfoClick={() => setShowInfo(p => !p)}
      />

      <AnimatePresence mode="wait">
        {currentQ && (
          <QuestionCard
            key={currentQ.id}
            question={currentQ}
            questionIndex={session.currentIndex}
            totalQuestions={questions.length}
            timer={timer}
            onNext={() => void advance(false)}
            onSkip={() => void advance(true)}
            isNextCooling={session.isNextCooling}
          />
        )}
      </AnimatePresence>

      <CameraPreview stream={stream} />

      <SecurityWarningModal
        isOpen={security.showWarning}
        violationCount={security.violationCount}
        onDismiss={security.dismissWarning}
      />

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed right-0 top-0 h-screen w-72 bg-[#111827] border-l border-white/10 z-30 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-white font-semibold">Interview Info</h3>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Position</p>
                <p className="text-white font-medium">{jobTitle}</p>
                <p className="text-slate text-xs">{company}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Progress</p>
                <div className="h-1.5 bg-white/10 rounded-full">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(session.currentIndex / questions.length) * 100}%` }}
                  />
                </div>
                <p className="text-white/40 text-xs mt-1">
                  Q{session.currentIndex + 1} of {questions.length}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TakeInterviewScreen