import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversationId = params.id;

    // Verify membership
    const membership = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Mark unreadCount as 0 for this member
    await prisma.conversationMember.update({
      where: { id: membership.id },
      data: { unreadCount: 0 },
    });

    // When this user opens the chat, mark messages from others as "read"
    // so the sender sees double cyan ticks on their side
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: user.id },
        status: { in: ["sent", "delivered"] },
      },
      data: { status: "read" },
    });

    // Promote the current user's own messages to at least "delivered"
    // because the other member is actively viewing this conversation
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: user.id,
        status: "sent",
      },
      data: { status: "delivered" },
    });

    const messages = await prisma.message.findMany({
      where: { conversationId, isDeleted: false },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        attachments: true,
        reactions: {
          include: {
            user: { select: { id: true, name: true, username: true } },
          },
        },
        payment: {
          include: {
            sender: { select: { name: true } },
            receiver: { select: { name: true } },
          },
        },
        repliedIn: {
          include: {
            parentMessage: {
              select: {
                id: true,
                content: true,
                type: true,
                sender: { select: { name: true } },
              },
            },
          },
        },
      },
      take: 100,
    });

    const formatted = messages.map((m) => {
      const parentReply = m.repliedIn?.[0]?.parentMessage;
      return {
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        sender: m.sender,
        content: m.content,
        type: m.type,
        status: m.status,
        isEdited: m.isEdited,
        isDeleted: m.isDeleted,
        createdAt: m.createdAt,
        attachments: m.attachments,
        reactions: m.reactions,
        payment: m.payment
          ? {
              id: m.payment.id,
              amount: m.payment.amount,
              currency: m.payment.currency,
              status: m.payment.status,
              note: m.payment.note,
              senderId: m.payment.senderId,
              receiverId: m.payment.receiverId,
              senderName: m.payment.sender.name,
              receiverName: m.payment.receiver.name,
              receiptNumber: m.payment.receiptNumber,
              createdAt: m.payment.createdAt,
            }
          : null,
        replyTo: parentReply
          ? {
              id: parentReply.id,
              content: parentReply.content,
              senderName: parentReply.sender.name,
              type: parentReply.type,
            }
          : null,
      };
    });

    return NextResponse.json({ messages: formatted });
  } catch (err: any) {
    console.error("Fetch messages error:", err);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversationId = params.id;
    const body = await req.json();
    const { content, type = "text", attachments, replyToId, paymentId } = body;

    // Check membership
    const membership = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content: content || null,
        type,
        status: "sent",
        attachments: attachments && attachments.length > 0
          ? {
              create: attachments.map((att: any) => ({
                fileUrl: att.fileUrl,
                fileName: att.fileName,
                fileType: att.fileType,
                fileSize: att.fileSize || 0,
                duration: att.duration || null,
                thumbnailUrl: att.thumbnailUrl || null,
              })),
            }
          : undefined,
        repliedIn: replyToId
          ? {
              create: {
                parentMessageId: replyToId,
              },
            }
          : undefined,
      },
      include: {
        sender: {
          select: { id: true, name: true, username: true, avatarUrl: true },
        },
        attachments: true,
        reactions: true,
      },
    });

    // If this message links to a payment
    if (paymentId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { messageId: message.id },
      });
    }

    // Update conversation lastMessageAt & increment other members unread count
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    await prisma.conversationMember.updateMany({
      where: {
        conversationId,
        userId: { not: user.id },
      },
      data: {
        unreadCount: { increment: 1 },
      },
    });

    return NextResponse.json({ message });
  } catch (err: any) {
    console.error("Create message error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
