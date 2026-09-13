import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signToken, TOKEN_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        isOnline: true,
        lastSeen: true,
        isVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: `Demo user ${username} not found` }, { status: 404 });
    }

    // Mark online
    await prisma.user.update({
      where: { id: user.id },
      data: { isOnline: true, lastSeen: new Date() },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const response = NextResponse.json({
      user: { ...user, isOnline: true },
      message: `Switched to demo account: ${user.name}`,
    });

    response.cookies.set({
      name: TOKEN_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error("Demo login error:", err);
    return NextResponse.json({ error: "Failed demo login" }, { status: 500 });
  }
}
