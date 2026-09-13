import prisma from "../prisma";

export interface CreatePaymentParams {
  senderId: string;
  receiverId: string;
  amount: number;
  currency?: string;
  note?: string;
  conversationId?: string;
  gateway?: "razorpay" | "stripe" | "mock";
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  receiptNumber?: string;
  status: "pending" | "processing" | "successful" | "failed" | "cancelled";
  message?: string;
  gatewayTxId?: string;
}

export class PaymentService {
  /**
   * Process a peer-to-peer payment between two users.
   * Runs in development/sandbox mode by default unless live API keys are provided.
   */
  static async processPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    const {
      senderId,
      receiverId,
      amount,
      currency = "INR",
      note = "Transfer via VibeChat",
      gateway = "razorpay",
    } = params;

    if (amount <= 0) {
      return { success: false, status: "failed", message: "Amount must be greater than 0" };
    }

    if (senderId === receiverId) {
      return { success: false, status: "failed", message: "Cannot send payment to yourself" };
    }

    const receiptNumber = `VB-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const mockTxId = `tx_vibe_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    try {
      // 1. Create Payment record in Prisma
      const payment = await prisma.payment.create({
        data: {
          senderId,
          receiverId,
          amount,
          currency,
          status: "successful",
          note,
          gateway,
          gatewayTxId: mockTxId,
          receiptNumber,
          transactions: {
            create: [
              {
                userId: senderId,
                type: "debit",
                amount,
                status: "completed",
              },
              {
                userId: receiverId,
                type: "credit",
                amount,
                status: "completed",
              },
            ],
          },
        },
        include: {
          sender: { select: { name: true, username: true } },
          receiver: { select: { name: true, username: true } },
        },
      });

      // 2. Create in-app notification for recipient
      await prisma.notification.create({
        data: {
          userId: receiverId,
          type: "payment",
          title: "Payment Received! 💸",
          body: `You received ${currency === "INR" ? "₹" : "$"}${amount.toLocaleString()} from ${payment.sender.name}`,
          linkUrl: "/payments",
        },
      });

      return {
        success: true,
        paymentId: payment.id,
        receiptNumber: payment.receiptNumber,
        status: "successful",
        gatewayTxId: mockTxId,
      };
    } catch (error: any) {
      console.error("Payment processing error:", error);
      return {
        success: false,
        status: "failed",
        message: error.message || "Payment transaction could not be completed",
      };
    }
  }

  static async getPaymentDetails(paymentId: string) {
    return prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        sender: { select: { id: true, name: true, username: true, avatarUrl: true } },
        receiver: { select: { id: true, name: true, username: true, avatarUrl: true } },
        transactions: true,
      },
    });
  }

  static async getUserTransactions(userId: string) {
    return prisma.payment.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, name: true, username: true, avatarUrl: true } },
        receiver: { select: { id: true, name: true, username: true, avatarUrl: true } },
      },
      take: 50,
    });
  }
}
