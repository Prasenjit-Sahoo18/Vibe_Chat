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

    const statusId = params.id;

    // Record view if not already recorded
    const existing = await prisma.statusView.findUnique({
      where: {
        statusId_viewerId: {
          statusId,
          viewerId: user.id,
        },
      },
    });

    if (!existing) {
      await prisma.statusView.create({
        data: {
          statusId,
          viewerId: user.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
