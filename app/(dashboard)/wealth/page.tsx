'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { AssetCard } from '@/components/wealth/AssetCard';
import { GoalCard } from '@/components/wealth/GoalCard';
import { Mono } from '@/components/ui/Mono';
import { Plus, PiggyBank, Landmark, X, Building2, Home, CheckCircle2, AlertCircle, Trash2, Phone } from 'lucide-react';
import { AssetCategory, AssetType } from '@/types';

export default function WealthPage() {
  const {
    assets,
    goals,
    totalWealth,
    liquidWealth,
    fixedWealth,
    addGoal,
    addAsset,
    rentalProperties,
    rentalTenants,
    totalRentalIncomePerMonth,
    totalSecurityDepositHeld,
    addRentalTenant,
    toggleTenantRentStatus,
    deleteRentalTenant,
  } = useFamilyStore();
  const [viewTab, setViewTab] = useState<'all' | 'liquid' | 'fixed'>('all');

  // Add Asset Modal State
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [assetCategory, setAssetCategory] = useState<AssetCategory>('fixed');
  const [assetType, setAssetType] = useState<AssetType>('property');
  const [monthlyRent, setMonthlyRent] = useState('');

  // Add Goal Modal State
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalSaved, setGoalSaved] = useState('');
  const [goalDate, setGoalDate] = useState('');

  // Add Rental Tenant / Property Modal State
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
  const [tName, setTName] = useState('');
  const [tRoom, setTRoom] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tRent, setTRent] = useState('7500');
  const [tDeposit, setTDeposit] = useState('7500');

  const handleAddTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim() || !tRoom.trim()) return;

    addRentalTenant({
      property_id: 'prop-kesharwani-1',
      room_id: tRoom.trim(),
      name: tName.trim(),
      phone: tPhone.trim(),
      monthly_rent: Number(tRent) || 0,
      security_deposit: Number(tDeposit) || 0,
      rent_status: 'paid',
      joining_date: new Date().toISOString().split('T')[0],
    });

    setTName('');
    setTRoom('');
    setTPhone('');
    setTRent('7500');
    setTDeposit('7500');
    setIsAddTenantOpen(false);
  };

  const filteredAssets = assets.filter((a) => {
    if (viewTab === 'all') return true;
    return a.category === viewTab;
  });

  const handleAddAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(assetValue);
    if (!assetName.trim() || !val || val <= 0) return;

    const notes = (assetType === 'property' || assetType === 'land') && monthlyRent.trim() && Number(monthlyRent) > 0
      ? `किराया: ₹${Number(monthlyRent).toLocaleString('en-IN')}/माह`
      : undefined;

    addAsset({
      label: assetName.trim(),
      category: assetCategory,
      type: assetType,
      value: val,
      notes,
    });

    setAssetName('');
    setAssetValue('');
    setMonthlyRent('');
    setIsAddAssetOpen(false);
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(goalTarget);
    const saved = parseFloat(goalSaved) || 0;
    if (!goalTitle.trim() || !target || target <= 0) return;

    addGoal({
      title: goalTitle.trim(),
      target_amount: target,
      saved_amount: saved,
      target_date: goalDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category: 'savings',
    });

    setGoalTitle('');
    setGoalTarget('');
    setGoalSaved('');
    setIsAddGoalOpen(false);
  };

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Wealth"
        subtitle="सारी बचत, संपत्ति व लक्ष्य एक जगह"
        action={
          <button
            onClick={() => setIsAddAssetOpen(true)}
            className="px-3 py-1.5 bg-gold text-navy font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm hover:bg-gold-light active:scale-95 transition-all"
          >
            <Plus size={15} /> + नया Asset
          </button>
        }
      />

      {/* Net Wealth Card */}
      <div className="px-4">
        <div className="rounded-2xl p-5 text-center bg-navy shadow-md text-paper">
          <p className="text-xs text-gold-soft tracking-wider font-mono">TOTAL NET WEALTH</p>
          <Mono className="text-3xl font-semibold text-paper block mt-0.5">
            ₹{totalWealth.toLocaleString('en-IN')}
          </Mono>
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-navy-light/60">
            <div className="text-center">
              <span className="text-[10px] text-gold-soft uppercase tracking-wider block">
                Liquid (Cash / Bank)
              </span>
              <Mono className="text-sm font-semibold text-paper">
                ₹{liquidWealth.toLocaleString('en-IN')}
              </Mono>
            </div>
            <div className="text-center border-l border-navy-light/60">
              <span className="text-[10px] text-gold-soft uppercase tracking-wider block">
                Fixed (ज़मीन / Gold)
              </span>
              <Mono className="text-sm font-semibold text-paper">
                ₹{fixedWealth.toLocaleString('en-IN')}
              </Mono>
            </div>
          </div>
        </div>
      </div>

      {/* Asset category tabs */}
      <div className="px-4 flex gap-2">
        <button
          onClick={() => setViewTab('all')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            viewTab === 'all' ? 'bg-navy text-paper' : 'bg-paper-dim text-ink-muted'
          }`}
        >
          सब Assets ({assets.length})
        </button>
        <button
          onClick={() => setViewTab('liquid')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            viewTab === 'liquid' ? 'bg-navy text-paper' : 'bg-paper-dim text-ink-muted'
          }`}
        >
          Liquid (₹{(liquidWealth / 100000).toFixed(1)}L)
        </button>
        <button
          onClick={() => setViewTab('fixed')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            viewTab === 'fixed' ? 'bg-navy text-paper' : 'bg-paper-dim text-ink-muted'
          }`}
        >
          Fixed (₹{(fixedWealth / 100000).toFixed(1)}L)
        </button>
      </div>

      {/* Assets Grid & Empty State */}
      <div className="px-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
            पारिवारिक संपत्तियां ({filteredAssets.length})
          </h3>
          <button
            onClick={() => setIsAddAssetOpen(true)}
            className="text-xs font-bold text-gold hover:underline flex items-center gap-1"
          >
            <Plus size={13} /> Asset जोड़ें
          </button>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="p-6 text-center bg-paper rounded-2xl border border-dashed border-paper-dim space-y-2 shadow-sm">
            <Landmark size={24} className="text-gold mx-auto" />
            <p className="text-xs font-bold text-ink">अभी कोई संपत्ति दर्ज नहीं है</p>
            <p className="text-[11px] text-ink-muted max-w-xs mx-auto">
              सोना, ज़मीन, बैंक बचत, FD या म्यूच्यूअल फण्ड जोड़ें और परिवार की कुल नेटवर्थ ट्रैक करें।
            </p>
            <button
              onClick={() => setIsAddAssetOpen(true)}
              className="px-4 py-2 bg-gold text-navy text-xs font-bold rounded-xl shadow-sm hover:bg-gold-light transition-all"
            >
              + पहली संपत्ति दर्ज करें
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>

      {/* 🏢 Rental Properties & Tenants Section */}
      <div className="px-4 pt-2 space-y-2.5">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-800/40 text-paper shadow-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs sm:text-sm text-paper">किराया संपत्ति व किरायेदार (Rent ERP)</h3>
                  <span className="text-[10px] bg-teal-500/25 text-teal-300 px-1.5 py-0.5 rounded font-mono font-bold">
                    {rentalTenants.length} किरायेदार
                  </span>
                </div>
                <p className="text-[11px] text-teal-200/80">मासिक किराया, अमानत व रूम रसीद ट्रैकिंग</p>
              </div>
            </div>

            <button
              onClick={() => setIsAddTenantOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <Plus size={14} /> + किरायेदार जोड़ें
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-center">
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="text-[10px] text-teal-200 uppercase tracking-wider block">मासिक कुल किराया</span>
              <Mono className="text-sm sm:text-base font-bold text-emerald-400 block mt-0.5">
                ₹{totalRentalIncomePerMonth.toLocaleString('en-IN')}<span className="text-[10px] text-teal-200/70 font-sans">/माह</span>
              </Mono>
            </div>
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="text-[10px] text-teal-200 uppercase tracking-wider block">जमा अमानत (Deposit)</span>
              <Mono className="text-sm sm:text-base font-bold text-teal-300 block mt-0.5">
                ₹{totalSecurityDepositHeld.toLocaleString('en-IN')}
              </Mono>
            </div>
          </div>
        </div>

        {rentalTenants.length === 0 ? (
          <div className="p-5 text-center bg-paper rounded-2xl border border-dashed border-paper-dim space-y-2 shadow-xs">
            <Home size={22} className="text-teal-600 mx-auto" />
            <p className="text-xs font-bold text-ink">अभी कोई किरायेदार दर्ज नहीं है</p>
            <p className="text-[11px] text-ink-muted max-w-xs mx-auto">
              अपनी प्रॉपर्टी, फ्लैट, दुकान या हॉस्टल रूम के किरायेदार, मासिक किराया और सिक्योरिटी डिपॉजिट दर्ज करें।
            </p>
            <button
              onClick={() => setIsAddTenantOpen(true)}
              className="px-3.5 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-teal-700 transition-all"
            >
              + पहला किरायेदार जोड़ें
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {rentalTenants.map((t) => (
              <div
                key={t.id}
                className="p-3 bg-paper rounded-xl border border-paper-dim shadow-xs flex items-center justify-between text-xs hover:border-teal-300/40 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md text-[11px]">
                      {t.room_id}
                    </span>
                    <h4 className="font-bold text-ink text-xs">{t.name}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-ink-muted">
                    {t.phone && <span>📞 {t.phone}</span>}
                    <span>मासिक: <b className="text-ink font-mono">₹{t.monthly_rent.toLocaleString('en-IN')}/माह</b></span>
                    <span>अमानत: <b className="text-emerald-700 font-mono">₹{t.security_deposit.toLocaleString('en-IN')}</b></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleTenantRentStatus(t.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      t.rent_status === 'paid'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse'
                    }`}
                  >
                    {t.rent_status === 'paid' ? '✓ किराया जमा' : 'बाकी (Due)'}
                  </button>
                  <button
                    onClick={() => deleteRentalTenant(t.id)}
                    className="p-1 text-ink-muted hover:text-rose-600 transition-all"
                    title="हटाएं"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Goals Section */}
      <div className="px-4 pt-2 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-ink text-sm">
            Family Financial Goals ({goals.length})
          </h2>
          <button
            onClick={() => setIsAddGoalOpen(true)}
            className="text-xs font-bold text-gold hover:underline flex items-center gap-1"
          >
            <Plus size={13} /> नया Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="p-6 text-center bg-paper rounded-2xl border border-dashed border-paper-dim space-y-2 shadow-sm">
            <PiggyBank size={24} className="text-gold mx-auto" />
            <p className="text-xs font-bold text-ink">कोई वित्तीय लक्ष्य (Goal) नहीं बना है</p>
            <p className="text-[11px] text-ink-muted max-w-xs mx-auto">
              बच्चों की पढ़ाई, नया मकान, कार या शादी का लक्ष्य तय करें।
            </p>
            <button
              onClick={() => setIsAddGoalOpen(true)}
              className="px-4 py-2 bg-gold text-navy text-xs font-bold rounded-xl shadow-sm hover:bg-gold-light transition-all"
            >
              + नया Goal बनाएं
            </button>
          </div>
        ) : (
          <div className="rounded-xl bg-paper border border-paper-dim divide-y divide-paper-dim overflow-hidden shadow-sm">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {isAddAssetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Landmark size={18} className="text-gold" />
                नई संपत्ति (Asset) जोड़ें
              </h3>
              <button
                onClick={() => setIsAddAssetOpen(false)}
                className="text-ink-muted hover:text-ink p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddAssetSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  संपत्ति का नाम (e.g. SBI Savings, पुश्तैनी ज़मीन, गोल्ड)
                </label>
                <input
                  type="text"
                  placeholder="e.g. SBI Bank Balance, Gold Jewellery"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  अनुमानित मूल्य (Current Value ₹)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="₹ 50,000"
                  value={assetValue}
                  onChange={(e) => setAssetValue(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  प्रकार (Asset Type)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAssetCategory('fixed');
                      setAssetType('property');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-center font-semibold text-xs transition-all ${
                      assetType === 'property'
                        ? 'border-gold bg-gold/15 text-gold-dark font-bold'
                        : 'border-paper-dim bg-paper text-ink-muted'
                    }`}
                  >
                    🏢 मकान / दुकान (Property)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAssetCategory('fixed');
                      setAssetType('land');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-center font-semibold text-xs transition-all ${
                      assetType === 'land'
                        ? 'border-gold bg-gold/15 text-gold-dark font-bold'
                        : 'border-paper-dim bg-paper text-ink-muted'
                    }`}
                  >
                    🌱 ज़मीन / प्लॉट (Land)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAssetCategory('fixed');
                      setAssetType('gold');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-center font-semibold text-xs transition-all ${
                      assetType === 'gold'
                        ? 'border-gold bg-gold/15 text-gold-dark font-bold'
                        : 'border-paper-dim bg-paper text-ink-muted'
                    }`}
                  >
                    🪙 सोना / जेवर (Gold)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAssetCategory('liquid');
                      setAssetType('bank_deposit');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-center font-semibold text-xs transition-all ${
                      assetType === 'bank_deposit'
                        ? 'border-gold bg-gold/15 text-gold-dark font-bold'
                        : 'border-paper-dim bg-paper text-ink-muted'
                    }`}
                  >
                    🏦 बैंक / FD / Cash
                  </button>
                </div>
              </div>

              {(assetType === 'property' || assetType === 'land') && (
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    मासिक किराया आता है? (Monthly Rent ₹) [वैकल्पिक]
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="उदा. ₹15,000 / माह"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold font-mono"
                  />
                  <p className="text-[10px] text-ink-muted mt-0.5">
                    प्रॉपर्टी कार्ड पर हर महीने आने वाला किराया दिखेगा।
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddAssetOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink-muted font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gold text-navy font-bold hover:bg-gold-light shadow-sm"
                >
                  सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddGoalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <PiggyBank size={18} className="text-gold" />
                नया Financial Goal बनाएं
              </h3>
              <button
                onClick={() => setIsAddGoalOpen(false)}
                className="text-ink-muted hover:text-ink p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddGoalSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  लक्ष्य का नाम (Goal Name)
                </label>
                <input
                  type="text"
                  placeholder="e.g. बेटी की पढ़ाई, नया मकान, कार"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    कुल लक्ष्य (Target ₹)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="₹ 5,00,000"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    जमा राशि (Saved ₹)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="₹ 50,000"
                    value={goalSaved}
                    onChange={(e) => setGoalSaved(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  तारीख (Target Date)
                </label>
                <input
                  type="date"
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddGoalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink-muted font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gold text-navy font-bold hover:bg-gold-light shadow-sm"
                >
                  Goal जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Rental Tenant / Property Modal */}
      {isAddTenantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Building2 size={18} className="text-teal-600" />
                नया किरायेदार / रूम प्रविष्टि
              </h3>
              <button
                onClick={() => setIsAddTenantOpen(false)}
                className="text-ink-muted hover:text-ink p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddTenantSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  रूम / फ्लैट / दुकान नंबर * (उदा. रूम 204, फ्लैट 2B)
                </label>
                <input
                  type="text"
                  placeholder="उदा. Room 101, Shop 4, 1st Floor Flat"
                  value={tRoom}
                  onChange={(e) => setTRoom(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-teal-600 font-bold"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  किरायेदार का नाम *
                </label>
                <input
                  type="text"
                  placeholder="उदा. राहुल वर्मा, शर्मा जी"
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-teal-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  मोबाइल नंबर (वैकल्पिक)
                </label>
                <input
                  type="tel"
                  placeholder="उदा. 98765 43210"
                  value={tPhone}
                  onChange={(e) => setTPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-teal-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    मासिक किराया ₹ *
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="₹ 7,500"
                    value={tRent}
                    onChange={(e) => setTRent(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-teal-600 font-mono font-bold text-ink"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    सिक्योरिटी डिपॉजिट ₹
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="₹ 7,500"
                    value={tDeposit}
                    onChange={(e) => setTDeposit(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-teal-600 font-mono text-ink"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTenantOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink-muted font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-sm"
                >
                  किरायेदार जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
