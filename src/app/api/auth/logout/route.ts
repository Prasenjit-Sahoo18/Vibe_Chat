import { NextResponse } from "next/server";
import { TOKEN_NAME, getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const user = await getSessionUser();
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isOnline: false, lastSeen: new Date() },
      });
    }

    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.delete(TOKEN_NAME);
    return response;
  } catch (err) {
    const response = NextResponse.json({ message: "Logged out" });
    response.cookies.delete(TOKEN_NAME);
    return response;
  }
}
