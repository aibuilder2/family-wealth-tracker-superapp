const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
  console.log('Wrote:', relPath);
}

// 1. components/money/MemberFilter.tsx
save('components/money/MemberFilter.tsx', `'use client';

import React from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils/cn';

export function MemberFilter() {
  const { members, activeMemberId, setActiveMemberId } = useFamilyStore();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      <button
        type="button"
        onClick={() => setActiveMemberId(null)}
        className={cn(
          'text-xs px-3 py-1.5 rounded-full font-medium transition-all shrink-0 font-sans',
          activeMemberId === null
            ? 'bg-navy text-paper shadow-sm'
            : 'bg-paper-dim text-ink-muted hover:text-ink'
        )}
      >
        All ({members.length})
      </button>
      {members.map((m) => {
        const isSelected = activeMemberId === m.id;
        return (
          <div key={m.id} className="flex items-center gap-1.5 shrink-0">
            <Avatar
              m={m}
              size={32}
              isSelected={isSelected}
              onClick={() => setActiveMemberId(isSelected ? null : m.id)}
            />
            <span
              onClick={() => setActiveMemberId(isSelected ? null : m.id)}
              className={cn(
                'text-xs cursor-pointer select-none font-medium',
                isSelected ? 'text-ink font-semibold' : 'text-ink-muted'
              )}
            >
              {m.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
`);

// 2. components/money/TransactionList.tsx
save('components/money/TransactionList.tsx', `'use client';

import React from 'react';
import { Transaction, Member } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Mono } from '@/components/ui/Mono';
import { getRelativeDateLabel } from '@/lib/utils/dateHelpers';
import { Trash2 } from 'lucide-react';
import { useFamilyStore } from '@/lib/store/familyStore';

interface TransactionListProps {
  transactions: Transaction[];
  members: Member[];
  groupByDate?: boolean;
  showDelete?: boolean;
}

export function TransactionList({
  transactions,
  members,
  groupByDate = true,
  showDelete = false,
}: TransactionListProps) {
  const { deleteTransaction } = useFamilyStore();

  const getMember = (memberId: string) => {
    return members.find((m) => m.id === memberId) || {
      name: 'Member',
      color: '#B98B2A',
      initials: 'M',
    };
  };

  if (transactions.length === 0) {
    return (
      <div className="p-8 text-center bg-paper rounded-xl border border-paper-dim">
        <p className="text-sm text-ink-muted">Koi transaction nahi mila.</p>
      </div>
    );
  }

  if (!groupByDate) {
    return (
      <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim">
        {transactions.map((tx) => {
          const m = getMember(tx.member_id);
          const isPositive = tx.type === 'income' || tx.type === 'udhar_taken';
          const isUdhar = tx.type === 'udhar_given' || tx.type === 'udhar_taken';

          return (
            <div key={tx.id} className="flex items-center gap-3 px-4 py-3 hover:bg-paper-dim/30 transition-colors group">
              <Avatar m={m} size={34} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink font-medium truncate">{tx.note || tx.category}</p>
                <p className="text-[11px] text-ink-muted flex items-center gap-1.5 mt-0.5">
                  <span>{m.name}</span>
                  <span>·</span>
                  <span className="capitalize">{tx.category}</span>
                  {tx.mode && (
                    <>
                      <span>·</span>
                      <span className="capitalize">{tx.mode}</span>
                    </>
                  )}
                  {isUdhar && tx.udhar_person && (
                    <span className="text-gold font-medium">({tx.udhar_person})</span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <Mono
                  className="text-[13px] font-semibold block"
                  style={{ color: isPositive ? '#4C7A5E' : '#C1502E' }}
                >
                  {isPositive ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                </Mono>
                <span className="text-[10px] text-ink-muted">
                  {getRelativeDateLabel(tx.txn_date)}
                </span>
              </div>
              {showDelete && (
                <button
                  type="button"
                  onClick={() => deleteTransaction(tx.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-ink-muted hover:text-coral transition-all"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Group by date
  const groups = {};
  transactions.forEach((tx) => {
    const label = getRelativeDateLabel(tx.txn_date);
    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  });

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([dateLabel, items]) => (
        <div key={dateLabel}>
          <p className="px-1 text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
            {dateLabel}
          </p>
          <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim">
            {items.map((tx) => {
              const m = getMember(tx.member_id);
              const isPositive = tx.type === 'income' || tx.type === 'udhar_taken';
              const isUdhar = tx.type === 'udhar_given' || tx.type === 'udhar_taken';

              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-paper-dim/30 transition-colors group"
                >
                  <Avatar m={m} size={34} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink font-medium truncate">{tx.note || tx.category}</p>
                    <p className="text-[11px] text-ink-muted flex items-center gap-1.5 mt-0.5">
                      <span>{m.name}</span>
                      <span>·</span>
                      <span className="capitalize">{tx.category}</span>
                      {tx.mode && (
                        <>
                          <span>·</span>
                          <span className="capitalize">{tx.mode}</span>
                        </>
                      )}
                      {isUdhar && tx.udhar_person && (
                        <span className="text-gold font-medium">({tx.udhar_person})</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <Mono
                      className="text-[13px] font-semibold block"
                      style={{ color: isPositive ? '#4C7A5E' : '#C1502E' }}
                    >
                      {isPositive ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                    </Mono>
                  </div>
                  {showDelete && (
                    <button
                      type="button"
                      onClick={() => deleteTransaction(tx.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-ink-muted hover:text-coral transition-all"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
`);
