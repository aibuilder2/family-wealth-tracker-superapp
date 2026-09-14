'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Chip } from '@/components/ui/Chip';
import { MemberFilter } from '@/components/money/MemberFilter';
import { TransactionList } from '@/components/money/TransactionList';
import { Plus, HandCoins, ArrowRight } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export default function MoneyPage() {
  const { transactions, members, activeMemberId, openQuickAdd, totalUdharGiven, totalUdharTaken } = useFamilyStore();
  const [filterType, setFilterType] = useState<string>('all');

  const filterChips = [
    { key: 'all', label: 'Sab' },
    { key: 'online', label: 'Online' },
    { key: 'offline', label: 'Offline' },
    { key: 'udhar', label: 'Udhar' },
    { key: 'income', label: 'Income' },
  ];

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

      {/* Udhar Manager Link Banner */}
      <div className="px-4">
        <Link
          href="/money/udhar"
          className="p-3 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-between hover:bg-gold/15 transition-all shadow-sm block"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center shrink-0">
              <HandCoins size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink">Udhar & Settlement Manager</h4>
              <p className="text-[10px] text-ink-muted">
                Lena: <Mono className="font-bold text-coral">₹{totalUdharGiven.toLocaleString('en-IN')}</Mono> · Dena: <Mono className="font-bold text-green">₹{totalUdharTaken.toLocaleString('en-IN')}</Mono>
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-gold flex items-center gap-0.5">
            Hisab Karein <ArrowRight size={13} />
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
