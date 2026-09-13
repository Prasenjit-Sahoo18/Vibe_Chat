"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { PaymentModal } from "../chat/PaymentModal";
import { Modal } from "../common/Modal";

export function PaymentsDashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "debit" | "credit">("all");
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<any | null>(null);

  useEffect(() => {
    loadTransactions();
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        const others = (data.users || []).filter((u: any) => u.id !== user?.id);
        setUsersList(others);
        if (others.length > 0) setSelectedRecipient(others[0]);
      })
      .catch(console.error);
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/payments");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalSent = transactions
    .filter((t) => t.senderId === user?.id)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReceived = transactions
    .filter((t) => t.receiverId === user?.id)
    .reduce((sum, t) => sum + t.amount, 0);

  const walletBalance = 5000 + totalReceived - totalSent;

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "debit") return t.senderId === user?.id;
    if (filterType === "credit") return t.receiverId === user?.id;
    return true;
  });

  return (
    /* Full height container — never overflows the viewport */
    <div className="h-full w-full flex flex-col overflow-hidden bg-slate-950/60">

      {/* ── Header bar ── */}
      <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-950">
        <div>
          <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            Payments &amp; Wallet
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              Sandbox
            </span>
          </h1>
          <p className="text-xs text-slate-400">Peer-to-peer transfers &amp; ledger</p>
        </div>

        {/* Recipient + Send button — always visible in header */}
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Send To
            </label>
            <select
              value={selectedRecipient?.id || ""}
              onChange={(e) => {
                const u = usersList.find((u: any) => u.id === e.target.value);
                setSelectedRecipient(u || null);
              }}
              className="px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 min-w-[150px]"
            >
              {usersList.length === 0 && <option value="">Loading…</option>}
              {usersList.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.name} (@{u.username})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => selectedRecipient && setShowSendModal(true)}
            disabled={!selectedRecipient}
            className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Send Money
          </button>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {/* Balance */}
          <div className="relative overflow-hidden col-span-1 rounded-2xl bg-gradient-to-br from-indigo-900/70 via-purple-900/40 to-slate-900 border border-indigo-500/30 p-4 shadow-xl">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 mb-1 flex items-center gap-1">
              Balance <ShieldCheck className="w-3 h-3 text-emerald-400" />
            </p>
            <div className="text-2xl font-black text-white">
              ₹{walletBalance.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">VibeChat Wallet</p>
          </div>

          {/* Total Sent */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>Sent</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-xl font-bold text-slate-100 mt-1">
              ₹{totalSent.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">Peer transfers</span>
          </div>

          {/* Total Received */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>Received</span>
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              ₹{totalReceived.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">Credits &amp; payouts</span>
          </div>
        </div>

        {/* Transactions */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow flex flex-col overflow-hidden">
          {/* Filter header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 flex-shrink-0">
            <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
            <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
              {(["all", "debit", "credit"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                    filterType === t
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* List — scrolls inside the card */}
          <div className="overflow-y-auto" style={{ maxHeight: "340px" }}>
            {isLoading ? (
              <p className="text-center text-slate-500 py-8 text-xs">Loading transactions…</p>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-20 text-indigo-400" />
                No transactions for this filter.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/40">
                {filteredTransactions.map((tx) => {
                  const isDebit = tx.senderId === user?.id;
                  const otherUser = isDebit ? tx.receiver : tx.sender;
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isDebit ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {isDebit ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-white">
                            {isDebit ? `To ${otherUser?.name || "User"}` : `From ${otherUser?.name || "User"}`}
                          </h4>
                          <p className="text-[10px] text-slate-400">
                            {tx.note || "Transfer via VibeChat"} · {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className={`text-xs font-bold ${isDebit ? "text-slate-200" : "text-emerald-400"}`}>
                            {isDebit ? "-" : "+"}₹{tx.amount.toLocaleString()}
                          </div>
                          <span className="text-[9px] text-emerald-400 font-medium">Successful</span>
                        </div>
                        <button
                          onClick={() => setSelectedReceipt(tx)}
                          title="View Receipt"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Payment Modal */}
      {showSendModal && selectedRecipient && (
        <PaymentModal
          isOpen={showSendModal}
          onClose={() => setShowSendModal(false)}
          recipient={selectedRecipient}
          onPaymentSuccess={() => loadTransactions()}
        />
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title="Official Receipt"
        >
          <div className="text-center space-y-4">
            <div>
              <div className="text-3xl font-black text-white">
                ₹{selectedReceipt.amount.toLocaleString()}
              </div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Settled &amp; Confirmed
              </span>
            </div>
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID</span>
                <span className="font-mono text-white text-[10px]">{selectedReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sender</span>
                <span className="text-white">{selectedReceipt.sender?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Receiver</span>
                <span className="text-white">{selectedReceipt.receiver?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date &amp; Time</span>
                <span className="text-slate-300">{new Date(selectedReceipt.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gateway</span>
                <span className="text-indigo-400 uppercase font-semibold">Razorpay / UPI</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-colors"
            >
              Close Receipt
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
