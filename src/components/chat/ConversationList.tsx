"use client";

import React, { useState } from "react";
import { Conversation } from "@/lib/types";
import { Avatar } from "../common/Avatar";
import { UnreadBadge } from "../common/Badge";
import { Search, Plus, Users, Image as ImageIcon, Mic, CreditCard, FileText } from "lucide-react";
import { useSocket } from "@/context/SocketContext";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conv: Conversation) => void;
  onNewChat: () => void;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onNewChat,
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { typingUsers } = useSocket();

  const filtered = conversations.filter((c) => {
    const titleMatch = (c.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const memberMatch = c.members.some((m) =>
      m.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return titleMatch || memberMatch;
  });

  const formatTime = (dateString?: string | Date) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const renderLastMessageSnippet = (conv: Conversation) => {
    const isTyping = (typingUsers[conv.id] || []).length > 0;
    if (isTyping) {
      return (
        <span className="text-cyan-400 font-medium flex items-center gap-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
          Typing...
        </span>
      );
    }

    const msg = conv.lastMessage;
    if (!msg) return <span className="text-slate-500 italic">No messages yet</span>;

    if (msg.type === "payment") {
      return (
        <span className="text-emerald-400 flex items-center gap-1 font-medium">
          <CreditCard className="w-3.5 h-3.5" />
          {msg.content || "Payment transferred"}
        </span>
      );
    }

    if (msg.type === "image") {
      return (
        <span className="text-slate-300 flex items-center gap-1">
          <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> Photo
        </span>
      );
    }

    if (msg.type === "voice" || msg.type === "audio") {
      return (
        <span className="text-slate-300 flex items-center gap-1">
          <Mic className="w-3.5 h-3.5 text-purple-400" /> Voice message
        </span>
      );
    }

    if (msg.type === "document") {
      return (
        <span className="text-slate-300 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-amber-400" /> Shared document
        </span>
      );
    }

    return (
      <span className="text-slate-400 truncate">
        {msg.sender ? `${msg.sender.name.split(" ")[0]}: ` : ""}
        {msg.content}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border-r border-slate-800/80 w-full md:w-80 lg:w-96 flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Messages
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
            {conversations.length}
          </span>
        </h2>
        <button
          onClick={onNewChat}
          title="New Conversation"
          className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-105 flex items-center gap-1 text-xs font-medium"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-slate-800/40">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/20">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 h-64">
            <Users className="w-10 h-10 mb-2 opacity-40 text-indigo-400" />
            <p className="text-sm font-medium">No conversations found</p>
            <p className="text-xs text-slate-500 mt-1">
              Start a new chat to connect with your friends
            </p>
          </div>
        ) : (
          filtered.map((conv) => {
            const isSelected = selectedId === conv.id;
            const otherMember = conv.members.find((m) => !conv.isGroup && m.user);
            const isOnline = !conv.isGroup && otherMember ? otherMember.user.isOnline : false;

            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                  isSelected
                    ? "bg-indigo-600/15 border-l-4 border-indigo-500"
                    : "hover:bg-slate-800/40 border-l-4 border-transparent"
                }`}
              >
                <Avatar
                  src={conv.avatarUrl}
                  name={conv.title || "Chat"}
                  size="md"
                  isOnline={!conv.isGroup ? isOnline : undefined}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`text-sm font-semibold truncate ${
                        isSelected ? "text-indigo-300" : "text-white"
                      }`}
                    >
                      {conv.title || "Direct Conversation"}
                    </h3>
                    <span className="text-[11px] text-slate-400 flex-shrink-0">
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="truncate pr-2">{renderLastMessageSnippet(conv)}</div>
                    {conv.unreadCount !== undefined && conv.unreadCount > 0 && (
                      <UnreadBadge count={conv.unreadCount} />
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
