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

    const statusId = params.id;

    const reaction = await prisma.statusReaction.create({
      data: {
        statusId,
        userId: user.id,
        emoji,
      },
    });

    return NextResponse.json({ success: true, reaction });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to react to status" }, { status: 500 });
  }
}
