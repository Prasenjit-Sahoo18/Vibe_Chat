"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { SOCKET_EVENTS } from "@/lib/socket/events";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUserIds: Set<string>;
  typingUsers: { [conversationId: string]: string[] }; // convId -> userIds
  sendTyping: (conversationId: string, isTyping: boolean) => void;
  broadcastMessage: (conversationId: string, message: any) => void;
  broadcastReaction: (conversationId: string, messageId: string, emoji: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<{ [conversationId: string]: string[] }>({});
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin;
    
    // Initialize socket connection with fallback transports
    const newSocket = io(socketUrl, {
      query: { userId: user.id },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      setOnlineUserIds((prev) => new Set(prev).add(user.id));
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on(SOCKET_EVENTS.USER_ONLINE, ({ userId }: { userId: string }) => {
      setOnlineUserIds((prev) => new Set(prev).add(userId));
    });

    newSocket.on(SOCKET_EVENTS.USER_OFFLINE, ({ userId }: { userId: string }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    newSocket.on(SOCKET_EVENTS.USER_TYPING, ({ conversationId, userId, isTyping }: any) => {
      setTypingUsers((prev) => {
        const current = prev[conversationId] || [];
        if (isTyping) {
          if (!current.includes(userId)) {
            return { ...prev, [conversationId]: [...current, userId] };
          }
        } else {
          return { ...prev, [conversationId]: current.filter((id) => id !== userId) };
        }
        return prev;
      });
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const sendTyping = (conversationId: string, isTyping: boolean) => {
    if (socketRef.current && user) {
      socketRef.current.emit(SOCKET_EVENTS.USER_TYPING, {
        conversationId,
        userId: user.id,
        isTyping,
      });
    }
  };

  const broadcastMessage = (conversationId: string, message: any) => {
    if (socketRef.current) {
      socketRef.current.emit(SOCKET_EVENTS.MESSAGE_NEW, {
        conversationId,
        message,
      });
    }
  };

  const broadcastReaction = (conversationId: string, messageId: string, emoji: string) => {
    if (socketRef.current && user) {
      socketRef.current.emit(SOCKET_EVENTS.MESSAGE_REACTION, {
        conversationId,
        messageId,
        userId: user.id,
        emoji,
      });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        onlineUserIds,
        typingUsers,
        sendTyping,
        broadcastMessage,
        broadcastReaction,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
