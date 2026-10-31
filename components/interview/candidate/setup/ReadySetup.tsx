'use client'

import { CheckCircle } from 'lucide-react'

interface ReadyStepProps {
  totalQuestions: number
  onStart: () => void
}

export function ReadyStep({ totalQuestions, onStart }: ReadyStepProps) {
  const reminders = [
    { icon: '🔒', text: 'Stay in this tab during the interview' },
    { icon: '🎤', text: 'Speak clearly and face the camera' },
    { icon: '📝', text: `${totalQuestions} questions to answer` },
  ]

  return (
    <div>
      <div className="relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 rounded-full border-2 border-success/30 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-success/20 border border-success/50 flex items-center justify-center">
          <CheckCircle className="text-success w-8 h-8" />
        </div>
      </div>

      <h2 className="font-display text-white text-2xl font-bold text-center mt-5">
        You&apos;re All Set!
      </h2>
      <p className="text-slate text-sm text-center">Camera and microphone are ready.</p>

      <div className="bg-white/5 rounded-xl p-4 mt-5 space-y-2.5">
        {reminders.map(r => (
          <p key={r.text} className="text-white/70 text-sm flex items-center gap-2.5">
            <span>{r.icon}</span>
            <span>{r.text}</span>
          </p>
        ))}
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-6 w-full h-14 rounded-xl font-display font-bold text-white text-base bg-success shadow-[0_0_20px_rgba(22,163,74,0.4)] hover:shadow-[0_0_28px_rgba(22,163,74,0.6)] transition-all"
      >
        ⚡ Start Interview
      </button>
    </div>
  )
}

export default ReadyStep