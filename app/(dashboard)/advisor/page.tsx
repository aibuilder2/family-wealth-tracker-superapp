'use client';

import React, { useState, useEffect } from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Sparkles, RefreshCw, AlertCircle, TrendingUp, ShieldCheck, Lightbulb } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

interface InsightItem {
  title: string;
  desc: string;
  tag: string;
  color?: string;
}

export default function AdvisorPage() {
  const {
    totalIncomeThisMonth,
    totalExpenseThisMonth,
    totalWealth,
    liquidWealth,
    fixedWealth,
    goals,
    transactions,
  } = useFamilyStore();

  const [insights, setInsights] = useState<InsightItem[]>([
    {
      title: "Priya ki Education Goal",
      desc: "Aapka education goal 62% pura ho gaya hai. Agle 6 mahine me ₹31,000/month save karke aap target date se pehle reach kar lenge.",
      tag: "Goal Strategy",
      color: "gold",
    },
    {
      title: "Bank FD vs Equity Split",
      desc: "Aapka 55% fixed wealth aur 45% liquid wealth me hai, jo ek balanced family portfolio ke liye ideal hai.",
      tag: "Asset Allocation",
      color: "green",
    },
    {
      title: "Car Insurance Renewal",
      desc: "Car insurance 12 din me due hai. Pehle se renew karne par NCB (No Claim Bonus) protect rahega.",
      tag: "Reminder Alert",
      color: "coral",
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

  const fetchAiAdvice = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalIncome: totalIncomeThisMonth,
          totalExpense: totalExpenseThisMonth,
          totalWealth,
          liquidWealth,
          fixedWealth,
          goals,
          recentTransactions: transactions.slice(0, 8),
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.insights) && data.insights.length > 0) {
        setInsights(data.insights);
        setLastRefreshed(new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error('Error getting AI advice:', err);
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'green':
        return { tag: 'text-green bg-green/10', border: 'border-green/20' };
      case 'coral':
        return { tag: 'text-coral bg-coral/10', border: 'border-coral/20' };
      case 'gold':
      default:
        return { tag: 'text-gold bg-gold/10', border: 'border-gold/20' };
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <ScreenHeader
        title="AI Financial Advisor"
        subtitle="Aapke parivar ke live data par smart analysis"
      />

      {/* Snapshot Strip */}
      <div className="px-4">
        <div className="p-3.5 bg-paper rounded-xl border border-paper-dim shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-ink-muted uppercase tracking-wider font-bold">Parivar Net Wealth</span>
            <Mono className="text-base font-bold text-ink block">
              ₹{totalWealth.toLocaleString('en-IN')}
            </Mono>
          </div>
          <button
            onClick={fetchAiAdvice}
            disabled={loading}
            className="px-3 py-2 rounded-lg bg-gold hover:bg-gold-soft text-navy text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'AI Soch Raha Hai...' : 'Naya Analysis Lein'}</span>
          </button>
        </div>
      </div>

      {lastRefreshed && (
        <div className="px-4 text-right">
          <span className="text-[10px] text-ink-muted">Aakhri update: {lastRefreshed}</span>
        </div>
      )}

      {/* AI Insights List */}
      <div className="px-4 space-y-3">
        {insights.map((item, i) => {
          const colors = getColorClasses(item.color);
          return (
            <div
              key={i}
              className={`p-4 rounded-xl bg-paper border ${colors.border} shadow-sm space-y-2 animate-fade-in`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${colors.tag}`}>
                  {item.tag}
                </span>
                <Sparkles size={14} className="text-gold" />
              </div>
              <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
