'use client';

import React from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { MemberCard } from '@/components/family/MemberCard';
import { FamilyTreeView } from '@/components/family/FamilyTreeView';
import Link from 'next/link';
import { HeartPulse, Key, Sparkles, Plus } from 'lucide-react';

export default function FamilyPage() {
  const { family, members } = useFamilyStore();

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Family"
        subtitle="Parivar ke sabhi members"
      />

      {/* Member List */}
      <div className="px-4">
        <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim shadow-sm">
          {members.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </div>

      {/* Family Tree Link */}
      <div className="px-4">
        <FamilyTreeView />
      </div>

      {/* Quick Links to Medical & AI Advisor */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <Link
          href="/medical"
          className="p-4 rounded-xl bg-paper border border-paper-dim hover:border-coral/40 transition-all shadow-sm block"
        >
          <HeartPulse size={20} className="text-coral mb-1.5" />
          <h3 className="text-sm font-semibold text-ink">Medical Records</h3>
          <p className="text-[11px] text-ink-muted mt-0.5">Dawaiyan aur blood group</p>
        </Link>

        <Link
          href="/advisor"
          className="p-4 rounded-xl bg-paper border border-paper-dim hover:border-gold/40 transition-all shadow-sm block"
        >
          <Sparkles size={20} className="text-gold mb-1.5" />
          <h3 className="text-sm font-semibold text-ink">AI Advisor</h3>
          <p className="text-[11px] text-ink-muted mt-0.5">Bachat & investment advice</p>
        </Link>
      </div>

      {/* Invite Code Box */}
      <div className="px-4">
        <div className="p-4 rounded-xl bg-paper-dim/80 border border-paper-dim flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">Family Invite Code</span>
            <p className="font-mono font-bold text-sm text-ink">{family.invite_code}</p>
          </div>
          <span className="text-xs text-gold font-medium bg-gold/10 px-2.5 py-1 rounded-lg">
            Share Code
          </span>
        </div>
      </div>
    </div>
  );
}
