"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type DeviceCheckState =
  | "idle"
  | "checking"
  | "ready"
  | "error"
  | "denied"
  | "unsupported";

export type PermissionState =
  | "unknown"
  | "granted"
  | "denied"
  | "prompt"
  | "unsupported";

export function useDeviceCheck(options?: { autoStart?: boolean }) {
  const autoStart = options?.autoStart ?? true;

  const [status, setStatus] = useState<DeviceCheckState>("idle");
  const [permissionState, setPermissionState] =
    useState<PermissionState>("unknown");
  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopStream = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setStream(null);
    setCameraReady(false);
    setMicReady(false);
    setAudioLevel(0);
  }, []);

  const startAudioMonitoring = useCallback((mediaStream: MediaStream) => {
    const audioTrack = mediaStream.getAudioTracks()[0];

    if (!audioTrack || typeof window === "undefined") {
      setMicReady(false);
      return;
    }

    const AudioCtor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioCtor) {
      setMicReady(false);
      return;
    }

    const context = new AudioCtor();
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.85;

    const source = context.createMediaStreamSource(mediaStream);
    source.connect(analyser);

    audioContextRef.current = context;
    analyserRef.current = analyser;

    const tick = () => {
      if (!analyserRef.current) return;

      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(data);

      const average = data.reduce((sum, value) => sum + value, 0) / data.length;
      const normalized = average / 255;

      setAudioLevel(normalized);
      setMicReady(normalized > 0.06);

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
  }, []);

  const checkDevices = useCallback(async () => {
    if (typeof window === "undefined") {
      setStatus("unsupported");
      setPermissionState("unsupported");
      setErrorMessage("This experience is only available in the browser.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      setPermissionState("unsupported");
      setErrorMessage(
        "Your browser does not support camera and microphone access.",
      );
      return;
    }

    setIsChecking(true);
    setStatus("checking");
    setPermissionState("prompt");
    setErrorMessage(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setPermissionState("granted");
      setCameraReady(mediaStream.getVideoTracks().length > 0);
      startAudioMonitoring(mediaStream);

      mediaStream.getVideoTracks().forEach((track) => {
        track.addEventListener("ended", () => {
          setCameraReady(false);
          setStatus("error");
          setErrorMessage(
            "Your camera disconnected. Please reconnect it and try again.",
          );
        });
      });

      mediaStream.getAudioTracks().forEach((track) => {
        track.addEventListener("ended", () => {
          setMicReady(false);
          setStatus("error");
          setErrorMessage(
            "Your microphone disconnected. Please reconnect it and try again.",
          );
        });
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        void videoRef.current.play().catch(() => {
          // Ignore autoplay restrictions; the stream is still available for preview.
        });
      }

      setStatus("ready");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to access your camera and microphone.";

      const normalizedMessage = message.toLowerCase();
      const permissionDenied =
        normalizedMessage.includes("denied") ||
        normalizedMessage.includes("not allowed") ||
        normalizedMessage.includes("permission");

      setPermissionState(permissionDenied ? "denied" : "prompt");
      setStatus(permissionDenied ? "denied" : "error");
      setErrorMessage(
        permissionDenied
          ? "Camera and microphone access was blocked. Please allow access to continue."
          : "Unable to access your device. Please check your camera and microphone settings.",
      );
    } finally {
      setIsChecking(false);
    }
  }, [startAudioMonitoring]);

  useEffect(() => {
    if (!autoStart) return;
    void checkDevices();

    return () => {
      stopStream();
    };
  }, [autoStart, checkDevices, stopStream]);

  useEffect(() => {
    if (!videoRef.current || !stream) return;

    videoRef.current.srcObject = stream;
    videoRef.current.muted = true;
    videoRef.current.playsInline = true;
    void videoRef.current.play().catch(() => undefined);
  }, [stream]);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return {
    status,
    permissionState,
    cameraReady,
    micReady,
    audioLevel,
    errorMessage,
    isChecking,
    stream,
    videoRef,
    checkDevices,
    stopStream,
    isReady: cameraReady && micReady,
  };
}
