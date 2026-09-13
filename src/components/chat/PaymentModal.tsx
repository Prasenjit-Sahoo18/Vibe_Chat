"use client";

import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { CreditCard, Send, ShieldCheck } from "lucide-react";
import { User } from "@/lib/types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: User | { id: string; name: string; username: string };
  conversationId?: string;
  onPaymentSuccess?: (payment: any) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  recipient,
  conversationId,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [amount, setAmount] = useState("500");
  const [currency, setCurrency] = useState("INR");
  const [note, setNote] = useState("Transfer via VibeChat 🚀");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickAmounts = ["100", "250", "500", "1000", "2000"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: recipient.id,
          amount: numAmount,
          currency,
          note,
          conversationId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Payment failed");
      }

      if (onPaymentSuccess) {
        onPaymentSuccess(data.payment);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Payment">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient info */}
        <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white text-sm">
            {recipient.name[0]}
          </div>
          <div>
            <span className="text-xs text-slate-400">Paying to:</span>
            <h4 className="text-sm font-semibold text-white">{recipient.name}</h4>
            <span className="text-xs text-slate-500">@{recipient.username}</span>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-indigo-400">
              {currency === "INR" ? "₹" : "$"}
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="1"
              step="any"
              required
              className="w-full pl-12 pr-24 py-3 bg-slate-950 border border-slate-800 rounded-xl text-2xl font-bold text-white focus:outline-none focus:border-indigo-500"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-slate-900 text-xs font-semibold text-slate-300 rounded-lg px-2 py-1.5 border border-slate-700 focus:outline-none"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          {/* Quick amount chips */}
          <div className="flex items-center gap-2 mt-2">
            {quickAmounts.map((q) => (
              <button
                type="button"
                key={q}
                onClick={() => setAmount(q)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  amount === q
                    ? "bg-indigo-600/30 border-indigo-500 text-indigo-300 font-semibold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                +{q}
              </button>
            ))}
          </div>
        </div>

        {/* Note / Purpose */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Note / Purpose
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a remark (e.g. Split dinner, freelance gig)"
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Secured via Razorpay & Unified Instant Settlements. Mock sandbox mode active.</span>
        </div>

        {error && <p className="text-xs text-rose-400">{error}</p>}

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <span>Processing Transfer...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send {currency === "INR" ? "₹" : "$"}{amount}</span>
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}
