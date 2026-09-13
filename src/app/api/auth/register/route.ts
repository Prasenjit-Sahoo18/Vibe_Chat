import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { hashPassword, signToken, TOKEN_NAME } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, username, email, password, phoneNumber, avatarUrl } = result.data;

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
      },
    });

    if (existing) {
      if (existing.email.toLowerCase() === email.toLowerCase()) {
        return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
      }
      return NextResponse.json({ error: "Username is already taken" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const defaultAvatar =
      avatarUrl ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`;

    const user = await prisma.user.create({
      data: {
        name,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        passwordHash,
        phoneNumber,
        avatarUrl: defaultAvatar,
        profile: {
          create: {
            themePreference: "dark",
          },
        },
        settings: {
          create: {
            theme: "dark",
          },
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        isOnline: true,
        lastSeen: true,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const response = NextResponse.json({ user, message: "Welcome to VibeChat!" });
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
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
