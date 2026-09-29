'use client';

import React, { useState, useMemo } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Chip } from '@/components/ui/Chip';
import { MemberFilter } from '@/components/money/MemberFilter';
import { TransactionList } from '@/components/money/TransactionList';
import { Plus, Calendar, Clock, Filter, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export default function MoneyPage() {
  const { transactions, members, activeMemberId, openQuickAdd } = useFamilyStore();
  const [filterType, setFilterType] = useState<string>('all');
  
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
          <button
            type="button"
            onClick={() => openQuickAdd('expense')}
            className="px-3.5 py-1.5 bg-gold text-navy font-black text-xs rounded-xl flex items-center gap-1 shadow-sm hover:bg-gold-light active:scale-95 transition-all"
            title="Add Transaction"
          >
            <Plus size={15} /> + लेन-देन जोड़ें
          </button>
        }
      />

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
