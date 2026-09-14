'use client';

import React from 'react';
import Link from 'next/link';
import { useFamilyStore } from '@/lib/store/familyStore';
import { NetWealthCard } from '@/components/wealth/NetWealthCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Mono } from '@/components/ui/Mono';
import { TransactionList } from '@/components/money/TransactionList';
import { ArrowUpRight, ArrowDownRight, ChevronRight, HandCoins } from 'lucide-react';

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
  const primaryGoal = goals[0] || {
    title: 'Priya ki Education',
    target_amount: 500000,
    saved_amount: 310000,
  };
  const goalPercent = Math.min(
    100,
    Math.round((primaryGoal.saved_amount / primaryGoal.target_amount) * 100)
  );

  return (
    <div className="space-y-4 pt-4">
      {/* 1. Net Wealth Card */}
      <div className="px-4">
        <NetWealthCard />
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
          <p className="text-ink-muted text-[11px] mt-0.5">is mahine</p>
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
          <p className="text-ink-muted text-[11px] mt-0.5">pichle mahine se 6% kam</p>
        </div>
      </div>

      {/* 3. Featured Goal Widget */}
      {primaryGoal && (
        <div className="px-4">
          <div className="rounded-xl p-4 bg-paper border border-paper-dim flex items-center gap-4 shadow-sm">
            <ProgressRing percent={goalPercent} size={80} />
            <div className="flex-1 min-w-0">
              <p className="font-serif font-semibold text-ink text-sm truncate">
                {primaryGoal.title}
              </p>
              <p className="text-xs text-ink-muted mt-0.5">
                Goal: <Mono>₹{primaryGoal.target_amount.toLocaleString('en-IN')}</Mono>
              </p>
              <p className="text-xs text-ink-muted">
                Jama: <Mono className="text-gold font-semibold">₹{primaryGoal.saved_amount.toLocaleString('en-IN')}</Mono>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stock & AI Trading Spotlight */}
      <div className="px-4">
        <Link 
          href="/stocks"
          className="rounded-xl p-4 bg-gradient-to-r from-navy via-[#1b3b5a] to-navy border border-gold/30 flex items-center justify-between shadow-md group hover:border-gold transition-all block"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold-soft shrink-0">
              <span className="text-lg">📈</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white group-hover:text-gold-soft">Stock & AI Trading Hub</span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-gold/20 text-gold-soft rounded">LIVE</span>
              </div>
              <p className="text-[11px] text-slate-300">AI Top 5 EOD Picks, F&O Heatmap & 11-Lesson Academy</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-gold-soft group-hover:translate-x-1 transition-transform" />
        </Link>
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
