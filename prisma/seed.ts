import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ROYALTY_FREE_TRACKS, DEMO_STICKER_PACKS } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting VibeChat database seed...");

  // Clean existing tables (in appropriate dependency order)
  await prisma.statusView.deleteMany();
  await prisma.statusReaction.deleteMany();
  await prisma.statusMusic.deleteMany();
  await prisma.status.deleteMany();
  await prisma.musicTrack.deleteMany();
  await prisma.sticker.deleteMany();
  await prisma.stickerPack.deleteMany();
  await prisma.messageReaction.deleteMany();
  await prisma.messageAttachment.deleteMany();
  await prisma.messageReadReceipt.deleteMany();
  await prisma.messageReply.deleteMany();
  await prisma.messageForward.deleteMany();
  await prisma.savedMessage.deleteMany();
  await prisma.pinnedMessage.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.message.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.conversationMember.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.aIMessage.deleteMany();
  await prisma.aIConversation.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.deviceSession.deleteMany();
  await prisma.blockedUser.deleteMany();
  await prisma.report.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash("vibe123456", 10);

  // 1. Create Demo Users
  const alex = await prisma.user.create({
    data: {
      email: "alex@vibechat.app",
      username: "alex_vibe",
      name: "Alex Rivera",
      passwordHash: defaultPassword,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
      bio: "Product Designer & vibe curator 🎨✨",
      isOnline: true,
      isVerified: true,
      profile: {
        create: {
          bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80",
          location: "Bengaluru, India",
          website: "https://vibechat.app",
          statusMessage: "Building VibeChat 🚀",
        },
      },
      settings: {
        create: {
          theme: "dark",
          notifications: true,
          soundEnabled: true,
          readReceipts: true,
        },
      },
    },
  });

  const sarah = await prisma.user.create({
    data: {
      email: "sarah@vibechat.app",
      username: "sarah_dev",
      name: "Sarah Chen",
      passwordHash: defaultPassword,
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
      bio: "Full-Stack architect building real-time systems ⚡",
      isOnline: true,
      isVerified: true,
      profile: {
        create: {
          bannerUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80",
          location: "San Francisco, USA",
          statusMessage: "Shipping features at lightspeed 💻",
        },
      },
      settings: {
        create: {
          theme: "dark",
        },
      },
    },
  });

  const rahul = await prisma.user.create({
    data: {
      email: "rahul@vibechat.app",
      username: "rahul_s",
      name: "Rahul Sharma",
      passwordHash: defaultPassword,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
      bio: "Startup founder & tech nerd 🚀",
      isOnline: false,
      lastSeen: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
      isVerified: true,
      profile: {
        create: {
          location: "Mumbai, India",
          statusMessage: "Scaling servers to 100k users",
        },
      },
      settings: {
        create: {
          theme: "dark",
        },
      },
    },
  });

  const priya = await prisma.user.create({
    data: {
      email: "priya@vibechat.app",
      username: "priya_ux",
      name: "Priya Patel",
      passwordHash: defaultPassword,
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
      bio: "Designing vibes & crafting human experiences 💫",
      isOnline: true,
      isVerified: true,
      profile: {
        create: {
          location: "Bengaluru, India",
          statusMessage: "Design systems are art 🎨",
        },
      },
      settings: {
        create: {
          theme: "dark",
        },
      },
    },
  });

  const john = await prisma.user.create({
    data: {
      email: "john@vibechat.app",
      username: "john_doe",
      name: "John Doe",
      passwordHash: defaultPassword,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
      bio: "Music producer & audio engineer 🎧",
      isOnline: false,
      lastSeen: new Date(Date.now() - 3 * 3600 * 1000), // 3 hours ago
      profile: {
        create: {
          location: "London, UK",
          statusMessage: "Mixing new status beats 🎵",
        },
      },
      settings: {
        create: {
          theme: "dark",
        },
      },
    },
  });

  console.log("✅ Seeded 5 demo users");

  // 2. Seed Music Tracks
  for (const track of ROYALTY_FREE_TRACKS) {
    await prisma.musicTrack.create({
      data: {
        id: track.id,
        title: track.title,
        artist: track.artist,
        coverUrl: track.coverUrl,
        audioUrl: track.audioUrl,
        duration: track.duration,
        genre: track.genre,
      },
    });
  }
  console.log("✅ Seeded royalty-free music tracks");

  // 3. Seed Sticker Packs
  for (const pack of DEMO_STICKER_PACKS) {
    const createdPack = await prisma.stickerPack.create({
      data: {
        id: pack.id,
        name: pack.name,
        category: pack.category,
        thumbnail: pack.thumbnail,
      },
    });

    for (const st of pack.stickers) {
      await prisma.sticker.create({
        data: {
          id: st.id,
          packId: createdPack.id,
          name: st.name,
          imageUrl: st.imageUrl,
          emojiShortcut: st.emojiShortcut,
        },
      });
    }
  }
  console.log("✅ Seeded sticker packs");

  // 4. Create Conversations

  // Conversation 1: Alex & Sarah (Direct Chat)
  const convAlexSarah = await prisma.conversation.create({
    data: {
      isGroup: false,
      lastMessageAt: new Date(),
      members: {
        create: [
          { userId: alex.id, role: "member" },
          { userId: sarah.id, role: "member" },
        ],
      },
    },
  });

  // Messages in Alex & Sarah
  const msg1 = await prisma.message.create({
    data: {
      conversationId: convAlexSarah.id,
      senderId: sarah.id,
      content: "Hey Alex! Just pushed the new real-time WebSocket protocol updates 🚀",
      type: "text",
      status: "read",
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
    },
  });

  const msg2 = await prisma.message.create({
    data: {
      conversationId: convAlexSarah.id,
      senderId: alex.id,
      content: "Awesome Sarah! The latency is virtually zero now. I also finished the new status music picker.",
      type: "text",
      status: "read",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    },
  });

  // Reaction on msg2
  await prisma.messageReaction.create({
    data: {
      messageId: msg2.id,
      userId: sarah.id,
      emoji: "🔥",
    },
  });

  // Payment message from Alex to Sarah
  const paymentMessage = await prisma.message.create({
    data: {
      conversationId: convAlexSarah.id,
      senderId: alex.id,
      content: "Sent ₹1,200 for sprint bonus 🎯",
      type: "payment",
      status: "read",
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
    },
  });

  await prisma.payment.create({
    data: {
      messageId: paymentMessage.id,
      senderId: alex.id,
      receiverId: sarah.id,
      amount: 1200,
      currency: "INR",
      status: "successful",
      note: "Sprint design milestone bonus 🎯",
      receiptNumber: "VB-829104-7712",
      transactions: {
        create: [
          { userId: alex.id, type: "debit", amount: 1200, status: "completed" },
          { userId: sarah.id, type: "credit", amount: 1200, status: "completed" },
        ],
      },
    },
  });

  const msgLast = await prisma.message.create({
    data: {
      conversationId: convAlexSarah.id,
      senderId: sarah.id,
      content: "Received! Thanks Alex! Let's ship the demo build today 🙌",
      type: "text",
      status: "read",
      createdAt: new Date(Date.now() - 5 * 60 * 1000),
    },
  });

  // Conversation 2: Alex & Rahul (Direct Chat)
  const convAlexRahul = await prisma.conversation.create({
    data: {
      isGroup: false,
      lastMessageAt: new Date(Date.now() - 25 * 60 * 1000),
      members: {
        create: [
          { userId: alex.id, role: "member" },
          { userId: rahul.id, role: "member" },
        ],
      },
    },
  });

  await prisma.message.create({
    data: {
      conversationId: convAlexRahul.id,
      senderId: rahul.id,
      content: "Hey Alex, are we still meeting for lunch today?",
      type: "text",
      status: "read",
      createdAt: new Date(Date.now() - 120 * 60 * 1000),
    },
  });

  const rahulPayMsg = await prisma.message.create({
    data: {
      conversationId: convAlexRahul.id,
      senderId: rahul.id,
      content: "Sent ₹500 for lunch 🍕",
      type: "payment",
      status: "read",
      createdAt: new Date(Date.now() - 25 * 60 * 1000),
    },
  });

  await prisma.payment.create({
    data: {
      messageId: rahulPayMsg.id,
      senderId: rahul.id,
      receiverId: alex.id,
      amount: 500,
      currency: "INR",
      status: "successful",
      note: "Thanks for lunch! 🍕",
      receiptNumber: "VB-192837-4401",
      transactions: {
        create: [
          { userId: rahul.id, type: "debit", amount: 500, status: "completed" },
          { userId: alex.id, type: "credit", amount: 500, status: "completed" },
        ],
      },
    },
  });

  // Conversation 3: Group Chat "⚡ VibeChat Core Team"
  const groupConv = await prisma.conversation.create({
    data: {
      isGroup: true,
      title: "⚡ VibeChat Core Team",
      description: "Official discussion and product sync for VibeChat platform",
      avatarUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&q=80",
      lastMessageAt: new Date(Date.now() - 2 * 60 * 1000),
      members: {
        create: [
          { userId: alex.id, role: "owner" },
          { userId: sarah.id, role: "admin" },
          { userId: rahul.id, role: "member" },
          { userId: priya.id, role: "member" },
        ],
      },
    },
  });

  await prisma.group.create({
    data: {
      conversationId: groupConv.id,
      name: "⚡ VibeChat Core Team",
      description: "Official discussion and product sync for VibeChat platform",
      avatarUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&q=80",
      createdById: alex.id,
      members: {
        create: [
          { userId: alex.id, role: "admin" },
          { userId: sarah.id, role: "admin" },
          { userId: rahul.id, role: "member" },
          { userId: priya.id, role: "member" },
        ],
      },
    },
  });

  await prisma.message.create({
    data: {
      conversationId: groupConv.id,
      senderId: priya.id,
      content: "The new UI color palette is live! Loving the cyber cyan and vibrant violet contrast 💜💙",
      type: "text",
      status: "read",
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
    },
  });

  const groupMsgMedia = await prisma.message.create({
    data: {
      conversationId: groupConv.id,
      senderId: alex.id,
      content: "Check out the mockup preview:",
      type: "image",
      status: "read",
      createdAt: new Date(Date.now() - 2 * 60 * 1000),
      attachments: {
        create: [
          {
            fileUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
            fileName: "vibechat_dashboard_preview.png",
            fileType: "image/png",
            fileSize: 428000,
          },
        ],
      },
    },
  });

  // 5. Seed 24-Hour Ephemeral Statuses
  const expires24h = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const status1 = await prisma.status.create({
    data: {
      userId: alex.id,
      content: "Late night UI polish for VibeChat 3.0 🌙✨",
      mediaType: "text",
      bgColor: "from-indigo-600 via-purple-600 to-pink-600",
      expiresAt: expires24h,
      music: {
        create: {
          trackId: "track-1",
          startTimeSec: 0,
          durationSec: 15,
        },
      },
      views: {
        create: [
          { viewerId: sarah.id },
          { viewerId: rahul.id },
        ],
      },
      reactions: {
        create: [
          { userId: sarah.id, emoji: "🔥" },
        ],
      },
    },
  });

  const status2 = await prisma.status.create({
    data: {
      userId: sarah.id,
      content: "Coffee fueled coding session! Crushed 12 pull requests today ☕💻",
      mediaType: "text",
      bgColor: "from-cyan-500 via-blue-600 to-indigo-700",
      expiresAt: expires24h,
      music: {
        create: {
          trackId: "track-2",
          startTimeSec: 5,
          durationSec: 15,
        },
      },
      views: {
        create: [
          { viewerId: alex.id },
        ],
      },
    },
  });

  const status3 = await prisma.status.create({
    data: {
      userId: rahul.id,
      content: "Scaling server capacity to 100k concurrent WebSocket connections! 🚀",
      mediaType: "text",
      bgColor: "from-emerald-500 via-teal-600 to-cyan-700",
      expiresAt: expires24h,
    },
  });

  console.log("✅ Seeded statuses with music tracks");

  // 6. Seed In-App Notifications for Alex
  await prisma.notification.createMany({
    data: [
      {
        userId: alex.id,
        type: "payment",
        title: "Payment Received! 💸",
        body: "Rahul Sharma sent you ₹500 for lunch",
        linkUrl: "/payments",
        isRead: false,
      },
      {
        userId: alex.id,
        type: "reaction",
        title: "New Reaction 🔥",
        body: "Sarah Chen reacted with 🔥 to your status",
        linkUrl: "/status",
        isRead: true,
      },
      {
        userId: alex.id,
        type: "message",
        title: "Group Mention ⚡",
        body: "Priya Patel posted in ⚡ VibeChat Core Team",
        linkUrl: "/chat",
        isRead: false,
      },
    ],
  });

  console.log("🎉 VibeChat seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
