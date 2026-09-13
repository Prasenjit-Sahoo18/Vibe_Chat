import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, bio, avatarUrl, statusMessage, themePreference } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : user.name,
        bio: bio !== undefined ? bio : user.bio,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : user.avatarUrl,
        profile: {
          upsert: {
            create: {
              statusMessage: statusMessage || "Living the vibe",
              themePreference: themePreference || "system",
            },
            update: {
              statusMessage: statusMessage !== undefined ? statusMessage : undefined,
              themePreference: themePreference !== undefined ? themePreference : undefined,
            },
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
        profile: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
