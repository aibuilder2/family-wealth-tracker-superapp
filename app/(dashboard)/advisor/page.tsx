'use client';

import React, { useState, useEffect } from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Sparkles, TrendingUp, ShieldCheck, Lightbulb, Send, Bot, RefreshCw } from 'lucide-react';

export default function AdvisorPage() {
  const { liquidWealth, fixedWealth, totalWealth, totalIncomeThisMonth, totalExpenseThisMonth, goals, reminders } = useFamilyStore();
  
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);

  const fetchAdvice = async (customQuery?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: customQuery || query,
          wealthData: {
            liquidWealth,
            fixedWealth,
            totalWealth,
            totalIncome: totalIncomeThisMonth,
            totalExpense: totalExpenseThisMonth,
            goalsCount: goals.length,
            remindersCount: reminders.length
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.insights) {
          setInsights(data.insights);
        }
      }
    } catch (e) {
      console.error('Advisor fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, [liquidWealth, fixedWealth, totalIncomeThisMonth, totalExpenseThisMonth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchAdvice(query);
    setQuery('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <ScreenHeader
          title="AI Wealth & Stock Advisor"
          subtitle="Real-time wealth analysis & AI recommendations based on your family portfolio"
        />
        <button
          onClick={() => fetchAdvice()}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#10263A] border border-[#B98B2A]/30 text-[#E5C378] text-xs font-bold flex items-center gap-2 hover:bg-[#15324d] transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Analysis
        </button>
      </div>

      {/* Interactive AI Query Box */}
      <div className="bg-[#10263A]/85 border border-[#B98B2A]/30 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Bot className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E5C378]" />
            <input
              type="text"
              placeholder="Ask AI anything about your investments, taxes, stock picks, or family goals..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#081522]/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#B98B2A] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-3 rounded-xl bg-[#B98B2A] hover:bg-[#c59a35] text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" /> Ask
          </button>
        </form>
      </div>

      {/* Dynamic AI Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item, i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#10263A]/80 border border-white/10 shadow-lg hover:border-[#B98B2A]/40 transition-all space-y-2 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5C378] px-2.5 py-1 bg-[#B98B2A]/15 border border-[#B98B2A]/30 rounded-md">
                {item.tag}
              </span>
              <Sparkles size={15} className="text-[#E5C378]" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">{item.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
