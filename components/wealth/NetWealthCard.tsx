'use client';

import React from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Mono } from '@/components/ui/Mono';
import { ArrowUpRight, Plus } from 'lucide-react';

export function NetWealthCard() {
  const { totalWealth, totalIncomeThisMonth, totalRentalIncomePerMonth, totalSecurityDepositHeld, openQuickAdd } = useFamilyStore();

  return (
    <div className="rounded-2xl p-5 bg-navy shadow-md text-paper">
      <p className="text-xs text-gold-soft font-medium tracking-wide">
        TOTAL FAMILY WEALTH
      </p>
      <Mono className="text-3xl font-semibold text-paper block mt-0.5">
        ₹{totalWealth.toLocaleString('en-IN')}
      </Mono>
      <div className="flex items-center gap-1 mt-1">
        <ArrowUpRight size={14} className="text-gold-soft" />
        <span className="text-xs text-gold-soft">
          {totalIncomeThisMonth > 0
            ? `+₹${totalIncomeThisMonth.toLocaleString('en-IN')} इस महीने आमदनी`
            : '0 आमदनी इस महीने'}
        </span>
      </div>

      {totalRentalIncomePerMonth > 0 && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10 text-[11px] text-teal-200">
          <span>🏢 कुल किराया: <b className="text-paper">₹{totalRentalIncomePerMonth.toLocaleString('en-IN')}/माह</b></span>
          {totalSecurityDepositHeld > 0 && (
            <span>• अमानत: <b className="text-paper">₹{totalSecurityDepositHeld.toLocaleString('en-IN')}</b></span>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => openQuickAdd('expense')}
          className="flex-1 rounded-xl py-2 text-xs flex items-center justify-center gap-1 bg-white/10 text-paper hover:bg-white/15 active:scale-95 transition-all font-sans font-medium"
        >
          <Plus size={12} /> Expense
        </button>

        <button
          type="button"
          onClick={() => openQuickAdd('income')}
          className="flex-1 rounded-xl py-2 text-xs flex items-center justify-center gap-1 bg-white/10 text-paper hover:bg-white/15 active:scale-95 transition-all font-sans font-medium"
        >
          <Plus size={12} /> Income
        </button>

        <button
          type="button"
          onClick={() => openQuickAdd('udhar')}
          className="flex-1 rounded-xl py-2 text-xs flex items-center justify-center gap-1 bg-white/10 text-paper hover:bg-white/15 active:scale-95 transition-all font-sans font-medium"
        >
          <Plus size={12} /> Udhar
        </button>
      </div>
    </div>
  );
}
