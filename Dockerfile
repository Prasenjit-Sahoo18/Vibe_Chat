# Production Dockerfile for VibeChat (Fly.io, Render, Railway, Docker)
FROM node:20-slim AS runner

WORKDIR /app

# Install openssl for Prisma engine support
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for building Next.js)
RUN npm install --include=dev

# Copy source code and Prisma schema
COPY . .

# Run auto-database preparation and Next.js build
RUN node scripts/prepare-db.js && npm run build

# Expose standard port
EXPOSE 3000

# Start custom Socket.IO + Next.js server
CMD ["node", "scripts/prepare-db.js", "&&", "npm", "run", "server"]
