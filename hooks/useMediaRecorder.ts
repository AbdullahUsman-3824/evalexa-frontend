'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export function useMediaRecorder(stream: MediaStream | null) {
  const [isRecording, setIsRecording] = useState(false)
  const mrRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(() => {
    if (!stream || typeof MediaRecorder === 'undefined') return

    // Make sure a previous recorder is not still running
    if (mrRef.current && mrRef.current.state !== 'inactive') {
      mrRef.current.stop()
    }

    chunksRef.current = []
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm'

    const mr = new MediaRecorder(stream, { mimeType })
    mr.ondataavailable = (e: BlobEvent) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    mrRef.current = mr
    mr.start(1000)
    setIsRecording(true)
  }, [stream])

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise<Blob>(resolve => {
      const mr = mrRef.current
      if (!mr || mr.state === 'inactive') {
        setIsRecording(false)
        resolve(new Blob(chunksRef.current, { type: 'video/webm' }))
        return
      }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        setIsRecording(false)
        resolve(blob)
      }
      mr.stop()
    })
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const mr = mrRef.current
      if (mr && mr.state !== 'inactive') mr.stop()
    }
  }, [])

  return { isRecording, startRecording, stopRecording }
}