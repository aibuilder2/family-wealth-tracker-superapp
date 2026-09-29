'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Plus, Calendar, Check, X, Clock, Trash2, DollarSign, 
  Banknote, Smartphone, CheckCircle2, History, AlertCircle, Phone,
  CreditCard, MapPin, ShieldCheck, ChevronLeft, ChevronRight, FileText,
  HelpCircle, Settings2, ArrowDownRight, Edit3
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import { useFamilyStore } from '@/lib/store/familyStore';

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

export type StaffWageModel = 'monthly_fixed' | 'daily_wage' | 'monthly_with_allowed_leaves';

export interface StaffMember {
  id: string;
  name: string;
  role: 'maid' | 'driver' | 'cook' | 'gardener' | 'guard' | 'shop_helper';
  monthlySalary: number;
  advanceTaken: number;
  phone: string;
  joiningDate?: string;
  
  // Non-mandatory Identity & Addresses
  aadharNumber?: string; // आधार कार्ड नंबर
  currentAddress?: string; // स्थानीय / वर्तमान पता
  permanentAddress?: string; // स्थायी / मूल गांव का पता ("wahi se hai to wahi ki ya dusre jagah ki ho to waha ka")
  
  // Wage Model & Leave Policy
  wageModel: StaffWageModel; // 'monthly_fixed' | 'daily_wage' | 'monthly_with_allowed_leaves'
  dailyRate?: number; // दैनिक मजदूरी दर (यदि daily_wage चुना हो)
  allowedPaidLeaves?: number; // महीने में स्वीकृत पेड छुट्टियाँ (उदा. 2 दिन)
  deductLeaveSalary?: boolean; // अतिरिक्त छुट्टी पर पैसे कटेंगे या नहीं

  // Month-wise Attendance Data: { "2026-09": { 1: 'P', 2: 'A', ... } }
  attendance: { [day: number]: 'P' | 'A' | 'H' }; // fallback current month
  monthlyAttendance?: { [month: string]: { [day: number]: 'P' | 'A' | 'H' } };
  
  salaryHistory?: StaffSalaryPayment[];
}

const DEFAULT_STAFF: StaffMember[] = [];

export function HouseholdStaffModule() {
  const { addTransaction, members } = useFamilyStore();

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
                wageModel: s.wageModel || 'monthly_with_allowed_leaves',
                allowedPaidLeaves: s.allowedPaidLeaves ?? 2,
                deductLeaveSalary: s.deductLeaveSalary ?? true,
                monthlyAttendance: s.monthlyAttendance || {
                  [new Date().toISOString().substring(0, 7)]: s.attendance || {}
                },
                salaryHistory: s.salaryHistory || []
              }));
          }
        } catch (e) {}
      }
    }
    return DEFAULT_STAFF;
  });

  // Current Month State for Viewing & Attendance
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().substring(0, 7));

  // Save changes
  useEffect(() => {
    localStorage.setItem('fwa_staff_v1', JSON.stringify(staffList));
  }, [staffList]);

  // Modal State for Adding Staff
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffMember['role']>('maid');
  const [salary, setSalary] = useState<number | ''>('');
  const [phone, setPhone] = useState('');
  const [joiningDate, setJoiningDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [aadharNumber, setAadharNumber] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [wageModel, setWageModel] = useState<StaffWageModel>('monthly_with_allowed_leaves');
  const [dailyRate, setDailyRate] = useState<number | ''>('');
  const [allowedPaidLeaves, setAllowedPaidLeaves] = useState<number>(2);
  const [deductLeaveSalary, setDeductLeaveSalary] = useState<boolean>(true);

  // Modal State for Paying Salary
  const [payingStaff, setPayingStaff] = useState<StaffMember | null>(null);
  const [salaryAmount, setSalaryAmount] = useState<number | ''>('');
  const [salaryDeductAdvance, setSalaryDeductAdvance] = useState(0);
  const [salaryDate, setSalaryDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [salaryMode, setSalaryMode] = useState<'cash' | 'upi'>('cash');
  const [salaryRef, setSalaryRef] = useState('');
  const [salaryNotes, setSalaryNotes] = useState('');
  const [syncSalaryToExpense, setSyncSalaryToExpense] = useState(true);

  // Modal State for Advance
  const [advanceStaff, setAdvanceStaff] = useState<StaffMember | null>(null);
  const [advanceAmt, setAdvanceAmt] = useState<number | ''>('');
  const [advanceNotes, setAdvanceNotes] = useState('खर्च के लिए अग्रिम / एडवांस');
  const [syncAdvanceToExpense, setSyncAdvanceToExpense] = useState(true);

  // Modal State for Viewing Detailed Profile
  const [viewProfileStaff, setViewProfileStaff] = useState<StaffMember | null>(null);

  // Month navigation helpers
  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const d = new Date(year, month - 2, 1);
    setSelectedMonth(d.toISOString().substring(0, 7));
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const d = new Date(year, month, 1);
    setSelectedMonth(d.toISOString().substring(0, 7));
  };

  const formatMonthLabel = (m: string) => {
    const [year, month] = m.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' });
  };

  // Days in selected month
  const totalDaysInSelectedMonth = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  }, [selectedMonth]);

  // Attendance Getter & Toggler for selected month
  const getAttendanceMap = (staff: StaffMember) => {
    if (staff.monthlyAttendance && staff.monthlyAttendance[selectedMonth]) {
      return staff.monthlyAttendance[selectedMonth];
    }
    // Fallback if current month
    if (selectedMonth === new Date().toISOString().substring(0, 7)) {
      return staff.attendance || {};
    }
    return {};
  };

  const toggleAttendance = (staffId: string, day: number) => {
    setStaffList(prev => prev.map(st => {
      if (st.id !== staffId) return st;
      const currentMonthAtt = { ...(st.monthlyAttendance?.[selectedMonth] || {}) };
      const currentVal = currentMonthAtt[day];
      let next: 'P' | 'A' | 'H' = 'P';
      if (currentVal === 'P') next = 'H';
      else if (currentVal === 'H') next = 'A';
      else if (currentVal === 'A') {
        delete currentMonthAtt[day];
      } else {
        next = 'P';
      }

      if (currentVal !== 'A') {
        currentMonthAtt[day] = next;
      }

      const updatedMonthly = {
        ...(st.monthlyAttendance || {}),
        [selectedMonth]: currentMonthAtt
      };

      return {
        ...st,
        attendance: selectedMonth === new Date().toISOString().substring(0, 7) ? currentMonthAtt : st.attendance,
        monthlyAttendance: updatedMonthly
      };
    }));
  };

  // Add new staff submit
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
      aadharNumber: aadharNumber.trim() || undefined,
      currentAddress: currentAddress.trim() || undefined,
      permanentAddress: permanentAddress.trim() || undefined,
      wageModel,
      dailyRate: dailyRate ? Number(dailyRate) : Math.round(Number(salary) / 30),
      allowedPaidLeaves: Number(allowedPaidLeaves) || 0,
      deductLeaveSalary,
      attendance: {},
      monthlyAttendance: { [selectedMonth]: {} },
      salaryHistory: []
    };

    setStaffList([...staffList, newStaff]);
    setIsAddOpen(false);

    // Reset Form
    setName('');
    setSalary('');
    setPhone('');
    setAadharNumber('');
    setCurrentAddress('');
    setPermanentAddress('');
    setDailyRate('');
    setAllowedPaidLeaves(2);
    setDeductLeaveSalary(true);
  };

  // Handle Open Advance Modal
  const handleOpenAdvance = (staff: StaffMember) => {
    setAdvanceStaff(staff);
    setAdvanceAmt('');
    setAdvanceNotes('आकस्मिक आवश्यकता हेतु अग्रिम / एडवांस');
    setSyncAdvanceToExpense(true);
  };

  // Save Advance & Auto-Sync with Family Expenses
  const handleSaveAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advanceStaff || !advanceAmt) return;

    const amt = Number(advanceAmt);
    const today = new Date().toISOString().split('T')[0];

    setStaffList(staffList.map(st => {
      if (st.id === advanceStaff.id) {
        return {
          ...st,
          advanceTaken: (st.advanceTaken || 0) + amt
        };
      }
      return st;
    }));

    // Auto-Sync into Family Expenses!
    if (syncAdvanceToExpense) {
      try {
        addTransaction({
          type: 'expense',
          category: 'household',
          amount: amt,
          mode: 'offline',
          note: `[स्टाफ एडवांस] ${advanceStaff.name} (${advanceStaff.role}) - ${advanceNotes.trim()}`,
          txn_date: today,
          member_id: members[0]?.id || 'm-ankush'
        });
      } catch (err) {
        console.error('Error auto-syncing advance', err);
      }
    }

    setAdvanceStaff(null);
  };

  // Handle Open Pay Salary Modal
  const handleOpenPaySalary = (staff: StaffMember) => {
    const attMap = getAttendanceMap(staff);
    const presentDays = Object.values(attMap).filter(v => v === 'P').length;
    const halfDays = Object.values(attMap).filter(v => v === 'H').length;
    const absentDays = Object.values(attMap).filter(v => v === 'A').length;
    const effectiveWorkedDays = presentDays + (halfDays * 0.5);

    let calculatedGross = staff.monthlySalary;

    if (staff.wageModel === 'daily_wage') {
      // Daily wage model
      const rate = staff.dailyRate || Math.round(staff.monthlySalary / 30);
      calculatedGross = Math.round(effectiveWorkedDays * rate);
    } else if (staff.wageModel === 'monthly_with_allowed_leaves') {
      // Monthly salary with allowed leave quota
      const allowed = staff.allowedPaidLeaves ?? 2;
      const extraAbsent = Math.max(0, absentDays - allowed);
      if (staff.deductLeaveSalary && extraAbsent > 0) {
        const perDayDeduction = Math.round(staff.monthlySalary / 30);
        calculatedGross = Math.max(0, staff.monthlySalary - (extraAbsent * perDayDeduction));
      } else {
        calculatedGross = staff.monthlySalary;
      }
    } else {
      // Fixed monthly
      calculatedGross = staff.monthlySalary;
    }

    const advToDeduct = Math.min(staff.advanceTaken || 0, calculatedGross);
    const net = Math.max(0, calculatedGross - advToDeduct);

    setPayingStaff(staff);
    setSalaryAmount(net);
    setSalaryDeductAdvance(advToDeduct);
    setSalaryDate(new Date().toISOString().split('T')[0]);
    setSalaryMode('cash');
    setSalaryRef('');
    setSalaryNotes(`माह ${formatMonthLabel(selectedMonth)} का वेतन भुगतान (कार्य दिवस: ${effectiveWorkedDays})`);
    setSyncSalaryToExpense(true);
  };

  // Save Salary & Auto-Sync with Family Expenses
  const handleSaveSalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingStaff || salaryAmount === '') return;

    const pmt: StaffSalaryPayment = {
      id: `ssp-${Date.now()}`,
      staffId: payingStaff.id,
      month: selectedMonth,
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

    // Auto-Sync into Family Expenses!
    if (syncSalaryToExpense && Number(salaryAmount) > 0) {
      try {
        addTransaction({
          type: 'expense',
          category: 'household',
          amount: Number(salaryAmount),
          mode: salaryMode === 'cash' ? 'offline' : 'online',
          note: `[स्टाफ वेतन] ${payingStaff.name} - माह ${selectedMonth} (${salaryMode.toUpperCase()})`,
          txn_date: salaryDate,
          member_id: members[0]?.id || 'm-ankush'
        });
      } catch (err) {}
    }

    setPayingStaff(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('क्या आप इस स्टाफ का पूरा रिकॉर्ड हटाना चाहते हैं?')) {
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
      {/* Top Banner & Stats */}
      <div className="bg-navy text-paper p-4 md:p-5 rounded-3xl shadow-lg border border-navy-light/40 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-gold font-bold uppercase block">
              Household Staff & Payroll • घरेलू कर्मचारी प्रबंधन
            </span>
            <h2 className="text-base sm:text-lg font-serif font-black text-paper flex items-center gap-2">
              <Users size={20} className="text-gold" />
              घरेलू कर्मचारी, वेतन व हाज़िरी
            </h2>
            <p className="text-xs text-paper-dim/80 mt-0.5">
              31-दिन कैलेंडर, दैनिक/मासिक वेतन नियम, आधार व ऑटो-सिंक एडवांस
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="px-3.5 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0"
          >
            <Plus size={15} /> नया कर्मचारी जोड़ें
          </button>
        </div>

        {/* Month Selector Bar */}
        <div className="flex items-center justify-between bg-navy-light/40 p-2.5 rounded-2xl border border-navy-light/60">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-xl bg-navy/60 hover:bg-navy text-paper transition-all flex items-center gap-1 text-xs"
          >
            <ChevronLeft size={16} /> पिछला माह
          </button>

          <div className="text-center">
            <span className="text-xs font-serif font-black text-gold">
              📅 {formatMonthLabel(selectedMonth)}
            </span>
            <span className="text-[10px] text-paper-dim/70 block">
              (कुल {totalDaysInSelectedMonth} दिन)
            </span>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-xl bg-navy/60 hover:bg-navy text-paper transition-all flex items-center gap-1 text-xs"
          >
            अगला माह <ChevronRight size={16} />
          </button>
        </div>

        {/* 3 KPI Cards */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="bg-navy/70 border border-navy-light p-2.5 rounded-2xl">
            <span className="text-[10px] text-paper-dim font-bold block">कुल कर्मचारी</span>
            <span className="text-base font-mono font-black text-paper">{staffList.length}</span>
          </div>
          <div className="bg-navy/70 border border-navy-light p-2.5 rounded-2xl">
            <span className="text-[10px] text-paper-dim font-bold block">मासिक तय वेतन</span>
            <span className="text-base font-mono font-black text-gold">
              ₹{totalMonthlySalary.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-navy/70 border border-navy-light p-2.5 rounded-2xl">
            <span className="text-[10px] text-paper-dim font-bold block">कुल बकाया एडवांस</span>
            <span className="text-base font-mono font-black text-coral">
              ₹{totalAdvance.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Staff Members List */}
      {staffList.length === 0 ? (
        <div className="p-8 text-center bg-paper rounded-2xl border border-dashed border-paper-dim space-y-3">
          <Users size={36} className="text-ink-muted mx-auto opacity-40" />
          <h4 className="text-sm font-bold text-ink">कोई घरेलू कर्मचारी दर्ज नहीं है</h4>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            कामवाली बाई, रसोइया, ड्राइवर या दुकान सहायक का नाम, मासिक वेतन व हाज़िरी दर्ज करें।
          </p>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-gold text-navy font-black text-xs rounded-xl inline-flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={14} /> कर्मचारी जोड़ें
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {staffList.map((st) => {
            const attMap = getAttendanceMap(st);
            const presentCount = Object.values(attMap).filter(v => v === 'P').length;
            const halfCount = Object.values(attMap).filter(v => v === 'H').length;
            const absentCount = Object.values(attMap).filter(v => v === 'A').length;
            const effectiveDays = presentCount + (halfCount * 0.5);

            // Is salary paid for this selected month?
            const paidThisMonth = (st.salaryHistory || []).find(p => p.month === selectedMonth);

            return (
              <div 
                key={st.id}
                className="bg-paper rounded-2xl border border-paper-dim p-4 shadow-sm hover:border-gold/40 transition-all space-y-3"
              >
                {/* Staff Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-dim/60 pb-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gold/15 text-gold-dark font-black flex items-center justify-center text-sm shrink-0 border border-gold/30">
                      {st.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-ink">{st.name}</h4>
                        <span className="text-[10px] font-bold bg-paper-dim px-2 py-0.5 rounded-full text-ink-muted">
                          {getRoleLabel(st.role)}
                        </span>
                        {st.wageModel === 'daily_wage' && (
                          <span className="text-[9px] font-bold bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded">
                            दैनिक दर: ₹{st.dailyRate}/दिन
                          </span>
                        )}
                        {st.wageModel === 'monthly_with_allowed_leaves' && (
                          <span className="text-[9px] font-bold bg-purple-500/10 text-purple-600 px-1.5 py-0.5 rounded">
                            छुट्टी कोटा: {st.allowedPaidLeaves ?? 2} दिन
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-[11px] text-ink-muted mt-0.5 flex-wrap">
                        {st.phone && (
                          <span className="flex items-center gap-1 font-mono">
                            <Phone size={11} /> {st.phone}
                          </span>
                        )}
                        {st.currentAddress && (
                          <span className="flex items-center gap-1 truncate max-w-[200px]" title={st.currentAddress}>
                            <MapPin size={11} className="text-emerald-500" /> {st.currentAddress}
                          </span>
                        )}
                        {st.aadharNumber && (
                          <span className="font-mono text-[10px] bg-paper-dim/60 px-1.5 py-0.5 rounded">
                            आधार: •••• {st.aadharNumber.slice(-4)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Financial Quick Status */}
                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-ink-muted block uppercase font-bold">मासिक तय वेतन</span>
                      <span className="text-sm font-mono font-black text-ink">
                        ₹{st.monthlySalary.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-ink-muted block uppercase font-bold">बकाया एडवांस</span>
                      <span className={`text-sm font-mono font-black ${st.advanceTaken > 0 ? 'text-coral' : 'text-green'}`}>
                        ₹{(st.advanceTaken || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 border-l border-paper-dim pl-2">
                      <button
                        type="button"
                        onClick={() => setViewProfileStaff(st)}
                        className="p-1.5 rounded-lg bg-paper-dim hover:bg-paper-dim/80 text-ink-muted hover:text-ink transition-colors"
                        title="विवरण देखें (View Profile)"
                      >
                        <FileText size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(st.id)}
                        className="p-1.5 rounded-lg bg-paper-dim hover:bg-coral/20 text-ink-muted hover:text-coral transition-colors"
                        title="हटाएं"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Attendance Summary Bar for Selected Month */}
                <div className="flex items-center justify-between text-xs bg-paper-dim/30 p-2.5 rounded-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-ink">
                      {formatMonthLabel(selectedMonth)} हाज़िरी:
                    </span>
                    <span className="text-[11px] font-bold text-green bg-green/10 px-2 py-0.5 rounded">
                      उपस्थित (P): {presentCount}
                    </span>
                    <span className="text-[11px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
                      आधा दिन (H): {halfCount}
                    </span>
                    <span className="text-[11px] font-bold text-coral bg-coral/10 px-2 py-0.5 rounded">
                      अनुपस्थित (A): {absentCount}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-ink bg-paper px-2 py-0.5 rounded border border-paper-dim">
                      कुल कार्य दिवस: {effectiveDays}
                    </span>
                  </div>

                  {paidThisMonth ? (
                    <span className="text-[10px] font-bold bg-green/15 text-green border border-green/30 px-2 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle2 size={12} /> वेतन चुकता (₹{paidThisMonth.amount})
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-amber-500/15 text-amber-600 border border-amber-500/30 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Clock size={12} /> वेतन देय
                    </span>
                  )}
                </div>

                {/* 31-Day Attendance Calendar Grid */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-ink-muted">
                    <span>तारीखवार हाज़िरी लगाएं (टैप करें: P $\to$ H $\to$ A $\to$ Blank):</span>
                  </div>
                  
                  {/* Days 1 to 15 */}
                  <div className="grid grid-cols-15 gap-1 text-center font-mono text-[10px]">
                    {Array.from({ length: 15 }, (_, i) => i + 1).map(day => {
                      const status = attMap[day];
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleAttendance(st.id, day)}
                          className={`py-1 rounded border font-bold transition-all ${
                            status === 'P'
                              ? 'bg-green text-white border-green shadow-2xs'
                              : status === 'H'
                              ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                              : status === 'A'
                              ? 'bg-coral text-white border-coral shadow-2xs'
                              : 'bg-paper-dim/40 text-ink-muted border-paper-dim hover:bg-paper-dim'
                          }`}
                          title={`Day ${day}: ${status || 'Not Marked'}`}
                        >
                          <div>{day}</div>
                          <div className="text-[9px] font-black">{status || '-'}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Days 16 to 31 */}
                  <div className="grid grid-cols-16 gap-1 text-center font-mono text-[10px]">
                    {Array.from({ length: totalDaysInSelectedMonth - 15 }, (_, i) => i + 16).map(day => {
                      const status = attMap[day];
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleAttendance(st.id, day)}
                          className={`py-1 rounded border font-bold transition-all ${
                            status === 'P'
                              ? 'bg-green text-white border-green shadow-2xs'
                              : status === 'H'
                              ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                              : status === 'A'
                              ? 'bg-coral text-white border-coral shadow-2xs'
                              : 'bg-paper-dim/40 text-ink-muted border-paper-dim hover:bg-paper-dim'
                          }`}
                          title={`Day ${day}: ${status || 'Not Marked'}`}
                        >
                          <div>{day}</div>
                          <div className="text-[9px] font-black">{status || '-'}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleOpenAdvance(st)}
                    className="px-3 py-1.5 rounded-xl bg-paper border border-coral/40 text-coral hover:bg-coral/10 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <DollarSign size={13} /> + एडवांस दें
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenPaySalary(st)}
                      className="px-3.5 py-1.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <Banknote size={14} /> वेतन भुगतान दर्ज करें
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD NEW STAFF MEMBER                            */}
      {/* ======================================================== */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Users size={16} className="text-gold" />
                नया घरेलू कर्मचारी / सहायक जोड़ें
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-ink-muted hover:text-ink">✕</button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">नाम (Name) *</label>
                  <input
                    type="text"
                    placeholder="e.g. सुनीता बाई या रामू"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">काम (Role)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-bold"
                  >
                    <option value="maid">कामवाली (Maid)</option>
                    <option value="cook">रसोइया (Cook)</option>
                    <option value="driver">ड्राइवर (Driver)</option>
                    <option value="gardener">माली (Gardener)</option>
                    <option value="guard">चौकीदार (Guard)</option>
                    <option value="shop_helper">दुकान सहायक (Helper)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">मासिक तय वेतन (₹) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">मोबाइल नंबर</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono"
                  />
                </div>
              </div>

              {/* Wage Model & Leave Policy (NEW USER REQUIREMENT) */}
              <div className="p-3 rounded-xl bg-paper-dim/30 border border-paper-dim space-y-2">
                <span className="text-[11px] font-black uppercase text-gold block">
                  ⚙️ वेतन व छुट्टी का नियम (Salary & Leave Policy)
                </span>

                <div>
                  <label className="text-[11px] font-bold text-ink block mb-1">वेतन का आधार</label>
                  <select
                    value={wageModel}
                    onChange={(e) => setWageModel(e.target.value as StaffWageModel)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-paper border border-paper-dim text-ink font-bold"
                  >
                    <option value="monthly_with_allowed_leaves">मासिक वेतन + स्वीकृत छुट्टी कोटा (Leaves Quota)</option>
                    <option value="daily_wage">दैनिक हाज़िरी के आधार पर (Daily Wage Rate)</option>
                    <option value="monthly_fixed">मासिक तय वेतन (बिना छुट्टी कटौती)</option>
                  </select>
                </div>

                {wageModel === 'daily_wage' && (
                  <div>
                    <label className="text-[11px] font-bold text-ink block mb-1">प्रति दिन की दर (Daily Rate ₹)</label>
                    <input
                      type="number"
                      placeholder="उदा. ₹200 / दिन"
                      value={dailyRate}
                      onChange={(e) => setDailyRate(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-paper border border-paper-dim text-ink font-mono font-bold"
                    />
                  </div>
                )}

                {wageModel === 'monthly_with_allowed_leaves' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-ink block mb-1">महीने में स्वीकृत छुट्टियां</label>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={allowedPaidLeaves}
                        onChange={(e) => setAllowedPaidLeaves(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-paper border border-paper-dim text-ink font-mono font-bold"
                      />
                      <span className="text-[9px] text-ink-muted">उदा. 2 दिन की पेड लीव</span>
                    </div>

                    <div className="flex items-center pt-4">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold text-ink">
                        <input
                          type="checkbox"
                          checked={deductLeaveSalary}
                          onChange={(e) => setDeductLeaveSalary(e.target.checked)}
                          className="rounded text-gold"
                        />
                        <span>अतिरिक्त छुट्टी पर पैसे काटें</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Identification & Address Fields (Flexible / Non-Mandatory) */}
              <div className="p-3 rounded-xl bg-paper-dim/20 border border-paper-dim space-y-2">
                <span className="text-[11px] font-bold text-ink-muted uppercase block">
                  पहचान व पता विवरण (वैकल्पिक / सुरक्षा हेतु)
                </span>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    आधार कार्ड नंबर (Aadhar No.) [वैकल्पिक]
                  </label>
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="12 अंकों का आधार नंबर"
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-paper border border-paper-dim text-ink font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    वर्तमान / स्थानीय पता (Current Local Address) [वैकल्पिक]
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. वार्ड नं 4, नदी पार, स्थानीय पता"
                    value={currentAddress}
                    onChange={(e) => setCurrentAddress(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-paper border border-paper-dim text-ink text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    मूल / स्थायी गाँव का पता (Permanent / Native Address) [वैकल्पिक]
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. यदि मूल रूप से दूसरे गाँव या जिले से हैं तो वहाँ का पता"
                    value={permanentAddress}
                    onChange={(e) => setPermanentAddress(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-paper border border-paper-dim text-ink text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gold text-navy font-black hover:bg-gold-light shadow-sm"
                >
                  ✓ कर्मचारी सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: PAY SALARY WITH DEDUCTION & AUTO-SYNC           */}
      {/* ======================================================== */}
      {payingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
                  <Banknote size={16} className="text-gold" />
                  {payingStaff.name} का वेतन भुगतान
                </h3>
                <p className="text-[11px] text-ink-muted">
                  माह: {formatMonthLabel(selectedMonth)} • तय वेतन: ₹{payingStaff.monthlySalary}
                </p>
              </div>
              <button onClick={() => setPayingStaff(null)} className="text-ink-muted hover:text-ink">✕</button>
            </div>

            <form onSubmit={handleSaveSalary} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    नेट देय वेतन (Net Amount ₹)
                  </label>
                  <input
                    type="number"
                    value={salaryAmount}
                    onChange={(e) => setSalaryAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono font-bold text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    काटा गया एडवांस (₹)
                  </label>
                  <input
                    type="number"
                    value={salaryDeductAdvance}
                    onChange={(e) => setSalaryDeductAdvance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono"
                  />
                  <span className="text-[9px] text-ink-muted">
                    कुल एडवांस: ₹{payingStaff.advanceTaken || 0}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">भुगतान तारीख</label>
                  <input
                    type="date"
                    value={salaryDate}
                    onChange={(e) => setSalaryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">माध्यम (Mode)</label>
                  <select
                    value={salaryMode}
                    onChange={(e) => setSalaryMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-bold"
                  >
                    <option value="cash">नकद (Cash)</option>
                    <option value="upi">UPI (PhonePe/GPay)</option>
                  </select>
                </div>
              </div>

              {/* Auto Sync with Expenses Toggle */}
              <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/30">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-ink text-xs">
                  <input
                    type="checkbox"
                    checked={syncSalaryToExpense}
                    onChange={(e) => setSyncSalaryToExpense(e.target.checked)}
                    className="rounded text-gold"
                  />
                  <span>इस वेतन को पारिवारिक खर्चों (Expenses) में स्वतः जोड़ें</span>
                </label>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">विवरण / नोट (Notes)</label>
                <input
                  type="text"
                  value={salaryNotes}
                  onChange={(e) => setSalaryNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayingStaff(null)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gold text-navy font-black hover:bg-gold-light shadow-sm"
                >
                  ✓ वेतन भुगतान दर्ज करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: GIVE ADVANCE & AUTO-SYNC TO EXPENSES            */}
      {/* ======================================================== */}
      {advanceStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <DollarSign size={16} className="text-coral" />
                {advanceStaff.name} को एडवांस दें
              </h3>
              <button onClick={() => setAdvanceStaff(null)} className="text-ink-muted hover:text-ink">✕</button>
            </div>

            <form onSubmit={handleSaveAdvance} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">एडवांस राशि (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={advanceAmt}
                  onChange={(e) => setAdvanceAmt(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono font-bold text-sm"
                  required
                  autoFocus
                />
                <span className="text-[10px] text-ink-muted block mt-0.5">
                  वर्तमान में पहले से एडवांस: ₹{advanceStaff.advanceTaken || 0}
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">कारण / विवरण (Notes)</label>
                <input
                  type="text"
                  placeholder="e.g. घर में बीमारी हेतु या त्योहार खर्च"
                  value={advanceNotes}
                  onChange={(e) => setAdvanceNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                />
              </div>

              {/* Auto Sync into Expenses Toggle (USER EXPLICIT REQUIREMENT) */}
              <div className="p-2.5 rounded-xl bg-coral/10 border border-coral/30">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-ink text-xs">
                  <input
                    type="checkbox"
                    checked={syncAdvanceToExpense}
                    onChange={(e) => setSyncAdvanceToExpense(e.target.checked)}
                    className="rounded text-coral"
                  />
                  <span>इस एडवांस को पारिवारिक खर्चों (Expenses) में स्वतः जोड़ें</span>
                </label>
                <p className="text-[9px] text-ink-muted mt-0.5">
                  इससे पारिवारिक बजट से यह राशि तुरंत कट जाएगी।
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdvanceStaff(null)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-coral text-white font-black hover:bg-coral/90 shadow-sm"
                >
                  ✓ एडवांस दर्ज करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: FULL PROFILE & SALARY HISTORY VIEW              */}
      {/* ======================================================== */}
      {viewProfileStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  <FileText size={16} className="text-gold" />
                  {viewProfileStaff.name} का संपूर्ण विवरण
                </h3>
                <p className="text-[11px] text-ink-muted">{getRoleLabel(viewProfileStaff.role)}</p>
              </div>
              <button onClick={() => setViewProfileStaff(null)} className="text-ink-muted hover:text-ink">✕</button>
            </div>

            {/* Profile Info Cards */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-paper-dim/40 rounded-xl">
                <span className="text-[10px] text-ink-muted block">मासिक तय वेतन</span>
                <span className="font-mono font-bold text-ink">₹{viewProfileStaff.monthlySalary}</span>
              </div>
              <div className="p-2.5 bg-paper-dim/40 rounded-xl">
                <span className="text-[10px] text-ink-muted block">बकाया एडवांस</span>
                <span className="font-mono font-bold text-coral">₹{viewProfileStaff.advanceTaken || 0}</span>
              </div>
              <div className="p-2.5 bg-paper-dim/40 rounded-xl">
                <span className="text-[10px] text-ink-muted block">मोबाइल नंबर</span>
                <span className="font-mono font-bold text-ink">{viewProfileStaff.phone || 'उपलब्ध नहीं'}</span>
              </div>
              <div className="p-2.5 bg-paper-dim/40 rounded-xl">
                <span className="text-[10px] text-ink-muted block">आधार नंबर</span>
                <span className="font-mono font-bold text-ink">{viewProfileStaff.aadharNumber || 'दर्ज नहीं'}</span>
              </div>
            </div>

            {/* Addresses */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-paper-dim/20 rounded-xl border border-paper-dim">
                <span className="text-[10px] font-bold text-ink-muted block">स्थानीय / वर्तमान पता:</span>
                <p className="text-ink font-semibold mt-0.5">{viewProfileStaff.currentAddress || 'दर्ज नहीं है'}</p>
              </div>
              <div className="p-2.5 bg-paper-dim/20 rounded-xl border border-paper-dim">
                <span className="text-[10px] font-bold text-ink-muted block">मूल गाँव / स्थायी पता:</span>
                <p className="text-ink font-semibold mt-0.5">{viewProfileStaff.permanentAddress || 'दर्ज नहीं है'}</p>
              </div>
            </div>

            {/* Salary History */}
            <div className="space-y-2 pt-1">
              <h5 className="text-xs font-bold text-ink flex items-center gap-1.5">
                <History size={14} className="text-gold" />
                पिछला वेतन भुगतान इतिहास:
              </h5>

              <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                {viewProfileStaff.salaryHistory && viewProfileStaff.salaryHistory.length > 0 ? (
                  viewProfileStaff.salaryHistory.map(pmt => (
                    <div
                      key={pmt.id}
                      className="p-2 rounded-xl bg-paper-dim/30 border border-paper-dim flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-ink">{formatMonthLabel(pmt.month)}</span>
                        <p className="text-[10px] text-ink-muted">
                          तारीख: {pmt.date} • माध्यम: {pmt.paymentMode.toUpperCase()}
                          {pmt.advanceDeducted > 0 && ` (एडवांस काटा: ₹${pmt.advanceDeducted})`}
                        </p>
                      </div>
                      <span className="font-mono font-black text-green">
                        ₹{pmt.amount.toLocaleString('en-IN')} ✓
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[11px] text-ink-muted py-4 bg-paper-dim/20 rounded-xl">
                    अभी तक कोई वेतन भुगतान दर्ज नहीं हुआ है।
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setViewProfileStaff(null)}
              className="w-full py-2.5 rounded-xl bg-paper-dim text-ink font-bold text-xs"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
