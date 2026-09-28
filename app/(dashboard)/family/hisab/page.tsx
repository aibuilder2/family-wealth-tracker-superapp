'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FamilyHisabModule } from '@/components/business-modules/family-hisab/FamilyHisabModule';
import { PapaFamilyFundModule } from '@/components/business-modules/family-hisab/PapaFamilyFundModule';
import { HouseholdStaffModule } from '@/components/business-modules/household-staff/HouseholdStaffModule';
import Link from 'next/link';
import { ChevronLeft, Users, Landmark, UserCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

type TabType = 'aapsi' | 'fund' | 'staff';

function FamilyHisabContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabType) || 'fund';
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType;
    if (tabParam && ['aapsi', 'fund', 'staff'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Family Finance & Cashflow Hub"
        subtitle="पारिवारिक कोष, सदस्य आय स्रोत (किराया/मुनाफा/ब्याज), फिक्स्ड EMI, खर्च व निवेश"
        action={
          <Link
            href="/family"
            className="px-3 py-1.5 bg-paper border border-paper-dim text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-paper-dim transition-all text-ink"
          >
            <ChevronLeft size={14} /> Family Home
          </Link>
        }
      />

      {/* 3 Main Tabs Switcher */}
      <div className="px-4">
        <div className="grid grid-cols-3 p-1.5 bg-paper rounded-2xl border border-paper-dim shadow-sm gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('fund')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === 'fund'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-ink-muted hover:text-ink hover:bg-paper-dim/50'
            }`}
          >
            <Landmark size={15} />
            <span className="truncate">🏛️ फंड व सदस्य कैशफ्लो</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('aapsi')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === 'aapsi'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-ink-muted hover:text-ink hover:bg-paper-dim/50'
            }`}
          >
            <Users size={15} />
            <span className="truncate">👥 सदस्य आपसी हिसाब</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === 'staff'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-ink-muted hover:text-ink hover:bg-paper-dim/50'
            }`}
          >
            <UserCheck size={15} />
            <span className="truncate">🧹 घरेलू कर्मचारी</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="px-4">
        {activeTab === 'fund' && (
          <div className="animate-in fade-in duration-150">
            <PapaFamilyFundModule />
          </div>
        )}

        {activeTab === 'aapsi' && (
          <div className="animate-in fade-in duration-150">
            <FamilyHisabModule />
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="animate-in fade-in duration-150">
            <HouseholdStaffModule />
          </div>
        )}
      </div>
    </div>
  );
}

export default function FamilyHisabPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-ink-muted text-xs">लोड हो रहा है...</div>}>
      <FamilyHisabContent />
    </Suspense>
  );
}
