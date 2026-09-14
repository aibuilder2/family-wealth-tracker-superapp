'use client';

import React from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ReminderCard } from '@/components/reminders/ReminderCard';

export default function RemindersPage() {
  const { reminders } = useFamilyStore();

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Reminders"
        subtitle="Insurance, service aur appointments"
      />

      <div className="px-4">
        <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim shadow-sm">
          {reminders.map((r) => (
            <ReminderCard key={r.id} reminder={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
