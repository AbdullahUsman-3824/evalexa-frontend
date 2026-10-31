'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

interface PINStepProps {
  pin: string
  onPinChange: (pin: string) => void
  error: string
  attempts: number
  isVerifying: boolean
  onVerify: () => void
}

const LENGTH = 6
const MAX_ATTEMPTS = 3

export function PINStep({
  pin,
  onPinChange,
  error,
  attempts,
  isVerifying,
  onVerify,
}: PINStepProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  // Derived from the prop: no local state to keep in sync
  const digits = Array.from({ length: LENGTH }, (_, i) => pin[i] ?? '')

  // Focus-only effect (touches the DOM, no setState)
  useEffect(() => {
    if (pin === '') inputsRef.current[0]?.focus()
  }, [pin])

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)

    if (!digit) {
      // Cleared a box: keep the PIN contiguous by truncating at this index
      onPinChange(pin.slice(0, index))
      return
    }

    onPinChange(pin.slice(0, index) + digit + pin.slice(index + 1))
    if (index < LENGTH - 1) inputsRef.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      e.preventDefault()
      onPinChange(pin.slice(0, index - 1))
      inputsRef.current[index - 1]?.focus()
    } else if (e.key === 'Enter' && pin.length === LENGTH && attempts < MAX_ATTEMPTS) {
      onVerify()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH)
    if (!pasted) return
    onPinChange(pasted)
    inputsRef.current[Math.min(pasted.length, LENGTH - 1)]?.focus()
  }

  return (
    <div>
      <Lock className="text-cyan w-10 h-10 mx-auto mb-4" />
      <h2 className="font-display text-white text-2xl text-center font-bold">Enter Your PIN</h2>
      <p className="text-slate text-sm text-center mt-1">
        Check your email for the 6-digit PIN
      </p>

      <div className="mt-6 flex justify-center gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => {
              inputsRef.current[i] = el
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={d}
            disabled={attempts >= MAX_ATTEMPTS}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            aria-label={`PIN digit ${i + 1}`}
            className="w-12 h-14 bg-white/5 border border-white/20 rounded-xl text-center text-white text-xl font-mono focus:border-primary focus:bg-white/10 focus:outline-none transition disabled:opacity-50"
          />
        ))}
      </div>

      {error && (
        <motion.p
          key={error + attempts}
          animate={{ x: [0, -8, 8, -6, 6, 0] }}
          transition={{ duration: 0.4 }}
          className="text-red-400 text-sm text-center mt-3"
        >
          {error}
        </motion.p>
      )}

      <button
        type="button"
        onClick={onVerify}
        disabled={pin.length < LENGTH || attempts >= MAX_ATTEMPTS || isVerifying}
        className="mt-5 w-full h-11 bg-primary rounded-xl text-white font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isVerifying ? 'Verifying...' : 'Verify PIN'}
      </button>
    </div>
  )
}

export default PINStep