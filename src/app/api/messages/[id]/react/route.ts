import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emoji } = await req.json();
    if (!emoji) {
      return NextResponse.json({ error: "Emoji is required" }, { status: 400 });
    }

    const messageId = params.id;

    // Check if reaction already exists from this user with same emoji
    const existing = await prisma.messageReaction.findUnique({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId: user.id,
          emoji,
        },
      },
    });

    if (existing) {
      // Toggle off / remove
      await prisma.messageReaction.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ action: "removed", emoji });
    }

    // Add reaction
    const reaction = await prisma.messageReaction.create({
      data: {
        messageId,
        userId: user.id,
        emoji,
      },
      include: {
        user: {
          select: { id: true, name: true, username: true },
        },
      },
    });

    return NextResponse.json({ action: "added", reaction });
  } catch (err: any) {
    console.error("Reaction error:", err);
    return NextResponse.json({ error: "Failed to react to message" }, { status: 500 });
  }
}
