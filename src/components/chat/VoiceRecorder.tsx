"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, Send, Trash2, AlertCircle, Loader2 } from "lucide-react";

interface VoiceRecorderProps {
  onSend: (audioData: { fileUrl: string; duration: number }) => void;
  onCancel: () => void;
}

export function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
  const [seconds, setSeconds] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [barHeights, setBarHeights] = useState<number[]>([10, 15, 8, 20, 12, 25, 14, 18, 10, 22, 16, 12]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function initRecorder() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Your browser does not support audio recording.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        // Setup real-time audio analyzer for voice waveform
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            audioContextRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateWaveform = () => {
              if (!analyser || isCancelledRef.current) return;
              analyser.getByteFrequencyData(dataArray);

              // Take 12 sample points across frequency range
              const newBars: number[] = [];
              const step = Math.max(1, Math.floor(bufferLength / 12));
              for (let i = 0; i < 12; i++) {
                const val = dataArray[i * step] || 0;
                // Scale from 0-255 to 6px - 32px height
                const height = Math.max(6, Math.min(32, Math.round((val / 255) * 32)));
                newBars.push(height);
              }
              setBarHeights(newBars);
              animationFrameRef.current = requestAnimationFrame(updateWaveform);
            };

            updateWaveform();
          }
        } catch (e) {
          console.warn("AudioContext visualizer not supported, fallback active", e);
        }

        // Determine best supported MIME type
        const mimeType = [
          "audio/webm;codecs=opus",
          "audio/webm",
          "audio/ogg;codecs=opus",
          "audio/ogg",
          "audio/mp4",
        ].find((type) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) || "";

        const options = mimeType ? { mimeType } : undefined;
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        // Start recording
        mediaRecorder.start(100); // 100ms timeslices

        // Start timer
        timerRef.current = setInterval(() => {
          setSeconds((prev) => prev + 1);
        }, 1000);
      } catch (err: any) {
        console.error("Microphone access error:", err);
        if (isMounted) {
          setPermissionError(
            err.message || "Microphone access denied. Please allow microphone permissions in your browser."
          );
        }
      }
    }

    initRecorder();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const handleCancel = () => {
    isCancelledRef.current = true;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    cleanup();
    onCancel();
  };

  const handleSend = async () => {
    if (!mediaRecorderRef.current || isProcessing) return;

    setIsProcessing(true);
    const recordedDuration = Math.max(1, seconds);

    const mediaRecorder = mediaRecorderRef.current;

    // Trigger stop and handle completion
    mediaRecorder.onstop = async () => {
      if (isCancelledRef.current) return;

      try {
        const mimeType = mediaRecorder.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        if (audioBlob.size === 0) {
          throw new Error("Recorded audio is empty");
        }

        // Try uploading real recorded audio Blob to /api/upload
        let finalAudioUrl = "";
        try {
          const extension = mimeType.includes("mp4") ? "mp4" : mimeType.includes("ogg") ? "ogg" : "webm";
          const audioFile = new File([audioBlob], `voice_${Date.now()}.${extension}`, {
            type: mimeType,
          });

          const formData = new FormData();
          formData.append("file", audioFile);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (res.ok) {
            const uploadData = await res.json();
            finalAudioUrl = uploadData.fileUrl;
          }
        } catch (uploadErr) {
          console.warn("Upload endpoint failed, generating Data URL fallback", uploadErr);
        }

        // Fallback to Data URL if upload failed
        if (!finalAudioUrl) {
          finalAudioUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(audioBlob);
          });
        }

        cleanup();
        onSend({
          fileUrl: finalAudioUrl,
          duration: recordedDuration,
        });
      } catch (err) {
        console.error("Failed to process recorded audio:", err);
        cleanup();
        onCancel();
      }
    };

    if (mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (permissionError) {
    return (
      <div className="flex items-center justify-between w-full bg-slate-900 border border-rose-500/40 rounded-2xl px-4 py-2.5 shadow-lg animate-in fade-in duration-200">
        <div className="flex items-center gap-2 text-xs text-rose-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{permissionError}</span>
        </div>
        <button
          onClick={handleCancel}
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold ml-2 flex-shrink-0"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full bg-slate-900 border border-indigo-500/50 rounded-2xl px-4 py-2 shadow-lg animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        {/* Pulsing red record indicator */}
        <div className="relative flex items-center justify-center">
          <span className="w-3 h-3 bg-rose-500 rounded-full animate-ping absolute" />
          <span className="w-3 h-3 bg-rose-500 rounded-full relative" />
        </div>

        {/* Live timer */}
        <span className="font-mono text-sm font-bold text-slate-100">{formatTimer(seconds)}</span>

        {/* Real-time live audio waveform visualizer bars */}
        <div className="flex items-center gap-1 h-8 px-2">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full transition-all duration-75"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isProcessing}
          title="Discard Voice Note"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={isProcessing}
          title="Send Voice Note"
          className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105 disabled:opacity-50 flex items-center justify-center"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
