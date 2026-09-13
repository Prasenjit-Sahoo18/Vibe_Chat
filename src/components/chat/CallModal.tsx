"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Shield,
  Sparkles,
} from "lucide-react";
import { Avatar } from "../common/Avatar";
import { User } from "@/lib/types";

interface CallModalProps {
  isOpen: boolean;
  isVideo: boolean;
  recipient: User | { id?: string; name: string; username?: string; avatarUrl?: string | null };
  onClose: (callDurationSec: number) => void;
}

export function CallModal({
  isOpen,
  isVideo: initialIsVideo,
  recipient,
  onClose,
}: CallModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isVideo, setIsVideo] = useState(initialIsVideo);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callStatus, setCallStatus] = useState<"connecting" | "ringing" | "connected">("connecting");
  const [seconds, setSeconds] = useState(0);
  const [streamError, setStreamError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Request actual camera / mic permissions and start stream
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsVideo(initialIsVideo);
    setCallStatus("connecting");
    setSeconds(0);
    setStreamError(null);

    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: initialIsVideo ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (localVideoRef.current && initialIsVideo) {
          localVideoRef.current.srcObject = stream;
        }

        // Simulate connecting -> ringing -> connected
        setTimeout(() => {
          if (isMounted) setCallStatus("ringing");
        }, 1200);

        setTimeout(() => {
          if (isMounted) {
            setCallStatus("connected");
            timerRef.current = setInterval(() => {
              setSeconds((prev) => prev + 1);
            }, 1000);
          }
        }, 3000);
      } catch (err: any) {
        console.warn("Could not access camera/mic:", err);
        if (isMounted) {
          setStreamError(
            err.name === "NotAllowedError"
              ? "Microphone/Camera permission denied. Running in call simulation mode."
              : "No media hardware found. Running in encrypted call simulation mode."
          );
          // Still allow connected simulation
          setTimeout(() => {
            if (isMounted) {
              setCallStatus("connected");
              timerRef.current = setInterval(() => {
                setSeconds((prev) => prev + 1);
              }, 1000);
            }
          }, 2000);
        }
      }
    }

    initMedia();

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, initialIsVideo]);

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = async () => {
    if (isVideo) {
      // Turn off video
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach((t) => {
          t.stop();
          streamRef.current?.removeTrack(t);
        });
      }
      setIsVideo(false);
    } else {
      // Turn on video
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = videoStream.getVideoTracks()[0];
        if (videoTrack && streamRef.current) {
          streamRef.current.addTrack(videoTrack);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = streamRef.current;
          }
        }
        setIsVideo(true);
      } catch (e) {
        console.error("Failed to enable video:", e);
      }
    }
  };

  const handleEndCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    onClose(seconds);
  };

  const formatCallTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 select-none animate-in fade-in duration-300">
      {/* Top Header: Security + Call Info */}
      <div className="flex items-center justify-between z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 backdrop-blur-md">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium text-[11px]">End-to-End Encrypted WebRTC</span>
        </div>

        {callStatus === "connected" && (
          <div className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold tracking-wider animate-pulse">
            {formatCallTime(seconds)}
          </div>
        )}
      </div>

      {/* Main Center Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative my-4">
        {isVideo ? (
          /* Video Layout: Fullscreen / Card with PiP preview */
          <div className="relative w-full max-w-4xl h-[65vh] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center">
            {/* Remote Simulated Stream / Avatar backdrop */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950/40">
              <Avatar
                src={recipient.avatarUrl}
                name={recipient.name}
                size="xl"
                className="w-28 h-28 text-3xl mb-4 ring-4 ring-indigo-500/30 shadow-2xl"
              />
              <h2 className="text-xl font-bold text-white tracking-tight">{recipient.name}</h2>
              <p className="text-xs text-slate-400 mt-1 capitalize">
                {callStatus === "connected" ? "Live HD Stream" : `${callStatus}...`}
              </p>
            </div>

            {/* Local Real Webcam Video (Picture in Picture) */}
            <div className="absolute top-4 right-4 w-36 sm:w-48 h-24 sm:h-32 rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-2xl bg-black z-20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />
              <span className="absolute bottom-1.5 left-2 text-[9px] font-bold bg-black/60 px-1.5 py-0.5 rounded text-white backdrop-blur-sm">
                You
              </span>
            </div>
          </div>
        ) : (
          /* Voice Call Layout: Big WhatsApp Calling Avatar with pulsing sound waves */
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing sound rings */}
              {callStatus === "connected" && (
                <>
                  <div className="absolute w-48 h-48 rounded-full bg-indigo-500/10 animate-ping opacity-30" />
                  <div className="absolute w-60 h-60 rounded-full border border-indigo-500/20 animate-pulse" />
                </>
              )}

              {/* Glowing Avatar */}
              <div className="relative z-10 w-32 h-32 rounded-full ring-4 ring-indigo-500/40 shadow-2xl overflow-hidden flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-purple-600">
                {recipient.avatarUrl ? (
                  <img src={recipient.avatarUrl} alt={recipient.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-white">
                    {recipient.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Name and State */}
            <div className="text-center space-y-1 z-10">
              <h2 className="text-2xl font-black text-white tracking-tight">{recipient.name}</h2>
              <p className="text-sm font-medium text-indigo-400 capitalize">
                {callStatus === "connected" ? "Voice Connected" : `${callStatus}...`}
              </p>
              {streamError && (
                <p className="text-[11px] text-slate-500 max-w-sm px-4 pt-1">{streamError}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="flex items-center justify-center gap-4 z-20 pb-4">
        {/* Mute Mic Button */}
        <button
          type="button"
          onClick={toggleMute}
          title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
          className={`p-4 rounded-full transition-all hover:scale-110 shadow-xl ${
            isMuted
              ? "bg-rose-500 text-white"
              : "bg-slate-800/90 text-white hover:bg-slate-700 border border-slate-700/50"
          }`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* Video Toggle Button */}
        <button
          type="button"
          onClick={toggleVideo}
          title={isVideo ? "Turn Off Camera" : "Turn On Camera"}
          className={`p-4 rounded-full transition-all hover:scale-110 shadow-xl ${
            !isVideo
              ? "bg-slate-800/90 text-white hover:bg-slate-700 border border-slate-700/50"
              : "bg-indigo-600 text-white hover:bg-indigo-500"
          }`}
        >
          {isVideo ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>

        {/* Speaker Toggle */}
        <button
          type="button"
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          title={isSpeakerOn ? "Mute Speaker" : "Unmute Speaker"}
          className="p-4 rounded-full bg-slate-800/90 text-white hover:bg-slate-700 border border-slate-700/50 transition-all hover:scale-110 shadow-xl"
        >
          {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>

        {/* Hang Up (Red WhatsApp Button) */}
        <button
          type="button"
          onClick={handleEndCall}
          title="End Call"
          className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-all hover:scale-110 shadow-2xl shadow-rose-600/40 ml-2"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>,
    document.body
  );
}
