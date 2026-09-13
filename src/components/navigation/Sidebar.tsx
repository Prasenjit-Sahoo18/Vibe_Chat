"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Sparkles,
  CircleDot,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Avatar } from "../common/Avatar";
import { UnreadBadge } from "../common/Badge";

interface SidebarProps {
  unreadNotificationCount?: number;
  onOpenNotifications?: () => void;
  onOpenSearch?: () => void;
}

export function Sidebar({
  unreadNotificationCount = 0,
  onOpenNotifications,
  onOpenSearch,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, demoLogin } = useAuth();
  const { isDark, setTheme } = useTheme();
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const navItems = [
    { label: "Chats", href: "/chat", icon: MessageSquare },
    { label: "Status", href: "/status", icon: CircleDot },
    { label: "AI Assistant", href: "/ai", icon: Sparkles, badge: "AI" },
    { label: "Payments", href: "/payments", icon: CreditCard },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const demoUsers = [
    { username: "alex_vibe", name: "Alex Rivera", role: "Designer" },
    { username: "sarah_dev", name: "Sarah Chen", role: "Architect" },
    { username: "rahul_s", name: "Rahul Sharma", role: "Founder" },
    { username: "priya_ux", name: "Priya Patel", role: "UX Lead" },
    { username: "john_doe", name: "John Doe", role: "Producer" },
  ];

  return (
    <aside className="hidden md:flex flex-col items-center justify-between w-20 py-5 bg-slate-950 border-r border-slate-800/80 z-30 select-none">
      {/* Brand Logo */}
      <div className="flex flex-col items-center gap-6">
        <Link href="/chat" className="group relative flex items-center justify-center">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-lg group-hover:shadow-indigo-500/30 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 text-xl tracking-tighter">
                V
              </span>
            </div>
          </div>
          <span className="absolute -bottom-5 text-[10px] font-semibold text-slate-400 tracking-wider">
            Vibe
          </span>
        </Link>

        {/* Global Search Button */}
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            title="Global Search"
            className="p-3 mt-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/60 transition-all hover:scale-105"
          >
            <Search className="w-5 h-5" />
          </button>
        )}

        {/* Navigation links */}
        <nav className="flex flex-col items-center gap-2 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === "/chat" && pathname.startsWith("/chat"));
            return (
              <Link
                key={item.label}
                href={item.href}
                title={item.label}
                className={`relative p-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 scale-105"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1 py-0.2 text-[9px] font-black uppercase tracking-wider bg-cyan-500 text-slate-950 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-4 relative">
        {/* Notifications */}
        {onOpenNotifications && (
          <button
            onClick={onOpenNotifications}
            title="Notifications"
            className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
            )}
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          title="Toggle Theme"
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Demo Switcher Quick Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            title="Switch Demo User"
            className="p-2.5 rounded-xl text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all"
          >
            <Users className="w-5 h-5" />
          </button>

          {showDemoMenu && (
            <div className="absolute left-14 bottom-0 w-52 bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 border-b border-slate-800">
                Switch Demo Account
              </div>
              <div className="flex flex-col gap-1 mt-1">
                {demoUsers.map((d) => (
                  <button
                    key={d.username}
                    onClick={async () => {
                      await demoLogin(d.username);
                      setShowDemoMenu(false);
                      window.location.reload();
                    }}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors ${
                      user?.username === d.username
                        ? "bg-indigo-600 text-white font-semibold"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span>{d.name}</span>
                    <span className="text-[10px] opacity-70">{d.role}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Current User Profile & Logout */}
        {user && (
          <div className="flex flex-col items-center gap-2 pt-2 border-t border-slate-800/80">
            <Link href="/settings" title={`${user.name} (@${user.username})`}>
              <Avatar
                src={user.avatarUrl}
                name={user.name}
                size="sm"
                isOnline={user.isOnline}
              />
            </Link>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
