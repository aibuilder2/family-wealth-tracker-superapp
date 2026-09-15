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
    family,
    transactions,
    members,
    goals,
    assets,
    totalIncomeThisMonth,
    totalExpenseThisMonth,
    totalUdharGiven,
    isDemoMode,
    loadDemoData,
    resetToClean,
    openQuickAdd,
  } = useFamilyStore();

  const recentTransactions = transactions.slice(0, 4);
  const primaryGoal = goals[0];
  const goalPercent = primaryGoal
    ? Math.min(100, Math.round(((primaryGoal.saved_amount || 0) / (primaryGoal.target_amount || 1)) * 100))
    : 0;

  return (
    <div className="space-y-4 pt-2">
      {/* Demo Mode or Clean Workspace Notice */}
      {isDemoMode ? (
        <div className="mx-4 p-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-base">🧪</span>
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">Sample Demo Mode Active</p>
              <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80">Ye sirf test sample data hai</p>
            </div>
          </div>
          <button
            onClick={resetToClean}
            className="px-2.5 py-1 text-[11px] font-bold bg-navy text-paper rounded-xl hover:bg-black transition-colors"
          >
            🧹 Clean Dashboard
          </button>
        </div>
      ) : transactions.length === 0 && assets.length === 0 && (
        <div className="mx-4 p-4 bg-paper rounded-2xl border border-gold/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold flex items-center gap-1">
              ✨ Naya Clean Workspace
            </span>
            <span className="text-[10px] font-mono bg-gold/10 text-gold px-2 py-0.5 rounded-full font-bold">
              0 Dummy Data
            </span>
          </div>
          <p className="text-xs text-ink-muted">
            Swagat hai! Yeh aapka private dashboard hai. Yahan koi purana dummy data nahi hai. Apna pehla kharch, aamadni ya asset jodein.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => openQuickAdd('income')}
              className="px-3 py-1.5 bg-navy text-paper rounded-xl text-xs font-semibold hover:bg-black transition-all"
            >
              + Aamadni Jodein
            </button>
            <button
              onClick={loadDemoData}
              className="px-3 py-1.5 bg-paper-dim text-ink rounded-xl text-xs font-medium hover:bg-paper-dim/80 transition-all"
            >
              📥 Sample Template Load Karein
            </button>
          </div>
        </div>
      )}

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
          <p className="text-ink-muted text-[11px] mt-0.5">is mahine ka kharch</p>
        </div>
      </div>

      {/* 3. Featured Goal Widget */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="font-serif font-semibold text-ink text-xs uppercase tracking-wider">
            Family Goal (Lakshya)
          </h2>
          <Link href="/wealth/goals" className="text-xs text-gold font-bold hover:underline flex items-center gap-0.5">
            Sabhi Lakshya Dekho <ChevronRight size={14} />
          </Link>
        </div>
        {primaryGoal ? (
          <Link 
            href="/wealth/goals" 
            className="rounded-xl p-4 bg-paper border border-paper-dim flex items-center gap-4 shadow-sm hover:border-gold/50 transition-all block group"
          >
            <div className="flex items-center gap-4 w-full">
              <ProgressRing percent={goalPercent} size={74} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-serif font-bold text-ink text-sm truncate group-hover:text-gold transition-colors">
                    {primaryGoal.title}
                  </p>
                  <span className="text-[10px] font-bold text-gold px-1.5 py-0.5 bg-gold/10 rounded">
                    {goalPercent}%
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-0.5">
                  Target: <Mono>₹{primaryGoal.target_amount.toLocaleString('en-IN')}</Mono>
                </p>
                <p className="text-xs text-ink-muted">
                  Jama: <Mono className="text-gold font-bold">₹{primaryGoal.saved_amount.toLocaleString('en-IN')}</Mono>
                </p>
              </div>
            </div>
          </Link>
        ) : (
          <Link
            href="/wealth/goals"
            className="rounded-xl p-4 bg-paper border border-dashed border-paper-dim hover:border-gold/50 flex items-center justify-between text-ink-muted hover:text-ink transition-colors block"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🎯</span>
              <div>
                <p className="text-xs font-semibold text-ink">Naya Lakshya (Goal) Set Karein</p>
                <p className="text-[10px] text-ink-muted">Ghar, bacho ki padhai, car ya retirement save karein</p>
              </div>
            </div>
            <span className="text-xs text-gold font-bold">+ Goal Jodein</span>
          </Link>
        )}
      </div>

      {/* Quick Business Hub, Gold Loans & Rentals Strip */}
      <div className="px-4 grid grid-cols-3 gap-2">
        <Link 
          href="/gold-loans"
          className="rounded-xl p-2.5 bg-gradient-to-br from-[#2a2010] to-[#1c160c] border border-yellow-500/40 flex flex-col justify-between shadow-sm group hover:border-yellow-400 transition-all block"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">🥇</span>
            <span className="px-1 py-0.2 text-[8px] font-bold bg-yellow-500/20 text-yellow-300 rounded">GIRVI</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-white group-hover:text-yellow-300 transition-colors leading-tight">Gold Loans</p>
            <p className="text-[9px] text-slate-300 truncate">75% LTV & Parchi</p>
          </div>
        </Link>

        <Link 
          href="/rentals"
          className="rounded-xl p-2.5 bg-gradient-to-br from-[#1c2a38] to-navy border border-amber-500/30 flex flex-col justify-between shadow-sm group hover:border-amber-400 transition-all block"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">🏠</span>
            <span className="px-1 py-0.2 text-[8px] font-bold bg-amber-500/20 text-amber-300 rounded">RENT</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-white group-hover:text-amber-300 transition-colors leading-tight">Rentals & PG</p>
            <p className="text-[9px] text-slate-300 truncate">Rooms & Meter</p>
          </div>
        </Link>

        <Link 
          href="/stocks"
          className="rounded-xl p-2.5 bg-gradient-to-br from-navy via-[#1b3b5a] to-navy border border-gold/30 flex flex-col justify-between shadow-sm group hover:border-gold transition-all block"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">📈</span>
            <span className="px-1 py-0.2 text-[8px] font-bold bg-gold/20 text-gold-soft rounded">LIVE</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-white group-hover:text-gold-soft transition-colors leading-tight">Stock AI Hub</p>
            <p className="text-[9px] text-slate-300 truncate">Picks & Academy</p>
          </div>
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
