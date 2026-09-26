'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { AssetCard } from '@/components/wealth/AssetCard';
import { GoalCard } from '@/components/wealth/GoalCard';
import { Mono } from '@/components/ui/Mono';
import { Plus, PiggyBank, Landmark, X } from 'lucide-react';
import { AssetCategory, AssetType } from '@/types';

export default function WealthPage() {
  const { assets, goals, totalWealth, liquidWealth, fixedWealth, addGoal, addAsset } = useFamilyStore();
  const [viewTab, setViewTab] = useState<'all' | 'liquid' | 'fixed'>('all');

  // Add Asset Modal State
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [assetCategory, setAssetCategory] = useState<AssetCategory>('liquid');
  const [assetType, setAssetType] = useState<AssetType>('bank_deposit');

  // Add Goal Modal State
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalSaved, setGoalSaved] = useState('');
  const [goalDate, setGoalDate] = useState('');

  const filteredAssets = assets.filter((a) => {
    if (viewTab === 'all') return true;
    return a.category === viewTab;
  });

  const handleAddAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(assetValue);
    if (!assetName.trim() || !val || val <= 0) return;

    addAsset({
      label: assetName.trim(),
      category: assetCategory,
      type: assetType,
      value: val,
    });

    setAssetName('');
    setAssetValue('');
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
                  प्रकार (Category)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAssetCategory('liquid');
                      setAssetType('bank_deposit');
                    }}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                      assetCategory === 'liquid'
                        ? 'border-gold bg-gold/15 text-gold-dark'
                        : 'border-paper-dim bg-paper text-ink-muted'
                    }`}
                  >
                    Liquid (Cash / Bank)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAssetCategory('fixed');
                      setAssetType('gold');
                    }}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                      assetCategory === 'fixed'
                        ? 'border-gold bg-gold/15 text-gold-dark'
                        : 'border-paper-dim bg-paper text-ink-muted'
                    }`}
                  >
                    Fixed (Land / Gold / Plot)
                  </button>
                </div>
              </div>

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
    </div>
  );
}
