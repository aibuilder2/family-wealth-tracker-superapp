'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Users, Plus, Calendar, CheckCircle2, AlertCircle, 
  Clock, DollarSign, Smartphone, Banknote, CreditCard, ChevronDown, 
  ChevronUp, Trash2, ArrowRightLeft, ShieldCheck, Sun, Store, 
  Landmark, Wheat, Sparkles, History, Check, Share2
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import { useFamilyStore } from '@/lib/store/familyStore';

export interface MonthlyCommitmentPayment {
  id: string;
  commitmentId: string;
  month: string; // YYYY-MM
  date: string; // YYYY-MM-DD
  amount: number;
  paidBy: 'me' | 'papa';
  paymentMode: 'cash' | 'upi' | 'bank_transfer';
  referenceNo?: string;
  reimbursedByPapa: boolean; // Papa se le liya ya nahi
  reimbursedDate?: string;
  reimbursedMode?: 'cash' | 'upi';
  notes?: string;
}

export interface MonthlyCommitment {
  id: string;
  title: string;
  category: 'solar_panel' | 'shop_emi' | 'nagar_palika' | 'mandi_rent' | 'staff_salary' | 'ration_home' | 'other';
  amount: number;
  dueDay: number; // e.g. 5, 10
  paidBy: 'me' | 'papa'; // Default who pays
  fundSource: 'papa_rental_fund' | 'personal';
  notes?: string;
  isActive: boolean;
  payments: MonthlyCommitmentPayment[];
}

export interface CustomFundInflow {
  id: string;
  title: string;
  amount: number;
  source: string;
  date: string;
  notes?: string;
}

const DEFAULT_COMMITMENTS: MonthlyCommitment[] = [
  {
    id: 'com-solar-1',
    title: 'सोलर पैनल EMI (दुकान व घर)',
    category: 'solar_panel',
    amount: 4500,
    dueDay: 10,
    paidBy: 'me',
    fundSource: 'papa_rental_fund',
    notes: 'हर महीने 10 तारीख को बैंक से कटती है, पापा के रेंटल फंड से लेकर भरनी होती है',
    isActive: true,
    payments: []
  },
  {
    id: 'com-shop-emi-1',
    title: 'दुकान लोन / कमर्शियल EMI',
    category: 'shop_emi',
    amount: 8000,
    dueDay: 5,
    paidBy: 'me',
    fundSource: 'papa_rental_fund',
    notes: 'दुकान का मासिक लोन किश्त, पापा से पैसा लेकर दिया जाता है',
    isActive: true,
    payments: []
  },
  {
    id: 'com-mandi-1',
    title: 'मंडी दुकान रेंट व सेस (Mandi Shop Rent)',
    category: 'mandi_rent',
    amount: 2500,
    dueDay: 7,
    paidBy: 'me',
    fundSource: 'papa_rental_fund',
    notes: 'मंडी समिति दुकान का सरकारी मासिक किराया व टैक्स',
    isActive: true,
    payments: []
  },
  {
    id: 'com-nagarpalika-1',
    title: 'नगर पालिका दुकान किराया / टैक्स',
    category: 'nagar_palika',
    amount: 1800,
    dueDay: 1,
    paidBy: 'me',
    fundSource: 'papa_rental_fund',
    notes: 'नगर पालिका दुकान का मासिक किराया व कमर्शियल सफाई शुल्क',
    isActive: true,
    payments: []
  },
  {
    id: 'com-staff-1',
    title: 'घरेलू कर्मचारी व बाई का वेतन (Staff/Maid)',
    category: 'staff_salary',
    amount: 5000,
    dueDay: 5,
    paidBy: 'me',
    fundSource: 'papa_rental_fund',
    notes: 'घर की मेड व सहायक का मासिक वेतन',
    isActive: true,
    payments: []
  }
];

export function PapaFamilyFundModule() {
  const { rentalProperties, members } = useFamilyStore();

  const mukhiya = members.find(m => m.role === 'owner') || members[0] || { name: 'Ankush kesharwani' };
  const papa = members.find(m => m.name.toLowerCase().includes('ganesh') || m.relationship === 'Father') || { name: 'Ganesh Prasad kesharwani' };

  // Current Month (YYYY-MM)
  const currentMonth = useMemo(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${mm}`;
  }, []);

  // 1. Commitments State (EMIs, Mandi Rent, Nagar Palika, Solar)
  const [commitments, setCommitments] = useState<MonthlyCommitment[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_papa_commitments_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return DEFAULT_COMMITMENTS;
  });

  // 2. Custom Additional Inflows to Papa's Fund
  const [customInflows, setCustomInflows] = useState<CustomFundInflow[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_papa_custom_inflows_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('fwa_papa_commitments_v1', JSON.stringify(commitments));
  }, [commitments]);

  useEffect(() => {
    localStorage.setItem('fwa_papa_custom_inflows_v1', JSON.stringify(customInflows));
  }, [customInflows]);

  // Selected Commitment for History Modal
  const [historyCommitment, setHistoryCommitment] = useState<MonthlyCommitment | null>(null);

  // Modal 1: Pay / Record Commitment Payment
  const [payingCommitment, setPayingCommitment] = useState<MonthlyCommitment | null>(null);
  const [payAmount, setPayAmount] = useState<number | ''>('');
  const [payDate, setPayDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState<'me' | 'papa'>('me');
  const [payMode, setPayMode] = useState<'upi' | 'cash' | 'bank_transfer'>('upi');
  const [payRef, setPayRef] = useState('');
  const [reimbursedByPapa, setReimbursedByPapa] = useState(false);
  const [reimbursedMode, setReimbursedMode] = useState<'cash' | 'upi'>('cash');
  const [payNotes, setPayNotes] = useState('');

  // Modal 2: Add New Commitment
  const [isAddCommitmentOpen, setIsAddCommitmentOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MonthlyCommitment['category']>('solar_panel');
  const [newAmount, setNewAmount] = useState<number | ''>('');
  const [newDueDay, setNewDueDay] = useState(5);
  const [newPaidBy, setNewPaidBy] = useState<'me' | 'papa'>('me');
  const [newNotes, setNewNotes] = useState('');

  // Modal 3: Add Additional Inflow to Papa's Pool
  const [isInflowModalOpen, setIsInflowModalOpen] = useState(false);
  const [inflowTitle, setInflowTitle] = useState('');
  const [inflowAmount, setInflowAmount] = useState<number | ''>('');
  const [inflowSource, setInflowSource] = useState('दुकान मुनाफा / व्यापार');
  const [inflowNotes, setInflowNotes] = useState('');

  // ==========================================
  // CALCULATIONS
  // ==========================================
  // A. Total Rental Inflow to Papa from 6 Properties
  const totalRentalToPapa = useMemo(() => {
    return rentalProperties.reduce((sum, p) => {
      const propTenantsSum = (p.tenants || []).reduce((tSum, t) => tSum + Number(t.monthly_rent || 0), 0);
      return sum + (propTenantsSum > 0 ? propTenantsSum : (p.monthly_target_revenue || 0));
    }, 0);
  }, [rentalProperties]);

  // B. Custom Inflows for Current Month
  const currentMonthCustomInflow = useMemo(() => {
    return customInflows
      .filter(inf => inf.date.startsWith(currentMonth))
      .reduce((sum, inf) => sum + inf.amount, 0);
  }, [customInflows, currentMonth]);

  // Total Inflow to Papa's Pool this Month
  const totalPapaInflowThisMonth = totalRentalToPapa + currentMonthCustomInflow;

  // C. Total Monthly Commitments Budget
  const totalMonthlyCommitmentBudget = useMemo(() => {
    return commitments
      .filter(c => c.isActive)
      .reduce((sum, c) => sum + c.amount, 0);
  }, [commitments]);

  // D. Actual Payments Paid in Current Month
  const currentMonthPaidCommitments = useMemo(() => {
    let total = 0;
    commitments.forEach(c => {
      c.payments.forEach(p => {
        if (p.date.startsWith(currentMonth)) {
          total += p.amount;
        }
      });
    });
    return total;
  }, [commitments, currentMonth]);

  // E. Pending Reimbursements from Papa (Maine diya par Papa se lena baki hai)
  const totalPendingFromPapa = useMemo(() => {
    let total = 0;
    commitments.forEach(c => {
      c.payments.forEach(p => {
        if (p.paidBy === 'me' && !p.reimbursedByPapa) {
          total += p.amount;
        }
      });
    });
    return total;
  }, [commitments]);

  // F. Net Surplus / Savings with Papa this month
  const netSurplusWithPapa = totalPapaInflowThisMonth - currentMonthPaidCommitments;

  // Handler: Open Pay Commitment Modal
  const handleOpenPayModal = (c: MonthlyCommitment) => {
    setPayingCommitment(c);
    setPayAmount(c.amount);
    setPayDate(new Date().toISOString().split('T')[0]);
    setPaidBy(c.paidBy);
    setPayMode('upi');
    setPayRef('');
    setReimbursedByPapa(false);
    setPayNotes(`${c.title} का मासिक भुगतान`);
  };

  // Handler: Submit Payment
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingCommitment || !payAmount) return;

    const payment: MonthlyCommitmentPayment = {
      id: `mcp-${Date.now()}`,
      commitmentId: payingCommitment.id,
      month: currentMonth,
      date: payDate,
      amount: Number(payAmount),
      paidBy,
      paymentMode: payMode,
      referenceNo: payRef.trim() || undefined,
      reimbursedByPapa: paidBy === 'papa' ? true : reimbursedByPapa,
      reimbursedDate: reimbursedByPapa ? payDate : undefined,
      reimbursedMode: reimbursedByPapa ? reimbursedMode : undefined,
      notes: payNotes.trim() || undefined,
    };

    setCommitments(prev => prev.map(c => {
      if (c.id !== payingCommitment.id) return c;
      return {
        ...c,
        payments: [payment, ...c.payments]
      };
    }));

    setPayingCommitment(null);
  };

  // Handler: Toggle Reimbursement from Papa
  const handleToggleReimburse = (commitmentId: string, paymentId: string) => {
    setCommitments(prev => prev.map(c => {
      if (c.id !== commitmentId) return c;
      return {
        ...c,
        payments: c.payments.map(p => {
          if (p.id !== paymentId) return p;
          const nextState = !p.reimbursedByPapa;
          return {
            ...p,
            reimbursedByPapa: nextState,
            reimbursedDate: nextState ? new Date().toISOString().split('T')[0] : undefined,
            reimbursedMode: nextState ? 'cash' : undefined
          };
        })
      };
    }));
  };

  // Handler: Submit New Commitment
  const handleAddCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;

    const newCom: MonthlyCommitment = {
      id: `com-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      amount: Number(newAmount),
      dueDay: Number(newDueDay || 5),
      paidBy: newPaidBy,
      fundSource: 'papa_rental_fund',
      notes: newNotes.trim() || undefined,
      isActive: true,
      payments: []
    };

    setCommitments([...commitments, newCom]);
    setIsAddCommitmentOpen(false);
    setNewTitle('');
    setNewAmount('');
    setNewNotes('');
  };

  // Handler: Submit Custom Inflow to Papa
  const handleAddInflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inflowTitle || !inflowAmount) return;

    const inflow: CustomFundInflow = {
      id: `inf-${Date.now()}`,
      title: inflowTitle.trim(),
      amount: Number(inflowAmount),
      source: inflowSource,
      date: new Date().toISOString().split('T')[0],
      notes: inflowNotes.trim() || undefined
    };

    setCustomInflows([inflow, ...customInflows]);
    setIsInflowModalOpen(false);
    setInflowTitle('');
    setInflowAmount('');
    setInflowNotes('');
  };

  // Category Icon & Color Helper
  const getCategoryMeta = (cat: MonthlyCommitment['category']) => {
    switch (cat) {
      case 'solar_panel':
        return { icon: Sun, label: 'सोलर पैनल EMI', color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' };
      case 'shop_emi':
        return { icon: Store, label: 'दुकान लोन EMI', color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' };
      case 'nagar_palika':
        return { icon: Landmark, label: 'नगर पालिका किराया', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' };
      case 'mandi_rent':
        return { icon: Wheat, label: 'मंडी दुकान रेंट', color: 'text-orange-400 bg-orange-500/20 border-orange-500/30' };
      case 'staff_salary':
        return { icon: Users, label: 'घरेलू स्टाफ वेतन', color: 'text-purple-400 bg-purple-500/20 border-purple-500/30' };
      default:
        return { icon: Sparkles, label: 'मासिक कमिटमेंट', color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30' };
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. PAPA CENTRAL FAMILY POOL HERO CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-navy to-slate-950 text-paper p-5 rounded-3xl shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl shrink-0 border border-amber-500/30">
              <Building2 size={26} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold font-serif text-white">
                  पापा का केंद्रीय रेंटल व पारिवारिक कोष
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  {papa.name}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                सभी 6 संपत्तियों का किराया पापा के पास जमा होता है, और वहीं से सोलर EMI, मंडी व दुकान रेंट का भुगतान होता है।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsInflowModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
            >
              <Plus size={15} /> + पापा के फंड में जमा करें
            </button>
            <button
              onClick={() => setIsAddCommitmentOpen(true)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
            >
              <Plus size={15} /> + नई EMI / रेंट मद जोड़ें
            </button>
          </div>
        </div>

        {/* 4 Financial KPI Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
          {/* Card 1: Total Inflow */}
          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-bold flex items-center gap-1">🏢 कुल मासिक रेंटल इनफ्लो</span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">6 प्रॉपर्टीज</span>
            </div>
            <div className="text-lg md:text-xl font-black text-emerald-400 font-mono">
              ₹{totalPapaInflowThisMonth.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-slate-400">
              किराया: ₹{totalRentalToPapa.toLocaleString('en-IN')} {currentMonthCustomInflow > 0 && `+ अन्य: ₹${currentMonthCustomInflow.toLocaleString('en-IN')}`}
            </p>
          </div>

          {/* Card 2: Total Commitments Budget */}
          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-bold flex items-center gap-1">⚡ कुल तय मासिक कमिटमेंट्स</span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">{commitments.length} मदें</span>
            </div>
            <div className="text-lg md:text-xl font-black text-amber-300 font-mono">
              ₹{totalMonthlyCommitmentBudget.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-slate-400">सोलर, मंडी, नगर पालिका व लोन EMI</p>
          </div>

          {/* Card 3: Paid This Month */}
          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-bold flex items-center gap-1">✅ इस महीने का भुगतान</span>
              <span className="text-[10px] text-blue-400 font-mono font-bold">चालू माह</span>
            </div>
            <div className="text-lg md:text-xl font-black text-blue-300 font-mono">
              ₹{currentMonthPaidCommitments.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-slate-400">
              बकाया: ₹{Math.max(0, totalMonthlyCommitmentBudget - currentMonthPaidCommitments).toLocaleString('en-IN')}
            </p>
          </div>

          {/* Card 4: Net Surplus with Papa */}
          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-bold flex items-center gap-1">💰 पापा के पास शुद्ध बचत</span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">Surplus</span>
            </div>
            <div className="text-lg md:text-xl font-black text-emerald-300 font-mono">
              ₹{netSurplusWithPapa.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-slate-400">सारे खर्चे निकलने के बाद बचत</p>
          </div>
        </div>

        {/* ANKUSH & PAPA SETTLEMENT ALERT BANNER */}
        {totalPendingFromPapa > 0 && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-400 shrink-0" />
              <div>
                <span className="font-black text-amber-300">
                  अंकुश ने अपनी जेब/UPI से भुगतान किया है — पापा से लेना बाकी:
                </span>
                <span className="font-mono font-black text-white text-sm ml-2">
                  ₹{totalPendingFromPapa.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/20 px-2.5 py-1 rounded-xl">
              पापा के रेंटल फंड से प्रतिपूर्ति (Reimbursement) देय
            </span>
          </div>
        )}
      </div>

      {/* 2. RECURRING MONTHLY COMMITMENTS & EMIS LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-black text-ink uppercase tracking-wider flex items-center gap-2">
              <Sun size={16} className="text-amber-500" />
              <span>मासिक तय कमिटमेंट्स व EMI मदें (हर महीने बिना टच किए ऑटो-शेड्यूल)</span>
            </h3>
            <p className="text-xs text-ink-muted">सोलर EMI, मंडी किराया, नगर पालिका, लोन व स्टाफ का भुगतान ट्रैक करें</p>
          </div>
          <span className="text-xs text-ink-muted font-mono font-bold">
            कुल {commitments.length} मदें
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {commitments.map(c => {
            const meta = getCategoryMeta(c.category);
            const Icon = meta.icon;

            // Check payment for current month
            const thisMonthPayment = c.payments.find(p => p.date.startsWith(currentMonth));
            const isPaidThisMonth = Boolean(thisMonthPayment);
            const totalLifetimePaid = c.payments.reduce((sum, p) => sum + p.amount, 0);

            return (
              <div 
                key={c.id} 
                className="bg-paper border border-paper-dim rounded-3xl p-4 md:p-5 shadow-sm space-y-3.5 hover:border-gold/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`p-2.5 rounded-2xl border ${meta.color}`}>
                        <Icon size={18} />
                      </span>
                      <div>
                        <h4 className="text-sm font-black text-ink leading-tight">{c.title}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-bold text-ink-muted">
                            हर महीने की {c.dueDay} तारीख देय
                          </span>
                          <span className="text-[10px] text-ink-muted">•</span>
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-300">
                            {c.paidBy === 'me' ? 'अंकुश द्वारा भुगतान (पापा से लेकर)' : 'पापा द्वारा सीधा भुगतान'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base md:text-lg font-black text-ink font-mono">
                        ₹{c.amount.toLocaleString('en-IN')}<span className="text-xs font-normal text-ink-muted">/माह</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        isPaidThisMonth 
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' 
                          : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                      }`}>
                        {isPaidThisMonth ? '✓ इस माह का भुगतान पूर्ण' : `⏳ बकाया (${c.dueDay} तारीख तक देय)`}
                      </span>
                    </div>
                  </div>

                  {c.notes && (
                    <p className="text-[11px] text-ink-muted bg-paper-dim/40 p-2 rounded-xl">
                      💡 {c.notes}
                    </p>
                  )}

                  {/* Payment Details for Current Month */}
                  {thisMonthPayment ? (
                    <div className="p-3 rounded-2xl bg-emerald-50/20 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 size={13} className="text-emerald-600" /> 
                          भुगतान तारीख: {thisMonthPayment.date}
                        </span>
                        <span className="text-[11px] font-bold uppercase text-ink-muted">
                          {thisMonthPayment.paymentMode === 'upi' ? '📱 UPI' : thisMonthPayment.paymentMode === 'cash' ? '💵 Cash' : '🏦 Bank'}
                        </span>
                      </div>

                      {/* Reimbursement status with Papa */}
                      <div className="flex items-center justify-between pt-1 border-t border-emerald-500/20">
                        <span className="text-[11px] text-ink-muted">पापा से हिसाब:</span>
                        {thisMonthPayment.reimbursedByPapa ? (
                          <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Check size={13} /> पापा से पैसा मिल गया ({thisMonthPayment.reimbursedMode || 'Cash'})
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                              ⏳ पापा से लेना बाकी
                            </span>
                            <button
                              onClick={() => handleToggleReimburse(c.id, thisMonthPayment.id)}
                              className="px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-sm"
                            >
                              ✓ पापा से मिल गया
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-paper-dim/40 border border-paper-dim flex items-center justify-between text-xs">
                      <span className="text-ink-muted text-[11px]">इस महीने का भुगतान अभी नहीं हुआ</span>
                      <button
                        onClick={() => handleOpenPayModal(c)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center gap-1 shadow-md active:scale-95 transition-all"
                      >
                        <Banknote size={14} /> पेमेंट दर्ज करें
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-paper-dim text-xs">
                  <button
                    onClick={() => setHistoryCommitment(c)}
                    className="font-bold text-ink hover:text-gold flex items-center gap-1 text-[11px]"
                  >
                    <History size={13} /> पेमेंट इतिहास देखें ({c.payments.length} भुगतान)
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-ink-muted">कुल भुगतान: ₹{totalLifetimePaid.toLocaleString('en-IN')}</span>
                    {isPaidThisMonth && (
                      <button
                        onClick={() => handleOpenPayModal(c)}
                        className="text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        + नया पेमेंट
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MODAL: RECORD PAYMENT FOR COMMITMENT */}
      {payingCommitment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper rounded-3xl shadow-2xl p-5 md:p-6 border border-paper-dim space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ink flex items-center gap-2">
                  <Banknote size={20} className="text-emerald-500" /> {payingCommitment.title}
                </h3>
                <p className="text-xs text-ink-muted">इस मद का मासिक भुगतान दर्ज करें</p>
              </div>
              <button 
                onClick={() => setPayingCommitment(null)}
                className="w-8 h-8 rounded-full bg-paper-dim text-ink font-bold hover:bg-paper-dim/80 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-ink-muted font-bold mb-1">रकम / Amount (₹) *</label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={e => setPayAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-black text-sm text-ink"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted font-bold mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-gold" /> भुगतान तारीख *
                  </label>
                  <input
                    type="date"
                    value={payDate}
                    onChange={e => setPayDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-ink text-xs"
                  />
                </div>
              </div>

              {/* Who Paid */}
              <div>
                <label className="block text-ink-muted font-bold mb-1">भुगतान किसने किया?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaidBy('me')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      paidBy === 'me'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'bg-paper border-paper-dim text-ink-muted'
                    }`}
                  >
                    <span>👤 मैंने दिया ({mukhiya.name.split(' ')[0]})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaidBy('papa');
                      setReimbursedByPapa(true);
                    }}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      paidBy === 'papa'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300 shadow-sm'
                        : 'bg-paper border-paper-dim text-ink-muted'
                    }`}
                  >
                    <span>👴 पापा ने सीधे दिया</span>
                  </button>
                </div>
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block text-ink-muted font-bold mb-1">भुगतान माध्यम (Mode) *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMode('upi')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      payMode === 'upi' ? 'bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-300' : 'bg-paper border-paper-dim text-ink-muted'
                    }`}
                  >
                    <Smartphone size={16} />
                    <span>📱 UPI (GPay)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMode('cash')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      payMode === 'cash' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300' : 'bg-paper border-paper-dim text-ink-muted'
                    }`}
                  >
                    <Banknote size={16} />
                    <span>💵 नकद Cash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMode('bank_transfer')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      payMode === 'bank_transfer' ? 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300' : 'bg-paper border-paper-dim text-ink-muted'
                    }`}
                  >
                    <CreditCard size={16} />
                    <span>🏦 बैंक NEFT/Auto</span>
                  </button>
                </div>
              </div>

              {/* Papa Reimbursement Checkbox (If paid by Ankush) */}
              {paidBy === 'me' && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reimbursedByPapa}
                        onChange={e => setReimbursedByPapa(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                      />
                      <span>क्या यह पैसा पापा के रेंटल फंड से वापस ले लिया?</span>
                    </label>
                  </div>

                  {reimbursedByPapa && (
                    <div className="flex items-center gap-2 pt-1 border-t border-amber-500/20 text-xs">
                      <span className="text-ink-muted">पापा से कैसे मिला:</span>
                      <button
                        type="button"
                        onClick={() => setReimbursedMode('cash')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-xs ${reimbursedMode === 'cash' ? 'bg-amber-500 text-slate-950' : 'bg-paper border text-ink-muted'}`}
                      >
                        💵 कैश मिला
                      </button>
                      <button
                        type="button"
                        onClick={() => setReimbursedMode('upi')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-xs ${reimbursedMode === 'upi' ? 'bg-amber-500 text-slate-950' : 'bg-paper border text-ink-muted'}`}
                      >
                        📱 UPI मिला
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Reference & Notes */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-ink-muted mb-1">Txn / रसीद नं. (ऐच्छिक)</label>
                  <input
                    type="text"
                    placeholder="उदा. UPI-4920194"
                    value={payRef}
                    onChange={e => setPayRef(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim text-ink font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">नोट</label>
                  <input
                    type="text"
                    value={payNotes}
                    onChange={e => setPayNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim text-ink text-[11px]"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setPayingCommitment(null)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold hover:bg-paper-dim/80"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 shadow-md"
                >
                  ✓ भुगतान सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: PAYMENT HISTORY OF SPECIFIC COMMITMENT (कब-कब किस मद में दिया) */}
      {historyCommitment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-paper rounded-3xl shadow-2xl p-5 md:p-6 border border-paper-dim space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ink flex items-center gap-2">
                  <History size={18} className="text-gold" /> {historyCommitment.title} का पूरा भुगतान इतिहास
                </h3>
                <p className="text-xs text-ink-muted">कब-कब, किस तारीख को कितना दिया और पापा से मिला या नहीं</p>
              </div>
              <button 
                onClick={() => setHistoryCommitment(null)}
                className="w-8 h-8 rounded-full bg-paper-dim text-ink font-bold hover:bg-paper-dim/80 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              {historyCommitment.payments.length === 0 ? (
                <div className="p-8 bg-paper border border-dashed border-paper-dim rounded-2xl text-center text-xs text-ink-muted">
                  अभी तक इस मद में कोई पिछला भुगतान दर्ज नहीं है।
                </div>
              ) : (
                historyCommitment.payments.map((p, idx) => (
                  <div key={p.id} className="p-3.5 rounded-2xl bg-paper-dim/40 border border-paper-dim flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-ink">{idx + 1}.</span>
                        <span className="font-bold text-ink">तारीख: {p.date}</span>
                        <span className="px-2 py-0.5 rounded bg-paper text-[10px] font-bold uppercase text-ink-muted">
                          {p.paymentMode === 'upi' ? '📱 UPI' : p.paymentMode === 'cash' ? '💵 Cash' : '🏦 Bank'}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-muted">
                        भुगतानकर्ता: <span className="font-bold text-ink">{p.paidBy === 'me' ? 'अंकुश' : 'पापा'}</span>
                        {p.referenceNo && ` • Ref: ${p.referenceNo}`}
                      </p>
                    </div>

                    <div className="text-right">
                      <Mono className="text-base font-black text-ink">₹{p.amount.toLocaleString('en-IN')}</Mono>
                      <div className="mt-0.5">
                        {p.reimbursedByPapa ? (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 justify-end">
                            <Check size={11} /> पापा से मिल गया
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600">
                            ⏳ पापा से लेना बाकी
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setHistoryCommitment(null)}
                className="w-full py-2.5 rounded-xl bg-navy text-paper font-bold text-xs"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: ADD NEW COMMITMENT */}
      {isAddCommitmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper rounded-3xl shadow-2xl p-5 md:p-6 border border-paper-dim space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ink flex items-center gap-2">
                  <Plus size={18} className="text-amber-500" /> नई मासिक EMI या रेंट मद जोड़ें
                </h3>
                <p className="text-xs text-ink-muted">हर महीने ऑटो-शेड्यूल होने वाली किश्त या किराया</p>
              </div>
              <button 
                onClick={() => setIsAddCommitmentOpen(false)}
                className="w-8 h-8 rounded-full bg-paper-dim text-ink font-bold hover:bg-paper-dim/80 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCommitment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-ink-muted font-bold mb-1">मद का नाम *</label>
                <input
                  type="text"
                  placeholder="उदा. सोलर पैनल EMI, दुकान लोन, मंडी किराया"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-ink-muted font-bold mb-1">मासिक रकम (₹) *</label>
                  <input
                    type="number"
                    placeholder="उदा. 4500"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-black text-sm text-ink"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted font-bold mb-1">महीने की देय तारीख *</label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-ink-muted text-xs">हर माह</span>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={newDueDay}
                      onChange={e => setNewDueDay(Number(e.target.value || 5))}
                      required
                      className="w-20 px-2 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-ink text-center"
                    />
                    <span className="text-ink-muted text-xs">तारीख</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-ink-muted font-bold mb-1">प्रकार (Category)</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-medium text-ink"
                >
                  <option value="solar_panel">☀️ सोलर पैनल EMI</option>
                  <option value="shop_emi">🏪 दुकान लोन EMI</option>
                  <option value="mandi_rent">🌾 मंडी दुकान रेंट व सेस</option>
                  <option value="nagar_palika">🏛️ नगर पालिका दुकान रेंट</option>
                  <option value="staff_salary">🧹 घरेलू स्टाफ / बाई वेतन</option>
                  <option value="other">⚡ अन्य मासिक कमिटमेंट</option>
                </select>
              </div>

              <div>
                <label className="block text-ink-muted font-bold mb-1">आमतौर पर भुगतान कौन करता है?</label>
                <select
                  value={newPaidBy}
                  onChange={e => setNewPaidBy(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-medium text-ink"
                >
                  <option value="me">अंकुश (पापा से पैसा लेकर देता है)</option>
                  <option value="papa">पापा (सीधे अपने खाते या कैश से देते हैं)</option>
                </select>
              </div>

              <div>
                <label className="block text-ink-muted mb-1">अतिरिक्त नोट / बैंक विवरण</label>
                <input
                  type="text"
                  placeholder="उदा. HDFC Bank A/c से 10 तारीख को कटती है"
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim text-ink"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCommitmentOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold hover:bg-paper-dim/80"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400 shadow-md"
                >
                  ✓ कमिटमेंट सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: ADD CUSTOM INFLOW TO PAPA'S FUND */}
      {isInflowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper rounded-3xl shadow-2xl p-5 md:p-6 border border-emerald-500/30 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ink flex items-center gap-2">
                  <Plus size={18} className="text-emerald-500" /> पापा के फंड में जमा करें
                </h3>
                <p className="text-xs text-ink-muted">किराये के अलावा दुकान या अन्य आय पापा के कोष में जोड़ें</p>
              </div>
              <button 
                onClick={() => setIsInflowModalOpen(false)}
                className="w-8 h-8 rounded-full bg-paper-dim text-ink font-bold hover:bg-paper-dim/80 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddInflow} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-ink-muted font-bold mb-1">फंड का विवरण / स्रोत *</label>
                <input
                  type="text"
                  placeholder="उदा. मुख्य दुकान का मासिक मुनाफा, पेंशन, ब्याज"
                  value={inflowTitle}
                  onChange={e => setInflowTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-ink"
                />
              </div>

              <div>
                <label className="block text-emerald-600 font-bold mb-1">जमा रकम (₹) *</label>
                <input
                  type="number"
                  placeholder="उदा. 15000"
                  value={inflowAmount}
                  onChange={e => setInflowAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-emerald-500/40 font-black text-sm text-ink"
                />
              </div>

              <div>
                <label className="block text-ink-muted mb-1">अतिरिक्त विवरण</label>
                <input
                  type="text"
                  placeholder="उदा. नकद दिया गया"
                  value={inflowNotes}
                  onChange={e => setInflowNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim text-ink"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInflowModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold hover:bg-paper-dim/80"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 shadow-md"
                >
                  ✓ फंड जमा करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
