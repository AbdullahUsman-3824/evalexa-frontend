'use client'

import { Check, AlertTriangle } from 'lucide-react'

interface WelcomeStepProps {
  candidateName: string
  jobTitle: string
  company: string
  totalQuestions: number
  onContinue: () => void
}

const RULES = [
  'Audio and video will be recorded',
  'Face the camera, speak clearly',
  'Do not switch tabs or windows',
  'Complete device setup before starting',
  'Each question has a time limit',
  'Skip goes to next; you cannot return',
]

export function WelcomeStep({
  candidateName,
  jobTitle,
  company,
  totalQuestions,
  onContinue,
}: WelcomeStepProps) {
  const stats = [
    { value: String(totalQuestions), label: 'Questions' },
    { value: '~15 min', label: 'Est. Time' },
    { value: '3 days', label: 'Deadline' },
  ]

  return (
    <div>
      <div className="text-4xl text-center mb-4">🤖</div>
      <h1 className="font-display text-white text-2xl font-bold text-center">
        Welcome, {candidateName}!
      </h1>
      <div className="flex justify-center mt-2">
        <span className="bg-cyan/15 text-cyan text-xs px-3 py-1 rounded-full border border-cyan/30">
          AI Video Interview
        </span>
      </div>
      <p className="text-white/60 text-center text-sm mt-1">
        {jobTitle} at {company}
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-white font-semibold">{s.value}</p>
            <p className="text-slate text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <p className="text-white text-sm font-semibold mb-2">Before you begin</p>
        <ul className="space-y-1.5">
          {RULES.map(rule => (
            <li key={rule} className="flex items-start gap-2">
              <Check className="text-cyan w-4 h-4 shrink-0 mt-px" />
              <span className="text-slate text-xs">{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center gap-2">
        <AlertTriangle className="text-amber-400 w-4 h-4 shrink-0" />
        <span className="text-amber-300 text-xs">Your audio and video will be recorded.</span>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-6 w-full h-12 bg-primary rounded-xl font-display font-semibold text-white hover:bg-primary/90 transition"
      >
        I Understand — Continue
      </button>
    </div>
  )
}

export default WelcomeStep