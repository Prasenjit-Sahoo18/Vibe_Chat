"use client";

import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  MessageSquare,
  Share2,
  Eye,
  CreditCard,
  TrendingUp,
  Activity,
  HardDrive,
} from "lucide-react";

export function AnalyticsDashboard() {
  const messageActivityData = [
    { day: "Mon", messages: 140, calls: 12 },
    { day: "Tue", messages: 230, calls: 18 },
    { day: "Wed", messages: 310, calls: 24 },
    { day: "Thu", messages: 280, calls: 15 },
    { day: "Fri", messages: 450, calls: 32 },
    { day: "Sat", messages: 520, calls: 40 },
    { day: "Sun", messages: 410, calls: 28 },
  ];

  const paymentVolumeData = [
    { month: "May", volume: 12000 },
    { month: "Jun", volume: 18500 },
    { month: "Jul", volume: 24000 },
    { month: "Aug", volume: 31500 },
    { month: "Sep", volume: 42000 },
  ];

  const mediaDistribution = [
    { name: "Photos", value: 45, color: "#6366f1" },
    { name: "Voice Notes", value: 25, color: "#8b5cf6" },
    { name: "Documents", value: 18, color: "#06b6d4" },
    { name: "Videos", value: 12, color: "#ec4899" },
  ];

  const stats = [
    { label: "Total Messages", value: "2,480", change: "+18%", icon: MessageSquare, color: "text-indigo-400" },
    { label: "Status Story Views", value: "1,120", change: "+34%", icon: Eye, color: "text-cyan-400" },
    { label: "P2P Payment Volume", value: "₹42,000", change: "+28%", icon: CreditCard, color: "text-emerald-400" },
    { label: "Media & Cloud Shared", value: "3.2 GB", change: "+12%", icon: HardDrive, color: "text-purple-400" },
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-950/60 p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Social Analytics & Activity
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
            Real-Time Metrics
          </span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Insights into your chat frequency, media uploads, and social engagement.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {s.label}
                </span>
                <div className="text-2xl font-black text-white mt-1">{s.value}</div>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> {s.change} this week
                </span>
              </div>
              <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800/80 ${s.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages Trend Area Chart */}
        <div className="lg:col-span-2 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Messaging Velocity (Daily)
            </h3>
            <span className="text-xs text-slate-400">Past 7 days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={messageActivityData}>
                <defs>
                  <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" textAnchor="end" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="messages"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMsg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Media Distribution Pie Chart */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-400" />
              Shared Media Types
            </h3>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mediaDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mediaDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {mediaDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300">{item.name}</span>
                <span className="font-bold text-white ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Volume Bar Chart */}
        <div className="lg:col-span-3 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Monthly Peer-to-Peer Transfer Volume (INR ₹)
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">Consistently Scaling</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentVolumeData}>
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="volume" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
