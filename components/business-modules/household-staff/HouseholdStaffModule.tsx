'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Calendar, Check, X, Clock, Trash2, DollarSign } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

interface StaffMember {
  id: string;
  name: string;
  role: 'maid' | 'driver' | 'cook' | 'gardener' | 'guard';
  monthlySalary: number;
  advanceTaken: number;
  phone: string;
  attendance: { [day: number]: 'P' | 'A' | 'H' }; // Day 1 to 31: Present, Absent, Half-day
}

const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 'st-1',
    name: 'सुनीता दीदी (कामवाली बाई)',
    role: 'maid',
    monthlySalary: 4500,
    advanceTaken: 1000,
    phone: '9893012345',
    attendance: { 1: 'P', 2: 'P', 3: 'P', 4: 'A', 5: 'P', 6: 'P', 7: 'P', 8: 'H', 9: 'P', 10: 'P' }
  },
  {
    id: 'st-2',
    name: 'रामू काका (ड्राइवर)',
    role: 'driver',
    monthlySalary: 14000,
    advanceTaken: 2500,
    phone: '9826198765',
    attendance: { 1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P', 8: 'P', 9: 'P', 10: 'P' }
  }
];

export function HouseholdStaffModule() {
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_staff_v1');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
      }
    }
    return DEFAULT_STAFF;
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffMember['role']>('maid');
  const [salary, setSalary] = useState<number | ''>('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    localStorage.setItem('fwa_staff_v1', JSON.stringify(staffList));
  }, [staffList]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !salary) return;

    const newStaff: StaffMember = {
      id: `st-${Date.now()}`,
      name,
      role,
      monthlySalary: Number(salary),
      advanceTaken: 0,
      phone,
      attendance: {}
    };

    setStaffList([...staffList, newStaff]);
    setIsAddOpen(false);
    setName('');
    setSalary('');
    setPhone('');
  };

  const toggleAttendance = (staffId: string, day: number) => {
    setStaffList(staffList.map(st => {
      if (st.id !== staffId) return st;
      const current = st.attendance[day];
      let next: 'P' | 'A' | 'H' = 'P';
      if (current === 'P') next = 'H';
      else if (current === 'H') next = 'A';
      else if (current === 'A') {
        const updated = { ...st.attendance };
        delete updated[day];
        return { ...st, attendance: updated };
      }
      return { ...st, attendance: { ...st.attendance, [day]: next } };
    }));
  };

  const handleAdvance = (staffId: string) => {
    const amt = prompt('एडवांस दी गई रकम (₹):');
    if (amt && !isNaN(Number(amt))) {
      setStaffList(staffList.map(st => {
        if (st.id === staffId) {
          return { ...st, advanceTaken: st.advanceTaken + Number(amt) };
        }
        return st;
      }));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('क्या आप इस स्टाफ का रिकॉर्ड हटाना चाहते हैं?')) {
      setStaffList(staffList.filter(s => s.id !== id));
    }
  };

  const totalMonthlySalary = staffList.reduce((sum, s) => sum + s.monthlySalary, 0);
  const totalAdvance = staffList.reduce((sum, s) => sum + s.advanceTaken, 0);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-navy text-paper p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gold/20 text-gold rounded-xl">
              <Users size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold font-serif">Household Staff Manager</h2>
              <p className="text-[11px] text-paper-dim/80">मेड, ड्राइवर, रसोइया की 1-31 दैनिक हाजिरी, एडवांस व वेतन</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3 py-1.5 bg-gold text-navy text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-gold-light active:scale-95 transition-all shadow-sm"
          >
            <Plus size={15} /> नया स्टाफ
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-navy-light/40">
          <div className="bg-navy-light/40 p-2.5 rounded-xl">
            <p className="text-[10px] text-paper-dim/70">कुल मासिक स्टाफ वेतन (Monthly)</p>
            <Mono className="text-base font-bold text-gold">₹{totalMonthlySalary.toLocaleString('en-IN')}</Mono>
          </div>
          <div className="bg-navy-light/40 p-2.5 rounded-xl">
            <p className="text-[10px] text-paper-dim/70">कुल एडवांस दिया हुआ (Advance)</p>
            <Mono className="text-base font-bold text-coral-light">₹{totalAdvance.toLocaleString('en-IN')}</Mono>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="space-y-3">
        {staffList.map(st => {
          const presentDays = Object.values(st.attendance).filter(v => v === 'P').length;
          const halfDays = Object.values(st.attendance).filter(v => v === 'H').length;
          const absentDays = Object.values(st.attendance).filter(v => v === 'A').length;
          const effectiveDays = presentDays + (halfDays * 0.5);
          const estimatedPayable = Math.max(0, Math.round((st.monthlySalary / 30) * effectiveDays) - st.advanceTaken);

          return (
            <div key={st.id} className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-gold/15 text-gold-dark text-[10px] font-bold rounded-md uppercase">
                      {st.role}
                    </span>
                    <span className="text-xs text-ink-muted">{st.phone}</span>
                  </div>
                  <h3 className="text-sm font-bold text-ink mt-1">{st.name}</h3>
                </div>

                <div className="text-right">
                  <Mono className="text-sm font-bold text-ink">₹{st.monthlySalary.toLocaleString('en-IN')}/माह</Mono>
                  {st.advanceTaken > 0 && (
                    <p className="text-[10px] text-coral font-semibold">एडवांस लिया: ₹{st.advanceTaken.toLocaleString('en-IN')}</p>
                  )}
                </div>
              </div>

              {/* 1-15 Day Attendance Matrix */}
              <div className="space-y-1.5 bg-paper-dim/40 p-2.5 rounded-xl">
                <div className="flex justify-between items-center text-[10px] text-ink-muted">
                  <span className="font-bold uppercase">हाजिरी कैलेंडर (टैप करें: हरा=P, पीला=H, लाल=A)</span>
                  <span className="font-semibold text-ink">कुल हाजिरी: {effectiveDays} दिन</span>
                </div>

                <div className="grid grid-cols-10 gap-1 text-center">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(day => {
                    const status = st.attendance[day];
                    return (
                      <button
                        key={day}
                        onClick={() => toggleAttendance(st.id, day)}
                        className={`py-1 rounded-md text-[10px] font-bold transition-all ${
                          status === 'P' ? 'bg-green text-paper' :
                          status === 'H' ? 'bg-gold text-navy' :
                          status === 'A' ? 'bg-coral text-paper' :
                          'bg-paper border border-paper-dim text-ink-muted hover:bg-paper-dim'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 text-xs border-t border-paper-dim">
                <div>
                  <span className="text-ink-muted text-[11px]">हाजिरी अनुसार शुद्ध देय: </span>
                  <Mono className="font-bold text-green">₹{estimatedPayable.toLocaleString('en-IN')}</Mono>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAdvance(st.id)}
                    className="px-2.5 py-1 bg-paper border border-paper-dim rounded-lg text-ink font-semibold hover:bg-paper-dim"
                  >
                    + एडवांस दें
                  </button>
                  <button
                    onClick={() => handleDelete(st.id)}
                    className="text-coral hover:text-coral-dark p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Staff Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <h3 className="text-sm font-bold text-ink">नया घरेलू स्टाफ जोड़ें</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">नाम</label>
                <input
                  type="text"
                  placeholder="उदा. सुनीता दीदी या रामू ड्राइवर"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">पद / भूमिका</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  >
                    <option value="maid">कामवाली (Maid)</option>
                    <option value="driver">ड्राइवर (Driver)</option>
                    <option value="cook">रसोइया (Cook)</option>
                    <option value="gardener">माली (Gardener)</option>
                    <option value="guard">चौकीदार (Guard)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">मासिक वेतन (₹)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={salary}
                    onChange={e => setSalary(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink-muted mb-1">फ़ोन नंबर</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gold text-navy font-bold hover:bg-gold-light"
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
