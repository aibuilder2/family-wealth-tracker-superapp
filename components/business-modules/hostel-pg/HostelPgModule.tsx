'use client';

import React, { useState } from 'react';
import { 
  Bed, Plus, Users, IndianRupee, Zap, UtensilsCrossed, 
  Calendar, CheckCircle2, Phone, ShieldCheck, X, Calculator
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import { useFamilyStore } from '@/lib/store/familyStore';

export default function HostelPgModule() {
  const { rentalProperties, updateRentalTenant, addRentalTenant } = useFamilyStore();

  // Find the hostel property
  const hostelProp = rentalProperties.find(p => p.has_hostel_model) || rentalProperties[4];
  const hostelTenants = hostelProp?.tenants || [];
  const hostelRooms = hostelProp?.rooms || [];

  // Submeter Calculator state
  const [prevReading, setPrevReading] = useState<number>(240);
  const [currReading, setCurrReading] = useState<number>(290);
  const [unitRate, setUnitRate] = useState<number>(9);

  // New Student Tenant Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [roomNo, setRoomNo] = useState('Room 101');
  const [bedLetter, setBedLetter] = useState('Bed A');
  const [monthlyRent, setMonthlyRent] = useState('4500');
  const [deposit, setDeposit] = useState('9000');
  const [foodIncluded, setFoodIncluded] = useState(true);

  const unitsConsumed = Math.max(0, currReading - prevReading);
  const electricityBill = unitsConsumed * unitRate;

  const totalMonthlyHostelRent = hostelTenants.reduce((s, t) => s + (t.monthly_rent || 0), 0);
  const totalHostelDeposit = hostelTenants.reduce((s, t) => s + (t.security_deposit || 0), 0);

  const handleAddHostelTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !hostelProp) return;

    addRentalTenant(hostelProp.id, {
      name: studentName.trim(),
      phone: studentPhone.trim(),
      room_number: roomNo,
      bed_number: bedLetter,
      monthly_rent: Number(monthlyRent) || 4500,
      security_deposit: Number(deposit) || 9000,
      rent_status: 'paid',
      food_included: foodIncluded,
      joining_date: new Date().toISOString().split('T')[0],
      rent_due_day: 5,
    });

    setShowAddModal(false);
    setStudentName('');
    setStudentPhone('');
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-lg border border-blue-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/25 flex items-center justify-center">
              <Bed className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm">हॉस्टल व पीजी बिज़नेस ERP (Rooms, Beds & Mess)</h3>
                <span className="text-[10px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded font-mono font-bold">
                  व्यापारिक मॉडल (No Property Valuation)
                </span>
              </div>
              <p className="text-[11px] text-blue-200">
                रूम/बेड मैट्रिक्स, मेस भोजन सुविधा, सब-मीटर रीडिंग व छात्र किरायेदार रिकॉर्ड।
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md transition cursor-pointer"
          >
            <Plus size={14} /> + नया हॉस्टल किरायेदार (छात्र)
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
          <div>
            <span className="text-[10px] text-blue-200">मासिक कुल हॉस्टल किराया</span>
            <Mono className="text-xs font-bold text-white block">₹{totalMonthlyHostelRent.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-emerald-300">जमा अमानत (Deposit)</span>
            <Mono className="text-xs font-bold text-emerald-300 block">₹{totalHostelDeposit.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-amber-300">कुल सक्रिय छात्र/किरायेदार</span>
            <Mono className="text-xs font-bold text-amber-300 block">{hostelTenants.length} छात्र</Mono>
          </div>
        </div>
      </div>

      {/* Electricity Sub-Meter Calculator Widget */}
      <div className="p-3.5 bg-paper rounded-xl border border-paper-dim shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
            <Zap size={14} className="text-amber-500" />
            <span>हॉस्टल सब-मीटर बिजली बिल कैलकुलेटर</span>
          </div>
          <span className="text-[10px] text-ink-muted">दर: ₹{unitRate}/यूनिट</span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-ink-muted block">पिछली यूनिट</span>
            <input
              type="number"
              value={prevReading}
              onChange={(e) => setPrevReading(Number(e.target.value))}
              className="w-full px-2 py-1 bg-paper-dim/40 border border-paper-dim rounded-lg font-mono font-bold"
            />
          </div>
          <div>
            <span className="text-[10px] text-ink-muted block">वर्तमान यूनिट</span>
            <input
              type="number"
              value={currReading}
              onChange={(e) => setCurrReading(Number(e.target.value))}
              className="w-full px-2 py-1 bg-paper-dim/40 border border-paper-dim rounded-lg font-mono font-bold"
            />
          </div>
          <div>
            <span className="text-[10px] text-ink-muted block">कुल खपत</span>
            <div className="px-2 py-1 bg-paper-dim/60 rounded-lg font-mono font-bold text-blue-600">
              {unitsConsumed} Units
            </div>
          </div>
          <div>
            <span className="text-[10px] text-ink-muted block">बिजली बिल</span>
            <div className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg font-mono font-black text-amber-600">
              ₹{electricityBill}
            </div>
          </div>
        </div>
      </div>

      {/* Active Students & Beds List */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
          हॉस्टल कमरे व छात्र सूची ({hostelTenants.length})
        </h4>

        {hostelTenants.length === 0 ? (
          <div className="p-6 bg-paper border border-paper-dim rounded-xl text-center text-xs text-ink-muted">
            कोई छात्र/किरायेदार दर्ज नहीं है।
          </div>
        ) : (
          hostelTenants.map((t) => (
            <div key={t.id} className="p-3 bg-paper rounded-xl border border-paper-dim shadow-xs flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded text-[10px]">
                    {t.room_number || 'Room 101'} • {t.bed_number || 'Bed A'}
                  </span>
                  <h4 className="font-bold text-ink">{t.name}</h4>
                  {t.food_included && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                      <UtensilsCrossed size={10} /> मेस भोजन शामिल
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-ink-muted">
                  किराया: <b className="text-ink">₹{t.monthly_rent}/माह</b> • सिक्योरिटी: ₹{t.security_deposit} • ड्यू: हर महीने 5 तारीख
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ✓ PAID (जमा)
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-sm w-full p-5 space-y-3.5 border border-paper-dim shadow-2xl">
            <div className="flex justify-between items-center border-b border-paper-dim pb-2">
              <h4 className="font-bold text-sm text-ink">नया हॉस्टल छात्र/किरायेदार जोड़ें</h4>
              <button onClick={() => setShowAddModal(false)} className="text-ink-muted hover:text-ink"><X size={16} /></button>
            </div>

            <form onSubmit={handleAddHostelTenant} className="space-y-2.5 text-xs">
              <input
                type="text"
                required
                placeholder="छात्र का नाम *"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="कमरा नंबर (उदा. Room 101)"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl"
                />
                <input
                  type="text"
                  placeholder="बेड (उदा. Bed A)"
                  value={bedLetter}
                  onChange={(e) => setBedLetter(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="किराया ₹"
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
              <label className="flex items-center gap-2 p-2 bg-paper-dim/30 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={foodIncluded}
                  onChange={(e) => setFoodIncluded(e.target.checked)}
                  className="rounded"
                />
                <span className="font-semibold text-ink">मेस भोजन (Mess Food) शामिल है</span>
              </label>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-xl border border-paper-dim font-bold text-ink-muted">रद्द</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">सुरक्षित करें</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
