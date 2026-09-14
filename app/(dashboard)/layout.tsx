'use client';

import React, { useState } from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';
import { AddTransactionModal } from '@/components/money/AddTransactionModal';
import { useFamilyStore } from '@/lib/store/familyStore';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { family, reminders, triggerEmergencySOS, currentUser } = useFamilyStore();
  const [sosStatus, setSosStatus] = useState<string | null>(null);

  const handleSOS = () => {
    const res = triggerEmergencySOS();
    setSosStatus(res.message);
    setTimeout(() => setSosStatus(null), 6000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-6 bg-[#E7E1D2]">
      <div className="w-full sm:max-w-[430px] h-screen sm:h-[840px] bg-navy sm:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col sm:border-[8px] sm:border-[#0B1B28] relative">
        
        <header className="flex items-center justify-between px-5 pt-4 pb-3 bg-navy text-paper shrink-0 z-10 border-b border-navy-light/40">
          <div>
            <Link href="/home" className="flex items-center gap-1.5">
              <span className="text-base font-semibold font-serif tracking-tight text-paper hover:text-gold-soft transition-colors">
                {family.name}
              </span>
            </Link>
            <p className="text-[10px] text-gold-soft font-mono tracking-wider">
              {currentUser.name} ({currentUser.role})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSOS}
              className="px-2 py-1 bg-coral text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow animate-pulse hover:opacity-90 transition-all"
              title="Emergency SOS"
            >
              <AlertTriangle size={12} /> SOS
            </button>

            <Link
              href="/calendar"
              className="relative w-8 h-8 rounded-full flex items-center justify-center bg-navy-light text-gold-soft hover:bg-navy-light/80 transition-colors"
              title="Calendar Reminders"
            >
              <Bell size={15} />
              {reminders.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-coral text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                  {reminders.length}
                </span>
              )}
            </Link>
          </div>
        </header>

        {sosStatus && (
          <div className="bg-coral text-white text-xs p-3 font-semibold text-center shrink-0 animate-bounce">
            {sosStatus}
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-[#EFEAE0] no-scrollbar pb-6">
          {children}
        </main>

        <BottomNav />
        <AddTransactionModal />
      </div>
    </div>
  );
}
