"use client";

import React, { useState, useEffect, useRef } from "react";
import { Conversation, Message, User } from "@/lib/types";
import { Avatar } from "../common/Avatar";
import { MessageItem } from "./MessageItem";
import { ChatComposer } from "./ChatComposer";
import { MediaViewer } from "./MediaViewer";
import {
  Phone,
  Video,
  Search,
  MoreVertical,
  ArrowLeft,
  Info,
  Shield,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { SOCKET_EVENTS } from "@/lib/socket/events";

interface ChatWindowProps {
  conversation: Conversation;
  onBack?: () => void;
  onRefreshConversations?: () => void;
}

export function ChatWindow({
  conversation,
  onBack,
  onRefreshConversations,
}: ChatWindowProps) {
  const { user } = useAuth();
  const { socket, typingUsers, sendTyping, broadcastMessage, broadcastReaction } = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState<Message | null>(null);
  const [activeMedia, setActiveMedia] = useState<{
    url: string;
    type: "image" | "video";
    fileName?: string;
  } | null>(null);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [callNotice, setCallNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherMember = conversation.members.find((m) => m.userId !== user?.id)?.user;
  const isTyping = (typingUsers[conversation.id] || []).length > 0;

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Fetch messages
  useEffect(() => {
    let isMounted = true;
    async function loadMessages() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/conversations/${conversation.id}/messages`);
        if (res.ok && isMounted) {
          const data = await res.json();
          setMessages(data.messages || []);
          setTimeout(() => scrollToBottom("auto"), 100);
        }
      } catch (err) {
        console.error("Error loading messages:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadMessages();

    // Join room via socket
    if (socket) {
      socket.emit(SOCKET_EVENTS.CONVERSATION_JOIN, { conversationId: conversation.id });
    }

    return () => {
      isMounted = false;
      if (socket) {
        socket.emit(SOCKET_EVENTS.CONVERSATION_LEAVE, { conversationId: conversation.id });
      }
    };
  }, [conversation.id, socket]);

  // Listen for socket real-time messages & reactions
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: { conversationId: string; message: Message }) => {
      if (data.conversationId === conversation.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
        scrollToBottom();
      }
    };

    const handleReaction = (data: {
      conversationId: string;
      messageId: string;
      userId: string;
      emoji: string;
    }) => {
      if (data.conversationId === conversation.id) {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === data.messageId) {
              const reactions = m.reactions || [];
              const exists = reactions.find((r) => r.userId === data.userId && r.emoji === data.emoji);
              if (exists) {
                return {
                  ...m,
                  reactions: reactions.filter((r) => r.id !== exists.id),
                };
              } else {
                return {
                  ...m,
                  reactions: [
                    ...reactions,
                    {
                      id: `temp_${Date.now()}`,
                      messageId: m.id,
                      userId: data.userId,
                      emoji: data.emoji,
                      createdAt: new Date(),
                    },
                  ],
                };
              }
            }
            return m;
          })
        );
      }
    };

    socket.on(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
    socket.on(SOCKET_EVENTS.MESSAGE_REACTION, handleReaction);

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
      socket.off(SOCKET_EVENTS.MESSAGE_REACTION, handleReaction);
    };
  }, [socket, conversation.id]);

  const handleSendMessage = async (payload: {
    content?: string;
    type?: string;
    attachments?: any[];
    replyToId?: string;
    paymentId?: string;
  }) => {
    if (!user) return;

    try {
      const res = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const createdMsg = data.message;
        setMessages((prev) => [...prev, createdMsg]);
        broadcastMessage(conversation.id, createdMsg);
        scrollToBottom();
        if (onRefreshConversations) onRefreshConversations();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleReact = async (messageId: string, emoji: string) => {
    try {
      const res = await fetch(`/api/messages/${messageId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });

      if (res.ok) {
        broadcastReaction(conversation.id, messageId, emoji);
        // Local state optimistic update
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === messageId) {
              const reactions = m.reactions || [];
              const exists = reactions.find((r) => r.userId === user?.id && r.emoji === emoji);
              if (exists) {
                return {
                  ...m,
                  reactions: reactions.filter((r) => r.id !== exists.id),
                };
              } else {
                return {
                  ...m,
                  reactions: [
                    ...reactions,
                    {
                      id: `temp_${Date.now()}`,
                      messageId,
                      userId: user!.id,
                      emoji,
                      createdAt: new Date(),
                    },
                  ],
                };
              }
            }
            return m;
          })
        );
      }
    } catch (err) {
      console.error("Reaction failed:", err);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const res = await fetch(`/api/messages/${messageId}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-slate-950/40 relative">
      <div className="flex flex-col flex-1 h-full min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 z-20">
          <div className="flex items-center gap-3 min-w-0">
            {onBack && (
              <button
                onClick={onBack}
                className="md:hidden p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <Avatar
              src={conversation.avatarUrl}
              name={conversation.title || "Chat"}
              size="md"
              isOnline={!conversation.isGroup ? otherMember?.isOnline : undefined}
            />

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                {conversation.title || otherMember?.name || "Direct Chat"}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {isTyping ? (
                  <span className="text-cyan-400 font-medium animate-pulse">typing...</span>
                ) : conversation.isGroup ? (
                  `${conversation.members.length} members`
                ) : otherMember?.isOnline ? (
                  <span className="text-emerald-400">Online</span>
                ) : (
                  "Offline"
                )}
              </p>
            </div>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setCallNotice("Voice call initiated. Connecting encrypted peer line...");
                setTimeout(() => setCallNotice(null), 4000);
              }}
              title="Voice Call"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setCallNotice("Starting HD Video Call room...");
                setTimeout(() => setCallNotice(null), 4000);
              }}
              title="Video Call"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Video className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowDetailsDrawer(!showDetailsDrawer)}
              title="Conversation Details"
              className={`p-2 rounded-xl transition-colors ${
                showDetailsDrawer ? "text-indigo-400 bg-indigo-500/10" : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Call simulation notice toast */}
        {callNotice && (
          <div className="bg-indigo-600/90 text-white text-xs py-2 px-4 text-center animate-in slide-in-from-top duration-200">
            {callNotice}
          </div>
        )}

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
              Loading conversation history...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white">End-to-end Protected Channel</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Messages, shared files, voice notes and peer payments are safely delivered.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageItem
                key={msg.id}
                message={msg}
                isMe={msg.senderId === user?.id}
                isGroup={conversation.isGroup}
                onReact={handleReact}
                onReply={(m) => setReplyMessage(m)}
                onDelete={handleDeleteMessage}
                onOpenMedia={(url, type, fileName) =>
                  setActiveMedia({ url, type, fileName })
                }
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <ChatComposer
          conversationId={conversation.id}
          recipient={!conversation.isGroup ? otherMember : null}
          onSendMessage={handleSendMessage}
          onTyping={(typing) => sendTyping(conversation.id, typing)}
          replyToMessage={replyMessage}
          onCancelReply={() => setReplyMessage(null)}
        />
      </div>

      {/* Right Details Drawer */}
      {showDetailsDrawer && (
        <div className="w-72 lg:w-80 bg-slate-900 border-l border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-right duration-200">
          <div className="flex flex-col items-center text-center pb-4 border-b border-slate-800">
            <Avatar
              src={conversation.avatarUrl}
              name={conversation.title || "Chat"}
              size="xl"
              className="mb-2"
            />
            <h3 className="text-base font-bold text-white">{conversation.title || otherMember?.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {conversation.isGroup ? "Group Conversation" : `@${otherMember?.username}`}
            </p>
          </div>

          {conversation.description && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Description
              </span>
              <p className="text-xs text-slate-300 mt-1">{conversation.description}</p>
            </div>
          )}

          {/* Members list for group */}
          {conversation.isGroup && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Members ({conversation.members.length})
              </span>
              <div className="space-y-2">
                {conversation.members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Avatar src={m.user.avatarUrl} name={m.user.name} size="sm" isOnline={m.user.isOnline} />
                      <span className="text-slate-200 font-medium">{m.user.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security details */}
          <div className="mt-auto p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Encrypted transmission via TLS 1.3 & WebSocket SSL</span>
          </div>
        </div>
      )}

      {/* Fullscreen Media Viewer */}
      {activeMedia && (
        <MediaViewer
          mediaUrl={activeMedia.url}
          mediaType={activeMedia.type}
          fileName={activeMedia.fileName}
          onClose={() => setActiveMedia(null)}
        />
      )}
    </div>
  );
}
