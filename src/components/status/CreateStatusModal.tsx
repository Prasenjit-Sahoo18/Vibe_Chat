"use client";

import React, { useState, useRef } from "react";
import { Modal } from "../common/Modal";
import { STATUS_GRADIENTS, ROYALTY_FREE_TRACKS } from "@/lib/constants";
import { Music2, Play, Pause, Image as ImageIcon, Send, Sparkles } from "lucide-react";

interface CreateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusCreated: () => void;
}

export function CreateStatusModal({
  isOpen,
  onClose,
  onStatusCreated,
}: CreateStatusModalProps) {
  const [content, setContent] = useState("");
  const [selectedGradient, setSelectedGradient] = useState(STATUS_GRADIENTS[0]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [previewTrackId, setPreviewTrackId] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  const handleTogglePreviewAudio = (trackId: string, audioUrl: string) => {
    if (previewTrackId === trackId) {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      setPreviewTrackId(null);
    } else {
      if (!audioPreviewRef.current) {
        audioPreviewRef.current = new Audio(audioUrl);
      } else {
        audioPreviewRef.current.src = audioUrl;
      }
      audioPreviewRef.current.play().catch(() => {});
      setPreviewTrackId(trackId);
      audioPreviewRef.current.onended = () => setPreviewTrackId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          bgColor: selectedGradient,
          mediaUrl,
          mediaType: mediaUrl ? "image" : "text",
          musicTrackId: selectedTrackId,
        }),
      });

      if (res.ok) {
        if (audioPreviewRef.current) audioPreviewRef.current.pause();
        onStatusCreated();
        onClose();
      }
    } catch (err) {
      console.error("Status creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create 24h Status" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Live Preview Card */}
        <div
          className={`relative w-full h-48 rounded-2xl bg-gradient-to-br ${selectedGradient} p-4 flex flex-col justify-between text-white shadow-xl`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full self-start">
            Live Preview
          </span>

          <div className="text-center font-bold text-lg drop-shadow-md px-4 truncate">
            {content || "Your vibe message appears here..."}
          </div>

          {selectedTrackId && (
            <div className="self-end flex items-center gap-1.5 text-xs bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              <Music2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>
                {ROYALTY_FREE_TRACKS.find((t) => t.id === selectedTrackId)?.title}
              </span>
            </div>
          )}
        </div>

        {/* Text Input */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Status Message
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening? Share a moment, thought, or quote..."
            rows={3}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Gradient Color Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Background Vibe
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {STATUS_GRADIENTS.map((grad, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedGradient(grad)}
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad} flex-shrink-0 transition-transform ${
                  selectedGradient === grad
                    ? "ring-2 ring-white scale-110 shadow-lg"
                    : "opacity-70 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Music Track Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Add Soundtrack (Royalty-Free)</span>
            {selectedTrackId && (
              <button
                type="button"
                onClick={() => setSelectedTrackId(null)}
                className="text-[10px] text-slate-400 hover:text-rose-400"
              >
                Remove Track
              </button>
            )}
          </label>

          <div className="space-y-1.5 max-h-40 overflow-y-auto border border-slate-800 rounded-xl p-1 bg-slate-950">
            {ROYALTY_FREE_TRACKS.map((track) => {
              const isSelected = selectedTrackId === track.id;
              const isPlaying = previewTrackId === track.id;

              return (
                <div
                  key={track.id}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                    isSelected ? "bg-indigo-600/20 border border-indigo-500/40" : "hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleTogglePreviewAudio(track.id, track.audioUrl)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{track.title}</p>
                      <p className="text-[10px] text-slate-400">{track.artist} • {track.genre}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedTrackId(isSelected ? null : track.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 text-slate-300 hover:text-white"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || (!content.trim() && !mediaUrl)}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Publishing Vibe...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Share to My Status</span>
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}
