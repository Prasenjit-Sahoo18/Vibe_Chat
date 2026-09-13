"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Avatar } from "../common/Avatar";
import {
  User,
  Shield,
  Palette,
  Bell,
  Check,
  Smartphone,
  Save,
  Moon,
  Sun,
  Laptop,
} from "lucide-react";

export function SettingsView() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "privacy" | "notifications">("profile");
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [readReceipts, setReadReceipts] = useState(true);
  const [lastSeenPrivacy, setLastSeenPrivacy] = useState("everyone");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, avatarUrl }),
      });

      if (res.ok) {
        updateUser({ name, bio, avatarUrl });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "appearance", label: "Appearance & Theme", icon: Palette },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-950/60 p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Platform Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize your profile, adjust visual vibe, and configure privacy controls.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Tab List */}
        <div className="w-full lg:w-64 flex lg:flex-col gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all flex-shrink-0 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Box */}
        <div className="flex-1 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                <Avatar src={avatarUrl || user?.avatarUrl} name={name || "User"} size="xl" />
                <div>
                  <h3 className="text-base font-bold text-white">{name}</h3>
                  <span className="text-xs text-slate-400">@{user?.username}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Bio / About
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  <Check className="w-4 h-4" /> Profile updated successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 text-sm transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </form>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  Theme Preference
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "dark", label: "Dark Vibe", icon: Moon },
                    { id: "light", label: "Clean Light", icon: Sun },
                    { id: "system", label: "System Sync", icon: Laptop },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id as any)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                          isSelected
                            ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <Icon className="w-6 h-6 mb-2" />
                        <span className="text-xs">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-2">
                <span className="font-semibold text-white block">VibeChat Design System</span>
                <p>
                  Crafted with an original cyber indigo, violet and cyan identity. High-contrast typography and fluid micro-animations ensure optimal readability and aesthetics.
                </p>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="space-y-6 max-w-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Read Receipts</h4>
                    <p className="text-xs text-slate-400">Show double check marks when messages are read</p>
                  </div>
                  <button
                    onClick={() => setReadReceipts(!readReceipts)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      readReceipts ? "bg-indigo-600" : "bg-slate-800"
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                        readReceipts ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Last Seen & Online Presence</h4>
                    <p className="text-xs text-slate-400">Control who can see when you are active</p>
                  </div>
                  <select
                    value={lastSeenPrivacy}
                    onChange={(e) => setLastSeenPrivacy(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="contacts">My Contacts Only</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-semibold text-white">Audio Chimes & Tones</h4>
                  <p className="text-xs text-slate-400">Play modern chime for incoming messages and payments</p>
                </div>
                <button
                  className="w-11 h-6 rounded-full bg-indigo-600 transition-colors relative"
                >
                  <span className="block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 right-1" />
                </button>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-semibold text-white">Payment Notifications</h4>
                  <p className="text-xs text-slate-400">Instant in-app alerts when funds are sent or received</p>
                </div>
                <button
                  className="w-11 h-6 rounded-full bg-indigo-600 transition-colors relative"
                >
                  <span className="block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 right-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
