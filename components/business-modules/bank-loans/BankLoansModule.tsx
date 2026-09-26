'use client';

import React, { useState, useEffect } from 'react';
import { Landmark, Plus, Calculator, Phone, Share2, ShieldCheck, TrendingUp, AlertTriangle, Calendar, Check, Trash2 } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import { useFamilyStore } from '@/lib/store/familyStore';

interface LoanRecord {
  id: string;
  name: string;
  bank: string;
  type: 'home' | 'car' | 'personal' | 'business' | 'plot';
  principal: number;
  remainingAmount: number;
  interestRate: number; // e.g. 8.5%
  tenureMonths: number;
  monthlyEmi: number;
  emiDueDay: number; // e.g. 5th of every month
  memberSplits: { member: string; percentage: number; amount: number }[];
  startDate: string;
  notes?: string;
}

const DEFAULT_LOANS: LoanRecord[] = [];

export function BankLoansModule() {
  const { members } = useFamilyStore();
  const [loans, setLoans] = useState<LoanRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_bank_loans_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed.filter(l => !['loan-1', 'loan-2'].includes(l.id));
        } catch (e) { }
      }
    }
    return [];
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isHikeCalcOpen, setIsHikeCalcOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [bank, setBank] = useState('');
  const [type, setType] = useState<'home' | 'car' | 'personal' | 'business' | 'plot'>('home');
  const [principal, setPrincipal] = useState<number | ''>('');
  const [remaining, setRemaining] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [tenure, setTenure] = useState<number | ''>('');
  const [emi, setEmi] = useState<number | ''>('');
  const [dueDay, setDueDay] = useState<number>(5);

  // Hike calculator state
  const [hikeLoan, setHikeLoan] = useState<LoanRecord | null>(null);
  const [newRate, setNewRate] = useState<number>(9.5);

  useEffect(() => {
    localStorage.setItem('fwa_bank_loans_v1', JSON.stringify(loans));
  }, [loans]);

  // Auto calculate approximate EMI: P * r * (1+r)^n / ((1+r)^n - 1)
  const calculateEmi = (p: number, annualRate: number, months: number) => {
    if (!p || !annualRate || !months) return 0;
    const r = annualRate / 12 / 100;
    const emiCalc = (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    return Math.round(emiCalc);
  };

  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !bank || !principal) return;

    const p = Number(principal);
    const r = Number(rate) || 8.5;
    const t = Number(tenure) || 60;
    const calculatedMonthlyEmi = Number(emi) || calculateEmi(p, r, t);

    const newLoan: LoanRecord = {
      id: `loan-${Date.now()}`,
      name,
      bank,
      type,
      principal: p,
      remainingAmount: Number(remaining) || p,
      interestRate: r,
      tenureMonths: t,
      monthlyEmi: calculatedMonthlyEmi,
      emiDueDay: dueDay,
      memberSplits: members.length > 1 ? [
        { member: members[0].name, percentage: 50, amount: Math.round(calculatedMonthlyEmi * 0.5) },
        { member: members[1].name, percentage: 50, amount: Math.round(calculatedMonthlyEmi * 0.5) }
      ] : [
        { member: members[0]?.name || 'Ankush kesharwani', percentage: 100, amount: calculatedMonthlyEmi }
      ],
      startDate: new Date().toISOString().split('T')[0]
    };

    setLoans([newLoan, ...loans]);
    setIsAddOpen(false);
    setName('');
    setBank('');
    setPrincipal('');
    setRemaining('');
    setRate('');
    setTenure('');
    setEmi('');
  };

  const handleDelete = (id: string) => {
    if (confirm('क्या आप इस लोन को हटाना चाहते हैं?')) {
      setLoans(loans.filter(l => l.id !== id));
    }
  };

  const totalOutstanding = loans.reduce((sum, l) => sum + l.remainingAmount, 0);
  const totalMonthlyEmi = loans.reduce((sum, l) => sum + l.monthlyEmi, 0);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-navy text-paper p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gold/20 text-gold rounded-xl">
              <Landmark size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold font-serif">Bank Loans & Family EMI Split</h2>
              <p className="text-[11px] text-paper-dim/80">होम लोन, कार लोन, पारिवारिक EMI हिस्सा व ब्याज दर अलर्ट</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3 py-1.5 bg-gold text-navy text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-gold-light active:scale-95 transition-all shadow-sm"
          >
            <Plus size={15} /> नया लोन
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-navy-light/40">
          <div className="bg-navy-light/40 p-2.5 rounded-xl">
            <p className="text-[10px] text-paper-dim/70">कुल बाकी बैंक कर्ज़ (Outstanding)</p>
            <Mono className="text-base font-bold text-coral-light">₹{totalOutstanding.toLocaleString('en-IN')}</Mono>
          </div>
          <div className="bg-navy-light/40 p-2.5 rounded-xl">
            <p className="text-[10px] text-paper-dim/70">मासिक कुल EMI (हर महीने)</p>
            <Mono className="text-base font-bold text-gold">₹{totalMonthlyEmi.toLocaleString('en-IN')}/माह</Mono>
          </div>
        </div>
      </div>

      {/* Loans List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-ink uppercase tracking-wider px-1">सक्रिय बैंक लोन्स ({loans.length})</h3>

        {loans.map((loan) => (
          <div key={loan.id} className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-gold/15 text-gold-dark text-[10px] font-bold rounded-md uppercase">
                    {loan.type} loan
                  </span>
                  <span className="text-[11px] text-ink-muted">{loan.bank}</span>
                </div>
                <h4 className="text-sm font-bold text-ink mt-0.5">{loan.name}</h4>
              </div>
              <div className="text-right">
                <Mono className="text-sm font-bold text-ink">₹{loan.monthlyEmi.toLocaleString('en-IN')}</Mono>
                <p className="text-[10px] text-ink-muted">हर महीने {loan.emiDueDay} तारीख को</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-paper-dim/40 p-2.5 rounded-xl text-center">
              <div>
                <p className="text-[10px] text-ink-muted">शुरुआती रकम</p>
                <Mono className="text-xs font-semibold text-ink">₹{(loan.principal / 100000).toFixed(1)}L</Mono>
              </div>
              <div>
                <p className="text-[10px] text-ink-muted">ब्याज दर (ROI)</p>
                <Mono className="text-xs font-semibold text-coral">{loan.interestRate}% p.a.</Mono>
              </div>
              <div>
                <p className="text-[10px] text-ink-muted">बाकी कर्ज़</p>
                <Mono className="text-xs font-semibold text-ink">₹{(loan.remainingAmount / 100000).toFixed(1)}L</Mono>
              </div>
            </div>

            {/* Family Member Split */}
            <div className="border-t border-paper-dim pt-2 space-y-1">
              <p className="text-[11px] font-bold text-ink-muted">परिवार में EMI बंटवारा (Family Split):</p>
              <div className="flex flex-wrap gap-2">
                {loan.memberSplits.map((sp, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-paper border border-paper-dim px-2.5 py-1 rounded-lg text-xs">
                    <span className="font-semibold text-ink">{sp.member}:</span>
                    <Mono className="text-gold-dark font-bold">₹{sp.amount.toLocaleString('en-IN')}</Mono>
                    <span className="text-[10px] text-ink-muted">({sp.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                onClick={() => {
                  setHikeLoan(loan);
                  setNewRate(loan.interestRate + 0.5);
                  setIsHikeCalcOpen(true);
                }}
                className="flex items-center gap-1 text-gold-dark font-semibold hover:underline"
              >
                <Calculator size={13} /> ब्याज दर बढ़ने पर EMI चेक करें
              </button>
              <button
                onClick={() => handleDelete(loan.id)}
                className="text-coral hover:text-coral-dark p-1"
                title="हटाएं"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Loan Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-ink">नया बैंक लोन जोड़ें</h3>
            <form onSubmit={handleAddLoan} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">लोन का नाम</label>
                <input
                  type="text"
                  placeholder="उदा. नया फ्लैट होम लोन"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">बैंक का नाम</label>
                  <input
                    type="text"
                    placeholder="उदा. SBI / HDFC"
                    value={bank}
                    onChange={e => setBank(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">लोन का प्रकार</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                  >
                    <option value="home">Home Loan</option>
                    <option value="car">Car Loan</option>
                    <option value="personal">Personal Loan</option>
                    <option value="business">Business / MSME Loan</option>
                    <option value="plot">Plot / Land Loan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">मंज़ूर रकम (Principal ₹)</label>
                  <input
                    type="number"
                    placeholder="2500000"
                    value={principal}
                    onChange={e => setPrincipal(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">आज बाकी रकम (₹)</label>
                  <input
                    type="number"
                    placeholder="2100000"
                    value={remaining}
                    onChange={e => setRemaining(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">ब्याज दर (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    placeholder="8.5"
                    value={rate}
                    onChange={e => setRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">अवधि (महीने)</label>
                  <input
                    type="number"
                    placeholder="180"
                    value={tenure}
                    onChange={e => setTenure(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">EMI तारीख</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dueDay}
                    onChange={e => setDueDay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
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

      {/* Hike Calculator Modal */}
      {isHikeCalcOpen && hikeLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <h3 className="text-sm font-bold text-ink">RBI रेपो रेट बढ़ने पर EMI असर</h3>
            <p className="text-xs text-ink-muted">{hikeLoan.name} ({hikeLoan.bank})</p>

            <div className="space-y-3 bg-paper-dim/40 p-3 rounded-xl text-xs">
              <div className="flex justify-between">
                <span>मौजूदा ब्याज दर:</span>
                <span className="font-bold text-ink">{hikeLoan.interestRate}% (EMI: ₹{hikeLoan.monthlyEmi.toLocaleString('en-IN')})</span>
              </div>
              <div>
                <label className="block text-ink-muted mb-1">नई ब्याज दर (%) डालें:</label>
                <input
                  type="number"
                  step="0.25"
                  value={newRate}
                  onChange={e => setNewRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-paper border border-paper-dim font-bold"
                />
              </div>
              <div className="pt-2 border-t border-paper-dim">
                <div className="flex justify-between text-coral font-bold text-sm">
                  <span>नई संभावित EMI:</span>
                  <Mono>₹{calculateEmi(hikeLoan.remainingAmount, newRate, hikeLoan.tenureMonths).toLocaleString('en-IN')}</Mono>
                </div>
                <p className="text-[10px] text-ink-muted mt-1">
                  मासिक अतिरिक्त बोझ: ₹{(calculateEmi(hikeLoan.remainingAmount, newRate, hikeLoan.tenureMonths) - hikeLoan.monthlyEmi).toLocaleString('en-IN')}/माह
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsHikeCalcOpen(false)}
              className="w-full py-2 bg-navy text-paper text-xs font-bold rounded-xl"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
