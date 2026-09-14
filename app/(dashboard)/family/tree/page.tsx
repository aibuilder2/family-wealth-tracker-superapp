'use client';

import React from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Avatar } from '@/components/ui/Avatar';
import { useFamilyStore } from '@/lib/store/familyStore';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function FamilyTreePage() {
  const { members } = useFamilyStore();

  return (
    <div className="space-y-4">
      <div className="px-4 pt-4">
        <Link href="/family" className="text-xs text-ink-muted hover:text-ink flex items-center gap-1 font-medium">
          <ChevronLeft size={16} /> Family par wapas jayein
        </Link>
      </div>

      <ScreenHeader
        title="Family Tree (Vansh)"
        subtitle="Puri peedhi ka record aur photos"
      />

      <div className="px-4">
        <div className="p-6 bg-paper rounded-2xl border border-paper-dim shadow-sm flex flex-col items-center space-y-6 text-center">
          
          {/* Generation 1: Parents */}
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center">
              <Avatar m={members[0]} size={48} />
              <span className="text-xs font-semibold text-ink mt-1.5">{members[0]?.name}</span>
              <span className="text-[10px] text-ink-muted">Pita (Head)</span>
            </div>

            <div className="text-ink-muted font-bold">♥</div>

            <div className="flex flex-col items-center">
              <Avatar m={members[1]} size={48} />
              <span className="text-xs font-semibold text-ink mt-1.5">{members[1]?.name}</span>
              <span className="text-[10px] text-ink-muted">Mata</span>
            </div>
          </div>

          {/* Tree Line Connector */}
          <div className="w-0.5 h-6 bg-gold/40" />

          {/* Generation 2: Children */}
          <div className="flex items-center gap-10">
            <div className="flex flex-col items-center">
              <Avatar m={members[2]} size={44} />
              <span className="text-xs font-semibold text-ink mt-1.5">{members[2]?.name}</span>
              <span className="text-[10px] text-ink-muted">Beta</span>
            </div>

            <div className="flex flex-col items-center">
              <Avatar m={members[3]} size={44} />
              <span className="text-xs font-semibold text-ink mt-1.5">{members[3]?.name}</span>
              <span className="text-[10px] text-ink-muted">Beti</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
