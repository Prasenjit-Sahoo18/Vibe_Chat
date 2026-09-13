import React from "react";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  isOnline?: boolean;
  className?: string;
}

export function Avatar({ src, name, size = "md", isOnline, className = "" }: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  const indicatorSizes = {
    sm: "w-2.5 h-2.5 bottom-0 right-0",
    md: "w-3 h-3 bottom-0 right-0",
    lg: "w-3.5 h-3.5 bottom-0.5 right-0.5",
    xl: "w-4 h-4 bottom-1 right-1",
  };

  const getInitials = (n: string) => {
    if (!n) return "V";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover border border-slate-700/60 shadow-sm`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-sm border border-slate-700/50`}
        >
          {getInitials(name)}
        </div>
      )}

      {isOnline !== undefined && (
        <span
          className={`absolute rounded-full border-2 border-slate-900 ${
            isOnline ? "bg-emerald-500" : "bg-slate-500"
          } ${indicatorSizes[size]}`}
          title={isOnline ? "Online" : "Offline"}
        />
      )}
    </div>
  );
}
