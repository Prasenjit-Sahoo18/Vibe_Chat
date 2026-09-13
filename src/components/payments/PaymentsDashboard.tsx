"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Receipt,
  Plus,
  ShieldCheck,
  Download,
  Filter,
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
        setUsersList(data.users || []);
        if (data.users && data.users.length > 0) {
          setSelectedRecipient(data.users[0]);
        }
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
    <div className="flex-1 h-full overflow-y-auto bg-slate-950/60 p-4 sm:p-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Payments & Wallet
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              UPI / Razorpay Sandbox
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Instant peer-to-peer transfers, split bills, and financial ledger.
          </p>
        </div>

        <button
          onClick={() => setShowSendModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-90 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 text-sm self-start sm:self-auto transition-all hover:scale-105"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Send Money</span>
        </button>
      </div>

      {/* Wallet Balance & Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Balance Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 p-6 shadow-2xl">
          <div className="flex items-center justify-between text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Available Balance</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ₹{walletBalance.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-2">Verified VibeChat Wallet</p>
        </div>

        {/* Total Sent */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Sent</span>
            <ArrowUpRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 my-2">
            ₹{totalSent.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Peer transfers & group splits</span>
        </div>

        {/* Total Received */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Received</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 my-2">
            ₹{totalReceived.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Direct credits & payouts</span>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">Recent Transactions</h3>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {(["all", "debit", "credit"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
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

        {/* Transactions List */}
        {isLoading ? (
          <p className="text-center text-slate-500 py-8 text-sm">Loading transactions...</p>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-30 text-indigo-400" />
            No transactions found for this filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/40">
            {filteredTransactions.map((tx) => {
              const isDebit = tx.senderId === user?.id;
              const otherUser = isDebit ? tx.receiver : tx.sender;

              return (
                <div
                  key={tx.id}
                  className="py-3.5 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        isDebit ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {isDebit ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {isDebit ? `To ${otherUser?.name || "User"}` : `From ${otherUser?.name || "User"}`}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {tx.note || "Transfer via VibeChat"} • {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div
                        className={`text-sm font-bold ${
                          isDebit ? "text-slate-200" : "text-emerald-400"
                        }`}
                      >
                        {isDebit ? "-" : "+"}₹{tx.amount.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium">Successful</span>
                    </div>

                    <button
                      onClick={() => setSelectedReceipt(tx)}
                      title="View Receipt"
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <Receipt className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Send Payment Modal from Dashboard */}
      {showSendModal && selectedRecipient && (
        <PaymentModal
          isOpen={showSendModal}
          onClose={() => setShowSendModal(false)}
          recipient={selectedRecipient}
          onPaymentSuccess={() => {
            loadTransactions();
          }}
        />
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title="Official Receipt"
        >
          <div className="text-center">
            <div className="text-3xl font-black text-white mb-1">
              ₹{selectedReceipt.amount.toLocaleString()}
            </div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Settled & Confirmed
            </span>

            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-left text-xs space-y-2.5 my-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID</span>
                <span className="font-mono text-white">{selectedReceipt.receiptNumber}</span>
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
                <span className="text-slate-400">Date & Time</span>
                <span className="text-slate-300">
                  {new Date(selectedReceipt.createdAt).toLocaleString()}
                </span>
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
