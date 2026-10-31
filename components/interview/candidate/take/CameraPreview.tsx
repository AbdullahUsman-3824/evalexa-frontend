'use client'

import { useRef, useEffect } from 'react'
import { Camera } from 'lucide-react'

interface CameraPreviewProps {
  stream: MediaStream | null
}

export function CameraPreview({ stream }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video && stream) {
      video.srcObject = stream
    }
    return () => {
      if (video) video.srcObject = null
    }
  }, [stream])

  return (
    <div className="fixed bottom-6 right-6 z-20">
      <div className="w-40 h-32 relative">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full rounded-xl object-cover border-2 border-white/20 shadow-xl"
            style={{ transform: 'scaleX(-1)' }}
          />
        ) : (
          <div className="w-full h-full bg-gray-800/80 rounded-xl border-2 border-white/10 flex items-center justify-center">
            <Camera className="text-gray-500 w-8 h-8" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-1 text-center mt-1.5">
        <Camera className="text-white/30 w-3 h-3" />
        <span className="text-white/30 text-xs">You</span>
      </div>
    </div>
  )
}

export default CameraPreview