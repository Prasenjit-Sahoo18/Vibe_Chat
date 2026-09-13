export const SOCKET_EVENTS = {
  // Connection
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",
  USER_TYPING: "user:typing",

  // Messages
  MESSAGE_NEW: "message:new",
  MESSAGE_UPDATE: "message:update",
  MESSAGE_DELETE: "message:delete",
  MESSAGE_REACTION: "message:reaction",
  MESSAGE_READ: "message:read",

  // Conversations
  CONVERSATION_JOIN: "conversation:join",
  CONVERSATION_LEAVE: "conversation:leave",
  CONVERSATION_UPDATE: "conversation:update",

  // Status & Notifications
  STATUS_NEW: "status:new",
  PAYMENT_NEW: "payment:new",
  NOTIFICATION_NEW: "notification:new",
} as const;
