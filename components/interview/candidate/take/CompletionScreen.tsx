'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface CompletionScreenProps {
  candidateName: string
  totalQuestions: number
  answeredCount: number
  skippedCount: number
  elapsed: number
}

function formatTime(seconds: number): string {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

export function CompletionScreen({
  candidateName,
  answeredCount,
  skippedCount,
  elapsed,
}: CompletionScreenProps) {
  const stats = [
    { value: String(answeredCount), label: 'Answered' },
    { value: String(skippedCount), label: 'Skipped' },
    { value: formatTime(elapsed), label: 'Duration' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#0a0e1a] flex flex-col items-center justify-center px-4 text-center">
      <motion.svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          className="stroke-green-500"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <motion.path
          d="M 30 50 L 44 64 L 70 36"
          className="stroke-green-500"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </motion.svg>

      <h1 className="font-display text-white text-3xl font-bold mt-6">Interview Complete!</h1>
      <p className="text-slate text-base mt-2">Thank you, {candidateName}.</p>

      <div className="bg-white/[0.08] border border-white/10 rounded-2xl p-6 mt-8 max-w-xs w-full grid grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.label}>
            <p className="font-display text-white text-2xl font-bold">{s.value}</p>
            <p className="text-slate text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div className="flex items-center">
          <Sparkles className="text-cyan w-5 h-5 animate-pulse" />
          <span className="text-white/70 text-sm ml-2">AI is analyzing your responses...</span>
        </div>
        <p className="text-slate text-xs mt-1">
          Results will be available to the recruiter shortly.
        </p>
      </div>

      <div className="mt-10">
        <span className="text-white text-sm font-display font-bold">Eval</span>
        <span className="text-cyan text-sm font-display font-bold">exa</span>
      </div>
    </div>
  )
}

export default CompletionScreen