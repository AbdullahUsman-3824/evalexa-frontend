'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface SecurityWarningModalProps {
  isOpen: boolean
  violationCount: number
  onDismiss: () => void
}

export function SecurityWarningModal({
  isOpen,
  violationCount,
  onDismiss,
}: SecurityWarningModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1a1a2e] border border-amber-500/50 rounded-2xl p-7 max-w-sm w-full mx-4 text-center"
          >
            <AlertTriangle className="text-amber-400 w-10 h-10 mx-auto mb-4" />

            <h2 className="font-display text-amber-400 text-xl font-bold">Security Warning</h2>

            <p className="text-white/60 text-sm mt-1">Violation {violationCount} of 2</p>

            <p className="text-white/70 text-sm mt-3 leading-relaxed">
              Leaving the interview tab or exiting fullscreen is not allowed. A second violation
              will automatically terminate your interview.
            </p>

            <p className="text-red-400 text-xs font-semibold mt-3">
              ⚠ One more violation will end your interview.
            </p>

            <button
              type="button"
              onClick={onDismiss}
              className="mt-5 w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold h-11 rounded-xl transition"
            >
              I Understand — Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SecurityWarningModal