'use client';

import React from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { TransactionForm } from '@/components/money/TransactionForm';
import { X } from 'lucide-react';

export function AddTransactionModal() {
  const { isQuickAddOpen, quickAddType, closeQuickAdd } = useFamilyStore();

  if (!isQuickAddOpen) return null;

  return (
    <div 
      onClick={closeQuickAdd}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        className="w-full max-w-[430px] bg-[#EFEAE0] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-paper-dim cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 bg-navy text-paper">
          <div>
            <h2 className="text-base font-semibold font-serif">Naya Entry Jodein</h2>
            <p className="text-xs text-gold-soft">Kharch, Income ya Udhar add karein</p>
          </div>
          <button
            onClick={closeQuickAdd}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-navy-light text-paper hover:text-gold-soft transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto flex-1">
          <TransactionForm
            initialType={quickAddType}
            onSuccess={closeQuickAdd}
          />
        </div>
      </div>
    </div>
  );
}
