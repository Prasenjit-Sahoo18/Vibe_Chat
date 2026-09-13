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

// Default to sqlite if not provided
const isPostgres = databaseUrl && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://"));
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
    console.log(`✅ schema.prisma updated to ${targetProvider}.`);
  }
}

// 3. Generate Prisma client & sync schema
try {
  console.log("⚙️  Running prisma generate...");
  execSync("npx prisma generate", { stdio: "inherit" });

  console.log("🗄️  Running prisma db push...");
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });

  console.log("🎉 Database preparation complete!");
} catch (err) {
  console.error("⚠️ Database preparation step encountered a non-fatal warning:", err.message);
}
