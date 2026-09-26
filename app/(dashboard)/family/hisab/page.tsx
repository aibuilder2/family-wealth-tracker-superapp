'use client';

import React from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FamilyHisabModule } from '@/components/business-modules/family-hisab/FamilyHisabModule';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function FamilyHisabPage() {
  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Member Aapsi Hisab"
        subtitle="परिवार के सदस्यों का आपस में खर्च, सामान व लेन-देन"
        action={
          <Link
            href="/family/tree"
            className="px-3 py-1.5 bg-paper border border-paper-dim text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-paper-dim transition-all text-ink"
          >
            <ChevronLeft size={14} /> Tree par jayein
          </Link>
        }
      />
      <div className="px-4">
        <FamilyHisabModule />
      </div>
    </div>
  );
}
