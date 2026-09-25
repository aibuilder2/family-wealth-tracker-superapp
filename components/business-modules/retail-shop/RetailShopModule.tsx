'use client';

import React, { useState, useEffect } from 'react';
import { Store, Plus, ShoppingBag, ArrowUpRight, ArrowDownRight, CreditCard, X } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export interface ShopKhataEntry {
  id: string;
  customerName: string;
  amount: number;
  type: 'UDHAR_DIYA' | 'JAMA_MILAA';
  date: string;
}

export default function RetailShopModule() {
  const [entries, setEntries] = useState<ShopKhataEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_retail_khata_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((e: any) => !['s-1', 's-2'].includes(e?.id));
          }
        } catch (e) {}
      }
    }
    return [];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'UDHAR_DIYA' | 'JAMA_MILAA'>('UDHAR_DIYA');

  useEffect(() => {
    try {
      localStorage.setItem('fwa_retail_khata_v1', JSON.stringify(entries));
    } catch (e) {}
  }, [entries]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;
    const newEntry: ShopKhataEntry = {
      id: 's-' + Date.now(),
      customerName: name.trim(),
      amount: Number(amount),
      type,
      date: new Date().toISOString().split('T')[0]
    };
    setEntries([newEntry, ...entries]);
    setShowAddModal(false);
    setName('');
    setAmount('');
  };

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
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Plus size={14} /> + नई एंट्री
          </button>
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
        {entries.length === 0 ? (
          <div className="p-8 bg-paper border border-paper-dim rounded-2xl text-center shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-full bg-paper-dim/50 flex items-center justify-center mx-auto text-ink-muted">
              <Store size={20} />
            </div>
            <p className="text-xs text-ink-muted">कोई किराना या रिटेल उधार/जमा एंट्री दर्ज नहीं है।</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1"
            >
              <Plus size={14} /> + नई एंट्री दर्ज करें
            </button>
          </div>
        ) : (
          entries.map(e => (
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
          ))
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-sm w-full p-5 space-y-3.5 border border-paper-dim shadow-2xl">
            <div className="flex justify-between items-center border-b border-paper-dim pb-2">
              <h4 className="font-bold text-sm text-ink">दुकान उधार / जमा प्रविष्टि</h4>
              <button onClick={() => setShowAddModal(false)} className="text-ink-muted hover:text-ink"><X size={16} /></button>
            </div>
            <form onSubmit={handleAddEntry} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('UDHAR_DIYA')}
                  className={`py-1.5 rounded-lg font-bold border ${type === 'UDHAR_DIYA' ? 'bg-rose-600 text-white' : 'bg-paper text-ink-muted'}`}
                >
                  उधार दिया
                </button>
                <button
                  type="button"
                  onClick={() => setType('JAMA_MILAA')}
                  className={`py-1.5 rounded-lg font-bold border ${type === 'JAMA_MILAA' ? 'bg-emerald-600 text-white' : 'bg-paper text-ink-muted'}`}
                >
                  जमा मिला
                </button>
              </div>
              <input
                type="text"
                placeholder="ग्राहक का नाम"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-lg font-semibold"
              />
              <input
                type="number"
                placeholder="रकम ₹"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-lg font-bold"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500"
                >
                  सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
