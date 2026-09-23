'use client';

import React, { useState, useEffect } from 'react';
import { 
  Fuel, Plus, IndianRupee, Droplet, 
  Calendar, CreditCard, AlertTriangle, ShieldCheck, X
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export interface FuelNozzleRecord {
  id: string;
  fuelType: 'PETROL' | 'DIESEL' | 'CNG';
  openingReading: number;
  closingReading: number;
  litresSold: number;
  ratePerLitre: number;
  totalSalesAmount: number;
}

export interface PetrolPumpShift {
  id: string;
  shiftDate: string;
  shiftName: 'DAY' | 'NIGHT';
  managerName: string;
  totalCashCollected: number;
  totalOnlineCardPayment: number;
  totalPartyUdharCredit: number; // Transport fleet credit
  totalShiftRevenue: number;
  tankDipPetrolLtrs: number;
  tankDipDieselLtrs: number;
}

const INITIAL_SHIFTS: PetrolPumpShift[] = [
  {
    id: 'pmp-1',
    shiftDate: new Date().toISOString().split('T')[0],
    shiftName: 'DAY',
    managerName: 'रामनिवास ऑपरेटर',
    totalCashCollected: 185000,
    totalOnlineCardPayment: 92000,
    totalPartyUdharCredit: 64000, // Transporter credit diesel
    totalShiftRevenue: 341000,
    tankDipPetrolLtrs: 14200,
    tankDipDieselLtrs: 22800,
  }
];

export default function PetrolPumpModule() {
  const [shifts, setShifts] = useState<PetrolPumpShift[]>(INITIAL_SHIFTS);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [cash, setCash] = useState('');
  const [online, setOnline] = useState('');
  const [creditParty, setCreditParty] = useState('');
  const [petrolDip, setPetrolDip] = useState('14000');
  const [dieselDip, setDieselDip] = useState('22000');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fwa_petrol_shifts_v1');
      if (saved) setShifts(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const saveShifts = (sList: PetrolPumpShift[]) => {
    setShifts(sList);
    try { localStorage.setItem('fwa_petrol_shifts_v1', JSON.stringify(sList)); } catch (e) {}
  };

  const handleSaveShift = (e: React.FormEvent) => {
    e.preventDefault();
    const c = Number(cash) || 0;
    const o = Number(online) || 0;
    const cr = Number(creditParty) || 0;

    const newS: PetrolPumpShift = {
      id: 'pmp-' + Date.now(),
      shiftDate: new Date().toISOString().split('T')[0],
      shiftName: 'DAY',
      managerName: 'शिफ्ट ऑपरेटर',
      totalCashCollected: c,
      totalOnlineCardPayment: o,
      totalPartyUdharCredit: cr,
      totalShiftRevenue: c + o + cr,
      tankDipPetrolLtrs: Number(petrolDip) || 14000,
      tankDipDieselLtrs: Number(dieselDip) || 22000,
    };

    saveShifts([newS, ...shifts]);
    setShowAddModal(false);
    setCash('');
    setOnline('');
    setCreditParty('');
  };

  const totalRev = shifts.reduce((s, item) => s + item.totalShiftRevenue, 0);
  const totalFleetCredit = shifts.reduce((s, item) => s + item.totalPartyUdharCredit, 0);

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950 via-amber-950 to-slate-900 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Fuel className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm">पेट्रोल पम्प व फ्यूल आउटलेट ERP</h3>
                <span className="text-[9px] bg-amber-500/30 text-amber-200 px-1.5 py-0.2 rounded font-mono">
                  HPCL / IOCL / BPCL
                </span>
              </div>
              <p className="text-[11px] text-amber-200">मीटर रीडिंग, गल्ला कैश, टैंक डिप व गाड़ी उधारी</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Plus size={14} /> + दैनिक शिफ्ट क्लोजिंग
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
          <div>
            <span className="text-[10px] text-amber-200">कुल फ्यूल बिक्री</span>
            <Mono className="text-xs font-bold text-white block">₹{totalRev.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-rose-300">ट्रांसपोर्टर उधार डीजल</span>
            <Mono className="text-xs font-bold text-rose-400 block">₹{totalFleetCredit.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-emerald-300">टैंक स्टॉक (Diesel)</span>
            <Mono className="text-xs font-bold text-emerald-400 block">{shifts[0]?.tankDipDieselLtrs || 0} Ltr</Mono>
          </div>
        </div>
      </div>

      {/* Shifts List */}
      <div className="space-y-2.5">
        {shifts.map(sh => (
          <div key={sh.id} className="p-3.5 bg-paper rounded-xl border border-paper-dim shadow-xs space-y-2 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-ink">शिफ्ट: {sh.shiftDate} ({sh.shiftName})</h4>
                <p className="text-[11px] text-ink-muted">मैनेजर: {sh.managerName}</p>
              </div>
              <div className="text-right">
                <Mono className="font-bold text-emerald-700 text-sm block">
                  ₹{sh.totalShiftRevenue.toLocaleString('en-IN')}
                </Mono>
                <span className="text-[9px] text-ink-muted">कुल गल्ला वसूली</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-paper-dim/40 rounded-lg p-2 text-[10px]">
              <span>💵 नकद कैश: <b>₹{sh.totalCashCollected}</b></span>
              <span>💳 POS/UPI: <b>₹{sh.totalOnlineCardPayment}</b></span>
              <span>🚛 फ्लीट उधार: <b className="text-rose-700">₹{sh.totalPartyUdharCredit}</b></span>
            </div>
          </div>
        ))}
      </div>

      {/* ➕ MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-sm w-full p-5 space-y-3.5 border border-paper-dim shadow-2xl">
            <div className="flex justify-between items-center border-b border-paper-dim pb-2">
              <h4 className="font-bold text-sm text-ink">पम्प शिफ्ट क्लोजिंग दर्ज करें</h4>
              <button onClick={() => setShowAddModal(false)} className="text-ink-muted hover:text-ink"><X size={16} /></button>
            </div>

            <form onSubmit={handleSaveShift} className="space-y-2.5 text-xs">
              <input
                type="number"
                required
                placeholder="नकद गल्ला कैश ₹"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold"
              />
              <input
                type="number"
                placeholder="ऑनलाइन / कार्ड स्वाइप ₹"
                value={online}
                onChange={(e) => setOnline(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl"
              />
              <input
                type="number"
                placeholder="पार्टियों का उधार डीज़ल ₹"
                value={creditParty}
                onChange={(e) => setCreditParty(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold text-rose-700"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="पेट्रोल टैंक डिप (Ltr)"
                  value={petrolDip}
                  onChange={(e) => setPetrolDip(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl"
                />
                <input
                  type="number"
                  placeholder="डीजल टैंक डिप (Ltr)"
                  value={dieselDip}
                  onChange={(e) => setDieselDip(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-xl border border-paper-dim font-bold text-ink-muted">रद्द</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold">शिफ्ट सेव करें</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
