import { createServer } from "http";
import { Server, Socket } from "socket.io";
import next from "next";
import { SOCKET_EVENTS } from "./src/lib/socket/events";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = parseInt(process.env.PORT || "3000", 10);
const SOCKET_PORT = parseInt(process.env.SOCKET_PORT || "3001", 10);

// Active user tracking
const onlineUsers = new Map<string, string>(); // userId -> socketId

async function startServer() {
  await app.prepare();

  // Create standalone or attached HTTP server for Socket.IO
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;

    if (userId) {
      onlineUsers.set(userId, socket.id);
      io.emit(SOCKET_EVENTS.USER_ONLINE, { userId, isOnline: true, lastSeen: new Date() });
      console.log(`⚡ User connected: ${userId} (${socket.id})`);
    }

    // Join conversation room
    socket.on(SOCKET_EVENTS.CONVERSATION_JOIN, ({ conversationId }: { conversationId: string }) => {
      socket.join(`conv:${conversationId}`);
    });

    // Leave conversation room
    socket.on(SOCKET_EVENTS.CONVERSATION_LEAVE, ({ conversationId }: { conversationId: string }) => {
      socket.leave(`conv:${conversationId}`);
    });

    // Typing indicators
    socket.on(SOCKET_EVENTS.USER_TYPING, ({ conversationId, userId, isTyping }: { conversationId: string; userId: string; isTyping: boolean }) => {
      socket.to(`conv:${conversationId}`).emit(SOCKET_EVENTS.USER_TYPING, {
        conversationId,
        userId,
        isTyping,
      });
    });

    // New message broadcast
    socket.on(SOCKET_EVENTS.MESSAGE_NEW, ({ conversationId, message }: { conversationId: string; message: any }) => {
      io.to(`conv:${conversationId}`).emit(SOCKET_EVENTS.MESSAGE_NEW, {
        conversationId,
        message,
      });
    });

    // Message reaction broadcast
    socket.on(SOCKET_EVENTS.MESSAGE_REACTION, (data: any) => {
      io.to(`conv:${data.conversationId}`).emit(SOCKET_EVENTS.MESSAGE_REACTION, data);
    });

    // Disconnect
    socket.on("disconnect", () => {
      if (userId && onlineUsers.get(userId) === socket.id) {
        onlineUsers.delete(userId);
        io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId, isOnline: false, lastSeen: new Date() });
        console.log(`🔌 User disconnected: ${userId}`);
      }
    });
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`> VibeChat ready on http://0.0.0.0:${PORT}`);
    console.log(`> Socket.IO active on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting VibeChat server:", err);
  process.exit(1);
});
