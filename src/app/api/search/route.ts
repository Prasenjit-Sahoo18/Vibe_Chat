import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";
    const filter = searchParams.get("filter") || "all"; // all, users, messages, media

    if (!query) {
      return NextResponse.json({ users: [], messages: [], media: [] });
    }

    let usersResult: any[] = [];
    let messagesResult: any[] = [];
    let mediaResult: any[] = [];

    // Search Users
    if (filter === "all" || filter === "users") {
      usersResult = await prisma.user.findMany({
        where: {
          AND: [
            { id: { not: user.id } },
            {
              OR: [
                { name: { contains: query } },
                { username: { contains: query } },
                { email: { contains: query } },
              ],
            },
          ],
        },
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          bio: true,
          isOnline: true,
          lastSeen: true,
        },
        take: 10,
      });
    }

    // Search Messages in user's conversations
    if (filter === "all" || filter === "messages") {
      messagesResult = await prisma.message.findMany({
        where: {
          isDeleted: false,
          content: { contains: query },
          conversation: {
            members: {
              some: { userId: user.id },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        include: {
          sender: { select: { id: true, name: true, username: true } },
          conversation: {
            select: { id: true, isGroup: true, title: true },
          },
        },
        take: 20,
      });
    }

    // Search Media attachments
    if (filter === "all" || filter === "media") {
      mediaResult = await prisma.messageAttachment.findMany({
        where: {
          fileName: { contains: query },
          message: {
            conversation: {
              members: { some: { userId: user.id } },
            },
          },
        },
        include: {
          message: {
            select: {
              id: true,
              conversationId: true,
              sender: { select: { name: true } },
              createdAt: true,
            },
          },
        },
        take: 15,
      });
    }

    return NextResponse.json({
      users: usersResult,
      messages: messagesResult,
      media: mediaResult,
    });
  } catch (err: any) {
    console.error("Search API error:", err);
    return NextResponse.json({ error: "Failed to perform search" }, { status: 500 });
  }
}
