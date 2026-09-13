"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, ArrowRight, ShieldCheck, Lock, User, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const demoAccounts = [
    { username: "alex_vibe", name: "Alex Rivera", role: "Product Designer" },
    { username: "sarah_dev", name: "Sarah Chen", role: "Full-Stack Architect" },
    { username: "rahul_s", name: "Rahul Sharma", role: "Startup Founder" },
    { username: "priya_ux", name: "Priya Patel", role: "UX Lead" },
    { username: "john_doe", name: "John Doe", role: "Music Producer" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await login(identifier, password);
    if (res.success) {
      router.push("/chat");
    } else {
      setError(res.error || "Invalid username or password");
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (username: string) => {
    setError(null);
    setIsSubmitting(true);
    const res = await demoLogin(username);
    if (res.success) {
      router.push("/chat");
    } else {
      setError(res.error || "Demo login failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-white text-xl">
                V
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight text-white">VibeChat</span>
          </Link>
          <h2 className="text-xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-400">
            Sign in to access your real-time chats, music statuses, and payments.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="alex_vibe or alex@vibechat.app"
                required
                autoComplete="off"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? "Signing In..." : "Sign In to VibeChat"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Accounts Quick Selector */}
        <div className="pt-3 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 1-Click Demo Accounts
            </span>
            <span className="text-[10px] text-slate-500">No password required</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((d) => (
              <button
                key={d.username}
                type="button"
                onClick={() => handleDemoLogin(d.username)}
                disabled={isSubmitting}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 text-left transition-all group"
              >
                <p className="text-xs font-semibold text-white group-hover:text-indigo-300 truncate">
                  {d.name}
                </p>
                <span className="text-[10px] text-slate-400 block truncate">{d.role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Link to Register */}
        <p className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-400 font-bold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
