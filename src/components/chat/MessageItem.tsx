"use client";

import React, { useState, useRef, useEffect } from "react";
import { Message } from "@/lib/types";
import { Avatar } from "../common/Avatar";
import { PaymentCard } from "./PaymentCard";
import {
  Check,
  CheckCheck,
  Clock,
  MoreVertical,
  Reply,
  Smile,
  Trash2,
  Edit2,
  FileText,
  Download,
  Play,
  Pause,
} from "lucide-react";
import { downloadFile } from "@/lib/download";

interface MessageItemProps {
  message: Message;
  isMe: boolean;
  isGroup?: boolean;
  onReact: (messageId: string, emoji: string) => void;
  onReply: (message: Message) => void;
  onDelete: (messageId: string) => void;
  onOpenMedia: (url: string, type: "image" | "video", fileName?: string) => void;
}

export function MessageItem({
  message,
  isMe,
  isGroup,
  onReact,
  onReply,
  onDelete,
  onOpenMedia,
}: MessageItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showReactTray, setShowReactTray] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(
    message.attachments?.[0]?.duration || 0
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const quickEmojis = ["❤️", "🔥", "👍", "😂", "🚀", "🎉"];

  const formatTime = (date?: string | Date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatAudioTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const renderStatusTicks = () => {
    if (!isMe) return null;
    if (message.status === "sending") {
      return <Clock className="w-3 h-3 text-slate-400" />;
    }
    if (message.status === "sent") {
      return <Check className="w-3.5 h-3.5 text-slate-400" />;
    }
    return <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />;
  };

  const handleAudioPlay = (audioUrl: string) => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current.play().catch((err) => {
          console.error("Audio playback error:", err);
          setIsPlayingAudio(false);
        });
        setIsPlayingAudio(true);
      }
      return;
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setTotalDuration(audio.duration);
      }
    };

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };

    audio.onended = () => {
      setIsPlayingAudio(false);
      setAudioProgress(0);
      setCurrentTime(0);
    };

    audio.onpause = () => {
      setIsPlayingAudio(false);
    };

    audio.onplay = () => {
      setIsPlayingAudio(true);
    };

    audio.play().catch((err) => {
      console.error("Audio playback error:", err);
      setIsPlayingAudio(false);
    });
    setIsPlayingAudio(true);
  };

  const handleAudioSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    audioRef.current.currentTime = pct * audioRef.current.duration;
    setAudioProgress(pct * 100);
    setCurrentTime(audioRef.current.currentTime);
  };

  return (
    <div
      className={`group relative flex gap-2.5 my-1.5 px-4 ${
        isMe ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Sender Avatar (for incoming in group chat) */}
      {!isMe && isGroup && (
        <Avatar
          src={message.sender?.avatarUrl}
          name={message.sender?.name || "User"}
          size="sm"
          className="mt-1"
        />
      )}

      {/* Message Bubble Container */}
      <div className={`relative max-w-[85%] sm:max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
        {/* Sender Name in group */}
        {!isMe && isGroup && message.sender && (
          <span className="text-[11px] font-semibold text-indigo-400 ml-1 mb-0.5">
            {message.sender.name}
          </span>
        )}

        {/* Quoted reply if exists */}
        {message.replyTo && (
          <div
            className={`mb-1 p-2 rounded-xl text-xs border-l-2 max-w-full truncate ${
              isMe
                ? "bg-indigo-900/40 border-indigo-400 text-indigo-200"
                : "bg-slate-800/80 border-purple-400 text-slate-300"
            }`}
          >
            <span className="font-semibold block text-[10px] opacity-80">
              {message.replyTo.senderName}
            </span>
            <span className="truncate">{message.replyTo.content || "Media"}</span>
          </div>
        )}

        {/* Payment Message Card */}
        {message.type === "payment" && message.payment ? (
          <PaymentCard payment={message.payment} isMeSender={isMe} />
        ) : message.type === "sticker" ? (
          /* Sticker representation */
          <div className="text-6xl p-2 select-none hover:scale-110 transition-transform">
            {message.content}
          </div>
        ) : (
          /* Normal Bubble */
          <div
            className={`relative rounded-2xl px-4 py-2.5 text-sm shadow-md transition-all ${
              isMe
                ? "bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white rounded-br-none"
                : "bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/50"
            }`}
          >
            {/* Image attachment */}
            {message.type === "image" && message.attachments?.[0] && (
              <div className="mb-2 overflow-hidden rounded-xl relative group/img">
                <img
                  src={message.attachments[0].fileUrl}
                  alt={message.attachments[0].fileName}
                  onClick={() =>
                    onOpenMedia(message.attachments![0].fileUrl, "image", message.attachments![0].fileName)
                  }
                  className="max-h-60 rounded-xl object-cover hover:scale-105 transition-transform cursor-pointer"
                />
                {/* 1-Click Download button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadFile(message.attachments![0].fileUrl, message.attachments![0].fileName);
                  }}
                  title="Download Image"
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg backdrop-blur-sm"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Video attachment */}
            {message.type === "video" && message.attachments?.[0] && (
              <div className="mb-2 overflow-hidden rounded-xl relative group/vid">
                <video
                  src={message.attachments[0].fileUrl}
                  controls
                  className="max-h-60 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => downloadFile(message.attachments![0].fileUrl, message.attachments![0].fileName)}
                  title="Download Video"
                  className="mt-1 flex items-center gap-1.5 text-[11px] text-white/80 hover:text-white bg-black/40 hover:bg-black/60 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Video</span>
                </button>
              </div>
            )}

            {/* Audio / Song / Voice message player */}
            {(message.type === "voice" || message.type === "audio") && message.attachments?.[0] && (
              <div className="py-1 min-w-[220px] sm:min-w-[260px] space-y-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleAudioPlay(message.attachments![0].fileUrl)}
                    title={isPlayingAudio ? "Pause Audio" : "Play Audio"}
                    className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-105 shadow-sm flex-shrink-0"
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-4 h-4 fill-white text-white" />
                    ) : (
                      <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    {/* Song / voice note filename */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <p className="text-xs font-semibold text-white truncate">
                        {message.attachments[0].fileName || (message.type === "voice" ? "Voice Note" : "Audio Track")}
                      </p>
                      <button
                        type="button"
                        onClick={() => downloadFile(message.attachments![0].fileUrl, message.attachments![0].fileName)}
                        title="Download Audio"
                        className="text-white/70 hover:text-white p-0.5 rounded transition-colors flex-shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Interactive seekable progress bar */}
                    <div
                      onClick={handleAudioSeek}
                      className="h-2 bg-white/20 hover:bg-white/30 rounded-full overflow-hidden cursor-pointer relative transition-all"
                      title="Click to seek"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-indigo-300 rounded-full transition-all duration-75"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>

                    {/* Elapsed & total duration */}
                    <div className="flex justify-between items-center text-[10px] text-white/70 mt-1">
                      <span>{formatAudioTime(currentTime)}</span>
                      <span>{formatAudioTime(totalDuration || message.attachments[0].duration || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Document attachment */}
            {message.type === "document" && message.attachments?.[0] && (
              <div className="flex items-center gap-3 p-2.5 bg-black/25 rounded-xl mb-1 border border-white/10">
                <FileText className="w-8 h-8 text-amber-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate text-white">{message.attachments[0].fileName}</p>
                  <span className="text-[10px] text-slate-300">
                    {Math.round(message.attachments[0].fileSize / 1024)} KB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => downloadFile(message.attachments![0].fileUrl, message.attachments![0].fileName)}
                  title="Download File"
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Message Text Content */}
            {message.content && (
              <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
            )}

            {/* Timestamp & Status ticks */}
            <div
              className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                isMe ? "text-indigo-200" : "text-slate-400"
              }`}
            >
              {message.isEdited && <span className="italic mr-1">edited</span>}
              <span>{formatTime(message.createdAt)}</span>
              {renderStatusTicks()}
            </div>
          </div>
        )}

        {/* Reactions bubble row */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 px-1">
            {message.reactions.map((r) => (
              <button
                key={r.id}
                onClick={() => onReact(message.id, r.emoji)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-white hover:scale-110 transition-transform shadow-sm"
              >
                <span>{r.emoji}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Hover Action Menu */}
      <div
        className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 self-center ${
          isMe ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <button
          onClick={() => setShowReactTray(!showReactTray)}
          title="React"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Smile className="w-4 h-4" />
        </button>

        <button
          onClick={() => onReply(message)}
          title="Reply"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Reply className="w-4 h-4" />
        </button>

        {isMe && (
          <button
            onClick={() => onDelete(message.id)}
            title="Delete"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Emoji Reaction Popover Tray */}
      {showReactTray && (
        <div
          className={`absolute z-30 -top-8 ${
            isMe ? "right-16" : "left-16"
          } flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-full px-2 py-1 shadow-2xl animate-in fade-in zoom-in-95 duration-150`}
        >
          {quickEmojis.map((e) => (
            <button
              key={e}
              onClick={() => {
                onReact(message.id, e);
                setShowReactTray(false);
              }}
              className="p-1 hover:scale-125 transition-transform text-sm"
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
