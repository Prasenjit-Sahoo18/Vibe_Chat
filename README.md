# VibeChat 🚀

**VibeChat** is a production-ready, full-stack real-time social communication and commerce platform. Combining instant messaging, WhatsApp-style voice & video calling, 24-hour music status stories, in-chat peer-to-peer payments, AI copilot intelligence, and rich media collaboration.

---

## ✨ Key Features

- 💬 **Zero-Latency Real-Time Chat**: Powered by Socket.IO with typing indicators, delivery checkmarks (Sent, Delivered, Read), inline replies, message reactions, and pin/delete actions.
- 📞 **Voice & Video Calling (WebRTC)**: End-to-end encrypted voice and video calls with real microphone & camera streaming, PiP preview, live call timer, and mute/video toggle controls.
- 📷 **WhatsApp-Style Profile Photos**: Click your avatar to upload any photo directly from your PC or phone—no image URLs needed.
- 📥 **1-Click File & Media Downloads**: Download sent images, videos, audio/voice notes, and document files (PDF, Word, Excel, ZIP) with a single click.
- 💸 **In-Chat Peer-to-Peer Payments**: Instant wallet transfers, Razorpay/Stripe sandbox integration, official receipts, and ledger tracking.
- 🎵 **24-Hour Ephemeral Stories with Music**: Soundtracked status updates with interactive progress bars, reactions, and viewer analytics.
- 🤖 **VibeChat AI Copilot**: Intelligent assistant for brainstorming, debugging, and chat summaries.

---

## ⚡ Quick Start (Run Locally)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Local Environment
The `.env` file is pre-configured for zero-config local development using SQLite:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="vibechat_super_secure_jwt_secret_key_2025_999!"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
PORT="3000"
```

### 3. Initialize & Seed Database
```bash
# Push schema to create database tables
npm run db:push

# Populate realistic demo users, messages, stories, and stickers
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 👥 Demo Accounts (Pre-Seeded)

Use the **1-Click Demo Selector** on `/login` or sign in with password **`vibe123456`**:

| Name | Role | Username | Email |
|---|---|---|---|
| **Alex Rivera** | Product Designer | `alex_vibe` | `alex@vibechat.app` |
| **Sarah Chen** | Full-Stack Architect | `sarah_dev` | `sarah@vibechat.app` |
| **Rahul Sharma** | Startup Founder | `rahul_s` | `rahul@vibechat.app` |
| **Priya Patel** | UX Lead | `priya_ux` | `priya@vibechat.app` |
| **John Doe** | Music Producer | `john_doe` | `john@vibechat.app` |

---

## 🚀 How to Deploy to GitHub

Run these commands in your project root:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Stage all files
git add .

# 3. Commit your changes
git commit -m "VibeChat: production-ready social chat & calling platform"

# 4. Set main branch
git branch -M main

# 5. Link your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🌐 How to Host on Render (1-Click Blueprint)

This project includes a pre-configured **`render.yaml`** blueprint that automatically sets up your Web Service and a free managed PostgreSQL database.

### Method 1: Render Blueprint (Recommended — 2 Minutes)

1. Go to your **[Render Dashboard](https://dashboard.render.com/)**.
2. In the top-right corner, click **New +** ➔ **Blueprint**.
3. Select and connect your **GitHub repository**.
4. Render will read `render.yaml` and auto-configure:
   - **PostgreSQL Database** (`vibechat-db`) — free managed database
   - **Web Service** (`vibechat`) — Node.js service running Next.js + Socket.IO
   - Auto-generated secure `AUTH_SECRET`
5. Click **Apply**.
6. Render will build and deploy your application. Once finished, your live URL will be:
   ```
   https://vibechat-xxxx.onrender.com
   ```

---

### Method 2: Manual Web Service Setup on Render

If you prefer setting up manually without blueprints:

1. In the **[Render Dashboard](https://dashboard.render.com/)**, click **New +** ➔ **Web Service**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name**: `vibechat`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run server`
   - **Plan**: `Free`
4. Add **Environment Variables**:
   | Key | Value | Description |
   |---|---|---|
   | `PORT` | `3000` | Port for HTTP and WebSockets |
   | `AUTH_SECRET` | *(click Generate)* | 32+ character random secret |
   | `DATABASE_URL` | `postgresql://...` | Connection string to your PostgreSQL DB |
   | `NODE_ENV` | `production` | Production mode |
5. Click **Create Web Service**.

> **Note on Database**: The build script (`scripts/prepare-db.js`) automatically detects your database:
> - When `DATABASE_URL` is PostgreSQL (on Render), it sets `schema.prisma` to PostgreSQL and syncs tables.
> - When `DATABASE_URL` is SQLite (locally), it sets `schema.prisma` to SQLite.
> No manual schema changes required!

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons |
| **Real-Time** | Custom Node.js HTTP Server + Socket.IO (Unified single-port engine) |
| **Calling** | WebRTC MediaStream API (Voice & Video Calling) |
| **Database & ORM** | Prisma ORM (Auto-adapts to PostgreSQL on Render / SQLite locally) |
| **Authentication** | JWT (HTTP-Only cookies), bcryptjs, Zod validation |
| **Payments** | Payment Service Abstraction (Razorpay / Stripe / Mock Sandbox) |
| **Media Handling** | Native File API, Base64/Data-URI & Cloudinary storage adapter |

---

## 📄 License
MIT License © VibeChat Platform Inc.

