'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { MOCK_INTERVIEW } from '@/lib/mock-interview'
import { TakeInterviewScreen } from '@/components/interview/candidate/take/TakeInterviewScreens'
import { WelcomeStep } from './WelcomeSetup'
import { PINStep } from './PinSetup'
import { DeviceStep, type DeviceStatus } from './DeviceSetup'
import { ReadyStep } from './ReadySetup'

type Step = 'welcome' | 'pin' | 'device' | 'start'

interface InterviewSetupScreenProps {
  token: string
}

const STEPS: { key: Step; label: string }[] = [
  { key: 'welcome', label: 'Welcome' },
  { key: 'pin', label: 'PIN' },
  { key: 'device', label: 'Device' },
  { key: 'start', label: 'Ready' },
]

const CORRECT_PIN = '482916' // hardcoded for now
const MAX_ATTEMPTS = 3

const INITIAL_STATUS: DeviceStatus = {
  cameraPermission: 'pending',
  cameraWorking: 'pending',
  micPermission: 'pending',
  micWorking: 'pending',
}

export function InterviewSetupScreen({ token }: InterviewSetupScreenProps) {
  void token // TODO: use token to fetch the real interview

  const [step, setStep] = useState<Step>('welcome')
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [pinAttempts, setPinAttempts] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [deviceStream, setDeviceStream] = useState<MediaStream | null>(null)
  const [deviceReady, setDeviceReady] = useState(false)
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>(INITIAL_STATUS)
  const [deviceError, setDeviceError] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [started, setStarted] = useState(false)

  const streamRef = useRef<MediaStream | null>(null)
  const verifyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { job, candidate, questions } = MOCK_INTERVIEW

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
  }, [])

  // Stop tracks / clear timers on unmount
  useEffect(() => {
    return () => {
      stopStream()
      if (verifyTimeoutRef.current) clearTimeout(verifyTimeoutRef.current)
    }
  }, [stopStream])

  const handleVerifyPin = () => {
    if (pin.length < 6 || pinAttempts >= MAX_ATTEMPTS || isVerifying) return
    setIsVerifying(true)

    verifyTimeoutRef.current = setTimeout(() => {
      setIsVerifying(false)
      if (pin === CORRECT_PIN) {
        setPinError('')
        setStep('device')
        return
      }
      const attempts = pinAttempts + 1
      setPinAttempts(attempts)
      if (attempts >= MAX_ATTEMPTS) {
        setPinError('Too many attempts. Contact recruiter.')
      } else {
        const left = MAX_ATTEMPTS - attempts
        setPinError(`Wrong PIN. ${left} ${left === 1 ? 'attempt' : 'attempts'} left.`)
        setPin('')
      }
    }, 800)
  }

  const handleCheckDevices = async () => {
    setIsChecking(true)
    setDeviceError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream
      setDeviceStream(stream)

      const videoTrack = stream.getVideoTracks()[0]
      const audioTrack = stream.getAudioTracks()[0]
      const camOk = !!videoTrack && videoTrack.readyState === 'live' && videoTrack.enabled
      const micOk = !!audioTrack && audioTrack.readyState === 'live' && audioTrack.enabled

      setDeviceStatus({
        cameraPermission: videoTrack ? 'ok' : 'fail',
        cameraWorking: camOk ? 'ok' : 'fail',
        micPermission: audioTrack ? 'ok' : 'fail',
        micWorking: micOk ? 'ok' : 'fail',
      })
      setDeviceReady(camOk && micOk)
      if (!camOk || !micOk) {
        setDeviceError('We could not detect a working camera and microphone.')
      }
    } catch {
      setDeviceStatus({
        cameraPermission: 'fail',
        cameraWorking: 'fail',
        micPermission: 'fail',
        micWorking: 'fail',
      })
      setDeviceReady(false)
      setDeviceError(
        'Permission denied. Please allow camera and microphone access in your browser, then try again.'
      )
    } finally {
      setIsChecking(false)
    }
  }

  if (started) {
    return (
      <TakeInterviewScreen
        questions={questions}
        candidateName={candidate.name}
        stream={deviceStream}
        jobTitle={job.title}
        company={job.company}
        onFinish={stopStream}
      />
    )
  }

  const currentIdx = STEPS.findIndex(s => s.key === step)

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center py-12 px-4 font-sans">
      {/* Logo */}
      <div>
        <span className="text-white font-display font-bold text-xl">Eval</span>
        <span className="text-cyan font-display font-bold text-xl">exa</span>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mt-5" aria-label="Progress">
        {STEPS.map((s, i) => {
          const state = i < currentIdx ? 'done' : i === currentIdx ? 'active' : 'pending'
          return (
            <div key={s.key} className="flex items-center">
              <div
                title={s.label}
                className={
                  state === 'active'
                    ? 'bg-primary w-6 h-2 rounded-full'
                    : state === 'done'
                    ? 'bg-success w-2 h-2 rounded-full'
                    : 'bg-white/20 w-2 h-2 rounded-full'
                }
              />
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-white/15 mx-1" />}
            </div>
          )
        })}
      </div>

      {/* Card */}
      <div className="mt-8 w-full max-w-lg bg-[#111827] rounded-2xl border border-white/10 p-8 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {step === 'welcome' && (
              <WelcomeStep
                candidateName={candidate.name}
                jobTitle={job.title}
                company={job.company}
                totalQuestions={questions.length}
                onContinue={() => setStep('pin')}
              />
            )}

            {step === 'pin' && (
              <PINStep
                pin={pin}
                onPinChange={setPin}
                error={pinError}
                attempts={pinAttempts}
                isVerifying={isVerifying}
                onVerify={handleVerifyPin}
              />
            )}

            {step === 'device' && (
              <DeviceStep
                stream={deviceStream}
                status={deviceStatus}
                deviceReady={deviceReady}
                error={deviceError}
                isChecking={isChecking}
                onCheck={handleCheckDevices}
                onContinue={() => setStep('start')}
              />
            )}

            {step === 'start' && (
              <ReadyStep totalQuestions={questions.length} onStart={() => setStarted(true)} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default InterviewSetupScreen