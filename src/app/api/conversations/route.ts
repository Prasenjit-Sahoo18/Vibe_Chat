import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        members: {
          some: { userId: user.id },
        },
      },
      orderBy: { lastMessageAt: "desc" },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
                isOnline: true,
                lastSeen: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            sender: {
              select: { id: true, name: true, username: true },
            },
            payment: true,
          },
        },
        group: true,
      },
    });

    const formatted = conversations.map((conv) => {
      const userMember = conv.members.find((m) => m.userId === user.id);
      const otherMember = conv.members.find((m) => m.userId !== user.id);

      let title = conv.title;
      let avatarUrl = conv.avatarUrl;

      if (!conv.isGroup && otherMember) {
        title = otherMember.user.name;
        avatarUrl = otherMember.user.avatarUrl;
      }

      return {
        id: conv.id,
        isGroup: conv.isGroup,
        title,
        avatarUrl,
        description: conv.description,
        lastMessageAt: conv.lastMessageAt,
        unreadCount: userMember?.unreadCount || 0,
        members: conv.members.map((m) => ({
          id: m.id,
          userId: m.userId,
          user: m.user,
          role: m.role,
          isMuted: m.isMuted,
          unreadCount: m.unreadCount,
        })),
        lastMessage: conv.messages[0] || null,
      };
    });

    return NextResponse.json({ conversations: formatted });
  } catch (err: any) {
    console.error("Fetch conversations error:", err);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isGroup, targetUserId, title, description, memberIds } = await req.json();

    if (!isGroup) {
      if (!targetUserId) {
        return NextResponse.json({ error: "Target user ID is required" }, { status: 400 });
      }

      // Check if 1-on-1 conversation already exists
      const existing = await prisma.conversation.findFirst({
        where: {
          isGroup: false,
          AND: [
            { members: { some: { userId: user.id } } },
            { members: { some: { userId: targetUserId } } },
          ],
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  avatarUrl: true,
                  isOnline: true,
                  lastSeen: true,
                },
              },
            },
          },
        },
      });

      if (existing) {
        return NextResponse.json({ conversation: existing, isNew: false });
      }

      // Create new direct conversation
      const newConv = await prisma.conversation.create({
        data: {
          isGroup: false,
          lastMessageAt: new Date(),
          members: {
            create: [
              { userId: user.id, role: "member" },
              { userId: targetUserId, role: "member" },
            ],
          },
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  avatarUrl: true,
                  isOnline: true,
                  lastSeen: true,
                },
              },
            },
          },
        },
      });

      return NextResponse.json({ conversation: newConv, isNew: true });
    }

    // Create Group conversation
    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Group title is required" }, { status: 400 });
    }

    const uniqueMemberIds = Array.from(new Set([user.id, ...(memberIds || [])]));

    const groupConversation = await prisma.conversation.create({
      data: {
        isGroup: true,
        title: title.trim(),
        description: description?.trim() || null,
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(title)}`,
        lastMessageAt: new Date(),
        members: {
          create: uniqueMemberIds.map((mId) => ({
            userId: mId,
            role: mId === user.id ? "owner" : "member",
          })),
        },
        group: {
          create: {
            name: title.trim(),
            description: description?.trim() || null,
            createdById: user.id,
            members: {
              create: uniqueMemberIds.map((mId) => ({
                userId: mId,
                role: mId === user.id ? "admin" : "member",
              })),
            },
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
                isOnline: true,
                lastSeen: true,
              },
            },
          },
        },
        group: true,
      },
    });

    return NextResponse.json({ conversation: groupConversation, isNew: true });
  } catch (err: any) {
    console.error("Create conversation error:", err);
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}
