'use client';

import React, { useState, useMemo } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Chip } from '@/components/ui/Chip';
import { MemberFilter } from '@/components/money/MemberFilter';
import { TransactionList } from '@/components/money/TransactionList';
import { Plus, Calendar, Clock, Filter, ArrowUpRight, ArrowDownRight, RefreshCw, PieChart, Sparkles, ShieldCheck } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import Link from 'next/link';
import { SmartWhatsAppImporter } from '@/components/money/SmartWhatsAppImporter';

export default function MoneyPage() {
  const { transactions, members, activeMemberId, openQuickAdd, cleanDuplicateTransactions } = useFamilyStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [showImporter, setShowImporter] = useState(false);
  
  // Time Range Filter (USER EXPLICIT REQUIREMENT: "time ke hisab se nikalne ka option")
  const [timeRange, setTimeRange] = useState<'all' | 'this_month' | 'last_month' | 'last_3_months' | 'custom'>('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const filterChips = [
    { key: 'all', label: 'सब प्रकार' },
    { key: 'expense', label: 'ख़र्च (Expense)' },
    { key: 'income', label: 'आमदनी (Income)' },
    { key: 'online', label: 'Online / UPI' },
    { key: 'offline', label: 'Cash (नकद)' },
    { key: 'udhar', label: 'उधारी (Udhar)' },
  ];

  // Current Month String (YYYY-MM)
  const currentMonthStr = useMemo(() => {
    return new Date().toISOString().substring(0, 7);
  }, []);

  // Last Month String (YYYY-MM)
  const lastMonthStr = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().substring(0, 7);
  }, []);

  // 3 Months Ago Date
  const threeMonthsAgoDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return d.toISOString().split('T')[0];
  }, []);

  // Apply filters
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Member filter
      if (activeMemberId && tx.member_id !== activeMemberId) {
        return false;
      }

      // 2. Type/Mode filter
      if (filterType === 'expense' && tx.type !== 'expense') return false;
      if (filterType === 'income' && tx.type !== 'income') return false;
      if (filterType === 'online' && tx.mode !== 'online') return false;
      if (filterType === 'offline' && tx.mode !== 'offline') return false;
      if (filterType === 'udhar' && !(tx.type === 'udhar_given' || tx.type === 'udhar_taken')) return false;

      // 3. Time Range Filter
      const txDate = tx.txn_date || '';
      if (timeRange === 'this_month') {
        if (!txDate.startsWith(currentMonthStr)) return false;
      } else if (timeRange === 'last_month') {
        if (!txDate.startsWith(lastMonthStr)) return false;
      } else if (timeRange === 'last_3_months') {
        if (txDate < threeMonthsAgoDate) return false;
      } else if (timeRange === 'custom') {
        if (customStartDate && txDate < customStartDate) return false;
        if (customEndDate && txDate > customEndDate) return false;
      }

      return true;
    });
  }, [transactions, activeMemberId, filterType, timeRange, currentMonthStr, lastMonthStr, threeMonthsAgoDate, customStartDate, customEndDate]);

  // Financial Totals for Filtered Transactions
  const filteredIncome = useMemo(() => {
    return filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [filtered]);

  const filteredExpense = useMemo(() => {
    return filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [filtered]);

  return (
    <div className="space-y-3">
      <ScreenHeader
        title="Money"
        subtitle="सब खर्च, आमदनी, उधारी व समयवार रिकॉर्ड"
        action={
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setShowImporter(!showImporter)}
              className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-emerald-500/25 transition cursor-pointer"
              title="WhatsApp / व्यापार ऐप से खर्च इम्पोर्ट करें"
            >
              <Sparkles size={14} className="text-emerald-400" />
              <span>📲 व्यापार इम्पोर्ट</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const res = cleanDuplicateTransactions();
                if (res.countRemoved > 0) {
                  alert(`सफलतापूर्वक ${res.countRemoved} डुप्लिकेट एंट्रियां हटा दी गईं! अब ऐप में कुल ${res.totalRemaining} सही एंट्रियां सुरक्षित हैं।`);
                } else {
                  alert(`कोई डुप्लिकेट एंट्री नहीं मिली। आपके सभी ${res.totalRemaining} ट्रांजेक्शन यूनिक हैं।`);
                }
              }}
              className="px-2.5 py-1.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-rose-500/25 transition cursor-pointer"
              title="डबल/डुप्लिकेट एंट्रियों को साफ करें"
            >
              <ShieldCheck size={14} className="text-rose-400" />
              <span>🧹 डुप्लिकेट हटाएं</span>
            </button>
            <Link
              href="/analytics"
              className="px-2.5 py-1.5 bg-paper border border-paper-dim text-navy font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-paper-dim transition"
              title="खर्च विश्लेषण व पैसिव रेशियो"
            >
              <PieChart size={14} className="text-gold-dark" />
              <span>एनालिटिक्स</span>
            </Link>
            <button
              type="button"
              onClick={() => openQuickAdd('expense')}
              className="px-3.5 py-1.5 bg-gold text-navy font-black text-xs rounded-xl flex items-center gap-1 shadow-sm hover:bg-gold-light active:scale-95 transition-all cursor-pointer"
              title="Add Transaction"
            >
              <Plus size={15} /> + लेन-देन
            </button>
          </div>
        }
      />

      {/* WhatsApp / Vyapar App Importer Collapsible */}
      {showImporter && (
        <div className="px-4 animate-in fade-in slide-in-from-top-3 duration-200">
          <SmartWhatsAppImporter onClose={() => setShowImporter(false)} />
        </div>
      )}

      {/* Quick Launch Banner if importer is closed */}
      {!showImporter && (
        <div className="px-4">
          <div
            onClick={() => setShowImporter(true)}
            className="p-3 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-amber-950/20 border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition shadow-xs group"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl">
                <Sparkles size={16} />
              </span>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                  📲 WhatsApp / व्यापार ऐप से बल्क में खर्च जोड़ें (Universal Date-Wise)
                </div>
                <div className="text-[11px] text-slate-400">
                  महीनेवार रिपोर्ट का टेक्स्ट यहाँ पेस्ट करें—तारीख, सदस्य और रकम अपने आप पहचान ली जाएगी।
                </div>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 bg-emerald-500 text-slate-950 rounded-xl shrink-0">
              पेस्ट करें ➜
            </span>
          </div>
        </div>
      )}

      {/* Time Range Filter Bar (Time ke hisab se nikalne ka option) */}
      <div className="px-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span className="font-bold flex items-center gap-1">
            <Clock size={13} className="text-gold" />
            समय सीमा (Time Range):
          </span>
          <span className="text-[10px] font-mono">
            {filtered.length} लेन-देन मिले
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setTimeRange('this_month')}
            className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
              timeRange === 'this_month'
                ? 'bg-gold text-navy border-gold shadow-xs font-black'
                : 'bg-paper border-paper-dim text-ink-muted hover:bg-paper-dim'
            }`}
          >
            इस महीने
          </button>

          <button
            type="button"
            onClick={() => setTimeRange('last_month')}
            className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
              timeRange === 'last_month'
                ? 'bg-gold text-navy border-gold shadow-xs font-black'
                : 'bg-paper border-paper-dim text-ink-muted hover:bg-paper-dim'
            }`}
          >
            पिछला माह
          </button>

          <button
            type="button"
            onClick={() => setTimeRange('last_3_months')}
            className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
              timeRange === 'last_3_months'
                ? 'bg-gold text-navy border-gold shadow-xs font-black'
                : 'bg-paper border-paper-dim text-ink-muted hover:bg-paper-dim'
            }`}
          >
            3 माह
          </button>

          <button
            type="button"
            onClick={() => setTimeRange('all')}
            className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
              timeRange === 'all'
                ? 'bg-gold text-navy border-gold shadow-xs font-black'
                : 'bg-paper border-paper-dim text-ink-muted hover:bg-paper-dim'
            }`}
          >
            सभी समय
          </button>

          <button
            type="button"
            onClick={() => setTimeRange('custom')}
            className={`py-1.5 px-2 rounded-xl border text-center transition-all col-span-4 sm:col-span-1 ${
              timeRange === 'custom'
                ? 'bg-gold text-navy border-gold shadow-xs font-black'
                : 'bg-paper border-paper-dim text-ink-muted hover:bg-paper-dim'
            }`}
          >
            कस्टम तारीख 🔍
          </button>
        </div>

        {/* Custom Date Range Inputs */}
        {timeRange === 'custom' && (
          <div className="p-3 bg-paper rounded-2xl border border-paper-dim flex flex-col sm:flex-row items-center gap-2 text-xs animate-in fade-in">
            <div className="flex-1 w-full">
              <span className="text-[10px] text-ink-muted block mb-0.5">तारीख से (From):</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
              />
            </div>
            <div className="flex-1 w-full">
              <span className="text-[10px] text-ink-muted block mb-0.5">तारीख तक (To):</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
              />
            </div>
          </div>
        )}
      </div>

      {/* Filtered Range Quick Summary Banner */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-2 bg-paper p-3 rounded-2xl border border-paper-dim shadow-xs">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-green/10 text-green shrink-0">
              <ArrowUpRight size={16} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-ink-muted uppercase block">आमदनी (Income)</span>
              <Mono className="text-sm font-black text-green">
                ₹{filteredIncome.toLocaleString('en-IN')}
              </Mono>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-paper-dim pl-3">
            <div className="p-2 rounded-xl bg-coral/10 text-coral shrink-0">
              <ArrowDownRight size={16} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-ink-muted uppercase block">कुल ख़र्च (Expense)</span>
              <Mono className="text-sm font-black text-coral">
                ₹{filteredExpense.toLocaleString('en-IN')}
              </Mono>
            </div>
          </div>
        </div>
      </div>

      {/* Type Filter Chips */}
      <div className="px-4 flex overflow-x-auto pb-1 no-scrollbar gap-1.5">
        {filterChips.map((chip) => (
          <Chip
            key={chip.key}
            active={filterType === chip.key}
            onClick={() => setFilterType(chip.key)}
          >
            {chip.label}
          </Chip>
        ))}
      </div>

      {/* Member Filter Bar */}
      <div className="px-4">
        <MemberFilter />
      </div>

      {/* Grouped Transaction List (With Edit & Delete) */}
      <div className="px-4 pt-1">
        <TransactionList
          transactions={filtered}
          members={members}
          groupByDate={true}
          showDelete={true}
        />
      </div>
    </div>
  );
}
