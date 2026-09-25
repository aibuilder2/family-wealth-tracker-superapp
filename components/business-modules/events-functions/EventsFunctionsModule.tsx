'use client';

import React, { useState, useEffect } from 'react';
import { PartyPopper, Plus, Gift, Users, IndianRupee, X } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export interface ShagunRecord {
  id: string;
  relativeName: string;
  relation: string;
  amount: number;
  eventTitle: string; // e.g. Rohan ki Shaadi, Griha Pravesh
  type: 'RECEIVED_SHAGUN' | 'GIVEN_SHAGUN';
}

export default function EventsFunctionsModule() {
  const [records, setRecords] = useState<ShagunRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_events_shagun_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((r: any) => !['sh-1', 'sh-2'].includes(r?.id));
          }
        } catch (e) {}
      }
    }
    return [];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [amount, setAmount] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [type, setType] = useState<'RECEIVED_SHAGUN' | 'GIVEN_SHAGUN'>('RECEIVED_SHAGUN');

  useEffect(() => {
    try {
      localStorage.setItem('fwa_events_shagun_v1', JSON.stringify(records));
    } catch (e) {}
  }, [records]);

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;
    const newR: ShagunRecord = {
      id: 'sh-' + Date.now(),
      relativeName: name.trim(),
      relation: relation.trim() || 'रिश्तेदार',
      amount: Number(amount),
      eventTitle: eventTitle.trim() || 'पारिवारिक कार्यक्रम',
      type
    };
    setRecords([newR, ...records]);
    setShowAddModal(false);
    setName('');
    setRelation('');
    setAmount('');
    setEventTitle('');
  };

  const totalReceived = records.filter(r => r.type === 'RECEIVED_SHAGUN').reduce((sum, r) => sum + r.amount, 0);
  const totalGiven = records.filter(r => r.type === 'GIVEN_SHAGUN').reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 via-pink-900 to-rose-950 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <PartyPopper className="w-5 h-5 text-pink-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm">शादी, इवेंट्स व शगुन डायरी</h3>
              <p className="text-[11px] text-pink-200">पारिवारिक आयोजन व शगुन लिफ़ाफ़ा रिकॉर्ड</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Plus size={14} /> + शगुन दर्ज करें
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
          <div>
            <span className="text-[10px] text-pink-200">कुल प्राप्त शगुन लिफाफा</span>
            <Mono className="text-sm font-bold text-emerald-300 block">₹{totalReceived.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-pink-200">कुल दिया गया न्योता/शगुन</span>
            <Mono className="text-sm font-bold text-amber-300 block">₹{totalGiven.toLocaleString('en-IN')}</Mono>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {records.length === 0 ? (
          <div className="p-8 bg-paper border border-paper-dim rounded-2xl text-center shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-full bg-paper-dim/50 flex items-center justify-center mx-auto text-ink-muted">
              <Gift size={20} />
            </div>
            <p className="text-xs text-ink-muted">कोई शगुन या न्योता लिफ़ाफ़ा रिकॉर्ड दर्ज नहीं है।</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs inline-flex items-center gap-1"
            >
              <Plus size={14} /> + नया शगुन दर्ज करें
            </button>
          </div>
        ) : (
          records.map(r => (
            <div key={r.id} className="p-3 bg-paper rounded-xl border border-paper-dim shadow-xs flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-ink">{r.relativeName} <span className="text-ink-muted text-[10px]">({r.relation})</span></p>
                <p className="text-[11px] text-ink-muted">अवसर: {r.eventTitle}</p>
              </div>
              <div className="text-right">
                <Mono className={`font-bold text-sm block ${r.type === 'RECEIVED_SHAGUN' ? 'text-emerald-700' : 'text-coral'}`}>
                  {r.type === 'RECEIVED_SHAGUN' ? `+ ₹${r.amount.toLocaleString('en-IN')}` : `- ₹${r.amount.toLocaleString('en-IN')}`}
                </Mono>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${r.type === 'RECEIVED_SHAGUN' ? 'bg-pink-100 text-pink-900' : 'bg-amber-100 text-amber-900'}`}>
                  {r.type === 'RECEIVED_SHAGUN' ? 'प्राप्त शगुन' : 'दिया शगुन'}
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
              <h4 className="font-bold text-sm text-ink">शगुन / न्योता लिफ़ाफ़ा प्रविष्टि</h4>
              <button onClick={() => setShowAddModal(false)} className="text-ink-muted hover:text-ink"><X size={16} /></button>
            </div>
            <form onSubmit={handleAddRecord} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('RECEIVED_SHAGUN')}
                  className={`py-1.5 rounded-lg font-bold border ${type === 'RECEIVED_SHAGUN' ? 'bg-pink-600 text-white' : 'bg-paper text-ink-muted'}`}
                >
                  प्राप्त शगुन
                </button>
                <button
                  type="button"
                  onClick={() => setType('GIVEN_SHAGUN')}
                  className={`py-1.5 rounded-lg font-bold border ${type === 'GIVEN_SHAGUN' ? 'bg-amber-600 text-white' : 'bg-paper text-ink-muted'}`}
                >
                  दिया गया शगुन
                </button>
              </div>
              <input
                type="text"
                placeholder="रिश्तेदार / व्यक्ति का नाम"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-lg font-semibold"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="रिश्ता (उदा. फूफाजी)"
                  value={relation}
                  onChange={e => setRelation(e.target.value)}
                  className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-lg"
                />
                <input
                  type="number"
                  placeholder="रकम ₹"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-lg font-bold"
                />
              </div>
              <input
                type="text"
                placeholder="अवसर (उदा. शादी, गृह प्रवेश)"
                value={eventTitle}
                onChange={e => setEventTitle(e.target.value)}
                className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-lg"
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
                  className="flex-1 py-2 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-500"
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
