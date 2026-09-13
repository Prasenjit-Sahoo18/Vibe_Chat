import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { AIService, AIMessageInput } from "@/lib/ai/service";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, conversationId } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1];

    // Generate AI response
    const replyContent = await AIService.generateReply(messages);

    // Save to database if conversation exists or create one
    let targetConvId = conversationId;
    if (!targetConvId) {
      const newAiConv = await prisma.aIConversation.create({
        data: {
          userId: user.id,
          title: lastUserMessage.content.slice(0, 40) + "...",
        },
      });
      targetConvId = newAiConv.id;
    }

    // Save user message
    await prisma.aIMessage.create({
      data: {
        aiConversationId: targetConvId,
        role: "user",
        content: lastUserMessage.content,
      },
    });

    // Save assistant message
    const assistantMessage = await prisma.aIMessage.create({
      data: {
        aiConversationId: targetConvId,
        role: "assistant",
        content: replyContent,
      },
    });

    return NextResponse.json({
      reply: replyContent,
      conversationId: targetConvId,
      messageId: assistantMessage.id,
    });
  } catch (err: any) {
    console.error("AI chat route error:", err);
    return NextResponse.json({ error: "AI service failure" }, { status: 500 });
  }
}
