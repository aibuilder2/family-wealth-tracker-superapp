'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Chip } from '@/components/ui/Chip';
import { MemberFilter } from '@/components/money/MemberFilter';
import { TransactionList } from '@/components/money/TransactionList';
import { Plus } from 'lucide-react';

export default function MoneyPage() {
  const { transactions, members, activeMemberId, openQuickAdd } = useFamilyStore();
  const [filterType, setFilterType] = useState<string>('all');

  const filterChips = [
    { key: 'all', label: 'Sab' },
    { key: 'online', label: 'Online' },
    { key: 'offline', label: 'Offline' },
    { key: 'udhar', label: 'Udhar' },
    { key: 'income', label: 'Income' },
  ];

  // Apply filters
  const filtered = transactions.filter((tx) => {
    // 1. Member filter
    if (activeMemberId && tx.member_id !== activeMemberId) {
      return false;
    }

    // 2. Type/Mode filter
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
        title="Money"
        subtitle="Sab kharch, income aur udhar"
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
