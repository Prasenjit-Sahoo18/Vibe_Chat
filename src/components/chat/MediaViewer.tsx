"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Download } from "lucide-react";
import { downloadFile } from "@/lib/download";

interface MediaViewerProps {
  mediaUrl: string | null;
  mediaType?: "image" | "video";
  fileName?: string;
  onClose: () => void;
}

export function MediaViewer({ mediaUrl, mediaType = "image", fileName = "media", onClose }: MediaViewerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mediaUrl || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top action bar */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
        <button
          type="button"
          onClick={() => downloadFile(mediaUrl, fileName)}
          className="p-2.5 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors"
          title="Download Media"
        >
          <Download className="w-5 h-5" />
        </button>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors"
          title="Close Viewer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-4xl max-h-[85vh] flex items-center justify-center">
        {mediaType === "video" ? (
          <video
            src={mediaUrl}
            controls
            autoPlay
            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-slate-800"
          />
        ) : (
          <img
            src={mediaUrl}
            alt={fileName}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-slate-800"
          />
        )}
      </div>
    </div>,
    document.body
  );
}

