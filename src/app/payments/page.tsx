"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/navigation/Sidebar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { PaymentsDashboard } from "@/components/payments/PaymentsDashboard";

export default function PaymentsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading]);

  if (isLoading || !user) return null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        <PaymentsDashboard />
      </main>
      <MobileNav />
    </div>
  );
}
