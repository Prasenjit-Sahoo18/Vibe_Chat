export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
  isOnline: boolean;
  lastSeen: string | Date;
  isVerified?: boolean;
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  user?: User;
  emoji: string;
  createdAt: string | Date;
}

export interface MessageAttachment {
  id: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl?: string | null;
  duration?: number | null;
}

export interface PaymentCardData {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "successful" | "failed" | "cancelled";
  note?: string | null;
  senderId: string;
  receiverId: string;
  senderName?: string;
  receiverName?: string;
  receiptNumber: string;
  createdAt: string | Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  content?: string | null;
  type: "text" | "image" | "video" | "audio" | "document" | "voice" | "payment" | "sticker";
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  isEdited: boolean;
  isDeleted: boolean;
  deletedForEveryone?: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  replyTo?: {
    id: string;
    content: string | null;
    senderName: string;
    type: string;
  } | null;
  forwardedFrom?: {
    id: string;
    senderName: string;
  } | null;
  payment?: PaymentCardData | null;
  isPinned?: boolean;
  isSaved?: boolean;
}

export interface ConversationMember {
  id: string;
  userId: string;
  user: User;
  role: "owner" | "admin" | "member";
  isMuted: boolean;
  unreadCount: number;
}

export interface Conversation {
  id: string;
  isGroup: boolean;
  title?: string | null;
  avatarUrl?: string | null;
  description?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  lastMessageAt: string | Date;
  members: ConversationMember[];
  lastMessage?: Message | null;
  unreadCount?: number;
  isPinned?: boolean;
}

export interface StatusItem {
  id: string;
  userId: string;
  user: User;
  content?: string | null;
  mediaUrl?: string | null;
  mediaType: "text" | "image" | "video";
  bgColor?: string | null;
  expiresAt: string | Date;
  createdAt: string | Date;
  music?: {
    title: string;
    artist: string;
    audioUrl: string;
    coverUrl?: string | null;
    duration: number;
  } | null;
  views?: {
    viewerId: string;
    viewer: User;
    viewedAt: string | Date;
  }[];
  reactions?: {
    userId: string;
    emoji: string;
  }[];
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  audioUrl: string;
  duration: number;
  genre: string;
}

export interface StickerPack {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  stickers: {
    id: string;
    name: string;
    imageUrl: string;
    emojiShortcut?: string;
  }[];
}

export interface InAppNotification {
  id: string;
  userId: string;
  type: "message" | "payment" | "reaction" | "status" | "group" | "ai";
  title: string;
  body: string;
  linkUrl?: string | null;
  isRead: boolean;
  createdAt: string | Date;
}
