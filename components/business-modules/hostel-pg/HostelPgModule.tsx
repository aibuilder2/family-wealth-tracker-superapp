'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bed, Plus, Users, IndianRupee, AlertCircle, 
  Calendar, CheckCircle2, Phone, ShieldCheck, X
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

import { useFamilyStore } from '@/lib/store/familyStore';

export interface RoomTenant {
  id: string;
  roomNumber: string; // e.g. "Room 101", "Flat 2B"
  tenantName: string;
  tenantPhone: string;
  monthlyRent: number;
  securityDeposit: number;
  dueDayOfMonth: number; // e.g. 5th of every month
  electricityMeterReading?: number;
  paymentStatus: 'PAID' | 'DUE';
  dueAmount: number;
  joiningDate: string;
}

export default function HostelPgModule() {
  const { rentalTenants, addRentalTenant, toggleTenantRentStatus } = useFamilyStore();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [roomNumber, setRoomNumber] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('7500');
  const [deposit, setDeposit] = useState('7500');

  const tenants: RoomTenant[] = rentalTenants.map((t) => ({
    id: t.id,
    roomNumber: t.room_id,
    tenantName: t.name,
    tenantPhone: t.phone || '',
    monthlyRent: t.monthly_rent,
    securityDeposit: t.security_deposit,
    dueDayOfMonth: 5,
    paymentStatus: t.rent_status === 'paid' ? 'PAID' : 'DUE',
    dueAmount: t.rent_status === 'due' ? t.monthly_rent : 0,
    joiningDate: t.joining_date || '',
  }));

  const handleSaveTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName.trim() || !roomNumber.trim()) return;

    const rent = Number(monthlyRent) || 0;
    addRentalTenant({
      property_id: 'prop-kesharwani-1',
      room_id: roomNumber.trim(),
      name: tenantName.trim(),
      phone: tenantPhone.trim(),
      monthly_rent: rent,
      security_deposit: Number(deposit) || 0,
      rent_status: 'paid',
      joining_date: new Date().toISOString().split('T')[0],
    });

    setShowAddModal(false);
    setRoomNumber('');
    setTenantName('');
    setTenantPhone('');
    setMonthlyRent('7500');
    setDeposit('7500');
  };

  const toggleRentStatus = (id: string) => {
    toggleTenantRentStatus(id);
  };

  // KPIs
  const totalMonthlyRent = tenants.reduce((s, t) => s + t.monthlyRent, 0);
  const totalDueRent = tenants.reduce((s, t) => s + t.dueAmount, 0);
  const totalDepositHeld = tenants.reduce((s, t) => s + t.securityDeposit, 0);

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900 to-emerald-950 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/25 flex items-center justify-center">
              <Bed className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm">हॉस्टल, पीजी व मकान किराया (Rent & PG ERP)</h3>
                <span className="text-[9px] bg-teal-500/30 text-teal-200 px-1.5 py-0.2 rounded font-mono">
                  {tenants.length} किरायेदार
                </span>
              </div>
              <p className="text-[11px] text-teal-200">रूम नंबर, मासिक किराया, सिक्योरिटी डिपॉजिट व उधारी</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer transition-all active:scale-95 self-start sm:self-auto"
          >
            <Plus size={14} /> + नया किरायेदार जोड़ें
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
          <div>
            <span className="text-[10px] text-teal-200">मासिक कुल किराया</span>
            <Mono className="text-xs font-bold text-white block">₹{totalMonthlyRent.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-rose-300">किराया बाकी (Due)</span>
            <Mono className="text-xs font-bold text-rose-400 block">₹{totalDueRent.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-emerald-300">जमा अमानत (Deposit)</span>
            <Mono className="text-xs font-bold text-emerald-300 block">₹{totalDepositHeld.toLocaleString('en-IN')}</Mono>
          </div>
        </div>
      </div>

      {/* Tenants List */}
      <div className="space-y-2.5">
        {tenants.length === 0 ? (
          <div className="p-8 bg-paper border border-paper-dim rounded-2xl text-center shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-full bg-paper-dim/50 flex items-center justify-center mx-auto text-ink-muted">
              <Bed size={20} />
            </div>
            <p className="text-xs text-ink-muted">कोई किरायेदार या रूम दर्ज नहीं है।</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1"
            >
              <Plus size={14} /> + नया किरायेदार जोड़ें
            </button>
          </div>
        ) : (
          tenants.map(t => (
            <div key={t.id} className="p-3.5 bg-paper rounded-xl border border-paper-dim shadow-xs flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-navy bg-navy/10 px-1.5 py-0.5 rounded text-[10px]">
                    {t.roomNumber}
                  </span>
                  <h4 className="font-bold text-ink">{t.tenantName}</h4>
                </div>
                <p className="text-[11px] text-ink-muted">📞 {t.tenantPhone} • शामिल: {t.joiningDate}</p>
                <div className="text-[10px] text-ink-muted">
                  किराया: <b className="text-ink">₹{t.monthlyRent}/माह</b> • सिक्योरिटी: ₹{t.securityDeposit}
                </div>
              </div>

              <div className="text-right space-y-1">
                <button
                  onClick={() => toggleRentStatus(t.id)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                    t.paymentStatus === 'PAID'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                  }`}
                >
                  {t.paymentStatus === 'PAID' ? '✓ किराया जमा' : `बाकी ₹${t.dueAmount}`}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ➕ MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-sm w-full p-5 space-y-3.5 border border-paper-dim shadow-2xl">
            <div className="flex justify-between items-center border-b border-paper-dim pb-2">
              <h4 className="font-bold text-sm text-ink">नया किरायेदार प्रविष्टि</h4>
              <button onClick={() => setShowAddModal(false)} className="text-ink-muted hover:text-ink"><X size={16} /></button>
            </div>

            <form onSubmit={handleSaveTenant} className="space-y-2.5 text-xs">
              <input
                type="text"
                required
                placeholder="रूम / फ्लैट / दुकान नंबर (उदा. रूम 204)"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold"
              />
              <input
                type="text"
                required
                placeholder="किरायेदार का नाम *"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-medium"
              />
              <input
                type="tel"
                placeholder="मोबाइल नंबर"
                value={tenantPhone}
                onChange={(e) => setTenantPhone(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  required
                  placeholder="मासिक किराया ₹"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold"
                />
                <input
                  type="number"
                  placeholder="सिक्योरिटी डिपॉजिट ₹"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-xl border border-paper-dim font-bold text-ink-muted">रद्द</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold">किरायेदार जोड़ें</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
