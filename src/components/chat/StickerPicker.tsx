"use client";

import React, { useState } from "react";
import { DEMO_STICKER_PACKS } from "@/lib/constants";

interface StickerPickerProps {
  onSelectSticker: (sticker: { id: string; name: string; imageUrl: string }) => void;
  onClose: () => void;
}

export function StickerPicker({ onSelectSticker, onClose }: StickerPickerProps) {
  const [activePackId, setActivePackId] = useState(DEMO_STICKER_PACKS[0].id);

  const activePack =
    DEMO_STICKER_PACKS.find((p) => p.id === activePackId) || DEMO_STICKER_PACKS[0];

  return (
    <div className="absolute bottom-16 right-4 sm:right-12 z-50 w-72 sm:w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Vibe Stickers
        </span>
        <button
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-white transition-colors"
        >
          Close
        </button>
      </div>

      {/* Sticker pack selector tabs */}
      <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
        {DEMO_STICKER_PACKS.map((pack) => (
          <button
            key={pack.id}
            onClick={() => setActivePackId(pack.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all flex-shrink-0 ${
              activePackId === pack.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <span>{pack.thumbnail}</span>
            <span>{pack.name}</span>
          </button>
        ))}
      </div>

      {/* Stickers Grid */}
      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
        {activePack.stickers.map((st) => (
          <button
            key={st.id}
            onClick={() => {
              onSelectSticker(st);
              onClose();
            }}
            title={st.name}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800 hover:scale-110 border border-slate-800/80 transition-all text-2xl"
          >
            {st.imageUrl}
            <span className="text-[9px] text-slate-400 truncate w-full text-center mt-1">
              {st.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
