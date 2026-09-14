'use client';

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
