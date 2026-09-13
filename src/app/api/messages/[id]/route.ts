import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, isDeleted, deletedForEveryone } = await req.json();
    const message = await prisma.message.findUnique({
      where: { id: params.id },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (message.senderId !== user.id) {
      return NextResponse.json({ error: "You can only edit or delete your own messages" }, { status: 403 });
    }

    const updated = await prisma.message.update({
      where: { id: params.id },
      data: {
        content: content !== undefined ? content : message.content,
        isEdited: content !== undefined && content !== message.content ? true : message.isEdited,
        isDeleted: isDeleted !== undefined ? isDeleted : message.isDeleted,
        deletedForEveryone: deletedForEveryone !== undefined ? deletedForEveryone : message.deletedForEveryone,
      },
    });

    return NextResponse.json({ message: updated });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message = await prisma.message.findUnique({
      where: { id: params.id },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (message.senderId !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await prisma.message.update({
      where: { id: params.id },
      data: { isDeleted: true, deletedForEveryone: true },
    });

    return NextResponse.json({ message: "Message deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
