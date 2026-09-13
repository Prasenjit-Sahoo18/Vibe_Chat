"use client";

import React, { useState, useRef } from "react";
import {
  Send,
  Paperclip,
  Smile,
  Sticker as StickerIcon,
  Mic,
  CreditCard,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { VoiceRecorder } from "./VoiceRecorder";
import { StickerPicker } from "./StickerPicker";
import { PaymentModal } from "./PaymentModal";
import { User } from "@/lib/types";

interface ChatComposerProps {
  conversationId: string;
  recipient?: User | null;
  onSendMessage: (data: {
    content?: string;
    type?: string;
    attachments?: any[];
    replyToId?: string;
    paymentId?: string;
  }) => Promise<void>;
  onTyping: (isTyping: boolean) => void;
  replyToMessage?: any | null;
  onCancelReply?: () => void;
}

export function ChatComposer({
  conversationId,
  recipient,
  onSendMessage,
  onTyping,
  replyToMessage,
  onCancelReply,
}: ChatComposerProps) {
  const [text, setText] = useState("");
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const commonEmojis = ["❤️", "🔥", "😂", "👍", "🚀", "🎉", "😍", "✨", "💯", "🙌"];

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    onTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 2000);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() && !replyToMessage) return;

    const messageText = text.trim();
    setText("");
    onTyping(false);

    await onSendMessage({
      content: messageText,
      type: "text",
      replyToId: replyToMessage?.id,
    });

    if (onCancelReply) onCancelReply();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      let type = "document";
      if (file.type.startsWith("image/")) type = "image";
      else if (file.type.startsWith("video/")) type = "video";
      else if (file.type.startsWith("audio/")) type = "audio";

      await onSendMessage({
        content: file.name,
        type,
        attachments: [
          {
            fileUrl: data.fileUrl,
            fileName: data.fileName,
            fileType: data.fileType,
            fileSize: data.fileSize,
          },
        ],
      });
    } catch (err) {
      console.error("File upload error:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSendVoice = async (audioData: { fileUrl: string; duration: number }) => {
    setIsRecordingVoice(false);
    await onSendMessage({
      content: "Voice Message",
      type: "voice",
      attachments: [
        {
          fileUrl: audioData.fileUrl,
          fileName: `voice_note_${Date.now()}.mp3`,
          fileType: "audio/mp3",
          fileSize: 48000,
          duration: audioData.duration,
        },
      ],
    });
  };

  const handleSelectSticker = async (sticker: { name: string; imageUrl: string }) => {
    await onSendMessage({
      content: sticker.imageUrl,
      type: "sticker",
    });
  };

  return (
    <div className="relative border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md p-3">
      {/* Reply Banner */}
      {replyToMessage && (
        <div className="flex items-center justify-between px-3 py-2 mb-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="text-indigo-400 font-semibold">Replying to {replyToMessage.sender?.name || "User"}:</span>
            <span className="text-slate-300 truncate">{replyToMessage.content}</span>
          </div>
          <button onClick={onCancelReply} className="text-slate-400 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Voice Recorder active view */}
      {isRecordingVoice ? (
        <VoiceRecorder onSend={handleSendVoice} onCancel={() => setIsRecordingVoice(false)} />
      ) : (
        <div className="flex items-center gap-2">
          {/* Action buttons (Attachment, Emoji, Sticker, Payment) */}
          <div className="flex items-center gap-1">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Attach File or Media"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors disabled:opacity-50"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="Insert Emoji"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setShowStickers(!showStickers)}
              title="Stickers"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors"
            >
              <StickerIcon className="w-5 h-5" />
            </button>

            {/* Payment Button */}
            {recipient && (
              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                title="Send Payment"
                className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-xl transition-colors"
              >
                <CreditCard className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Text input */}
          <form onSubmit={handleSend} className="flex-1 flex items-center">
            <input
              type="text"
              value={text}
              onChange={handleTextChange}
              placeholder="Type a message or vibe..."
              className="w-full py-2.5 px-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </form>

          {/* Right Action: Send or Mic */}
          {text.trim() ? (
            <button
              onClick={() => handleSend()}
              className="p-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsRecordingVoice(true)}
              title="Hold to record voice message"
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Emoji Quick Tray */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 z-50 p-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
          {commonEmojis.map((e) => (
            <button
              key={e}
              onClick={() => {
                setText((prev) => prev + e);
                setShowEmojiPicker(false);
              }}
              className="p-1.5 text-lg hover:scale-125 transition-transform"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Sticker Picker */}
      {showStickers && (
        <StickerPicker
          onSelectSticker={handleSelectSticker}
          onClose={() => setShowStickers(false)}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && recipient && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          recipient={recipient}
          conversationId={conversationId}
          onPaymentSuccess={() => {
            // refresh
          }}
        />
      )}
    </div>
  );
}
