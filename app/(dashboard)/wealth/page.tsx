'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { AssetCard } from '@/components/wealth/AssetCard';
import { GoalCard } from '@/components/wealth/GoalCard';
import { Mono } from '@/components/ui/Mono';
import { Plus, PiggyBank, Building2 } from 'lucide-react';

export default function WealthPage() {
  const { assets, goals, totalWealth, liquidWealth, fixedWealth, addGoal, addAsset } = useFamilyStore();
  const [viewTab, setViewTab] = useState<'all' | 'liquid' | 'fixed'>('all');

  const filteredAssets = assets.filter(a => {
    if (viewTab === 'all') return true;
    return a.category === viewTab;
  });

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Wealth"
        subtitle="Saari savings aur assets ek jagah"
      />

      {/* Net Wealth Card */}
      <div className="px-4">
        <div className="rounded-2xl p-5 text-center bg-navy shadow-md text-paper">
          <p className="text-xs text-gold-soft tracking-wider font-mono">NET WEALTH</p>
          <Mono className="text-3xl font-semibold text-paper block mt-0.5">
            ₹{totalWealth.toLocaleString('en-IN')}
          </Mono>
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-navy-light/60">
            <div className="text-center">
              <span className="text-[10px] text-gold-soft uppercase tracking-wider block">Liquid (Cash/Bank)</span>
              <Mono className="text-sm font-semibold text-paper">
                ₹{liquidWealth.toLocaleString('en-IN')}
              </Mono>
            </div>
            <div className="text-center border-l border-navy-light/60">
              <span className="text-[10px] text-gold-soft uppercase tracking-wider block">Fixed (Land/Gold)</span>
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
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
            viewTab === 'all' ? 'bg-navy text-paper' : 'bg-paper-dim text-ink-muted'
          }`}
        >
          Sab Assets
        </button>
        <button
          onClick={() => setViewTab('liquid')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
            viewTab === 'liquid' ? 'bg-navy text-paper' : 'bg-paper-dim text-ink-muted'
          }`}
        >
          Liquid (₹{(liquidWealth/100000).toFixed(1)}L)
        </button>
        <button
          onClick={() => setViewTab('fixed')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
            viewTab === 'fixed' ? 'bg-navy text-paper' : 'bg-paper-dim text-ink-muted'
          }`}
        >
          Fixed (₹{(fixedWealth/100000).toFixed(1)}L)
        </button>
      </div>

      {/* Assets Grid */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {filteredAssets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>

      {/* Goals Section */}
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif font-semibold text-ink text-sm">
            Family Financial Goals
          </h2>
        </div>

        <div className="rounded-xl bg-paper border border-paper-dim divide-y divide-paper-dim overflow-hidden shadow-sm">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>
    </div>
  );
}
