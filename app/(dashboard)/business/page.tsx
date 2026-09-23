'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { 
  Truck, Gem, Flame, Building2, Store, PartyPopper, 
  Bed, ShieldCheck, Fuel, Landmark, TrendingUp, HandCoins,
  Briefcase, Sprout, Scale, Users, Compass, HeartPulse, Car, CreditCard
} from 'lucide-react';

// Core Business & Financial Modules
import TransportModule from '@/components/business-modules/transport/TransportModule';
import JewelleryLoanModule from '@/components/business-modules/jewellery-loan/JewelleryLoanModule';
import CloudKitchenModule from '@/components/business-modules/cloud-kitchen/CloudKitchenModule';
import ConstructionModule from '@/components/business-modules/construction/ConstructionModule';
import RetailShopModule from '@/components/business-modules/retail-shop/RetailShopModule';
import EventsFunctionsModule from '@/components/business-modules/events-functions/EventsFunctionsModule';
import HostelPgModule from '@/components/business-modules/hostel-pg/HostelPgModule';
import InsurancePropertyCrmModule from '@/components/business-modules/insurance-property-crm/InsurancePropertyCrmModule';
import PetrolPumpModule from '@/components/business-modules/petrol-pump/PetrolPumpModule';

// Newly Modularized Core Life & Family Modules
import { BankLoansModule } from '@/components/business-modules/bank-loans/BankLoansModule';
import { InvestmentsSipModule } from '@/components/business-modules/investments-sip/InvestmentsSipModule';
import { UdharLedgerModule } from '@/components/business-modules/udhar-ledger/UdharLedgerModule';
import { BusinessSetupModule } from '@/components/business-modules/business-setup/BusinessSetupModule';
import { AgricultureModule } from '@/components/business-modules/agriculture/AgricultureModule';
import { CourtCasesModule } from '@/components/business-modules/court-cases/CourtCasesModule';
import { HouseholdStaffModule } from '@/components/business-modules/household-staff/HouseholdStaffModule';
import { TripsSplitterModule } from '@/components/business-modules/trips-splitter/TripsSplitterModule';
import { HospitalEpisodesModule } from '@/components/business-modules/hospital-episodes/HospitalEpisodesModule';
import { FamilyHisabModule } from '@/components/business-modules/family-hisab/FamilyHisabModule';
import { VehiclesGarageModule } from '@/components/business-modules/vehicles-garage/VehiclesGarageModule';
import { BusinessFirmsModule } from '@/components/business-modules/business-firms/BusinessFirmsModule';

const BUSINESS_TABS = [
  { id: 'bank-loans', label: 'बैंक लोन व EMI', icon: Landmark },
  { id: 'udhar-ledger', label: 'उधार प्रॉमिसरी OTP', icon: HandCoins },
  { id: 'udhar-mandates', label: '💳 UPI रिकवरी मैंडेट', icon: CreditCard },
  { id: 'trips-splitter', label: 'Holiday & Trips', icon: Compass },
  { id: 'hospital-episodes', label: 'अस्पताल व सर्जरी', icon: HeartPulse },
  { id: 'family-hisab', label: 'आपसी लेन-देन', icon: Users },
  { id: 'court-cases', label: 'कोर्ट केस डायरी', icon: Scale },
  { id: 'vehicles-garage', label: 'गैराज व गाड़ियाँ', icon: Car },
  { id: 'business-firms', label: 'फर्म व GST Drawings', icon: Building2 },
  { id: 'investments-sip', label: 'SIP, RD व FD', icon: TrendingUp },
  { id: 'business-setup', label: 'Business Setup', icon: Briefcase },
  { id: 'transport', label: 'ट्रांसपोर्ट व JCB', icon: Truck },
  { id: 'construction', label: 'मकान निर्माण', icon: Building2 },
  { id: 'hostel-pg', label: 'हॉस्टल/किराया', icon: Bed },
  { id: 'agriculture', label: 'कृषि व मंडी बोनस', icon: Sprout },
  { id: 'household-staff', label: 'घरेलू स्टाफ', icon: Users },
  { id: 'jewellery-loan', label: 'सोना गिरवी', icon: Gem },
  { id: 'cloud-kitchen', label: 'क्लाउड किचन/टिफ़िन', icon: Flame },
  { id: 'petrol-pump', label: 'पेट्रोल पम्प (Opt)', icon: Fuel },
  { id: 'insurance-property-crm', label: 'बीमा/प्रॉपर्टी CRM (Opt)', icon: ShieldCheck },
  { id: 'retail-shop', label: 'दुकान उधार (Opt)', icon: Store },
  { id: 'events-functions', label: 'शादी/शगुन (Opt)', icon: PartyPopper },
];

function BusinessHubContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'bank-loans');

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="space-y-4 pt-2">
      <ScreenHeader
        title="All Modules Hub"
        subtitle="पारिवारिक सेवाएं, लोन, हिसाब-किताब व स्वतंत्र व्यापार खाते"
      />

      {/* Horizontal Business Switcher Tabs */}
      <div className="px-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {BUSINESS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-navy text-gold-soft shadow-sm'
                    : 'bg-paper text-ink-muted hover:bg-paper-dim border border-paper-dim'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-gold' : 'text-ink-muted'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Module Container */}
      <div className="px-4">
        {activeTab === 'bank-loans' && <BankLoansModule />}
        {activeTab === 'udhar-ledger' && <UdharLedgerModule initialView="ledger" />}
        {activeTab === 'udhar-mandates' && <UdharLedgerModule initialView="mandates" />}
        {activeTab === 'trips-splitter' && <TripsSplitterModule />}
        {activeTab === 'hospital-episodes' && <HospitalEpisodesModule />}
        {activeTab === 'family-hisab' && <FamilyHisabModule />}
        {activeTab === 'court-cases' && <CourtCasesModule />}
        {activeTab === 'vehicles-garage' && <VehiclesGarageModule />}
        {activeTab === 'business-firms' && <BusinessFirmsModule />}
        {activeTab === 'investments-sip' && <InvestmentsSipModule />}
        {activeTab === 'business-setup' && <BusinessSetupModule />}
        {activeTab === 'transport' && <TransportModule />}
        {activeTab === 'construction' && <ConstructionModule />}
        {activeTab === 'hostel-pg' && <HostelPgModule />}
        {activeTab === 'agriculture' && <AgricultureModule />}
        {activeTab === 'household-staff' && <HouseholdStaffModule />}
        {activeTab === 'jewellery-loan' && <JewelleryLoanModule />}
        {activeTab === 'cloud-kitchen' && <CloudKitchenModule />}
        {activeTab === 'petrol-pump' && <PetrolPumpModule />}
        {activeTab === 'insurance-property-crm' && <InsurancePropertyCrmModule />}
        {activeTab === 'retail-shop' && <RetailShopModule />}
        {activeTab === 'events-functions' && <EventsFunctionsModule />}
      </div>
    </div>
  );
}

export default function BusinessHubPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-xs text-ink-muted">लोड हो रहा है...</div>}>
      <BusinessHubContent />
    </Suspense>
  );
}
