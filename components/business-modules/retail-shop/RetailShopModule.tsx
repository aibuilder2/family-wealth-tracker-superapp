'use client';

import React, { useState, useEffect } from 'react';
import { Store, Plus, ShoppingBag, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export interface ShopKhataEntry {
  id: string;
  customerName: string;
  amount: number;
  type: 'UDHAR_DIYA' | 'JAMA_MILAA';
  date: string;
}

export default function RetailShopModule() {
  const [entries, setEntries] = useState<ShopKhataEntry[]>([
    { id: 's-1', customerName: 'अनिल किराना ग्राहक', amount: 1450, type: 'UDHAR_DIYA', date: '2026-09-20' },
    { id: 's-2', customerName: 'दीपक शर्मा', amount: 2000, type: 'JAMA_MILAA', date: '2026-09-21' }
  ]);

  const totalUdhar = entries.filter(e => e.type === 'UDHAR_DIYA').reduce((sum, e) => sum + e.amount, 0);
  const totalJama = entries.filter(e => e.type === 'JAMA_MILAA').reduce((sum, e) => sum + e.amount, 0);
  const netPending = totalUdhar - totalJama;

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-950 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Store className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm">दुकान व किराना उधार (Retail Khata)</h3>
              <p className="text-[11px] text-emerald-200">दैनिक नकद बिक्री, गल्ला व कस्टमर उधारी</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
          <div>
            <span className="text-[10px] text-emerald-200">कुल दिया उधार</span>
            <Mono className="text-xs font-bold text-white block">₹{totalUdhar.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-emerald-200">प्राप्त जमा</span>
            <Mono className="text-xs font-bold text-emerald-300 block">₹{totalJama.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-emerald-200">मार्केट में बाकी</span>
            <Mono className="text-xs font-bold text-amber-300 block">₹{netPending.toLocaleString('en-IN')}</Mono>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {entries.map(e => (
          <div key={e.id} className="p-3 bg-paper rounded-xl border border-paper-dim shadow-xs flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-ink">{e.customerName}</p>
              <p className="text-[11px] text-ink-muted">तारीख: {e.date}</p>
            </div>
            <div className="text-right">
              <Mono className={`font-bold text-sm block ${e.type === 'UDHAR_DIYA' ? 'text-coral' : 'text-emerald-700'}`}>
                {e.type === 'UDHAR_DIYA' ? `+ ₹${e.amount}` : `- ₹${e.amount}`}
              </Mono>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${e.type === 'UDHAR_DIYA' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {e.type === 'UDHAR_DIYA' ? 'उधार माल दिया' : 'नकद प्राप्त जमा'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
