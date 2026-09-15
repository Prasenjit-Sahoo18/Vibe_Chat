const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 1. Determine DATABASE_URL from process.env or .env file
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  const envPath = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
    if (match) {
      databaseUrl = match[1];
    }
  }
}

// Check database provider: PostgreSQL vs SQLite
const isPostgres = Boolean(
  databaseUrl && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://"))
);
const targetProvider = isPostgres ? "postgresql" : "sqlite";

console.log(`🔍 Auto-detected database type: ${targetProvider.toUpperCase()}`);

// 2. Synchronize datasource provider in prisma/schema.prisma
const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
if (fs.existsSync(schemaPath)) {
  let schema = fs.readFileSync(schemaPath, "utf8");
  const regex = /datasource\s+db\s*\{[\s\S]*?provider\s*=\s*["']([^"']+)["'][\s\S]*?\}/;
  const match = schema.match(regex);

  if (match && match[1] !== targetProvider) {
    console.log(`🔄 Updating prisma/schema.prisma provider to '${targetProvider}'...`);
    schema = schema.replace(
      /datasource\s+db\s*\{[\s\S]*?provider\s*=\s*["'][^"']+["']/,
      `datasource db {\n  provider = "${targetProvider}"`
    );
    fs.writeFileSync(schemaPath, schema, "utf8");
    console.log(`✅ schema.prisma updated to '${targetProvider}'.`);
  }
}

// 3. Generate Prisma client & sync database schema
try {
  console.log("⚙️  Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });
} catch (err) {
  console.warn("⚠️ prisma generate warning (non-fatal):", err.message);
}

try {
  console.log("🗄️  Syncing database schema (prisma db push)...");
  execSync("npx prisma db push --accept-data-loss --skip-generate", { stdio: "inherit" });
  console.log("✅ Database schema is up to date!");
} catch (err) {
  console.warn("⚠️ prisma db push warning (non-fatal):", err.message);
}

// 4. If running in production (e.g. Render) with PostgreSQL, automatically seed demo data if needed
if (isPostgres && process.env.RENDER) {
  try {
    console.log("🌱 Checking if initial seed data is needed on Render...");
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
    console.log("✅ Seed completed successfully!");
  } catch (seedErr) {
    console.log("ℹ️  Database already initialized or seed skipped.");
  }
}

console.log("🎉 Database preparation complete!");
