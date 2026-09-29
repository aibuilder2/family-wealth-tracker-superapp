'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { AssetCard } from '@/components/wealth/AssetCard';
import { GoalCard } from '@/components/wealth/GoalCard';
import { Mono } from '@/components/ui/Mono';
import { 
  Plus, PiggyBank, Landmark, X, Building2, Home, CheckCircle2, 
  AlertCircle, Sparkles, User, Calendar, Link as LinkIcon, DollarSign 
} from 'lucide-react';
import { AssetCategory, AssetType, Goal } from '@/types';

export default function WealthPage() {
  const {
    assets,
    goals,
    members,
    totalWealth,
    liquidWealth,
    fixedWealth,
    addGoal,
    updateGoal,
    deleteGoal,
    addAsset,
    rentalProperties,
    totalRentalIncomePerMonth,
  } = useFamilyStore();

  const [viewTab, setViewTab] = useState<'all' | 'liquid' | 'fixed'>('all');

  // Add Asset Modal State
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [assetCategory, setAssetCategory] = useState<AssetCategory>('fixed');
  const [assetType, setAssetType] = useState<AssetType>('property');
  const [assetMemberId, setAssetMemberId] = useState(members[0]?.id || '');
  const [monthlyRent, setMonthlyRent] = useState('');
  
  // RD / Investment Specific Flexible Fields
  const [depositSubType, setDepositSubType] = useState<'RD' | 'FD' | 'SIP' | 'Savings' | 'General'>('General');
  const [startDate, setStartDate] = useState('');
  const [openedBy, setOpenedBy] = useState<'direct_bank' | 'agent'>('direct_bank');
  const [agentName, setAgentName] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // Add / Edit Goal Modal State
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalSaved, setGoalSaved] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [goalMemberId, setGoalMemberId] = useState(members[0]?.id || '');
  const [goalFundingSource, setGoalFundingSource] = useState<'income' | 'savings' | 'investment'>('savings');
  const [goalLinkedAssetIds, setGoalLinkedAssetIds] = useState<string[]>([]);
  const [goalNotes, setGoalNotes] = useState('');

  // Filtered Assets
  const filteredAssets = assets.filter((a) => {
    if (viewTab === 'all') return true;
    return a.category === viewTab;
  });

  const handleAddAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(assetValue);
    if (!assetName.trim() || !val || val <= 0) return;

    let notes = (assetType === 'property' || assetType === 'land') && monthlyRent.trim() && Number(monthlyRent) > 0
      ? `किराया: ₹${Number(monthlyRent).toLocaleString('en-IN')}/माह`
      : undefined;

    if (assetType === 'bank_deposit' && depositSubType !== 'General') {
      notes = `${depositSubType} • ${notes || ''}`.trim();
    }

    addAsset({
      label: assetName.trim(),
      category: assetCategory,
      type: assetType,
      value: val,
      member_id: assetMemberId || undefined,
      notes,
      start_date: startDate.trim() || undefined,
      opened_by: (assetType === 'bank_deposit' || assetType === 'mutual_funds') ? openedBy : undefined,
      agent_name: openedBy === 'agent' ? agentName.trim() || undefined : undefined,
      agent_phone: openedBy === 'agent' ? agentPhone.trim() || undefined : undefined,
      account_number: accountNumber.trim() || undefined,
    });

    // Reset Form
    setAssetName('');
    setAssetValue('');
    setMonthlyRent('');
    setStartDate('');
    setOpenedBy('direct_bank');
    setAgentName('');
    setAgentPhone('');
    setAccountNumber('');
    setIsAddAssetOpen(false);
  };

  const handleOpenAddGoal = () => {
    setEditingGoalId(null);
    setGoalTitle('');
    setGoalTarget('');
    setGoalSaved('');
    setGoalDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setGoalMemberId(members[0]?.id || '');
    setGoalFundingSource('savings');
    setGoalLinkedAssetIds([]);
    setGoalNotes('');
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setGoalTitle(goal.title);
    setGoalTarget(String(goal.target_amount));
    setGoalSaved(String(goal.saved_amount));
    setGoalDate(goal.target_date || '');
    setGoalMemberId(goal.member_id || members[0]?.id || '');
    setGoalFundingSource(goal.funding_source || 'savings');
    setGoalLinkedAssetIds(goal.linked_asset_ids || []);
    setGoalNotes(goal.notes || '');
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(goalTarget);
    const saved = parseFloat(goalSaved) || 0;
    if (!goalTitle.trim() || !target || target <= 0) return;

    if (editingGoalId) {
      updateGoal(editingGoalId, {
        title: goalTitle.trim(),
        target_amount: target,
        saved_amount: saved,
        target_date: goalDate || undefined,
        member_id: goalMemberId || undefined,
        funding_source: goalFundingSource,
        linked_asset_ids: goalLinkedAssetIds,
        notes: goalNotes.trim() || undefined,
      });
    } else {
      addGoal({
        title: goalTitle.trim(),
        target_amount: target,
        saved_amount: saved,
        target_date: goalDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: 'savings',
        member_id: goalMemberId || undefined,
        funding_source: goalFundingSource,
        linked_asset_ids: goalLinkedAssetIds,
        notes: goalNotes.trim() || undefined,
      });
    }

    setIsGoalModalOpen(false);
  };

  const toggleLinkedAsset = (assetId: string) => {
    setGoalLinkedAssetIds(prev => 
      prev.includes(assetId) ? prev.filter(id => id !== assetId) : [...prev, assetId]
    );
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
          <Mono className="text-3xl font-black text-paper block mt-1">
            ₹{totalWealth.toLocaleString('en-IN')}
          </Mono>
          <p className="text-xs text-paper-dim/80 mt-1">पारिवारिक कुल संपत्ति मूल्यांकन</p>
        </div>
      </div>

      {/* Liquid vs Fixed Breakdown Cards */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <div
          onClick={() => setViewTab(viewTab === 'liquid' ? 'all' : 'liquid')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            viewTab === 'liquid'
              ? 'bg-gold/15 border-gold shadow-sm'
              : 'bg-paper border-paper-dim hover:border-paper-dim/80'
          }`}
        >
          <span className="text-[10px] font-bold text-ink-muted uppercase block">तरल संपत्ति (Liquid)</span>
          <Mono className="text-lg font-black text-ink block mt-0.5">
            ₹{liquidWealth.toLocaleString('en-IN')}
          </Mono>
          <span className="text-[10px] text-ink-muted">बैंक, सोना, शेयर, नकदी</span>
        </div>

        <div
          onClick={() => setViewTab(viewTab === 'fixed' ? 'all' : 'fixed')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            viewTab === 'fixed'
              ? 'bg-gold/15 border-gold shadow-sm'
              : 'bg-paper border-paper-dim hover:border-paper-dim/80'
          }`}
        >
          <span className="text-[10px] font-bold text-ink-muted uppercase block">अचल संपत्ति (Fixed)</span>
          <Mono className="text-lg font-black text-ink block mt-0.5">
            ₹{fixedWealth.toLocaleString('en-IN')}
          </Mono>
          <span className="text-[10px] text-ink-muted">मकान, जमीन, दुकान, फ्लैट्स</span>
        </div>
      </div>

      {/* 🏢 Family Real Estate Portfolio (High-level Wealth Summary) */}
      <div className="px-4 pt-1">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-800/40 text-paper shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-paper">पारिवारिक अचल संपत्ति (Real Estate Wealth)</h3>
                <span className="text-[10px] bg-teal-500/25 text-teal-300 px-2 py-0.5 rounded font-mono font-bold">
                  {rentalProperties.length} संपत्तियां
                </span>
              </div>
              <p className="text-xs text-teal-200/80 mt-0.5">
                कुल वैल्यूएशन: <b className="font-mono text-emerald-400">₹{(rentalProperties.reduce((sum, p) => sum + (p.estimated_market_value || 0), 0)).toLocaleString('en-IN')}</b> • मासिक किराया आय: <b className="font-mono text-teal-300">₹{totalRentalIncomePerMonth.toLocaleString('en-IN')}/माह</b>
              </p>
            </div>
          </div>

          <Link
            href="/rentals"
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all whitespace-nowrap self-start sm:self-auto"
          >
            <span>🏢 पूरा किराया व संपत्ति खाता खोलें →</span>
          </Link>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="px-4 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-ink text-sm">
            पारिवारिक संपत्तियां ({filteredAssets.length})
          </h2>
          <button
            onClick={() => setIsAddAssetOpen(true)}
            className="text-xs font-bold text-gold hover:underline flex items-center gap-1"
          >
            <Plus size={13} /> नया Asset जोड़ें
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </div>

      {/* Goals Section (With Full Edit, Delete, Asset Linking) */}
      <div className="px-4 pt-2 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-ink text-sm flex items-center gap-1.5">
              <PiggyBank size={16} className="text-gold" />
              पारिवारिक वित्तीय लक्ष्य (Goals) ({goals.length})
            </h2>
            <p className="text-[11px] text-ink-muted">कार, मकान, शिक्षा, शादी - बचत व निवेश से लिंक करें</p>
          </div>
          <button
            onClick={handleOpenAddGoal}
            className="px-3 py-1.5 bg-gold text-navy font-black text-xs rounded-xl shadow-xs hover:bg-gold-light active:scale-95 transition-all flex items-center gap-1"
          >
            <Plus size={14} /> + नया Goal जोड़ें
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="p-6 text-center bg-paper rounded-2xl border border-dashed border-paper-dim space-y-2 shadow-sm">
            <PiggyBank size={28} className="text-gold mx-auto" />
            <p className="text-xs font-bold text-ink">कोई वित्तीय लक्ष्य (Goal) नहीं बना है</p>
            <p className="text-[11px] text-ink-muted max-w-xs mx-auto">
              नई कार, बच्चों की पढ़ाई, नया मकान या व्यापार विस्तार का लक्ष्य तय करें।
            </p>
            <button
              onClick={handleOpenAddGoal}
              className="px-4 py-2 bg-gold text-navy text-xs font-bold rounded-xl shadow-sm hover:bg-gold-light transition-all inline-flex items-center gap-1"
            >
              <Plus size={13} /> + नया Goal बनाएं
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goals.map((goal) => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                onEdit={handleOpenEditGoal}
                onDelete={(id) => {
                  if (confirm('क्या आप इस लक्ष्य को हटाना चाहते हैं?')) {
                    deleteGoal(id);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ADD ASSET (WITH RD START DATE & AGENT DETAILS)   */}
      {/* ======================================================== */}
      {isAddAssetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Landmark size={18} className="text-gold" />
                नई संपत्ति या निवेश (Asset / RD / FD) जोड़ें
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
                  संपत्ति / निवेश का नाम *
                </label>
                <input
                  type="text"
                  placeholder="उदा. SBI 5-Year RD, पैतृक जमीन, कार, गोल्ड"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold font-bold text-ink"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    वर्तमान मूल्य (Value ₹) *
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="₹ 2,00,000"
                    value={assetValue}
                    onChange={(e) => setAssetValue(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    किस सदस्य के नाम पर है?
                  </label>
                  <select
                    value={assetMemberId}
                    onChange={(e) => setAssetMemberId(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold text-ink font-bold"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Asset Type Selector */}
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  प्रकार (Category & Type)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAssetCategory('liquid');
                      setAssetType('bank_deposit');
                      setDepositSubType('RD');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-center font-semibold text-xs transition-all ${
                      assetType === 'bank_deposit' && depositSubType === 'RD'
                        ? 'border-gold bg-gold/15 text-gold-dark font-bold'
                        : 'border-paper-dim bg-paper text-ink-muted'
                    }`}
                  >
                    🏦 आरडी (Recurring Deposit)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAssetCategory('liquid');
                      setAssetType('bank_deposit');
                      setDepositSubType('FD');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-center font-semibold text-xs transition-all ${
                      assetType === 'bank_deposit' && depositSubType === 'FD'
                        ? 'border-gold bg-gold/15 text-gold-dark font-bold'
                        : 'border-paper-dim bg-paper text-ink-muted'
                    }`}
                  >
                    🏛️ एफडी (Fixed Deposit)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAssetCategory('liquid');
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
                      setAssetCategory('fixed');
                      setAssetType('property');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-center font-semibold text-xs transition-all ${
                      assetType === 'property'
                        ? 'border-gold bg-gold/15 text-gold-dark font-bold'
                        : 'border-paper-dim bg-paper text-ink-muted'
                    }`}
                  >
                    🏢 जमीन / मकान (Property)
                  </button>
                </div>
              </div>

              {/* RD / Deposit Flexible Fields (USER EXPLICIT REQUIREMENT) */}
              {(assetType === 'bank_deposit' || assetType === 'mutual_funds') && (
                <div className="p-3 rounded-xl bg-paper-dim/30 border border-paper-dim space-y-2">
                  <span className="text-[11px] font-bold text-ink uppercase block">
                    आरडी / बैंक जमा आरंभ व माध्यम विवरण (वैकल्पिक)
                  </span>

                  <div>
                    <label className="text-[11px] font-bold text-ink-muted block mb-1">
                      कब से शुरू हुआ (Start Date) [वैकल्पिक]
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-paper border border-paper-dim text-ink"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-ink-muted block mb-1">
                      किसने / कैसे खोला (Channel) [वैकल्पिक]
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOpenedBy('direct_bank')}
                        className={`py-1.5 px-2 rounded-xl border text-center font-bold text-xs ${
                          openedBy === 'direct_bank' ? 'bg-gold/15 border-gold text-gold-dark' : 'bg-paper border-paper-dim text-ink-muted'
                        }`}
                      >
                        डायरेक्ट बैंक से
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenedBy('agent')}
                        className={`py-1.5 px-2 rounded-xl border text-center font-bold text-xs ${
                          openedBy === 'agent' ? 'bg-gold/15 border-gold text-gold-dark' : 'bg-paper border-paper-dim text-ink-muted'
                        }`}
                      >
                        एजेंट के माध्यम से
                      </button>
                    </div>
                  </div>

                  {openedBy === 'agent' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-ink-muted block mb-1">एजेंट का नाम</label>
                        <input
                          type="text"
                          placeholder="e.g. शर्मा जी"
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-paper border border-paper-dim text-ink"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-ink-muted block mb-1">एजेंट का फोन</label>
                        <input
                          type="tel"
                          placeholder="9876543210"
                          value={agentPhone}
                          onChange={(e) => setAgentPhone(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-paper border border-paper-dim text-ink font-mono"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-ink-muted block mb-1">
                      खाता संख्या / रसीद नं (Account / Folio No.) [वैकल्पिक]
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10928374..."
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-paper border border-paper-dim text-ink font-mono"
                    />
                  </div>
                </div>
              )}

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

      {/* ======================================================== */}
      {/* MODAL 2: ADD / EDIT FINANCIAL GOAL (LINKED INVESTMENTS)  */}
      {/* ======================================================== */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <PiggyBank size={18} className="text-gold" />
                {editingGoalId ? 'वित्तीय लक्ष्य संपादित करें' : 'नया Financial Goal बनाएं'}
              </h3>
              <button
                onClick={() => setIsGoalModalOpen(false)}
                className="text-ink-muted hover:text-ink p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  लक्ष्य का नाम (Goal Title) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. नई कार, बेटी की शादी, नया मकान, शिक्षा"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold font-bold text-ink"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    कुल लक्ष्य (Target ₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="₹ 5,00,000"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    अब तक नकद जमा (Saved ₹)
                  </label>
                  <input
                    type="number"
                    placeholder="₹ 50,000"
                    value={goalSaved}
                    onChange={(e) => setGoalSaved(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    लक्ष्य तारीख (Target Date)
                  </label>
                  <input
                    type="date"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold text-ink"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    किस सदस्य का लक्ष्य है?
                  </label>
                  <select
                    value={goalMemberId}
                    onChange={(e) => setGoalMemberId(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold text-ink font-bold"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Goal Funding Source Selection */}
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  फंडिंग का मुख्य स्रोत (Funding Source)
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setGoalFundingSource('savings')}
                    className={`py-2 px-1.5 rounded-xl border text-center text-[11px] font-bold ${
                      goalFundingSource === 'savings' ? 'bg-gold/15 border-gold text-gold-dark' : 'bg-paper border-paper-dim text-ink-muted'
                    }`}
                  >
                    बैंक बचत
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoalFundingSource('income')}
                    className={`py-2 px-1.5 rounded-xl border text-center text-[11px] font-bold ${
                      goalFundingSource === 'income' ? 'bg-gold/15 border-gold text-gold-dark' : 'bg-paper border-paper-dim text-ink-muted'
                    }`}
                  >
                    मासिक आय
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoalFundingSource('investment')}
                    className={`py-2 px-1.5 rounded-xl border text-center text-[11px] font-bold ${
                      goalFundingSource === 'investment' ? 'bg-gold/15 border-gold text-gold-dark' : 'bg-paper border-paper-dim text-ink-muted'
                    }`}
                  >
                    निवेश से लिंक
                  </button>
                </div>
              </div>

              {/* Linked Investments Selector (USER EXPLICIT REQUIREMENT) */}
              <div className="p-3 rounded-xl bg-paper-dim/30 border border-paper-dim space-y-2">
                <span className="text-[11px] font-bold text-ink uppercase flex items-center gap-1">
                  <LinkIcon size={12} className="text-gold" />
                  इस लक्ष्य से जुड़े निवेश (FD / RD / SIP / Gold) जोड़ें
                </span>
                <p className="text-[10px] text-ink-muted">
                  जिस निवेश को चुनेंगे, उसका मूल्य सीधे इस लक्ष्य की जमा राशि में शामिल होगा।
                </p>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {assets.filter(a => ['bank_deposit', 'gold', 'silver', 'mutual_funds', 'shares'].includes(a.type)).map(a => {
                    const isLinked = goalLinkedAssetIds.includes(a.id);
                    return (
                      <label 
                        key={a.id} 
                        className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer text-xs transition-all ${
                          isLinked ? 'bg-gold/10 border-gold' : 'bg-paper border-paper-dim hover:bg-paper-dim/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isLinked}
                            onChange={() => toggleLinkedAsset(a.id)}
                            className="rounded text-gold"
                          />
                          <span className="font-bold text-ink">{a.label}</span>
                        </div>
                        <span className="font-mono font-bold text-gold">₹{Number(a.value).toLocaleString('en-IN')}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  नोट्स / विवरण (Notes)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2027 तक पूरा करने की योजना"
                  value={goalNotes}
                  onChange={(e) => setGoalNotes(e.target.value)}
                  className="w-full px-3 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold text-ink"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink-muted font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gold text-navy font-bold hover:bg-gold-light shadow-sm"
                >
                  {editingGoalId ? '✓ बदलाव सेव करें' : 'Goal जोड़ें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
