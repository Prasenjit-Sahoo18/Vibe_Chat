"use client";

import React, { useState } from "react";
import { PaymentCardData } from "@/lib/types";
import { CheckCircle, Clock, XCircle, ArrowUpRight, ArrowDownLeft, Receipt, ShieldCheck } from "lucide-react";
import { Modal } from "../common/Modal";

interface PaymentCardProps {
  payment: PaymentCardData;
  isMeSender: boolean;
}

export function PaymentCard({ payment, isMeSender }: PaymentCardProps) {
  const [showReceipt, setShowReceipt] = useState(false);

  const isSuccess = payment.status === "successful";
  const currencySymbol = payment.currency === "INR" ? "₹" : "$";

  return (
    <>
      <div className="w-72 sm:w-80 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/60 p-4 shadow-xl text-white">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-xl ${
                isMeSender ? "bg-indigo-500/20 text-indigo-400" : "bg-emerald-500/20 text-emerald-400"
              }`}
            >
              {isMeSender ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {isMeSender ? "Payment Sent" : "Payment Received"}
              </span>
              <p className="text-sm font-medium text-slate-200 truncate">
                {isMeSender ? `To ${payment.receiverName || "User"}` : `From ${payment.senderName || "User"}`}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-1">
            {isSuccess ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle className="w-3 h-3" /> Paid
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <Clock className="w-3 h-3" /> Pending
              </span>
            )}
          </div>
        </div>

        {/* Amount Display */}
        <div className="my-3 py-2 text-center bg-slate-950/60 rounded-xl border border-slate-800/60">
          <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            {currencySymbol}
            {payment.amount.toLocaleString()}
          </div>
          {payment.note && (
            <p className="text-xs text-slate-400 mt-1 italic px-2 truncate">"{payment.note}"</p>
          )}
        </div>

        {/* Footer info & Receipt button */}
        <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
          <span className="flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {payment.receiptNumber}
          </span>

          <button
            onClick={() => setShowReceipt(true)}
            className="flex items-center gap-1 font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <Receipt className="w-3.5 h-3.5" />
            Receipt
          </button>
        </div>
      </div>

      {/* Detailed Receipt Modal */}
      <Modal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        title="Payment Receipt"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="text-2xl font-bold text-white mb-1">
            {currencySymbol}{payment.amount.toLocaleString()}
          </h4>
          <p className="text-xs text-emerald-400 font-semibold mb-6 uppercase tracking-wider">
            Transaction Successful
          </p>

          <div className="w-full bg-slate-950 rounded-xl p-4 border border-slate-800 text-left space-y-3 text-xs mb-6">
            <div className="flex justify-between">
              <span className="text-slate-400">Receipt ID</span>
              <span className="font-mono text-white">{payment.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sender</span>
              <span className="text-white font-medium">{payment.senderName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Recipient</span>
              <span className="text-white font-medium">{payment.receiverName}</span>
            </div>
            {payment.note && (
              <div className="flex justify-between">
                <span className="text-slate-400">Note</span>
                <span className="text-slate-300 italic">{payment.note}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Gateway</span>
              <span className="text-indigo-400 font-semibold uppercase">Razorpay / Unified UPI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Timestamp</span>
              <span className="text-slate-300">{new Date(payment.createdAt).toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => setShowReceipt(false)}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Done
          </button>
        </div>
      </Modal>
    </>
  );
}
