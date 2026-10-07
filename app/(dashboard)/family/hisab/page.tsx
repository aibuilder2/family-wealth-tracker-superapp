'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FamilyHisabModule } from '@/components/business-modules/family-hisab/FamilyHisabModule';
import { PapaFamilyFundModule } from '@/components/business-modules/family-hisab/PapaFamilyFundModule';
import { FamilyLoansModule } from '@/components/business-modules/family-loans/FamilyLoansModule';
import { HouseholdStaffModule } from '@/components/business-modules/household-staff/HouseholdStaffModule';
import { TravelReimbursementModule } from '@/components/business-modules/family-hisab/TravelReimbursementModule';
import Link from 'next/link';
import { ChevronLeft, Users, Landmark, UserCheck, CreditCard, Plane, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { SmartWhatsAppImporter } from '@/components/money/SmartWhatsAppImporter';

type TabType = 'fund' | 'loans' | 'aapsi' | 'staff' | 'travel' | 'importer';

function FamilyHisabContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabType) || 'fund';
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType;
    if (tabParam && ['fund', 'loans', 'aapsi', 'staff', 'travel', 'importer'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (searchParams.get('partner')) {
      setActiveTab('aapsi');
    }
  }, [searchParams]);

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Family Finance & Cashflow Hub"
        subtitle="पारिवारिक केंद्रीय कोष, सदस्य आय स्रोत, लोन व EMI, आपसी लेन-देन व स्टाफ"
        action={
          <Link
            href="/family"
            className="px-3 py-1.5 bg-paper border border-paper-dim text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-paper-dim transition-all text-ink"
          >
            <ChevronLeft size={14} /> Family Home
          </Link>
        }
      />

      {/* 6 Main Tabs Switcher */}
      <div className="px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 p-1.5 bg-paper rounded-2xl border border-paper-dim shadow-sm gap-1.5">
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
            <span className="truncate">🏛️ सदस्य कैशफ्लो</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('loans')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === 'loans'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-ink-muted hover:text-ink hover:bg-paper-dim/50'
            }`}
          >
            <CreditCard size={15} />
            <span className="truncate">💳 लोन व EMI</span>
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
            <span className="truncate">👥 आपसी हिसाब</span>
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
            <span className="truncate">🧹 स्टाफ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('travel')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === 'travel'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-ink-muted hover:text-ink hover:bg-paper-dim/50'
            }`}
          >
            <Plane size={15} />
            <span className="truncate">✈️ टूर क्लेम</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('importer')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === 'importer'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-ink-muted hover:text-ink hover:bg-paper-dim/50'
            }`}
          >
            <Sparkles size={15} />
            <span className="truncate">📲 व्यापार इम्पोर्ट</span>
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

        {activeTab === 'loans' && (
          <div className="animate-in fade-in duration-150">
            <FamilyLoansModule onNavigateToCashflow={() => setActiveTab('fund')} />
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

        {activeTab === 'travel' && (
          <div className="animate-in fade-in duration-150">
            <TravelReimbursementModule />
          </div>
        )}

        {activeTab === 'importer' && (
          <div className="animate-in fade-in duration-150">
            <SmartWhatsAppImporter />
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
