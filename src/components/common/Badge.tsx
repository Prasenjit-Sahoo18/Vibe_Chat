import React from "react";
import { CheckCircle } from "lucide-react";

export function VerifiedBadge({ className = "w-4 h-4 text-cyan-400" }: { className?: string }) {
  return <CheckCircle className={`inline-block ml-1 flex-shrink-0 fill-cyan-500/20 ${className}`} />;
}

export function UnreadBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full min-w-[18px] h-[18px] shadow-sm animate-pulse">
      {count > 99 ? "99+" : count}
    </span>
  );
}
