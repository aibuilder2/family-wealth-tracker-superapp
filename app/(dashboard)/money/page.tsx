'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Chip } from '@/components/ui/Chip';
import { MemberFilter } from '@/components/money/MemberFilter';
import { TransactionList } from '@/components/money/TransactionList';
import { Plus, HandCoins, ArrowRight, Landmark } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export default function MoneyPage() {
  const { transactions, members, activeMemberId, openQuickAdd, totalUdharGiven, totalUdharTaken, bankLoans } = useFamilyStore();
  const [filterType, setFilterType] = useState<string>('all');

  const filterChips = [
    { key: 'all', label: 'Sab' },
    { key: 'online', label: 'Online' },
    { key: 'offline', label: 'Offline' },
    { key: 'udhar', label: 'Udhar' },
    { key: 'income', label: 'Income' },
  ];

  const totalOutstandingLoan = (bankLoans || []).reduce((sum, b) => sum + Number(b.current_outstanding_principal || b.original_principal || 0), 0);

  const filtered = transactions.filter((tx) => {
    if (activeMemberId && tx.member_id !== activeMemberId) {
      return false;
    }

    if (filterType === 'all') return true;
    if (filterType === 'online') return tx.mode === 'online';
    if (filterType === 'offline') return tx.mode === 'offline';
    if (filterType === 'udhar') return tx.type === 'udhar_given' || tx.type === 'udhar_taken';
    if (filterType === 'income') return tx.type === 'income';
    return true;
  });

  return (
    <div className="space-y-3">
      <ScreenHeader
        title="Money & Ledger"
        subtitle="Sab kharch, income aur udhar ledger"
        action={
          <button
            type="button"
            onClick={() => openQuickAdd('expense')}
            className="w-8 h-8 rounded-full bg-navy text-paper flex items-center justify-center shadow hover:bg-navy-light transition-all"
            title="Add Transaction"
          >
            <Plus size={16} />
          </button>
        }
      />

      {/* Len-Den, Loans & Udhar Hubs Grid */}
      <div className="px-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Parivar Member Aapsi Hisab */}
        <Link
          href="/family/hisab"
          className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-center justify-between hover:bg-indigo-50 transition-all shadow-xs block group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <span className="text-xs font-bold">🤝</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-indigo-950 group-hover:text-indigo-700 transition-colors">
                Parivar Sadasya Hisab
              </h4>
              <p className="text-[10px] text-indigo-900/70">
                Sadasyon ke aapsi paise &amp; khata
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 bg-white/80 px-2 py-0.5 rounded-md border border-indigo-200">
            Aapsi →
          </span>
        </Link>

        {/* Bahar ka Udhar Manager */}
        <Link
          href="/money/udhar"
          className="p-3 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-between hover:bg-gold/15 transition-all shadow-xs block group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center shrink-0">
              <HandCoins size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink group-hover:text-gold transition-colors">
                Bahar Ka Udhar Ledger
              </h4>
              <p className="text-[10px] text-ink-muted">
                Lena: <Mono className="font-bold text-coral">₹{totalUdharGiven.toLocaleString('en-IN')}</Mono> · OTP Praman
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-gold bg-white/80 px-2 py-0.5 rounded-md border border-gold/30">
            Udhar →
          </span>
        </Link>

        {/* Bank Loans & Family EMI Split Hub */}
        <Link
          href="/loans"
          className="p-3 rounded-2xl bg-navy/5 border border-navy/20 flex items-center justify-between hover:bg-navy/10 transition-all shadow-xs block group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-navy text-gold-soft flex items-center justify-center shrink-0">
              <Landmark size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink group-hover:text-navy transition-colors">
                Bank Loans & EMI Split
              </h4>
              <p className="text-[10px] text-ink-muted">
                {totalOutstandingLoan > 0 ? (
                  <>Loan: <Mono className="font-bold text-ink">₹{Math.round(totalOutstandingLoan).toLocaleString('en-IN')}</Mono></>
                ) : (
                  'Home/Car Loans, ₹/% Split & Hike'
                )}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-navy bg-white/80 px-2 py-0.5 rounded-md border border-navy/20">
            Loans →
          </span>
        </Link>
      </div>

      {/* Filter Chips */}
      <div className="px-4 flex overflow-x-auto pb-1 no-scrollbar">
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

      {/* Grouped Transaction List */}
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
