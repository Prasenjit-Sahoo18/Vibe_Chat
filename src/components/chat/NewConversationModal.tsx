"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { Avatar } from "../common/Avatar";
import { Search, Users, UserCheck, MessageSquarePlus, Check } from "lucide-react";
import { User } from "@/lib/types";

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationCreated: (conv: any) => void;
}

export function NewConversationModal({
  isOpen,
  onClose,
  onConversationCreated,
}: NewConversationModalProps) {
  const [tab, setTab] = useState<"direct" | "group">("direct");
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [groupTitle, setGroupTitle] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => setUsers(data.users || []))
        .catch((err) => console.error(err));
    }
  }, [isOpen]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartDirectChat = async (targetUserId: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isGroup: false, targetUserId }),
      });
      if (res.ok) {
        const data = await res.json();
        onConversationCreated(data.conversation);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupTitle.trim() || selectedUserIds.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isGroup: true,
          title: groupTitle.trim(),
          description: groupDesc.trim(),
          memberIds: selectedUserIds,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onConversationCreated(data.conversation);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Conversation">
      {/* Tabs */}
      <div className="flex border-b border-slate-800 mb-4">
        <button
          onClick={() => setTab("direct")}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center transition-colors border-b-2 ${
            tab === "direct"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Direct Message
        </button>
        <button
          onClick={() => setTab("group")}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center transition-colors border-b-2 ${
            tab === "group"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Create Group
        </button>
      </div>

      {tab === "direct" ? (
        <div className="space-y-3">
          {/* Search input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search people by name or @username..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/40">
            {filteredUsers.map((u) => (
              <button
                key={u.id}
                disabled={isSubmitting}
                onClick={() => handleStartDirectChat(u.id)}
                className="w-full p-2.5 flex items-center justify-between hover:bg-slate-800/60 rounded-xl transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={u.avatarUrl} name={u.name} size="md" isOnline={u.isOnline} />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{u.name}</h4>
                    <p className="text-xs text-slate-400">@{u.username}</p>
                  </div>
                </div>
                <MessageSquarePlus className="w-4 h-4 text-indigo-400" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={groupTitle}
              onChange={(e) => setGroupTitle(e.target.value)}
              placeholder="e.g. ⚡ Product Hackers"
              required
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
              placeholder="Group topic or vibe..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Members ({selectedUserIds.length})
            </label>
            <div className="max-h-44 overflow-y-auto divide-y divide-slate-800/40 border border-slate-800 rounded-xl p-1 bg-slate-950">
              {users.map((u) => {
                const isSelected = selectedUserIds.includes(u.id);
                return (
                  <div
                    key={u.id}
                    onClick={() => toggleUserSelection(u.id)}
                    className="flex items-center justify-between p-2 hover:bg-slate-800/50 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar src={u.avatarUrl} name={u.name} size="sm" />
                      <span className="text-xs font-medium text-white">{u.name}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-500 text-white"
                          : "border-slate-700"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !groupTitle.trim() || selectedUserIds.length === 0}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md shadow-indigo-600/30 transition-all text-sm disabled:opacity-50"
          >
            {isSubmitting ? "Creating Group..." : "Create Group Chat"}
          </button>
        </form>
      )}
    </Modal>
  );
}
