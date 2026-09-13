"use client";

import React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Sparkles,
  CircleDot,
  CreditCard,
  BarChart3,
  Shield,
  Music2,
  ArrowRight,
  Zap,
  Lock,
  Smartphone,
  CheckCircle2,
  Users,
  Play,
  Flame,
} from "lucide-react";

export default function LandingPage() {
  const demoAccounts = [
    { name: "Alex Rivera", role: "Product Designer", username: "alex_vibe" },
    { name: "Sarah Chen", role: "Full-Stack Architect", username: "sarah_dev" },
    { name: "Rahul Sharma", role: "Startup Founder", username: "rahul_s" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[140px] pointer-events-none" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-white text-lg">
                V
              </div>
            </div>
            <span className="text-xl font-black tracking-tight text-white">VibeChat</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#stories" className="hover:text-white transition-colors">24h Stories</a>
            <a href="#payments" className="hover:text-white transition-colors">P2P Payments</a>
            <a href="#ai" className="hover:text-white transition-colors">AI Assistant</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-bold text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/chat"
              className="text-xs sm:text-sm font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-95 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              Start Chatting
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Sparkles className="w-3.5 h-3.5" />
          The Next-Gen Social Communication Platform
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Feel the connection.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
            Chat, stories, music & commerce.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          VibeChat is engineered for the modern social web. Experience zero-latency WebSocket messaging, 24-hour soundtracked status stories, in-chat peer payments, and an integrated AI copilot.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/chat"
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-90 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>Start Chatting</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/register"
            className="px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-base transition-colors"
          >
            Create Account
          </Link>

          <Link
            href="/login"
            className="px-7 py-3.5 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-base transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Open Demo</span>
          </Link>
        </div>

        {/* Hero Interactive Mockup Showcase */}
        <div className="pt-12 max-w-5xl mx-auto">
          <div className="rounded-3xl bg-slate-900/70 border border-slate-800/80 p-2 sm:p-4 shadow-2xl backdrop-blur-2xl">
            <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
              {/* Window chrome header */}
              <div className="h-10 bg-slate-900 border-b border-slate-800/80 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">vibechat.app/chat</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Real-time Active
                </div>
              </div>

              {/* Mock Chat Grid Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 min-h-[380px] text-left">
                {/* Conversations Sidebar Preview */}
                <div className="border-r border-slate-800 p-4 space-y-3 hidden md:block">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Recent Conversations
                  </div>
                  {[
                    { name: "Sarah Chen", msg: "Just pushed the WebSocket updates 🚀", time: "10:45 AM", online: true },
                    { name: "⚡ VibeChat Core Team", msg: "Priya: Check out the new UI palette 💜", time: "10:30 AM", online: false },
                    { name: "Rahul Sharma", msg: "Sent ₹500 for lunch 🍕", time: "Yesterday", online: false },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl flex items-center gap-3 ${
                        i === 0 ? "bg-indigo-600/20 border border-indigo-500/30" : "bg-slate-900/40"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                        {c.name[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-white truncate">{c.name}</h4>
                          <span className="text-[10px] text-slate-500">{c.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{c.msg}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Stream Preview */}
                <div className="md:col-span-2 p-4 sm:p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs text-white">
                        S
                      </div>
                      <div className="p-3 bg-slate-800 rounded-2xl rounded-tl-none text-xs text-slate-100 max-w-sm">
                        Hey Alex! The new 24h status music picker is live. Check out this track preview! 🎵
                      </div>
                    </div>

                    <div className="flex gap-2.5 flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                        A
                      </div>
                      <div className="p-3 bg-indigo-600 rounded-2xl rounded-tr-none text-xs text-white max-w-sm shadow-md">
                        Awesome! Sent you the design sprint bonus bonus via in-chat P2P payment:
                      </div>
                    </div>

                    {/* Interactive Mock Payment Card */}
                    <div className="flex justify-end">
                      <div className="w-72 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700 p-3.5 shadow-xl text-white">
                        <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                          <span className="text-indigo-400 font-bold uppercase tracking-wider">
                            Payment Sent
                          </span>
                          <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            ✓ Successful
                          </span>
                        </div>
                        <div className="text-center py-2">
                          <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            ₹1,200
                          </div>
                          <span className="text-[11px] text-slate-400">Sprint design bonus 🎯</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Mock bar */}
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Type a message, attach file or send peer funds...</span>
                    <div className="flex items-center gap-2 text-indigo-400">
                      <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold">₹ Pay</span>
                      <span className="p-1.5 rounded-lg bg-indigo-600 text-white">Send</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Unrivaled Feature Suite
          </h2>
          <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Built for how people connect today.
          </h3>
          <p className="text-sm sm:text-base text-slate-400">
            Every layer of VibeChat is designed from scratch with modern ergonomics, original visuals, and high-performance engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Real-Time WebSocket Engine",
              desc: "Instant delivery ticks, online/offline presence tracking, live typing indicators, and room synchronization.",
              icon: Zap,
              color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
            },
            {
              title: "24h Ephemeral Stories with Music",
              desc: "Share your status with background soundtrack backing from royalty-free audio libraries, custom gradients, and reactions.",
              icon: Music2,
              color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
            },
            {
              title: "In-Chat Peer-to-Peer Payments",
              desc: "Transfer money directly inside conversations. Real-time receipts, wallet balance tracking, and Razorpay/UPI integration.",
              icon: CreditCard,
              color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
            },
            {
              title: "VibeChat AI Copilot",
              desc: "Ask questions, debug code, summarize long chat transcripts, and generate status quotes with streaming-like AI.",
              icon: Sparkles,
              color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
            },
            {
              title: "Voice Notes & Audio Waveforms",
              desc: "Record high-fidelity voice messages with live visualizer waveform playback and instant download support.",
              icon: MessageSquare,
              color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
            },
            {
              title: "Social Analytics Dashboard",
              desc: "Interactive Recharts data on daily message velocity, media storage distribution, and payment volumes.",
              icon: BarChart3,
              color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
            },
          ].map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all hover:scale-[1.02] shadow-xl space-y-3"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${f.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">{f.title}</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-950/60 via-purple-950/30 to-slate-900 border border-indigo-500/20 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Enterprise-Grade Privacy & Security
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Zero compromises on your data.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Bcrypt salted password hashing, HTTP-only JWT sessions, Prisma SQL injection immunity, strict Zod validation, and zero plaintext credential exposure.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Session Expiration Control
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Read Receipts Privacy
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sandbox Mock Ledger
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cloud Media Validation
              </span>
            </div>
          </div>

          <div className="w-full md:w-80 p-6 bg-slate-950/90 rounded-2xl border border-slate-800 text-center space-y-3 shadow-xl">
            <Lock className="w-10 h-10 mx-auto text-indigo-400" />
            <h4 className="text-base font-bold text-white">GitHub & Cloud Ready</h4>
            <p className="text-xs text-slate-400">
              Ready for one-click deployment on <strong>Vercel</strong> and <strong>Render</strong> with turnkey environment configuration.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center px-4 max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Ready to experience VibeChat?
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          Join thousands of users connecting through instant messages, 24h music stories, and effortless peer payments.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/chat"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-90 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
          >
            Launch VibeChat Web
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">VibeChat</span>
          <span>© {new Date().getFullYear()} VibeChat Platform Inc. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6 text-slate-400">
          <Link href="/chat" className="hover:text-white">Web App</Link>
          <Link href="/status" className="hover:text-white">Stories</Link>
          <Link href="/payments" className="hover:text-white">Payments</Link>
          <Link href="/ai" className="hover:text-white">VibeChat AI</Link>
          <Link href="/login" className="hover:text-white">Demo Switcher</Link>
        </div>
      </footer>
    </div>
  );
}
