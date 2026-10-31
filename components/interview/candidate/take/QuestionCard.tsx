'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

interface QuestionCardProps {
  question: {
    id: string
    questionText: string
    skill: string
    category: string
    maxDurationSeconds: number
  }
  questionIndex: number
  totalQuestions: number
  timer: { formattedTime: string; colorClass: string; animClass: string }
  onNext: () => void
  onSkip: () => void
  isNextCooling: boolean
}

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  timer,
  onNext,
  onSkip,
  isNextCooling,
}: QuestionCardProps) {
  const isLast = questionIndex >= totalQuestions - 1

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-2xl"
      >
        {/* Question number badge */}
        <div className="absolute -top-3.5 left-6 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-mono text-sm font-bold text-white shadow-lg shadow-primary/40 z-10">
          Q{questionIndex + 1}
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-2xl px-8 py-7 shadow-2xl">
          {/* Top row */}
          <div className="flex items-center justify-between mb-5">
            <span className="bg-white/10 text-white/60 text-xs px-3 py-1 rounded-full border border-white/10">
              {question.category}
            </span>

            <div className="flex items-center gap-1.5">
              <Clock className={`${timer.colorClass} w-3.5 h-3.5`} />
              <span className={`${timer.colorClass} ${timer.animClass} font-mono text-sm`}>
                {timer.formattedTime}
              </span>
            </div>
          </div>

          {/* Question text */}
          <p className="font-display text-white text-lg leading-relaxed font-medium min-h-[80px]">
            {question.questionText}
          </p>

          {/* Skill tag */}
          <p className="mt-3 text-cyan text-xs">#{question.skill}</p>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onSkip}
              disabled={isNextCooling}
              className="bg-white/10 hover:bg-white/15 text-white/60 text-sm px-5 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={isNextCooling}
              className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isNextCooling ? 'Saving...' : isLast ? 'Submit' : 'Next →'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default QuestionCard