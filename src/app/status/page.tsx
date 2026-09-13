"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/navigation/Sidebar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Avatar } from "@/components/common/Avatar";
import { StatusItem } from "@/lib/types";
import { StatusViewer } from "@/components/status/StatusViewer";
import { CreateStatusModal } from "@/components/status/CreateStatusModal";
import { Plus, CircleDot, Music2, Eye, Flame, Heart, Sparkles } from "lucide-react";

export default function StatusPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [statuses, setStatuses] = useState<StatusItem[]>([]);
  const [activeStatusIndex, setActiveStatusIndex] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const loadStatuses = async () => {
    setIsFetching(true);
    try {
      const res = await fetch("/api/status");
      if (res.ok) {
        const data = await res.json();
        setStatuses(data.statuses || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (user) {
      loadStatuses();
    }
  }, [user, isLoading]);

  if (isLoading || !user) return null;

  const myStatuses = statuses.filter((s) => s.userId === user.id);
  const otherStatuses = statuses.filter((s) => s.userId !== user.id);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 space-y-6 pb-20 md:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Vibe Stories & Statuses
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold border border-purple-500/20 flex items-center gap-1">
                <Music2 className="w-3.5 h-3.5" /> 24h Music Status
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Share ephemeral moments, visuals, and thoughts with soundtrack backing.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 text-sm self-start sm:self-auto transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Create Status</span>
          </button>
        </div>

        {/* My Status Section */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            My Status
          </h3>

          <div className="flex items-center justify-between">
            <div
              onClick={() => {
                if (myStatuses.length > 0) {
                  const idx = statuses.findIndex((s) => s.id === myStatuses[0].id);
                  setActiveStatusIndex(idx);
                } else {
                  setIsCreateModalOpen(true);
                }
              }}
              className="flex items-center gap-4 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-cyan-400 group-hover:scale-105 transition-transform">
                  <Avatar src={user.avatarUrl} name={user.name} size="lg" />
                </div>
                {myStatuses.length === 0 && (
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white border-2 border-slate-900">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {myStatuses.length > 0 ? "My Active Status" : "Add to My Status"}
                </h4>
                <p className="text-xs text-slate-400">
                  {myStatuses.length > 0
                    ? `${myStatuses.length} update • ${myStatuses[0].views?.length || 0} views`
                    : "Tap to share photos, text or music vibes"}
                </p>
              </div>
            </div>

            {myStatuses.length > 0 && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                title="Add another status"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Recent Updates Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recent Stories from Friends ({otherStatuses.length})
          </h3>

          {isFetching ? (
            <p className="text-sm text-slate-500 py-6">Loading stories...</p>
          ) : otherStatuses.length === 0 ? (
            <div className="rounded-3xl bg-slate-900/40 border border-slate-800/80 p-8 text-center text-slate-400">
              <CircleDot className="w-10 h-10 mx-auto mb-2 opacity-30 text-indigo-400" />
              <p className="text-sm font-medium text-slate-300">No new status updates</p>
              <p className="text-xs text-slate-500 mt-1">
                When friends post 24-hour vibes with music, they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {otherStatuses.map((st, i) => (
                <div
                  key={st.id}
                  onClick={() => {
                    const idx = statuses.findIndex((s) => s.id === st.id);
                    setActiveStatusIndex(idx);
                  }}
                  className={`relative h-64 rounded-3xl overflow-hidden cursor-pointer group shadow-xl border border-slate-800/80 transition-all hover:scale-[1.02] bg-gradient-to-br ${
                    st.bgColor || "from-indigo-600 to-purple-800"
                  }`}
                >
                  {/* Media overlay if present */}
                  {st.mediaUrl && (
                    <img
                      src={st.mediaUrl}
                      alt="Status"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Gradient shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                  {/* Content Container */}
                  <div className="relative z-10 p-4 h-full flex flex-col justify-between text-white">
                    {/* Top Author */}
                    <div className="flex items-center gap-2.5">
                      <div className="ring-2 ring-indigo-400 rounded-full p-0.5">
                        <Avatar src={st.user.avatarUrl} name={st.user.name} size="sm" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate drop-shadow">{st.user.name}</h4>
                        <span className="text-[10px] text-white/70">
                          {new Date(st.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>

                    {/* Middle Text / Caption */}
                    {st.content && (
                      <p className="text-sm font-bold line-clamp-3 drop-shadow leading-snug">
                        {st.content}
                      </p>
                    )}

                    {/* Bottom Music Info */}
                    {st.music && (
                      <div className="flex items-center gap-1.5 text-[11px] bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 self-start">
                        <Music2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span className="truncate max-w-[130px]">{st.music.title}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <MobileNav />

      {/* Status Fullscreen Viewer Player */}
      {activeStatusIndex !== null && (
        <StatusViewer
          statuses={statuses}
          initialIndex={activeStatusIndex}
          onClose={() => setActiveStatusIndex(null)}
          onReply={(statusId, replyText) => {
            alert(`Reply sent to story: "${replyText}"`);
          }}
          onReact={async (statusId, emoji) => {
            await fetch(`/api/status/${statusId}/react`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ emoji }),
            });
          }}
        />
      )}

      {/* Create Status Modal */}
      <CreateStatusModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onStatusCreated={loadStatuses}
      />
    </div>
  );
}
