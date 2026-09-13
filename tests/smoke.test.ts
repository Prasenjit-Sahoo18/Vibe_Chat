import { hashPassword, verifyPassword, signToken, verifyToken } from "../src/lib/auth";
import { PaymentService } from "../src/lib/payments/service";
import { AIService } from "../src/lib/ai/service";
import prisma from "../src/lib/prisma";

async function runTests() {
  console.log("🧪 Running VibeChat Automated Test Suite...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Password Hashing & Verification
  try {
    const rawPass = "superSecretVibe99";
    const hashed = await hashPassword(rawPass);
    const isMatch = await verifyPassword(rawPass, hashed);
    const isMismatch = await verifyPassword("wrongPass", hashed);

    assert(typeof hashed === "string" && hashed.length > 20, "Password hashed correctly");
    assert(isMatch === true, "Valid password verifies true");
    assert(isMismatch === false, "Incorrect password fails verification");
  } catch (err) {
    assert(false, `Password test threw: ${err}`);
  }

  // 2. JWT Token Signing & Verification
  try {
    const payload = { userId: "usr_123", email: "test@vibechat.app", username: "test_user" };
    const token = signToken(payload);
    const decoded = verifyToken(token);

    assert(typeof token === "string" && token.length > 30, "JWT token signed successfully");
    assert(decoded?.userId === payload.userId, "Decoded user ID matches payload");
    assert(decoded?.email === payload.email, "Decoded email matches payload");
  } catch (err) {
    assert(false, `JWT test threw: ${err}`);
  }

  // 3. AI Assistant Service Generation
  try {
    const reply1 = await AIService.generateReply([{ role: "user", content: "Can you write TypeScript code?" }]);
    const reply2 = await AIService.generateReply([{ role: "user", content: "Summarize this platform" }]);

    assert(reply1.toLowerCase().includes("typescript") || reply1.includes("```"), "AI generates code response");
    assert(reply2.toLowerCase().includes("summary") || reply2.includes("vibechat"), "AI generates summary response");
  } catch (err) {
    assert(false, `AI assistant test threw: ${err}`);
  }

  // 4. Database Connection & Seed Validation
  try {
    const userCount = await prisma.user.count();
    const demoUser = await prisma.user.findUnique({ where: { username: "alex_vibe" } });
    const convCount = await prisma.conversation.count();

    assert(userCount >= 5, `Database seeded with users (found ${userCount})`);
    assert(demoUser !== null && demoUser.name === "Alex Rivera", "Demo user Alex Rivera exists in DB");
    assert(convCount >= 2, `Active conversations seeded in DB (found ${convCount})`);
  } catch (err) {
    assert(false, `Prisma DB check threw: ${err}`);
  }

  // 5. Peer-to-Peer Payment Validation
  try {
    const invalidPayment = await PaymentService.processPayment({
      senderId: "user1",
      receiverId: "user1",
      amount: -100,
    });
    assert(invalidPayment.success === false, "Self-payment and negative amount rejected");
  } catch (err) {
    assert(false, `Payment rejection test threw: ${err}`);
  }

  console.log(`\n================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
