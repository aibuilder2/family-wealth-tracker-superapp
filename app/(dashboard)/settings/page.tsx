'use client';

import React from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Database } from 'lucide-react';

export default function SettingsPage() {
  const { family, members } = useFamilyStore();

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Settings"
        subtitle="Parivar profile aur configuration"
      />

      <div className="px-4 space-y-3">
        <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-3">
          <div>
            <span className="text-[10px] font-bold text-ink-muted uppercase">Family Name</span>
            <p className="text-base font-semibold text-ink font-serif">{family.name}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-ink-muted uppercase">Invite Code</span>
            <p className="font-mono text-sm font-bold text-gold">{family.invite_code}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-ink-muted uppercase">Total Members</span>
            <p className="text-sm text-ink">{members.length} members connected</p>
          </div>
        </div>

        <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm flex items-start gap-3">
          <Database size={18} className="text-gold shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-ink">Supabase Postgres and RLS</h4>
            <p className="text-[11px] text-ink-muted mt-0.5">
              Live schema with secure Row Level Security enabled for sensitive medical and document data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
