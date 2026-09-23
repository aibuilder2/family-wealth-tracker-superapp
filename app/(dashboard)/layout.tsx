'use client';

import React from 'react';
import { Bell, Shield, Briefcase, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';
import { AddTransactionModal } from '@/components/money/AddTransactionModal';
import { useFamilyStore } from '@/lib/store/familyStore';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { family, reminders } = useFamilyStore();
  const upcomingCount = reminders.length;

  return (
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-6 bg-[#E7E1D2]">
      {/* Mobile Device Frame Mockup */}
      <div className="w-full sm:max-w-[430px] h-screen sm:h-[840px] bg-navy sm:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col sm:border-[8px] sm:border-[#0B1B28] relative">
        
        {/* Top Family Header */}
        <header className="flex items-center justify-between px-5 pt-4 pb-3 bg-navy text-paper shrink-0 z-10 border-b border-navy-light/40">
          <div>
            <Link href="/home" className="flex items-center gap-1.5">
              <span className="text-base font-semibold font-serif tracking-tight text-paper hover:text-gold-soft transition-colors">
                {family.name}
              </span>
            </Link>
            <p className="text-[10px] text-gold-soft font-mono tracking-wider">
              PARIVAR WEALTH VAULT
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/business"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-navy-light text-gold-soft hover:bg-navy-light/80 transition-colors"
              title="Business Hub (व्यापार व प्रोजेक्ट्स)"
            >
              <Briefcase size={14} />
            </Link>
            <Link
              href="/advisor"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-navy-light text-gold-soft hover:bg-navy-light/80 transition-colors"
              title="AI Financial Advisor"
            >
              <Sparkles size={14} />
            </Link>
            <Link
              href="/reminders"
              className="relative w-8 h-8 rounded-full flex items-center justify-center bg-navy-light text-gold-soft hover:bg-navy-light/80 transition-colors"
              title="Reminders"
            >
              <Bell size={15} />
              {upcomingCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-coral text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                  {upcomingCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Dynamic Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-[#EFEAE0] no-scrollbar pb-6">
          {children}
        </main>

        {/* Persistent Bottom Nav */}
        <BottomNav />

        {/* Global Quick Add Popup */}
        <AddTransactionModal />
      </div>
    </div>
  );
}
