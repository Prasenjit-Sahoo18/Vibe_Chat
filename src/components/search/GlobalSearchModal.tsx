"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { Avatar } from "../common/Avatar";
import { Search, MessageSquare, Users, FileText, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation?: (convId: string) => void;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  onSelectConversation,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "users" | "messages" | "media">("all");
  const [results, setResults] = useState<{
    users: any[];
    messages: any[];
    media: any[];
  }>({ users: [], messages: [], media: [] });
  const [isSearching, setIsSearching] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults({ users: [], messages: [], media: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&filter=${filter}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filter]);

  const handleSelectUser = async (targetUserId: string) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isGroup: false, targetUserId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (onSelectConversation) {
          onSelectConversation(data.conversation.id);
        } else {
          router.push(`/chat?id=${data.conversation.id}`);
        }
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Global Search" maxWidth="max-w-xl">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, messages, files..."
            autoFocus
            className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(["all", "users", "messages", "media"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
          {isSearching && (
            <div className="text-center py-6 text-xs text-slate-400">Searching VibeChat...</div>
          )}

          {!isSearching && query.trim() && results.users.length === 0 && results.messages.length === 0 && results.media.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-500">
              No results found matching "{query}"
            </div>
          )}

          {/* People Results */}
          {results.users.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                People
              </span>
              <div className="space-y-1">
                {results.users.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => handleSelectUser(u.id)}
                    className="p-2.5 rounded-xl hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar src={u.avatarUrl} name={u.name} size="sm" isOnline={u.isOnline} />
                      <div>
                        <h4 className="text-sm font-semibold text-white">{u.name}</h4>
                        <p className="text-xs text-slate-400">@{u.username}</p>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-400 font-medium">Chat</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Results */}
          {results.messages.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Messages
              </span>
              <div className="space-y-1.5">
                {results.messages.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (onSelectConversation) onSelectConversation(m.conversationId);
                      else router.push(`/chat?id=${m.conversationId}`);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-semibold text-indigo-400">{m.sender.name}</span>
                      <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-2">{m.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
