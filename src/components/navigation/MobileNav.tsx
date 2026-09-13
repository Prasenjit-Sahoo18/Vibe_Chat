"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  CircleDot,
  CreditCard,
  Sparkles,
  Settings,
} from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Chats", href: "/chat", icon: MessageSquare },
    { label: "Status", href: "/status", icon: CircleDot },
    { label: "AI", href: "/ai", icon: Sparkles },
    { label: "Payments", href: "/payments", icon: CreditCard },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 flex items-center justify-around px-2 z-40">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href === "/chat" && pathname.startsWith("/chat"));
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all ${
              isActive ? "text-indigo-400 font-semibold scale-105" : "text-slate-400 hover:text-white"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
