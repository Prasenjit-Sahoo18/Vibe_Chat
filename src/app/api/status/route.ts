import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    const statuses = await prisma.status.findMany({
      where: {
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        music: {
          include: {
            track: true,
          },
        },
        views: {
          include: {
            viewer: {
              select: { id: true, name: true, username: true, avatarUrl: true },
            },
          },
        },
        reactions: true,
      },
    });

    const formatted = statuses.map((s) => ({
      id: s.id,
      userId: s.userId,
      user: s.user,
      content: s.content,
      mediaUrl: s.mediaUrl,
      mediaType: s.mediaType,
      bgColor: s.bgColor,
      expiresAt: s.expiresAt,
      createdAt: s.createdAt,
      music: s.music
        ? {
            title: s.music.track.title,
            artist: s.music.track.artist,
            audioUrl: s.music.track.audioUrl,
            coverUrl: s.music.track.coverUrl,
            duration: s.music.track.duration,
          }
        : null,
      views: s.views.map((v) => ({
        viewerId: v.viewerId,
        viewer: v.viewer,
        viewedAt: v.viewedAt,
      })),
      reactions: s.reactions,
      isViewedByMe: s.views.some((v) => v.viewerId === user.id),
    }));

    return NextResponse.json({ statuses: formatted });
  } catch (err: any) {
    console.error("Fetch status error:", err);
    return NextResponse.json({ error: "Failed to fetch statuses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, mediaUrl, mediaType = "text", bgColor, musicTrackId } = body;

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry

    const status = await prisma.status.create({
      data: {
        userId: user.id,
        content: content || null,
        mediaUrl: mediaUrl || null,
        mediaType,
        bgColor: bgColor || "from-indigo-600 via-purple-600 to-pink-600",
        expiresAt,
        music: musicTrackId
          ? {
              create: {
                trackId: musicTrackId,
                startTimeSec: 0,
                durationSec: 15,
              },
            }
          : undefined,
      },
      include: {
        user: {
          select: { id: true, name: true, username: true, avatarUrl: true },
        },
        music: {
          include: { track: true },
        },
        views: true,
        reactions: true,
      },
    });

    return NextResponse.json({ status });
  } catch (err: any) {
    console.error("Create status error:", err);
    return NextResponse.json({ error: "Failed to post status" }, { status: 500 });
  }
}
