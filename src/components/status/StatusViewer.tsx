"use client";

import React, { useState, useEffect, useRef } from "react";
import { StatusItem } from "@/lib/types";
import { Avatar } from "../common/Avatar";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Music2,
  Volume2,
  VolumeX,
  Eye,
  Send,
  Heart,
  Flame,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface StatusViewerProps {
  statuses: StatusItem[];
  initialIndex?: number;
  onClose: () => void;
  onReply?: (statusId: string, replyText: string) => void;
  onReact?: (statusId: string, emoji: string) => void;
}

export function StatusViewer({
  statuses,
  initialIndex = 0,
  onClose,
  onReply,
  onReact,
}: StatusViewerProps) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showViewers, setShowViewers] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentStatus = statuses[currentIndex];
  const isMyStatus = currentStatus?.userId === user?.id;

  // Record view
  useEffect(() => {
    if (currentStatus) {
      fetch(`/api/status/${currentStatus.id}/view`, { method: "POST" }).catch(console.error);
    }
  }, [currentStatus]);

  // Audio track playback
  useEffect(() => {
    if (currentStatus?.music?.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(currentStatus.music.audioUrl);
      } else {
        audioRef.current.src = currentStatus.music.audioUrl;
      }
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(() => {});
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentIndex, isMuted, currentStatus]);

  // Pause / resume music when story is paused / resumed
  useEffect(() => {
    if (audioRef.current && currentStatus?.music?.audioUrl) {
      if (isPaused) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [isPaused, currentStatus]);

  // Segmented progress bar timer (5 seconds per story)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2; // updates every 100ms -> 5000ms total
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    if (currentIndex < statuses.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !onReply) return;
    onReply(currentStatus.id, replyText.trim());
    setReplyText("");
  };

  if (!currentStatus) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center select-none backdrop-blur-md">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Story Card Container */}
      <div
        className="relative w-full max-w-md h-[85vh] sm:h-[80vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background gradient or media */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            currentStatus.bgColor || "from-indigo-600 to-purple-800"
          }`}
        >
          {currentStatus.mediaUrl && (
            <img
              src={currentStatus.mediaUrl}
              alt="Status"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Story Header */}
        <div className="relative z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          {/* Segmented Progress Bars */}
          <div className="flex gap-1.5 mb-3">
            {statuses.map((_, i) => (
              <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width:
                      i < currentIndex ? "100%" : i === currentIndex ? `${progress}%` : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* User Info Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar
                src={currentStatus.user.avatarUrl}
                name={currentStatus.user.name}
                size="md"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{currentStatus.user.name}</h4>
                <span className="text-[11px] text-white/70">
                  {new Date(currentStatus.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Music Track Badge */}
            {currentStatus.music && (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs text-white">
                <Music2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="truncate max-w-[120px] font-medium">
                  {currentStatus.music.title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="p-1 hover:text-cyan-400 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Story Middle Content (Text / Caption) */}
        <div className="relative z-10 flex items-center justify-center p-6 text-center">
          {currentStatus.content && (
            <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed drop-shadow-md">
              {currentStatus.content}
            </p>
          )}
        </div>

        {/* Left & Right Tap Overlays */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-20 bottom-24 w-1/3 z-10 opacity-0 hover:opacity-100 flex items-center pl-2 text-white/40 transition-opacity"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-20 bottom-24 w-1/3 z-10 opacity-0 hover:opacity-100 flex items-center justify-end pr-2 text-white/40 transition-opacity"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Story Footer */}
        <div className="relative z-20 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          {isMyStatus ? (
            /* Viewers bar for author */
            <div className="flex items-center justify-between text-xs text-white/90">
              <button
                onClick={() => setShowViewers(!showViewers)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors font-semibold"
              >
                <Eye className="w-4 h-4" />
                <span>{currentStatus.views?.length || 0} Views</span>
              </button>
              <span>Expires in 24 hours</span>
            </div>
          ) : (
            /* Reply & Quick Reactions for viewer */
            <div className="space-y-3">
              {/* Quick Reactions */}
              <div className="flex items-center justify-around">
                {["🔥", "❤️", "😍", "😂", "🚀", "👏"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onReact && onReact(currentStatus.id, emoji)}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Reply Input */}
              <form onSubmit={handleSendReply} className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Reply to status..."
                  className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-full text-sm text-white placeholder-white/60 focus:outline-none focus:bg-white/30"
                />
                <button
                  type="submit"
                  className="p-2 rounded-full bg-white text-slate-950 font-bold hover:bg-white/90 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
