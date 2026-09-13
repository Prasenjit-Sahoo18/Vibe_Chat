"use client";

import React, { useState, useEffect } from "react";
import { X, Bell, CheckCheck, CreditCard, Flame, MessageSquare } from "lucide-react";
import { InAppNotification } from "@/lib/types";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationsChanged?: () => void;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  onNotificationsChanged,
}: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      if (onNotificationsChanged) onNotificationsChanged();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const renderIcon = (type: string) => {
    if (type === "payment") return <CreditCard className="w-4 h-4 text-emerald-400" />;
    if (type === "reaction") return <Flame className="w-4 h-4 text-rose-400" />;
    return <MessageSquare className="w-4 h-4 text-indigo-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-slate-900 border-l border-slate-800 shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Notifications</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-end mb-3">
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-1">
            {isLoading ? (
              <p className="text-xs text-slate-500 text-center py-6">Loading alerts...</p>
            ) : notifications.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    n.isRead
                      ? "bg-slate-950/60 border-slate-800/80 text-slate-400"
                      : "bg-indigo-600/10 border-indigo-500/30 text-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      {renderIcon(n.type)}
                    </div>
                    <span className="text-xs font-bold text-white flex-1 truncate">
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 ml-8">{n.body}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors mt-4"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
}
