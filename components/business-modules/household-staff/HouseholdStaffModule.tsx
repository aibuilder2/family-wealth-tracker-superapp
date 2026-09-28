'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Calendar, Check, X, Clock, Trash2, DollarSign, 
  Banknote, Smartphone, CheckCircle2, History, AlertCircle, Phone
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export interface StaffSalaryPayment {
  id: string;
  staffId: string;
  month: string; // YYYY-MM
  date: string;
  amount: number;
  advanceDeducted: number;
  paymentMode: 'cash' | 'upi';
  referenceNo?: string;
  notes?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'maid' | 'driver' | 'cook' | 'gardener' | 'guard' | 'shop_helper';
  monthlySalary: number;
  advanceTaken: number;
  phone: string;
  joiningDate?: string;
  attendance: { [day: number]: 'P' | 'A' | 'H' }; // Day 1 to 31: Present, Absent, Half-day
  salaryHistory?: StaffSalaryPayment[];
}

const DEFAULT_STAFF: StaffMember[] = [];

export function HouseholdStaffModule() {
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_staff_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed
              .filter((s: any) => !['st-1', 'st-2'].includes(s?.id))
              .map((s: any) => ({
                ...s,
                salaryHistory: s.salaryHistory || []
              }));
          }
        } catch (e) {}
      }
    }
    return DEFAULT_STAFF;
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffMember['role']>('maid');
  const [salary, setSalary] = useState<number | ''>('');
  const [phone, setPhone] = useState('');
  const [joiningDate, setJoiningDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Modal State for Paying Salary
  const [payingStaff, setPayingStaff] = useState<StaffMember | null>(null);
  const [salaryAmount, setSalaryAmount] = useState<number | ''>('');
  const [salaryDeductAdvance, setSalaryDeductAdvance] = useState(0);
  const [salaryDate, setSalaryDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [salaryMode, setSalaryMode] = useState<'cash' | 'upi'>('cash');
  const [salaryRef, setSalaryRef] = useState('');
  const [salaryNotes, setSalaryNotes] = useState('');

  // Modal State for Advance
  const [advanceStaff, setAdvanceStaff] = useState<StaffMember | null>(null);
  const [advanceAmt, setAdvanceAmt] = useState<number | ''>('');
  const [advanceNotes, setAdvanceNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('fwa_staff_v1', JSON.stringify(staffList));
  }, [staffList]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !salary) return;

    const newStaff: StaffMember = {
      id: `st-${Date.now()}`,
      name: name.trim(),
      role,
      monthlySalary: Number(salary),
      advanceTaken: 0,
      phone: phone.trim(),
      joiningDate,
      attendance: {},
      salaryHistory: []
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

  const handleOpenAdvance = (staff: StaffMember) => {
    setAdvanceStaff(staff);
    setAdvanceAmt('');
    setAdvanceNotes('खर्च के लिए अग्रिम / एडवांस');
  };

  const handleSaveAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advanceStaff || !advanceAmt) return;

    const amt = Number(advanceAmt);
    setStaffList(staffList.map(st => {
      if (st.id === advanceStaff.id) {
        return {
          ...st,
          advanceTaken: (st.advanceTaken || 0) + amt
        };
      }
      return st;
    }));

    setAdvanceStaff(null);
  };

  const handleOpenPaySalary = (staff: StaffMember) => {
    const presentDays = Object.values(staff.attendance).filter(v => v === 'P').length;
    const halfDays = Object.values(staff.attendance).filter(v => v === 'H').length;
    const effectiveDays = presentDays + (halfDays * 0.5);
    const calculatedGross = effectiveDays > 0 
      ? Math.round((staff.monthlySalary / 30) * effectiveDays)
      : staff.monthlySalary;

    const advToDeduct = Math.min(staff.advanceTaken || 0, calculatedGross);
    const net = Math.max(0, calculatedGross - advToDeduct);

    setPayingStaff(staff);
    setSalaryAmount(net);
    setSalaryDeductAdvance(advToDeduct);
    setSalaryDate(new Date().toISOString().split('T')[0]);
    setSalaryMode('cash');
    setSalaryRef('');
    setSalaryNotes(`माह ${new Date().toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' })} का वेतन`);
  };

  const handleSaveSalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingStaff || !salaryAmount) return;

    const currentMonth = new Date().toISOString().substring(0, 7);
    const pmt: StaffSalaryPayment = {
      id: `ssp-${Date.now()}`,
      staffId: payingStaff.id,
      month: currentMonth,
      date: salaryDate,
      amount: Number(salaryAmount),
      advanceDeducted: Number(salaryDeductAdvance || 0),
      paymentMode: salaryMode,
      referenceNo: salaryRef.trim() || undefined,
      notes: salaryNotes.trim() || undefined
    };

    setStaffList(staffList.map(st => {
      if (st.id === payingStaff.id) {
        return {
          ...st,
          advanceTaken: Math.max(0, (st.advanceTaken || 0) - Number(salaryDeductAdvance || 0)),
          salaryHistory: [pmt, ...(st.salaryHistory || [])]
        };
      }
      return st;
    }));

    setPayingStaff(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('क्या आप इस स्टाफ का रिकॉर्ड हटाना चाहते हैं?')) {
      setStaffList(staffList.filter(s => s.id !== id));
    }
  };

  const totalMonthlySalary = staffList.reduce((sum, s) => sum + s.monthlySalary, 0);
  const totalAdvance = staffList.reduce((sum, s) => sum + (s.advanceTaken || 0), 0);

  const getRoleLabel = (r: StaffMember['role']) => {
    switch (r) {
      case 'maid': return 'कामवाली (Maid)';
      case 'cook': return 'रसोइया (Cook)';
      case 'driver': return 'ड्राइवर (Driver)';
      case 'gardener': return 'माली (Gardener)';
      case 'guard': return 'चौकीदार (Guard)';
      case 'shop_helper': return 'दुकान सहायक (Helper)';
      default: return 'घरेलू स्टाफ';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-navy text-paper p-4 md:p-5 rounded-3xl shadow-lg border border-navy-light/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-gold/20 text-gold rounded-2xl shrink-0">
              <Users size={24} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold font-serif text-white">घरेलू कर्मचारी व स्टाफ मैनेजर</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/20 text-gold border border-gold/30">
                  हाजिरी व वेतन
                </span>
              </div>
              <p className="text-xs text-paper-dim/80">घर की कामवाली, कुक, ड्राइवर की दैनिक हाजिरी (1-31), एडवांस व मासिक वेतन भुगतान</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3.5 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-black rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-md self-start sm:self-auto"
          >
            <Plus size={15} /> + नया स्टाफ जोड़ें
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-navy-light/40">
          <div className="bg-navy-light/40 p-3 rounded-2xl">
            <p className="text-[10px] text-paper-dim/70">कुल मासिक वेतन बजट (Monthly)</p>
            <Mono className="text-base font-black text-gold">₹{totalMonthlySalary.toLocaleString('en-IN')}</Mono>
            <p className="text-[10px] text-slate-400 mt-0.5">{staffList.length} कर्मचारी</p>
          </div>
          <div className="bg-navy-light/40 p-3 rounded-2xl">
            <p className="text-[10px] text-paper-dim/70">कुल बकाया एडवांस दिया हुआ</p>
            <Mono className="text-base font-black text-rose-300">₹{totalAdvance.toLocaleString('en-IN')}</Mono>
            <p className="text-[10px] text-slate-400 mt-0.5">सैलरी से काटा जाएगा</p>
          </div>
          <div className="bg-navy-light/40 p-3 rounded-2xl col-span-2 sm:col-span-1">
            <p className="text-[10px] text-paper-dim/70">हाजिरी सिस्टम</p>
            <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 size={13} /> 1-31 दिन का मासिक कैलेंडर
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">हरा=P, पीला=Half, लाल=Absent</p>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="space-y-3.5">
        {staffList.length === 0 ? (
          <div className="bg-paper border border-dashed border-paper-dim rounded-3xl p-8 text-center shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">अभी कोई घरेलू स्टाफ दर्ज नहीं है</h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto mt-0.5">
                घर की बाई, कुक, ड्राइवर या दुकान सहायक की हाजिरी, सैलरी और एडवांस हिसाब रखने के लिए स्टाफ जोड़ें।
              </p>
            </div>
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2 bg-gold text-navy text-xs font-black rounded-xl inline-flex items-center gap-1.5 hover:bg-gold-light shadow-md"
            >
              <Plus size={15} /> नया स्टाफ जोड़ें
            </button>
          </div>
        ) : (
          staffList.map(st => {
            const presentDays = Object.values(st.attendance).filter(v => v === 'P').length;
            const halfDays = Object.values(st.attendance).filter(v => v === 'H').length;
            const absentDays = Object.values(st.attendance).filter(v => v === 'A').length;
            const effectiveDays = presentDays + (halfDays * 0.5);
            const calculatedGross = effectiveDays > 0 
              ? Math.round((st.monthlySalary / 30) * effectiveDays)
              : st.monthlySalary;
            const estimatedPayable = Math.max(0, calculatedGross - (st.advanceTaken || 0));

            return (
              <div key={st.id} className="bg-paper border border-paper-dim rounded-3xl p-4 md:p-5 shadow-sm space-y-3 hover:border-gold/50 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 bg-gold/20 text-gold-dark text-[10px] font-black rounded-full uppercase border border-gold/30">
                        {getRoleLabel(st.role)}
                      </span>
                      {st.phone && (
                        <span className="text-xs text-ink-muted flex items-center gap-1 font-mono">
                          <Phone size={11} /> {st.phone}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm md:text-base font-black text-ink mt-1">{st.name}</h3>
                  </div>

                  <div className="text-right">
                    <Mono className="text-base font-black text-ink">₹{st.monthlySalary.toLocaleString('en-IN')}<span className="text-xs font-normal text-ink-muted">/माह</span></Mono>
                    {st.advanceTaken > 0 && (
                      <p className="text-[11px] text-rose-500 font-bold">एडवांस लिया: ₹{st.advanceTaken.toLocaleString('en-IN')}</p>
                    )}
                  </div>
                </div>

                {/* 1-31 FULL ATTENDANCE MATRIX */}
                <div className="space-y-2 bg-paper-dim/40 p-3 rounded-2xl border border-paper-dim/60">
                  <div className="flex justify-between items-center text-[10px] text-ink-muted">
                    <span className="font-bold uppercase tracking-wider">
                      हाजिरी कैलेंडर (टैप करें: हरा=P, पीला=Half, लाल=Absent)
                    </span>
                    <span className="font-bold text-ink">
                      हाजिरी: {presentDays} P | {halfDays} H | {absentDays} A (कुल: {effectiveDays} दिन)
                    </span>
                  </div>

                  {/* Row 1: Days 1 to 15 */}
                  <div className="grid grid-cols-15 gap-1 text-center">
                    {Array.from({ length: 15 }, (_, i) => i + 1).map(day => {
                      const status = st.attendance[day];
                      return (
                        <button
                          key={day}
                          onClick={() => toggleAttendance(st.id, day)}
                          title={`Day ${day}: ${status || 'Not Marked'}`}
                          className={`py-1 rounded-md text-[10px] font-black transition-all ${
                            status === 'P' ? 'bg-green text-white shadow-xs' :
                            status === 'H' ? 'bg-amber-400 text-slate-950 font-black' :
                            status === 'A' ? 'bg-rose-500 text-white' :
                            'bg-paper border border-paper-dim text-ink-muted hover:bg-paper-dim'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  {/* Row 2: Days 16 to 31 */}
                  <div className="grid grid-cols-16 gap-1 text-center">
                    {Array.from({ length: 16 }, (_, i) => i + 16).map(day => {
                      const status = st.attendance[day];
                      return (
                        <button
                          key={day}
                          onClick={() => toggleAttendance(st.id, day)}
                          title={`Day ${day}: ${status || 'Not Marked'}`}
                          className={`py-1 rounded-md text-[10px] font-black transition-all ${
                            status === 'P' ? 'bg-green text-white shadow-xs' :
                            status === 'H' ? 'bg-amber-400 text-slate-950 font-black' :
                            status === 'A' ? 'bg-rose-500 text-white' :
                            'bg-paper border border-paper-dim text-ink-muted hover:bg-paper-dim'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-paper-dim text-xs flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-ink-muted text-[11px]">शुद्ध देय वेतन: </span>
                    <Mono className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      ₹{estimatedPayable.toLocaleString('en-IN')}
                    </Mono>
                    {st.advanceTaken > 0 && (
                      <span className="text-[10px] text-ink-muted font-bold">
                        (₹{st.advanceTaken} एडवांस घटाकर)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAdvance(st)}
                      className="px-2.5 py-1.5 bg-paper border border-paper-dim rounded-xl text-ink font-bold hover:bg-paper-dim text-xs"
                    >
                      + एडवांस दें
                    </button>
                    <button
                      onClick={() => handleOpenPaySalary(st)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center gap-1 shadow-sm"
                    >
                      <Banknote size={14} /> वेतन भुगतान करें
                    </button>
                    <button
                      onClick={() => handleDelete(st.id)}
                      className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-all"
                      title="स्टाफ हटाएं"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Recent Salary Payments Log */}
                {st.salaryHistory && st.salaryHistory.length > 0 && (
                  <div className="pt-1.5 border-t border-paper-dim/60">
                    <span className="text-[10px] uppercase font-bold text-ink-muted block mb-1">
                      हालिया वेतन भुगतान:
                    </span>
                    <div className="space-y-1">
                      {st.salaryHistory.slice(0, 2).map(sh => (
                        <div key={sh.id} className="flex justify-between items-center text-[10px] bg-paper-dim/30 px-2 py-1 rounded-lg">
                          <span className="text-ink font-semibold">
                            📅 {sh.date}: {sh.notes || 'वेतन भुगतान'} ({sh.paymentMode === 'upi' ? 'UPI' : 'Cash'})
                          </span>
                          <span className="font-mono font-bold text-emerald-600">
                            ₹{sh.amount.toLocaleString('en-IN')} {sh.advanceDeducted > 0 && `(कटौती: ₹${sh.advanceDeducted})`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal 1: Add New Staff */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-3xl shadow-2xl p-5 border border-paper-dim space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-ink flex items-center gap-2">
              <Users size={18} className="text-gold" /> नया घरेलू स्टाफ जोड़ें
            </h3>
            <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-ink-muted font-bold mb-1">नाम *</label>
                <input
                  type="text"
                  placeholder="उदा. सुनीता दीदी या रामू ड्राइवर"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-ink-muted font-bold mb-1">पद / काम</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-medium text-ink"
                  >
                    <option value="maid">कामवाली (Maid)</option>
                    <option value="cook">रसोइया (Cook)</option>
                    <option value="driver">ड्राइवर (Driver)</option>
                    <option value="gardener">माली (Gardener)</option>
                    <option value="guard">चौकीदार (Guard)</option>
                    <option value="shop_helper">दुकान सहायक (Helper)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink-muted font-bold mb-1">मासिक वेतन (₹) *</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={salary}
                    onChange={e => setSalary(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-black text-sm text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-ink-muted font-bold mb-1">फ़ोन नंबर</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim text-ink"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted font-bold mb-1">शुरुआत तारीख</label>
                  <input
                    type="date"
                    value={joiningDate}
                    onChange={e => setJoiningDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim text-ink font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold hover:bg-paper-dim/80"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gold text-navy font-black hover:bg-gold-light shadow-md"
                >
                  ✓ स्टाफ सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Pay Monthly Salary */}
      {payingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper rounded-3xl shadow-2xl p-5 border border-emerald-500/30 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ink flex items-center gap-2">
                  <Banknote size={20} className="text-emerald-500" /> {payingStaff.name} का वेतन भुगतान
                </h3>
                <p className="text-xs text-ink-muted">मासिक वेतन, एडवांस कटौती व तारीख दर्ज करें</p>
              </div>
              <button 
                onClick={() => setPayingStaff(null)}
                className="w-8 h-8 rounded-full bg-paper-dim text-ink font-bold hover:bg-paper-dim/80 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSalary} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-emerald-600 font-bold mb-1">शुद्ध भुगतान रकम (₹) *</label>
                  <input
                    type="number"
                    value={salaryAmount}
                    onChange={e => setSalaryAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-emerald-500/40 font-black text-sm text-ink"
                  />
                </div>
                <div>
                  <label className="block text-rose-500 font-bold mb-1">एडवांस काटा गया (₹)</label>
                  <input
                    type="number"
                    value={salaryDeductAdvance}
                    onChange={e => setSalaryDeductAdvance(Number(e.target.value || 0))}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-rose-300 font-bold text-sm text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-ink-muted font-bold mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-gold" /> भुगतान तारीख *
                  </label>
                  <input
                    type="date"
                    value={salaryDate}
                    onChange={e => setSalaryDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-ink"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted font-bold mb-1">भुगतान माध्यम</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSalaryMode('cash')}
                      className={`py-2 rounded-xl font-bold text-xs ${salaryMode === 'cash' ? 'bg-emerald-500 text-slate-950' : 'bg-paper border text-ink-muted'}`}
                    >
                      💵 नकद
                    </button>
                    <button
                      type="button"
                      onClick={() => setSalaryMode('upi')}
                      className={`py-2 rounded-xl font-bold text-xs ${salaryMode === 'upi' ? 'bg-purple-600 text-white' : 'bg-paper border text-ink-muted'}`}
                    >
                      📱 UPI
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-ink-muted mb-1">विवरण / नोट</label>
                <input
                  type="text"
                  value={salaryNotes}
                  onChange={e => setSalaryNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim text-ink"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setPayingStaff(null)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold hover:bg-paper-dim/80"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 shadow-md"
                >
                  ✓ वेतन सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Give Advance to Staff */}
      {advanceStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-3xl shadow-2xl p-5 border border-paper-dim space-y-4">
            <h3 className="text-base font-bold text-ink">
              {advanceStaff.name} को एडवांस दें
            </h3>
            <form onSubmit={handleSaveAdvance} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-rose-500 font-bold mb-1">एडवांस रकम (₹) *</label>
                <input
                  type="number"
                  placeholder="उदा. 1000"
                  value={advanceAmt}
                  onChange={e => setAdvanceAmt(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  autoFocus
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-rose-300 font-black text-sm text-ink"
                />
              </div>

              <div>
                <label className="block text-ink-muted mb-1">कारण / नोट</label>
                <input
                  type="text"
                  value={advanceNotes}
                  onChange={e => setAdvanceNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim text-ink"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setAdvanceStaff(null)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold hover:bg-paper-dim/80"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-black hover:bg-rose-500 shadow-md"
                >
                  ✓ एडवांस दर्ज करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
