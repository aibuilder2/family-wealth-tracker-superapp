'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CreditCard, Plus, Calendar, CheckCircle2, AlertCircle, 
  Clock, DollarSign, Building2, User, ChevronRight, History, 
  Trash2, Edit3, ShieldCheck, Sun, Store, Car, Home, Sparkles,
  TrendingDown, Percent, ArrowRightLeft, Check
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Member } from '@/types';

// ==========================================
// CENTRAL LOANS & EMIs DATA SCHEMA
// ==========================================

export type LoanType = 'solar' | 'business' | 'home' | 'vehicle' | 'personal' | 'gold' | 'other';

export interface FamilyLoan {
  id: string;
  title: string; // e.g. "रूफटॉप सोलर पैनल लोन", "मुख्य दुकान कमर्शियल लोन"
  bankName: string; // e.g. "SBI", "Bank of Baroda", "HDFC"
  loanType: LoanType;
  principalAmount: number; // मूल लोन राशि e.g. 300000
  outstandingBalance: number; // बकाया ऋण e.g. 165000
  monthlyEmi: number; // मासिक किश्त e.g. 4500
  interestRate: number; // ब्याज दर % e.g. 8.5
  totalTenureMonths: number; // कुल अवधि e.g. 60 माह
  remainingEmis: number; // शेष किश्तें e.g. 36
  dueDay: number; // हर माह 1 से 31 तारीख e.g. 10
  
  // DYNAMIC MEMBER ALLOCATION (Zero Hardcoding)
  borrowerMemberId: string; // लोन किसके नाम पर है (Legal Account Holder)
  assignedPayerMemberId: string; // किश्त किस सदस्य के फंड से कटेगी (Funding Source)
  
  accountNumber?: string;
  startDate?: string;
  notes?: string;
  status: 'active' | 'closed';
}

export const STORAGE_KEY_LOANS = 'fwa_family_loans_central_v1';

export function FamilyLoansModule({ onNavigateToCashflow }: { onNavigateToCashflow?: (memberId: string) => void }) {
  const { members } = useFamilyStore();

  const ownerMember = useMemo(() => {
    return members.find(m => m.role === 'owner') || members[0] || { id: 'm-default', name: 'अंकुश' };
  }, [members]);

  const seniorOrFatherMember = useMemo(() => {
    return members.find(m => 
      m.relationship?.toLowerCase().includes('father') || 
      m.relationship?.toLowerCase().includes('pita') ||
      m.name.toLowerCase().includes('ganesh')
    ) || members.find(m => m.id !== ownerMember.id) || ownerMember;
  }, [members, ownerMember]);

  // Default seed loans if empty
  const defaultLoans: FamilyLoan[] = useMemo(() => [
    {
      id: 'loan-solar-1',
      title: 'रूफटॉप सोलर पैनल लोन (Solar Loan)',
      bankName: 'State Bank of India (SBI)',
      loanType: 'solar',
      principalAmount: 300000,
      outstandingBalance: 165000,
      monthlyEmi: 4500,
      interestRate: 7.5,
      totalTenureMonths: 60,
      remainingEmis: 36,
      dueDay: 10,
      borrowerMemberId: ownerMember.id, // e.g. Ankush ke name par
      assignedPayerMemberId: seniorOrFatherMember.id, // e.g. Papa ke rental pool se
      startDate: '2023-10-01',
      accountNumber: 'SBIN-SOLAR-8902',
      notes: 'घर पर लगे सोलर पैनल का बैंक लोन - किश्त पापा के रेंटल फंड से देय',
      status: 'active'
    },
    {
      id: 'loan-shop-1',
      title: 'मुख्य दुकान कमर्शियल लोन (Shop Loan)',
      bankName: 'Bank of Baroda',
      loanType: 'business',
      principalAmount: 500000,
      outstandingBalance: 280000,
      monthlyEmi: 8000,
      interestRate: 8.8,
      totalTenureMonths: 72,
      remainingEmis: 35,
      dueDay: 5,
      borrowerMemberId: ownerMember.id, // e.g. Ankush ke name par
      assignedPayerMemberId: seniorOrFatherMember.id, // e.g. Papa ke pool se
      startDate: '2023-04-15',
      accountNumber: 'BOB-COMM-4412',
      notes: 'व्यावसायिक दुकान हेतु लोन किश्त',
      status: 'active'
    }
  ], [ownerMember.id, seniorOrFatherMember.id]);

  // Central Loans State
  const [loans, setLoans] = useState<FamilyLoan[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_LOANS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return defaultLoans;
  });

  // Save to localStorage and auto-sync to member cashflow storage
  useEffect(() => {
    if (typeof window !== 'undefined' && loans.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY_LOANS, JSON.stringify(loans));
        // Auto-sync active loans to member cashflow recurring commitments
        syncLoansToMemberCashflowStorage(loans);
      } catch (e) {}
    }
  }, [loans]);

  // Function to sync active loans into member commitments storage
  const syncLoansToMemberCashflowStorage = (currentLoans: FamilyLoan[]) => {
    try {
      const rawCashflows = localStorage.getItem('fwa_dynamic_member_cashflows_v2');
      let profiles: Record<string, any> = {};
      if (rawCashflows) {
        profiles = JSON.parse(rawCashflows) || {};
      }

      currentLoans.filter(l => l.status === 'active').forEach(loan => {
        const targetMemberId = loan.assignedPayerMemberId;
        if (!targetMemberId) return;

        if (!profiles[targetMemberId]) {
          profiles[targetMemberId] = {
            memberId: targetMemberId,
            commitments: []
          };
        }

        const profile = profiles[targetMemberId];
        profile.commitments = profile.commitments || [];

        // Check if commitment already exists
        const existingIdx = profile.commitments.findIndex((c: any) => c.id === `com-sync-${loan.id}` || c.title.includes(loan.title));
        const commitmentData = {
          id: `com-sync-${loan.id}`,
          title: `${loan.title} (${loan.bankName})`,
          category: 'emi_loan',
          amount: loan.monthlyEmi,
          dueDay: loan.dueDay,
          defaultPayerMemberId: loan.borrowerMemberId, // Who physically holds loan
          notes: `लोन धारक: ${getMemberName(loan.borrowerMemberId)} • बकाया: ₹${loan.outstandingBalance.toLocaleString('en-IN')}`,
          isActive: true,
          payments: existingIdx >= 0 ? profile.commitments[existingIdx].payments || [] : []
        };

        if (existingIdx >= 0) {
          profile.commitments[existingIdx] = {
            ...profile.commitments[existingIdx],
            ...commitmentData
          };
        } else {
          profile.commitments.unshift(commitmentData);
        }
      });

      localStorage.setItem('fwa_dynamic_member_cashflows_v2', JSON.stringify(profiles));
    } catch (e) {
      console.error('Error auto-syncing loans to cashflows', e);
    }
  };

  // Helper for Member Names
  const getMemberName = (id?: string) => {
    if (!id) return 'अज्ञात सदस्य';
    const found = members.find(m => m.id === id);
    return found ? found.name : 'सदस्य';
  };

  // KPI Computations
  const totalPrincipal = useMemo(() => {
    return loans.filter(l => l.status === 'active').reduce((sum, l) => sum + Number(l.principalAmount || 0), 0);
  }, [loans]);

  const totalOutstanding = useMemo(() => {
    return loans.filter(l => l.status === 'active').reduce((sum, l) => sum + Number(l.outstandingBalance || 0), 0);
  }, [loans]);

  const totalMonthlyEmi = useMemo(() => {
    return loans.filter(l => l.status === 'active').reduce((sum, l) => sum + Number(l.monthlyEmi || 0), 0);
  }, [loans]);

  // Modal State for Adding/Editing Loan
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoanId, setEditingLoanId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [bankName, setBankName] = useState('');
  const [loanType, setLoanType] = useState<LoanType>('solar');
  const [principalAmount, setPrincipalAmount] = useState<number | ''>('');
  const [outstandingBalance, setOutstandingBalance] = useState<number | ''>('');
  const [monthlyEmi, setMonthlyEmi] = useState<number | ''>('');
  const [interestRate, setInterestRate] = useState<number | ''>('');
  const [dueDay, setDueDay] = useState<number>(10);
  const [totalTenureMonths, setTotalTenureMonths] = useState<number | ''>(60);
  const [remainingEmis, setRemainingEmis] = useState<number | ''>(36);
  const [borrowerMemberId, setBorrowerMemberId] = useState<string>(ownerMember.id);
  const [assignedPayerMemberId, setAssignedPayerMemberId] = useState<string>(seniorOrFatherMember.id);
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingLoanId(null);
    setTitle('');
    setBankName('SBI');
    setLoanType('solar');
    setPrincipalAmount('');
    setOutstandingBalance('');
    setMonthlyEmi('');
    setInterestRate(8.5);
    setDueDay(10);
    setTotalTenureMonths(60);
    setRemainingEmis(36);
    setBorrowerMemberId(ownerMember.id);
    setAssignedPayerMemberId(seniorOrFatherMember.id);
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (loan: FamilyLoan) => {
    setEditingLoanId(loan.id);
    setTitle(loan.title);
    setBankName(loan.bankName);
    setLoanType(loan.loanType);
    setPrincipalAmount(loan.principalAmount);
    setOutstandingBalance(loan.outstandingBalance);
    setMonthlyEmi(loan.monthlyEmi);
    setInterestRate(loan.interestRate);
    setDueDay(loan.dueDay);
    setTotalTenureMonths(loan.totalTenureMonths);
    setRemainingEmis(loan.remainingEmis);
    setBorrowerMemberId(loan.borrowerMemberId);
    setAssignedPayerMemberId(loan.assignedPayerMemberId);
    setNotes(loan.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !monthlyEmi) return;

    if (editingLoanId) {
      // Edit
      setLoans(prev => prev.map(l => {
        if (l.id === editingLoanId) {
          return {
            ...l,
            title: title.trim(),
            bankName: bankName.trim(),
            loanType,
            principalAmount: Number(principalAmount) || 0,
            outstandingBalance: Number(outstandingBalance) || 0,
            monthlyEmi: Number(monthlyEmi),
            interestRate: Number(interestRate) || 0,
            dueDay: Number(dueDay) || 10,
            totalTenureMonths: Number(totalTenureMonths) || 0,
            remainingEmis: Number(remainingEmis) || 0,
            borrowerMemberId,
            assignedPayerMemberId,
            notes: notes.trim() || undefined
          };
        }
        return l;
      }));
    } else {
      // Create New
      const newLoan: FamilyLoan = {
        id: `loan-${Date.now()}`,
        title: title.trim(),
        bankName: bankName.trim(),
        loanType,
        principalAmount: Number(principalAmount) || Number(monthlyEmi) * (Number(totalTenureMonths) || 12),
        outstandingBalance: Number(outstandingBalance) || Number(principalAmount) || 0,
        monthlyEmi: Number(monthlyEmi),
        interestRate: Number(interestRate) || 0,
        totalTenureMonths: Number(totalTenureMonths) || 60,
        remainingEmis: Number(remainingEmis) || 36,
        dueDay: Number(dueDay) || 10,
        borrowerMemberId,
        assignedPayerMemberId,
        notes: notes.trim() || undefined,
        status: 'active'
      };
      setLoans(prev => [newLoan, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteLoan = (loanId: string) => {
    if (!confirm('क्या आप इस लोन को हटाना चाहते हैं?')) return;
    setLoans(prev => prev.filter(l => l.id !== loanId));
  };

  const getLoanIcon = (type: LoanType) => {
    switch (type) {
      case 'solar': return <Sun size={18} className="text-amber-500" />;
      case 'business': return <Store size={18} className="text-emerald-500" />;
      case 'vehicle': return <Car size={18} className="text-blue-500" />;
      case 'home': return <Home size={18} className="text-indigo-500" />;
      default: return <CreditCard size={18} className="text-purple-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* ======================================================== */}
      {/* 1. HEADER & ACTIONS                                      */}
      {/* ======================================================== */}
      <div className="bg-paper rounded-2xl border border-paper-dim p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block">
            Central Debt & Liabilities • केंद्रीय लोन व EMI प्रबंधन
          </span>
          <h2 className="text-base font-serif font-black text-ink flex items-center gap-2">
            <CreditCard size={18} className="text-amber-500" />
            पारिवारिक लोन, किश्त व EMI हब
          </h2>
          <p className="text-[11px] text-ink-muted mt-0.5">
            लोन किसके नाम है, किश्त किस सदस्य के फंड से जाएगी - रियल-टाइम ऑटो-सिंक
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm hover:bg-amber-400 transition-all active:scale-95 shrink-0"
        >
          <Plus size={15} /> + नया लोन / EMI जोड़ें
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. FINANCIAL KPI CARDS FOR LOANS                         */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[10px] font-bold uppercase tracking-wider">सक्रिय लोन</span>
            <Building2 size={15} className="text-amber-500" />
          </div>
          <div className="text-lg font-mono font-black text-ink">
            {loans.filter(l => l.status === 'active').length}
          </div>
          <p className="text-[10px] text-ink-muted">सोलर, दुकान व अन्य लोन</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[10px] font-bold uppercase tracking-wider">कुल मासिक EMI</span>
            <Clock size={15} className="text-rose-500" />
          </div>
          <div className="text-lg font-mono font-black text-rose-500">
            ₹{totalMonthlyEmi.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-ink-muted">प्रतिमाह देय कुल किश्त</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[10px] font-bold uppercase tracking-wider">कुल बकाया ऋण</span>
            <TrendingDown size={15} className="text-orange-500" />
          </div>
          <div className="text-lg font-mono font-black text-orange-500">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-ink-muted">मूल बकाया शेष राशि</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[10px] font-bold uppercase tracking-wider">मूल स्वीकृत राशि</span>
            <ShieldCheck size={15} className="text-emerald-500" />
          </div>
          <div className="text-lg font-mono font-black text-ink">
            ₹{totalPrincipal.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-ink-muted">बैंकों द्वारा जारी कुल लोन</p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. LOAN CARDS LIST (JUST LIKE RENTAL PROPERTIES)         */}
      {/* ======================================================== */}
      <div className="space-y-3">
        {loans.map(loan => {
          const borrowerName = getMemberName(loan.borrowerMemberId);
          const payerName = getMemberName(loan.assignedPayerMemberId);

          const paidRatio = loan.principalAmount > 0 
            ? Math.round(((loan.principalAmount - loan.outstandingBalance) / loan.principalAmount) * 100) 
            : 0;

          return (
            <div
              key={loan.id}
              className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-xs hover:border-amber-500/40 transition-all space-y-3"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-paper-dim/60 pb-3">
                {/* Title & Bank */}
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0 shadow-2xs">
                    {getLoanIcon(loan.loanType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-ink">{loan.title}</h3>
                      <span className="text-[10px] font-bold bg-paper-dim px-2 py-0.5 rounded-full text-ink-muted">
                        {loan.bankName}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        हर माह {loan.dueDay} तारीख
                      </span>
                    </div>

                    {/* Dual Member Allocation Badges */}
                    <div className="flex items-center gap-2 flex-wrap mt-1 text-xs">
                      <span className="text-[11px] bg-paper-dim/60 px-2 py-0.5 rounded-md text-ink flex items-center gap-1">
                        <User size={12} className="text-blue-500" />
                        लोन खाता धारक: <strong className="font-bold text-blue-600">{borrowerName}</strong>
                      </span>
                      <span className="text-[11px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md text-emerald-700 flex items-center gap-1 font-bold">
                        <ArrowRightLeft size={12} className="text-emerald-600" />
                        किश्त फंड: <span>{payerName}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Monthly EMI & Actions */}
                <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-ink-muted block">मासिक किश्त (EMI)</span>
                    <span className="text-base font-mono font-black text-rose-500">
                      ₹{loan.monthlyEmi.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 border-l border-paper-dim pl-2.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(loan)}
                      className="p-1.5 rounded-lg bg-paper-dim/60 hover:bg-paper-dim text-ink-muted hover:text-ink transition-colors"
                      title="बदलाव करें (Edit)"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLoan(loan.id)}
                      className="p-1.5 rounded-lg bg-paper-dim/60 hover:bg-red-500/20 text-ink-muted hover:text-red-500 transition-colors"
                      title="हटाएं"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Outstanding Balance & Progress Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-0.5">
                <div className="p-2.5 rounded-xl bg-paper-dim/30 border border-paper-dim">
                  <span className="text-[10px] text-ink-muted block">स्वीकृत मूल राशि</span>
                  <span className="font-mono font-bold text-ink text-sm">
                    ₹{loan.principalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-paper-dim/30 border border-paper-dim">
                  <span className="text-[10px] text-ink-muted block">शेष बकाया ऋण</span>
                  <span className="font-mono font-bold text-orange-500 text-sm">
                    ₹{loan.outstandingBalance.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-paper-dim/30 border border-paper-dim">
                  <span className="text-[10px] text-ink-muted block">अवधि व शेष किश्तें</span>
                  <span className="font-mono font-bold text-ink text-sm">
                    {loan.remainingEmis} / {loan.totalTenureMonths} किश्तें शेष ({loan.interestRate}% ब्याज)
                  </span>
                </div>
              </div>

              {/* Repayment Progress bar */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-ink-muted mb-1">
                  <span>ऋण अदायगी प्रगति: {paidRatio}% चुकता</span>
                  <span>शेष: {100 - paidRatio}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-paper-dim overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, paidRatio))}%` }}
                  />
                </div>
              </div>

              {/* Bottom Sync Info Banner */}
              <div className="text-[11px] text-ink-muted bg-paper-dim/20 px-3 py-1.5 rounded-xl flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  यह लोन स्वतः <strong>{payerName}</strong> के कैशफ्लो हब में सिंक है।
                </span>
                {loan.notes && <span className="truncate max-w-[200px] text-[10px]">{loan.notes}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT LOAN                                   */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <CreditCard size={18} className="text-amber-500" />
                {editingLoanId ? 'लोन व EMI जानकारी संपादित करें' : 'नया पारिवारिक लोन व EMI जोड़ें'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-ink-muted hover:text-ink">✕</button>
            </div>

            <form onSubmit={handleSaveLoan} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">लोन का शीर्षक (Title)</label>
                <input
                  type="text"
                  placeholder="e.g. रूफटॉप सोलर पैनल लोन या मुख्य दुकान लोन"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">बैंक / संस्थान (Bank Name)</label>
                  <input
                    type="text"
                    placeholder="e.g. SBI, HDFC, Canara"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">लोन प्रकार (Type)</label>
                  <select
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value as LoanType)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                  >
                    <option value="solar">☀️ सोलर पैनल लोन</option>
                    <option value="business">🏪 व्यवसाय / दुकान लोन</option>
                    <option value="home">🏠 होम लोन</option>
                    <option value="vehicle">🚗 वाहन / कार लोन</option>
                    <option value="personal">👤 पर्सनल लोन</option>
                    <option value="gold">🟡 गोल्ड लोन</option>
                    <option value="other">🪙 अन्य ऋण</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">मासिक किश्त EMI (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 4500"
                    value={monthlyEmi}
                    onChange={(e) => setMonthlyEmi(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono font-bold text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">मासिक देय तारीख (Due Day)</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={dueDay}
                    onChange={(e) => setDueDay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">मूल स्वीकृत राशि (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 300000"
                    value={principalAmount}
                    onChange={(e) => setPrincipalAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">शेष बकाया राशि (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 165000"
                    value={outstandingBalance}
                    onChange={(e) => setOutstandingBalance(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">ब्याज दर (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 8.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">कुल किश्तें (Months)</label>
                  <input
                    type="number"
                    value={totalTenureMonths}
                    onChange={(e) => setTotalTenureMonths(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">शेष किश्तें</label>
                  <input
                    type="number"
                    value={remainingEmis}
                    onChange={(e) => setRemainingEmis(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono"
                  />
                </div>
              </div>

              {/* DYNAMIC MEMBER ALLOCATION */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <span className="text-[11px] font-black uppercase text-amber-600 block">
                  ⚙️ सदस्य आवंटन (Member Allocation Engine)
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-ink block mb-1">
                      1. लोन किसके नाम पर है? (Borrower)
                    </label>
                    <select
                      value={borrowerMemberId}
                      onChange={(e) => setBorrowerMemberId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-paper border border-paper-dim text-ink font-bold"
                    >
                      {members.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-ink block mb-1">
                      2. किश्त किस फंड से कटेगी? (Funding Pool)
                    </label>
                    <select
                      value={assignedPayerMemberId}
                      onChange={(e) => setAssignedPayerMemberId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-paper border border-paper-dim text-ink font-bold text-emerald-600"
                    >
                      {members.map(m => (
                        <option key={m.id} value={m.id}>{m.name} का फंड</option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="text-[10px] text-ink-muted">
                  सेव करते ही यह किश्त सीधे चुने गए सदस्य के कैशफ्लो हब में ऑटो-सिंक हो जाएगी।
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">नोट्स (Notes)</label>
                <input
                  type="text"
                  placeholder="e.g. खाता संख्या या लोन एग्रीमेंट संदर्भ"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400 shadow-sm"
                >
                  {editingLoanId ? '✓ बदलाव सेव करें' : '✓ लोन व EMI दर्ज करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
