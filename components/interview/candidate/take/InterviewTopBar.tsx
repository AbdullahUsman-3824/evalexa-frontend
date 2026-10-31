'use client'

import { Clock, Info } from 'lucide-react'

interface InterviewTopBarProps {
  elapsed: number
  isRecording: boolean
  questionIndex: number
  totalQuestions: number
  onInfoClick: () => void
}

function formatTime(seconds: number): string {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

export function InterviewTopBar({
  elapsed,
  isRecording,
  questionIndex,
  totalQuestions,
  onInfoClick,
}: InterviewTopBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-20 bg-transparent px-6 py-4 flex items-center justify-between">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <Clock className="text-white/60 w-4 h-4" />
        <span className="text-white/70 text-sm font-mono">{formatTime(elapsed)}</span>
        <span className="text-white/30 text-sm">·</span>
        <span className="text-white/50 text-sm">
          Q{questionIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* CENTER */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
        {isRecording && (
          <>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-mono tracking-widest ml-1.5">REC</span>
          </>
        )}
      </div>

      {/* RIGHT */}
      <button
        type="button"
        onClick={onInfoClick}
        aria-label="Interview info"
        className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition"
      >
        <Info className="text-white w-4 h-4" />
      </button>
    </div>
  )
}

export default InterviewTopBar