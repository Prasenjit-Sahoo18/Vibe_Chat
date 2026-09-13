"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/navigation/Sidebar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { NewConversationModal } from "@/components/chat/NewConversationModal";
import { NotificationDrawer } from "@/components/notifications/NotificationDrawer";
import { GlobalSearchModal } from "@/components/search/GlobalSearchModal";
import { Conversation } from "@/lib/types";
import { MessageSquare, Sparkles, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

function ChatContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load conversations
  const loadConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        const list: Conversation[] = data.conversations || [];
        setConversations(list);

        // If URL has ?id=xxx or select first conversation if on desktop
        const targetId = searchParams.get("id");
        if (targetId) {
          const found = list.find((c) => c.id === targetId);
          if (found) setSelectedConversation(found);
        } else if (!selectedConversation && list.length > 0 && window.innerWidth >= 768) {
          setSelectedConversation(list[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (user) {
      loadConversations();
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => setUnreadCount(data.unreadCount || 0))
        .catch(console.error);
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-white text-xl">
              V
            </div>
          </div>
          <span className="text-sm font-medium">Entering VibeChat...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Left Sidebar Navigation */}
      <Sidebar
        unreadNotificationCount={unreadCount}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
      />

      {/* Main Conversation Layout */}
      <main className="flex flex-1 h-full overflow-hidden pb-16 md:pb-0">
        {/* Conversation List Drawer (hidden on mobile if chat is active) */}
        <div
          className={`${
            selectedConversation ? "hidden md:flex" : "flex"
          } w-full md:w-auto h-full`}
        >
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversation?.id}
            onSelect={(conv) => setSelectedConversation(conv)}
            onNewChat={() => setIsNewChatModalOpen(true)}
          />
        </div>

        {/* Selected Chat Window or Empty State */}
        <div
          className={`${
            !selectedConversation ? "hidden md:flex" : "flex"
          } flex-1 h-full`}
        >
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              onBack={() => setSelectedConversation(null)}
              onRefreshConversations={loadConversations}
            />
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 h-full p-8 text-center bg-slate-950/40">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 shadow-xl">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Your VibeChat Conversations</h2>
              <p className="text-sm text-slate-400 max-w-sm mt-2">
                Select an existing conversation or start a new direct chat or group to experience real-time messaging, attachments, and peer payments.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setIsNewChatModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-90 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
                >
                  Start New Chat
                </button>
                <Link
                  href="/status"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-colors flex items-center gap-1.5"
                >
                  <span>Explore Stories</span>
                  <ArrowRight className="w-4 h-4 text-indigo-400" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Modals & Drawers */}
      <NewConversationModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onConversationCreated={(newConv) => {
          loadConversations();
          setSelectedConversation(newConv);
        }}
      />

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onNotificationsChanged={() => setUnreadCount(0)}
      />

      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectConversation={(convId) => {
          const found = conversations.find((c) => c.id === convId);
          if (found) setSelectedConversation(found);
          else loadConversations();
        }}
      />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading VibeChat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
