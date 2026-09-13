import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { PaymentService } from "@/lib/payments/service";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await PaymentService.getUserTransactions(user.id);
    return NextResponse.json({ transactions });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receiverId, amount, currency = "INR", note, conversationId } = await req.json();

    if (!receiverId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valid receiver and positive amount are required" },
        { status: 400 }
      );
    }

    // Process payment through payment service
    const result = await PaymentService.processPayment({
      senderId: user.id,
      receiverId,
      amount: Number(amount),
      currency,
      note,
      conversationId,
    });

    if (!result.success || !result.paymentId) {
      return NextResponse.json({ error: result.message || "Payment failed" }, { status: 400 });
    }

    // If payment was made in an active conversation, post a payment message directly!
    let paymentMessage = null;
    if (conversationId) {
      paymentMessage = await prisma.message.create({
        data: {
          conversationId,
          senderId: user.id,
          content: `Sent ${currency === "INR" ? "₹" : "$"}${Number(amount).toLocaleString()} • ${note || "Transfer"}`,
          type: "payment",
          status: "read",
        },
        include: {
          sender: { select: { id: true, name: true, username: true } },
        },
      });

      await prisma.payment.update({
        where: { id: result.paymentId },
        data: { messageId: paymentMessage.id },
      });

      await prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      });
    }

    const paymentDetails = await PaymentService.getPaymentDetails(result.paymentId);

    return NextResponse.json({
      success: true,
      payment: paymentDetails,
      message: paymentMessage,
    });
  } catch (err: any) {
    console.error("Payment API error:", err);
    return NextResponse.json({ error: "Payment processing error" }, { status: 500 });
  }
}
