'use client'

import { useEffect, useRef } from 'react'
import { Camera, Mic, CheckCircle, XCircle } from 'lucide-react'

export type CheckStatus = 'pending' | 'ok' | 'fail'

export interface DeviceStatus {
  cameraPermission: CheckStatus
  cameraWorking: CheckStatus
  micPermission: CheckStatus
  micWorking: CheckStatus
}

interface DeviceStepProps {
  stream: MediaStream | null
  status: DeviceStatus
  deviceReady: boolean
  error: string
  isChecking: boolean
  onCheck: () => void
  onContinue: () => void
}

function StatusIcon({ status }: { status: CheckStatus }) {
  if (status === 'ok') return <span className="text-success text-sm">✓</span>
  if (status === 'fail') return <span className="text-red-400 text-sm">✗</span>
  return <span className="text-white/30 text-sm">○</span>
}

export function DeviceStep({
  stream,
  status,
  deviceReady,
  error,
  isChecking,
  onCheck,
  onContinue,
}: DeviceStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video && stream) video.srcObject = stream
    return () => {
      if (video) video.srcObject = null
    }
  }, [stream])

  const items: { label: string; icon: typeof Camera; status: CheckStatus }[] = [
    { label: 'Camera Permission', icon: Camera, status: status.cameraPermission },
    { label: 'Camera Working', icon: Camera, status: status.cameraWorking },
    { label: 'Mic Permission', icon: Mic, status: status.micPermission },
    { label: 'Mic Working', icon: Mic, status: status.micWorking },
  ]

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* LEFT */}
      <div className="md:w-1/2">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-44 rounded-xl border-2 border-white/10 bg-gray-900 object-cover scale-x-[-1]"
          />
        ) : (
          <div className="w-full h-44 rounded-xl border-2 border-white/10 bg-gray-900 flex items-center justify-center">
            <Camera className="text-gray-500 w-10 h-10" />
          </div>
        )}
        <p className="text-white/40 text-xs text-center mt-2">Camera Preview</p>
      </div>

      {/* RIGHT */}
      <div className="md:w-1/2 md:pl-4">
        <h2 className="font-display text-white font-bold text-lg">Device Setup</h2>
        <p className="text-slate text-sm">Allow access to proceed</p>

        <ul className="mt-4 space-y-3">
          {items.map(({ label, icon: Icon, status: s }) => (
            <li key={label} className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Icon className="text-white/60 w-3.5 h-3.5" />
              </span>
              <span className="text-white/80 text-sm flex-1">{label}</span>
              <StatusIcon status={s} />
            </li>
          ))}
        </ul>

        {error && <p className="text-red-400 text-xs mt-3">{error}</p>}

        {!deviceReady && (
          <button
            type="button"
            onClick={onCheck}
            disabled={isChecking}
            className="mt-4 w-full bg-primary rounded-xl h-10 text-white text-sm hover:bg-primary/90 transition disabled:opacity-50"
          >
            {isChecking ? 'Checking...' : 'Check Camera & Microphone'}
          </button>
        )}

        {deviceReady && (
          <>
            <p className="text-success text-sm mt-4 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> All devices ready
            </p>
            <button
              type="button"
              onClick={onContinue}
              className="bg-success rounded-xl w-full h-11 text-white mt-3 hover:brightness-110 transition"
            >
              Continue to Interview →
            </button>
          </>
        )}

        {!deviceReady && status.cameraPermission === 'fail' && (
          <XCircle className="hidden" aria-hidden />
        )}
      </div>
    </div>
  )
}

export default DeviceStep