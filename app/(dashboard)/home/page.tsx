'use client';

import React from 'react';
import Link from 'next/link';
import { useFamilyStore } from '@/lib/store/familyStore';
import { NetWealthCard } from '@/components/wealth/NetWealthCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Mono } from '@/components/ui/Mono';
import { TransactionList } from '@/components/money/TransactionList';
import { BusinessShortcutsGrid } from '@/components/home/BusinessShortcutsGrid';
import { ArrowUpRight, ArrowDownRight, ChevronRight, HandCoins, PieChart, Bot, Zap } from 'lucide-react';

export default function HomePage() {
  const {
    transactions,
    members,
    goals,
    totalIncomeThisMonth,
    totalExpenseThisMonth,
    totalUdharGiven,
    openQuickAdd,
  } = useFamilyStore();

  const recentTransactions = transactions.slice(0, 4);
  const primaryGoal = goals.length > 0 ? goals[0] : null;
  const goalPercent = primaryGoal && primaryGoal.target_amount > 0
    ? Math.min(100, Math.round((primaryGoal.saved_amount / primaryGoal.target_amount) * 100))
    : 0;

  return (
    <div className="space-y-4 pt-4">
      {/* 1. Net Wealth Card */}
      <div className="px-4">
        <NetWealthCard />
      </div>

      {/* 1.5 Quick Business Hub Shortcuts Grid */}
      <div className="px-4">
        <BusinessShortcutsGrid />
      </div>

      {/* 2. Quick Monthly Metrics Grid */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {/* Income Card */}
        <div className="rounded-xl p-4 bg-paper border border-paper-dim shadow-sm">
          <div className="flex items-center gap-1 text-green text-[11px] font-semibold">
            <ArrowUpRight size={14} />
            <span>INCOME</span>
          </div>
          <Mono className="text-[18px] font-semibold text-ink block mt-0.5">
            ₹{totalIncomeThisMonth.toLocaleString('en-IN')}
          </Mono>
          <p className="text-ink-muted text-[11px] mt-0.5">इस महीने</p>
        </div>

        {/* Expense Card */}
        <div className="rounded-xl p-4 bg-paper border border-paper-dim shadow-sm">
          <div className="flex items-center gap-1 text-coral text-[11px] font-semibold">
            <ArrowDownRight size={14} />
            <span>EXPENSE</span>
          </div>
          <Mono className="text-[18px] font-semibold text-ink block mt-0.5">
            ₹{totalExpenseThisMonth.toLocaleString('en-IN')}
          </Mono>
          <p className="text-ink-muted text-[11px] mt-0.5">
            {totalExpenseThisMonth > 0 ? 'कुल ख़र्च' : '0 ख़र्च दर्ज'}
          </p>
        </div>
      </div>

      {/* 2.5 Quick Analytics & Passive Ratio Teaser */}
      <div className="px-4">
        <Link 
          href="/analytics" 
          className="rounded-xl px-4 py-2.5 bg-paper border border-paper-dim flex items-center justify-between shadow-xs hover:border-gold/50 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-gold/15 text-gold-dark rounded-lg">
              <PieChart size={15} />
            </span>
            <div>
              <p className="text-xs font-bold text-ink group-hover:text-gold-dark transition-colors">
                खर्च हॉटस्पॉट्स व पैसिव इनकम रेशियो
              </p>
              <p className="text-[10px] text-ink-muted">
                किस मद में ज्यादा खर्च हुआ & वित्तीय स्वतंत्रता स्कोर देखें
              </p>
            </div>
          </div>
          <ChevronRight size={14} className="text-ink-muted group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 2.6 AI Stock Scanner & Chanakya Advisor Teaser */}
      <div className="px-4">
        <Link 
          href="/advisor" 
          className="rounded-xl px-4 py-2.5 bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-transparent border border-emerald-500/25 flex items-center justify-between shadow-xs hover:border-emerald-500/50 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg">
              <Zap size={15} />
            </span>
            <div>
              <p className="text-xs font-bold text-ink group-hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                <span>चाणक्य AI: लाइव स्टॉक स्कैनर व रडार</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-700 font-bold">GPT-4o-Mini</span>
              </p>
              <p className="text-[10px] text-ink-muted">
                निफ्टी 50, ब्लूचिप स्टॉक्स व रेंटल री-इन्वेस्टमेंट सिग्नल्स देखें →
              </p>
            </div>
          </div>
          <ChevronRight size={14} className="text-ink-muted group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 3. Featured Goal Widget */}
      <div className="px-4">
        {primaryGoal ? (
          <Link href="/wealth" className="rounded-xl p-4 bg-paper border border-paper-dim flex items-center gap-4 shadow-sm hover:border-gold/50 transition-all block">
            <div className="flex items-center gap-4 w-full">
              <ProgressRing percent={goalPercent} size={80} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-serif font-bold text-ink text-sm truncate">
                    {primaryGoal.title}
                  </p>
                  <span className="text-[10px] font-bold text-gold hover:underline">लक्ष्य विवरण / बदलें →</span>
                </div>
                <p className="text-xs text-ink-muted mt-0.5">
                  Goal: <Mono>₹{primaryGoal.target_amount.toLocaleString('en-IN')}</Mono>
                </p>
                <p className="text-xs text-ink-muted">
                  Jama: <Mono className="text-gold font-semibold">₹{primaryGoal.saved_amount.toLocaleString('en-IN')}</Mono>
                </p>
              </div>
            </div>
          </Link>
        ) : (
          <div className="rounded-xl p-3.5 bg-paper border border-dashed border-paper-dim flex items-center justify-between shadow-sm">
            <div>
              <p className="font-serif font-bold text-ink text-xs">कोई Financial Goal नहीं है</p>
              <p className="text-[11px] text-ink-muted">घर, शिक्षा या शादी का लक्ष्य तय करें</p>
            </div>
            <Link
              href="/wealth"
              className="px-3 py-1.5 bg-gold/15 text-gold-dark hover:bg-gold/25 font-bold text-xs rounded-xl transition-all"
            >
              + Goal जोड़ें
            </Link>
          </div>
        )}
      </div>

      {/* 4. Udhar Summary Bar if exists */}
      {totalUdharGiven > 0 && (
        <div className="px-4">
          <div className="rounded-xl px-4 py-3 bg-gold/10 border border-gold/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HandCoins size={16} className="text-gold" />
              <div>
                <p className="text-xs font-semibold text-ink">Bahar Udhar Diya Hua Hai</p>
                <p className="text-[11px] text-ink-muted">Wapas lena baaki hai</p>
              </div>
            </div>
            <Mono className="text-xs font-bold text-gold">
              ₹{totalUdharGiven.toLocaleString('en-IN')}
            </Mono>
          </div>
        </div>
      )}

      {/* 5. Recent Activity Feed */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif font-semibold text-ink text-sm">
            Recent Activity
          </h2>
          <Link href="/money" className="text-xs text-gold font-medium hover:underline flex items-center gap-0.5">
            Sab dekho <ChevronRight size={14} />
          </Link>
        </div>

        <TransactionList
          transactions={recentTransactions}
          members={members}
          groupByDate={false}
        />
      </div>
    </div>
  );
}
