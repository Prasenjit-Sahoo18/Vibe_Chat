# VibeChat 🚀

**VibeChat** is a production-ready, full-stack real-time social communication and commerce platform. Combining instant messaging, 24-hour ephemeral status stories with soundtrack backing, in-chat peer-to-peer payments, AI copilot intelligence, and rich media collaboration into an original, high-performance web experience.

---

## 🎨 Brand & Visual Identity

* **Name**: VibeChat
* **Theme**: Modern, energetic, social, and developer/startup-grade.
* **Palette**: Electric Indigo (`#6366F1`), Vibrant Violet (`#8B5CF6`), Cyber Cyan (`#06B6D4`), and Deep Obsidian (`#0F172A`).
* **Design System**: Fully bespoke layouts, glassmorphic floating cards, rounded badges, custom audio visualizer waves, and smooth micro-interactions (no WhatsApp green or clones).

---

## ✨ Features

### 1. Real-Time Chat & Collaboration
* **Zero-Latency WebSocket Engine**: Powered by Socket.IO with automated reconnection and fallback synchronization.
* **Presence & Indicators**: Real-time online/offline status, "typing..." indicator, and delivery checkmarks (Sent, Delivered, Read double-ticks).
* **Rich Messaging**: Text, custom stickers, emojis, photos, videos, documents (PDF, Word, Excel, ZIP), and voice notes.
* **Message Actions**: Inline reply quotes, forward, emoji reactions (`❤️`, `🔥`, `👍`, `😂`, `🚀`, `🎉`), edit, delete, pin, and star.
* **Group Conversations**: Create multi-user channels, assign admins/members, and customize group icons and descriptions.

### 2. 24-Hour Ephemeral Stories with Music
* **Soundtracked Status Updates**: Attach royalty-free Lo-Fi, Synthwave, and Acoustic tracks to status updates.
* **Segmented Story Viewer**: Interactive Instagram/Telegram-style progress bars, touch/click pause, next/prev navigation.
* **Viewer Analytics & Reactions**: See who viewed your story, react with quick emojis, or send direct replies.

### 3. Peer-to-Peer Payments & Commerce
* **In-Chat Payment Cards**: Send funds directly from the message composer with custom amounts and transaction notes.
* **Receipts & Ledger**: Automatic transaction receipts, unique receipt numbers (`VB-XXXXXX`), and wallet balance tracking.
* **Gateway Abstraction**: Designed for Razorpay (UPI & Netbanking) and Stripe with a built-in sandbox mock engine.

### 4. VibeChat AI Assistant
* **Dedicated AI Copilot**: Ask questions, brainstorm status ideas, debug TypeScript/React code, and summarize long conversation threads.
* **Smart Fallback Engine**: Works out-of-the-box with built-in assistant responses or connects to external OpenAI/Groq keys via `AI_API_KEY`.

### 5. Media Viewer & Voice Recorder
* **Voice Note Recorder**: Live duration counter, pulsing recording indicator, visualizer waveforms, and instant transmission.
* **Fullscreen Media Viewer**: High-definition image inspection, video playback, and one-click media downloads.

### 6. Search, Analytics & Settings
* **Universal Search**: Global query engine across contacts, message history, and shared media files.
* **Interactive Analytics**: Recharts data visualizations showing daily messaging velocity, media storage usage, and payment volumes.
* **Personalized Settings**: Profile avatar and bio editor, Dark/Light/System themes, and granular privacy controls.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons |
| **Animation & Charts** | CSS Transitions, Framer Motion, Recharts |
| **Backend** | Next.js API Routes, Custom Node HTTP Server, Socket.IO |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Authentication** | JWT, bcryptjs password hashing, HTTP-Only cookies, Zod validation |
| **Payments** | Payment Service Abstraction (Razorpay / Stripe / Mock Sandbox) |
| **Storage** | Cloudinary / AWS S3 storage adapter with Base64/Data-URI fallback |

---

## 📁 Project Architecture

```
VibeChat/
├── prisma/
│   ├── schema.prisma       # 30+ production Prisma models
│   └── seed.ts             # Demo data generator (Alex, Sarah, Rahul, Priya, John)
├── public/                 # Static assets & icons
├── src/
│   ├── app/                # Next.js App Router pages & APIs
│   │   ├── api/            # REST API endpoints (auth, chat, status, payments, ai, search)
│   │   ├── chat/           # Real-time chat workspace
│   │   ├── status/         # 24h music stories dashboard
│   │   ├── payments/       # Wallet & transaction ledger
│   │   ├── ai/             # VibeChat AI copilot window
│   │   ├── analytics/      # Recharts analytics dashboard
│   │   ├── settings/       # Profile, privacy & theme controls
│   │   ├── login/          # Auth login + 1-click demo switcher
│   │   ├── register/       # User registration
│   │   ├── layout.tsx      # Root layout with Theme, Auth & Socket providers
│   │   └── page.tsx        # High-converting landing page
│   ├── components/         # Modular UI components
│   │   ├── common/         # Avatar, Badge, Modal
│   │   ├── navigation/     # Sidebar, MobileNav
│   │   ├── chat/           # ChatWindow, MessageItem, ChatComposer, PaymentCard, VoiceRecorder...
│   │   ├── status/         # StatusViewer, CreateStatusModal
│   │   ├── ai/             # AIChatView
│   │   ├── payments/       # PaymentsDashboard
│   │   ├── analytics/      # AnalyticsDashboard
│   │   ├── settings/       # SettingsView
│   │   ├── notifications/  # NotificationDrawer
│   │   └── search/         # GlobalSearchModal
│   ├── context/            # AuthContext, SocketContext, ThemeContext
│   └── lib/                # Prisma client, auth tokens, payments & AI services
├── tests/                  # Automated integration and smoke tests
├── server.ts               # Standalone / Custom Socket.IO real-time server
├── package.json
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/vibechat.git
cd vibechat
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

For local development, use a PostgreSQL database (Render supplies this automatically in production):
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
AUTH_SECRET="vibechat_super_secure_jwt_secret_key_2025_999!"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
PORT="3000"
```

### 3. Initialize & Seed Database
```bash
# Push schema to create database tables
npm run db:push

# Populate realistic demo users, messages, stories and payments
npm run db:seed
```

### 4. Run Automated Smoke Tests
```bash
npm run test
```

### 5. Launch Development Server
```bash
# Next.js development server
npm run dev

# Or with dedicated Socket.IO server:
npm run server
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Demo User Accounts (Pre-Seeded)

For instant testing, use the **1-Click Demo Selector** on the `/login` page or log in with password `vibe123456`:

| Name | Role | Username | Email |
|---|---|---|---|
| **Alex Rivera** | Product Designer | `alex_vibe` | `alex@vibechat.app` |
| **Sarah Chen** | Full-Stack Architect | `sarah_dev` | `sarah@vibechat.app` |
| **Rahul Sharma** | Startup Founder | `rahul_s` | `rahul@vibechat.app` |
| **Priya Patel** | UX Lead | `priya_ux` | `priya@vibechat.app` |
| **John Doe** | Music Producer | `john_doe` | `john@vibechat.app` |

---

## 🚀 Deployment Guide

### Deploying to Vercel (Next.js Application)
1. Push your repository to **GitHub**.
2. Connect your repo in the [Vercel Dashboard](https://vercel.com).
3. Under **Environment Variables**, add:
   - `DATABASE_URL`: Connection string to PostgreSQL (e.g. Neon, Supabase, or Vercel Postgres).
   - `AUTH_SECRET`: A secure 32+ character random string.
   - `NEXT_PUBLIC_APP_URL`: Your production Vercel domain (e.g. `https://vibechat.vercel.app`).
   - `AI_API_KEY`: *(Optional)* OpenAI or Groq API key.
4. Set Build Command: `prisma generate && next build`.
5. Deploy!

### Deploying to Render (Persistent Real-Time Service)
For continuous WebSocket server support:
1. In the [Render Dashboard](https://render.com), create a **Web Service**.
2. Set Environment to **Node**.
3. Build Command: `npm install && npx prisma generate && npm run build`.
4. Start Command: `npm run server` or `npx tsx server.ts`.
5. Under Environment Variables, set `PORT=3000`, `DATABASE_URL`, and `AUTH_SECRET`.

---

## 📄 License
MIT License © VibeChat Platform Inc.
