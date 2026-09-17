'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Avatar } from '@/components/ui/Avatar';
import {
  Landmark, Plus, TrendingUp, AlertTriangle, CheckCircle2,
  Share2, ShieldCheck, RefreshCw, ChevronRight, Calculator,
  Calendar, Phone, MessageCircle, X, Edit2, Trash2, ArrowUpRight,
  Sparkles, Check
} from 'lucide-react';
import { BankLoan, BankLoanType, LoanMemberSplit } from '@/types';
import Link from 'next/link';

const LOAN_TYPES: { type: BankLoanType; label: string }[] = [
  { type: 'home_loan', label: '🏠 Home Loan' },
  { type: 'car_loan', label: '🚗 Car / Vehicle Loan' },
  { type: 'personal_loan', label: '👤 Personal Loan' },
  { type: 'business_loan', label: '💼 Business / MSME Loan' },
  { type: 'plot_loan', label: '📐 Plot / Land Loan' },
  { type: 'education_loan', label: '🎓 Education Loan' },
  { type: 'lap', label: '🏢 Loan Against Property (LAP)' },
  { type: 'other', label: '📑 Other Bank Loan' },
];

export default function BankLoansPage() {
  const {
    bankLoans,
    members,
    addBankLoan,
    updateBankLoan,
    deleteBankLoan,
    recordLoanInterestHike,
    verifyLoanMemberOTP,
    currentUserId
  } = useFamilyStore();

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<BankLoan | null>(null);
  const [hikeLoan, setHikeLoan] = useState<BankLoan | null>(null);
  const [whatsappLoan, setWhatsappLoan] = useState<BankLoan | null>(null);
  const [loanToDelete, setLoanToDelete] = useState<BankLoan | null>(null);

  // Form State
  const [loanName, setLoanName] = useState('');
  const [bankName, setBankName] = useState('');
  const [loanType, setLoanType] = useState<BankLoanType>('home_loan');
  const [accountNo, setAccountNo] = useState('');
  const [principal, setPrincipal] = useState('');
  const [originalPrincipal, setOriginalPrincipal] = useState('');
  const [processingFee, setProcessingFee] = useState('');
  const [interestRate, setInterestRate] = useState('8.5');
  const [tenureMonths, setTenureMonths] = useState('180');
  const [manualEmi, setManualEmi] = useState('');
  const [emiDueDay, setEmiDueDay] = useState('5');
  const [startDate, setStartDate] = useState('');
  const [notes, setNotes] = useState('');

  // Multi-Member Split Form State
  // Mode: 'amount' or 'percent'
  const [splitMode, setSplitMode] = useState<'amount' | 'percent'>('amount');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    members.slice(0, 2).map(m => m.id)
  );
  const [memberAmounts, setMemberAmounts] = useState<Record<string, string>>({});
  const [memberPercents, setMemberPercents] = useState<Record<string, string>>({});

  // Interest Hike Form State
  const [newHikeRate, setNewHikeRate] = useState('');
  const [hikeEffectiveDate, setHikeEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [hikeReason, setHikeReason] = useState('RBI Repo Rate Revision / Bank MCLR Hike');

  // OTP Verification State
  const [otpVerifyMemberId, setOtpVerifyMemberId] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');

  // --- Auto Calculate EMI ---
  const calculateAutoEmi = (pVal: number, rVal: number, nVal: number) => {
    if (pVal <= 0 || rVal <= 0 || nVal <= 0) return 0;
    const monthlyRate = (rVal / 12) / 100;
    const emi = (pVal * monthlyRate * Math.pow(1 + monthlyRate, nVal)) / (Math.pow(1 + monthlyRate, nVal) - 1);
    return Math.round(emi);
  };

  const currentPrincipalNum = parseFloat(principal) || 0;
  const currentRateNum = parseFloat(interestRate) || 0;
  const currentTenureNum = parseInt(tenureMonths) || 120;
  const computedEmi = calculateAutoEmi(currentPrincipalNum, currentRateNum, currentTenureNum);
  const activeEmi = parseFloat(manualEmi) || computedEmi;

  // Overview Totals
  const activeLoans = bankLoans.filter(l => l.status === 'active');
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + Number(l.current_outstanding_principal || 0), 0);
  const totalMonthlyEmi = activeLoans.reduce((sum, l) => sum + Number(l.monthly_emi || 0), 0);

  // Member-wise Total EMI Contribution
  const memberEmiMap: Record<string, number> = {};
  activeLoans.forEach(loan => {
    loan.member_splits.forEach(split => {
      memberEmiMap[split.member_id] = (memberEmiMap[split.member_id] || 0) + Number(split.monthly_emi_share || 0);
    });
  });

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingLoan(null);
    setLoanName('');
    setBankName('');
    setLoanType('home_loan');
    setAccountNo('');
    setPrincipal('');
    setOriginalPrincipal('');
    setProcessingFee('');
    setInterestRate('8.5');
    setTenureMonths('180');
    setManualEmi('');
    setEmiDueDay('5');
    setStartDate('');
    setNotes('');

    const initialMembers = members.slice(0, 2).map(m => m.id);
    setSelectedMemberIds(initialMembers);
    setSplitMode('percent');
    if (initialMembers.length === 2) {
      setMemberPercents({ [initialMembers[0]]: '50', [initialMembers[1]]: '50' });
    } else if (initialMembers.length === 1) {
      setMemberPercents({ [initialMembers[0]]: '100' });
    }
    setMemberAmounts({});
    setIsAddOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (loan: BankLoan) => {
    setEditingLoan(loan);
    setLoanName(loan.loan_name);
    setBankName(loan.bank_name);
    setLoanType(loan.loan_type);
    setAccountNo(loan.account_no || '');
    setPrincipal(loan.current_outstanding_principal.toString());
    setOriginalPrincipal(loan.original_principal ? loan.original_principal.toString() : '');
    setProcessingFee(loan.processing_fees ? loan.processing_fees.toString() : '');
    setInterestRate(loan.annual_interest_rate.toString());
    setTenureMonths(loan.tenure_months ? loan.tenure_months.toString() : '');
    setManualEmi(loan.monthly_emi.toString());
    setEmiDueDay(loan.emi_due_day ? loan.emi_due_day.toString() : '5');
    setStartDate(loan.start_date || '');
    setNotes(loan.notes || '');

    const mIds = loan.member_splits.map(s => s.member_id);
    setSelectedMemberIds(mIds);
    setSplitMode('percent');
    const pMap: Record<string, string> = {};
    const aMap: Record<string, string> = {};
    loan.member_splits.forEach(s => {
      pMap[s.member_id] = s.share_percentage.toString();
      aMap[s.member_id] = s.share_amount ? s.share_amount.toString() : '';
    });
    setMemberPercents(pMap);
    setMemberAmounts(aMap);
    setIsAddOpen(true);
  };

  // Save Loan
  const handleSaveLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanName.trim()) return alert('Kripya loan ka naam bharein');
    if (!bankName.trim()) return alert('Bank ka naam likhein');
    const princNum = parseFloat(principal);
    if (!princNum || princNum <= 0) return alert('Bacha hua principal amount daalein');

    const emiToSave = parseFloat(manualEmi) || computedEmi;
    if (!emiToSave || emiToSave <= 0) return alert('Kripya monthly EMI check karein');

    if (selectedMemberIds.length === 0) return alert('Kam se kam ek parivar sadasya chunein jo loan chukayega');

    // Calculate splits
    const finalSplits: LoanMemberSplit[] = [];

    if (splitMode === 'percent') {
      selectedMemberIds.forEach(mId => {
        const pct = parseFloat(memberPercents[mId]) || 0;
        const mObj = members.find(m => m.id === mId);
        const emiShare = Math.round((emiToSave * pct) / 100);
        const princShare = Math.round((princNum * pct) / 100);
        // Random 6-digit OTP code for optional WhatsApp verification
        const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();

        finalSplits.push({
          member_id: mId,
          member_name: mObj?.name || 'Sadasya',
          share_percentage: pct,
          share_amount: princShare,
          monthly_emi_share: emiShare,
          otp_code: randomOtp,
          is_verified: editingLoan?.member_splits.find(s => s.member_id === mId)?.is_verified || false
        });
      });
    } else {
      // By Amount
      const totalAmountInput = selectedMemberIds.reduce(
        (sum, mId) => sum + (parseFloat(memberAmounts[mId]) || 0), 0
      );
      selectedMemberIds.forEach(mId => {
        const amt = parseFloat(memberAmounts[mId]) || 0;
        const mObj = members.find(m => m.id === mId);
        const pct = totalAmountInput > 0 ? (amt / totalAmountInput) * 100 : (100 / selectedMemberIds.length);
        const emiShare = Math.round((emiToSave * pct) / 100);
        const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();

        finalSplits.push({
          member_id: mId,
          member_name: mObj?.name || 'Sadasya',
          share_percentage: Math.round(pct * 10) / 10,
          share_amount: amt || Math.round((princNum * pct) / 100),
          monthly_emi_share: emiShare,
          otp_code: randomOtp,
          is_verified: editingLoan?.member_splits.find(s => s.member_id === mId)?.is_verified || false
        });
      });
    }

    const payload = {
      loan_name: loanName.trim(),
      bank_name: bankName.trim(),
      loan_type: loanType,
      account_no: accountNo.trim() || undefined,
      current_outstanding_principal: princNum,
      original_principal: parseFloat(originalPrincipal) || undefined,
      processing_fees: parseFloat(processingFee) || undefined,
      annual_interest_rate: parseFloat(interestRate) || 8.5,
      tenure_months: parseInt(tenureMonths) || undefined,
      monthly_emi: emiToSave,
      emi_due_day: parseInt(emiDueDay) || 5,
      start_date: startDate || undefined,
      member_splits: finalSplits,
      status: 'active' as const,
      notes: notes.trim() || undefined
    };

    if (editingLoan) {
      updateBankLoan(editingLoan.id, payload);
    } else {
      addBankLoan(payload);
    }

    setIsAddOpen(false);
  };

  // Record Interest Hike
  const handleSaveInterestHike = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hikeLoan) return;
    const rateNum = parseFloat(newHikeRate);
    if (!rateNum || rateNum <= 0) return alert('Naya byaj dar (Interest rate %) daalein');

    recordLoanInterestHike(hikeLoan.id, {
      new_rate: rateNum,
      effective_date: hikeEffectiveDate,
      reason: hikeReason.trim()
    });

    setHikeLoan(null);
    setNewHikeRate('');
  };

  // WhatsApp Share Generator
  const generateWhatsAppMessage = (loan: BankLoan) => {
    let msg = `🏦 *${loan.bank_name.toUpperCase()} - LOAN SAMJHAUTA (AGREEMENT)*\n\n`;
    msg += `📋 *Loan:* ${loan.loan_name}\n`;
    if (loan.account_no) msg += `🔢 *Account No:* ${loan.account_no}\n`;
    msg += `💰 *Outstanding Principal:* ₹${loan.current_outstanding_principal.toLocaleString('en-IN')}\n`;
    msg += `📈 *Interest Rate:* ${loan.annual_interest_rate}% p.a.\n`;
    msg += `📅 *Monthly EMI:* ₹${loan.monthly_emi.toLocaleString('en-IN')} (Har mahine ki ${loan.emi_due_day || 5} tareekh)\n\n`;
    msg += `👥 *PARIVAR SADASYA EMI HISSA (SPLIT):*\n`;

    loan.member_splits.forEach(split => {
      const mObj = members.find(m => m.id === split.member_id);
      msg += `• *${mObj?.name || 'Sadasya'}:* ${split.share_percentage}% (EMI: ₹${split.monthly_emi_share.toLocaleString('en-IN')}/mahina)`;
      if (split.otp_code) msg += ` | Verification Code: *${split.otp_code}*`;
      msg += `\n`;
    });

    msg += `\nYeh digital samjhauta parivar ke sabhi sadasyon ki sahmati se tay kiya gaya hai taaki aage chalkar koi vivad na ho.`;
    return encodeURIComponent(msg);
  };

  // Verify Member OTP
  const handleVerifyOtp = (loan: BankLoan) => {
    if (!otpVerifyMemberId) return alert('Kripya sadasya chunein');
    verifyLoanMemberOTP(loan.id, otpVerifyMemberId, enteredOtp);
    setEnteredOtp('');
    setOtpVerifyMemberId('');
    alert('✓ Sadasya ka samjhauta successfully verify ho gaya!');
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Top Navigation */}
      <div className="px-4 pt-3 flex items-center justify-between">
        <Link href="/money" className="text-xs text-ink-muted hover:text-ink flex items-center gap-1 font-semibold">
          ← Money Hub Par Wapas
        </Link>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 bg-gold text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs hover:bg-gold/90 transition-all active:scale-95"
        >
          <Plus size={14} /> + Naya / Purana Loan Jodein
        </button>
      </div>

      <ScreenHeader
        title="Bank Loans & Multi-Member Split"
        subtitle="Home, Car, Personal loans ko track karein aur sadasyon me EMI baantein"
      />

      {/* Top Summary Cards */}
      <div className="px-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-xs">
          <span className="text-[10px] uppercase font-bold text-ink-muted block">Kul Outstanding Karz</span>
          <Mono className="text-base font-bold text-coral mt-0.5 block">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </Mono>
          <span className="text-[10px] text-ink-muted">{activeLoans.length} Active Bank Loans</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-xs">
          <span className="text-[10px] uppercase font-bold text-ink-muted block">Kul Monthly EMI</span>
          <Mono className="text-base font-bold text-indigo-900 mt-0.5 block">
            ₹{totalMonthlyEmi.toLocaleString('en-IN')}
          </Mono>
          <span className="text-[10px] text-ink-muted">Har mahine parivar dwara deya</span>
        </div>

        <div className="col-span-2 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 via-paper to-amber-50 border border-indigo-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-900 tracking-wider">Multi-Member Split System</span>
            <p className="text-xs font-bold text-ink mt-0.5">
              Interest rate badhne par sabhi members ki EMI usi anupaat me auto-adjust hoti hai!
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Calculator size={18} />
          </div>
        </div>
      </div>

      {/* Member-Wise Total EMI Responsibility Card */}
      {Object.keys(memberEmiMap).length > 0 && (
        <div className="px-4">
          <div className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-xs space-y-2.5">
            <h4 className="text-xs font-bold text-ink flex items-center gap-1.5 uppercase tracking-wider">
              <span>👥</span> Sadasya-Wise Monthly EMI Zimme-dari:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {Object.entries(memberEmiMap).map(([mId, emiAmount]) => {
                const member = members.find(m => m.id === mId);
                const percentShare = totalMonthlyEmi > 0 ? Math.round((emiAmount / totalMonthlyEmi) * 100) : 0;

                return (
                  <div key={mId} className="p-3 rounded-xl bg-paper-dim/60 border border-paper-dim flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar m={member} size={34} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-ink truncate">{member?.name || 'Sadasya'}</p>
                        <p className="text-[10px] text-ink-muted truncate">{member?.relationship || 'Member'}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Mono className="text-xs font-bold text-indigo-900 block">
                        ₹{emiAmount.toLocaleString('en-IN')}
                      </Mono>
                      <span className="text-[10px] font-semibold text-gold-dark">{percentShare}% Hissa</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LOANS LIST */}
      <div className="px-4 space-y-3">
        {activeLoans.length === 0 ? (
          <div className="p-8 text-center bg-paper rounded-3xl border border-paper-dim space-y-3">
            <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
              <Landmark size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Abhi koi Bank Loan darj nahi hai</h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Aap naya ya purana chal raha Home/Car/Personal loan yahan add karke sadasyon me split kar sakte hain.
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-gold text-white rounded-xl text-xs font-bold shadow-xs hover:bg-gold/90"
            >
              + Pehla Bank Loan Jodein
            </button>
          </div>
        ) : (
          activeLoans.map(loan => (
            <div
              key={loan.id}
              className="p-4 sm:p-5 rounded-3xl bg-paper border border-paper-dim shadow-xs hover:border-gold/50 transition-all space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-dim pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                    <Landmark size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-ink">{loan.loan_name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 uppercase">
                        {loan.bank_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-ink-muted mt-0.5 flex-wrap">
                      <span>{LOAN_TYPES.find(t => t.type === loan.loan_type)?.label || 'Bank Loan'}</span>
                      {loan.account_no && <span>• A/c: {loan.account_no}</span>}
                      {loan.start_date && <span>• Shuruat: {loan.start_date}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenEdit(loan)}
                    className="w-8 h-8 rounded-lg bg-paper-dim hover:bg-gold/20 text-ink-muted hover:text-gold flex items-center justify-center transition-all"
                    title="Edit Loan"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => setLoanToDelete(loan)}
                    className="w-8 h-8 rounded-lg bg-paper-dim hover:bg-rose-100 text-ink-muted hover:text-rose-600 flex items-center justify-center transition-all"
                    title="Delete Loan"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Loan Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-paper-dim/40 p-3 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">Bacha Hua Principal</span>
                  <Mono className="text-sm font-bold text-coral">
                    ₹{loan.current_outstanding_principal.toLocaleString('en-IN')}
                  </Mono>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">Monthly EMI</span>
                  <Mono className="text-sm font-bold text-indigo-900">
                    ₹{loan.monthly_emi.toLocaleString('en-IN')}
                  </Mono>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">Byaj Dar (Interest)</span>
                  <span className="text-sm font-bold text-ink">
                    {loan.annual_interest_rate}% p.a.
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">EMI Ki Tareekh</span>
                  <span className="text-xs font-semibold text-ink">
                    Har mahine ki {loan.emi_due_day || 5} tareekh
                  </span>
                </div>
              </div>

              {/* Multi-Member Split Responsibility */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink flex items-center gap-1">
                    <span>🤝</span> Sadasyon Me EMI Ka Hissa:
                  </span>
                  <span className="text-[10px] text-ink-muted">
                    {loan.member_splits.length} Sadasya Sahbhagi
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {loan.member_splits.map(split => {
                    const member = members.find(m => m.id === split.member_id);
                    return (
                      <div
                        key={split.member_id}
                        className="p-2.5 rounded-xl bg-paper border border-paper-dim flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar m={member} size={30} />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-ink truncate">{member?.name || 'Sadasya'}</p>
                            <span className="text-[10px] font-semibold text-gold-dark">
                              {split.share_percentage}% hissa
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <Mono className="text-xs font-bold text-indigo-900 block">
                            ₹{split.monthly_emi_share.toLocaleString('en-IN')}/mahina
                          </Mono>
                          {split.is_verified ? (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 inline-flex items-center gap-0.5">
                              <CheckCircle2 size={10} /> Verified
                            </span>
                          ) : (
                            <span className="text-[9px] text-ink-muted/80">
                              Samjhauta Active
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Floating Rate Hike Revision History (if any) */}
              {loan.interest_revisions && loan.interest_revisions.length > 0 && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-amber-900 block">
                    📈 Byaj Dar Badhotari (Interest Hike History):
                  </span>
                  {loan.interest_revisions.map(rev => (
                    <div key={rev.id} className="flex items-center justify-between text-ink-muted">
                      <span>{rev.revision_date}: {rev.old_rate}% ➔ <strong>{rev.new_rate}%</strong> ({rev.reason || 'Hike'})</span>
                      <span className="font-bold text-ink">New EMI: ₹{rev.new_emi.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons: Interest Hike Revision + WhatsApp Share & OTP */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setHikeLoan(loan);
                    setNewHikeRate(loan.annual_interest_rate.toString());
                  }}
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <TrendingUp size={13} className="text-amber-700" /> Byaj Dar Badha (Interest Hike)
                </button>

                <button
                  type="button"
                  onClick={() => setWhatsappLoan(loan)}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Share2 size={13} className="text-emerald-600" /> WhatsApp Samjhauta &amp; OTP
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================= */}
      {/* ADD / EDIT LOAN MODAL                                     */}
      {/* ========================================================= */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-lg bg-paper rounded-t-3xl sm:rounded-2xl border border-paper-dim shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <Landmark size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    {editingLoan ? 'Bank Loan Edit Karein' : 'Naya / Purana Bank Loan Jodein'}
                  </h3>
                  <p className="text-[11px] text-ink-muted">Home, Car ya Personal loan ko sadasyon me split karein</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 rounded-full bg-paper-dim flex items-center justify-center text-ink-muted hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveLoan} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-ink-muted mb-1">
                    Loan Ka Naam <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={loanName}
                    onChange={e => setLoanName(e.target.value)}
                    placeholder="Jaise: SBI Home Loan (Ghar)"
                    className="w-full px-3 py-2 bg-paper-dim border border-paper-dim rounded-xl text-sm text-ink focus:outline-none focus:border-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink-muted mb-1">
                    Bank Ka Naam <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    placeholder="Jaise: SBI, HDFC, ICICI, PNB"
                    className="w-full px-3 py-2 bg-paper-dim border border-paper-dim rounded-xl text-sm text-ink focus:outline-none focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-ink-muted mb-1">
                    Loan Ka Type
                  </label>
                  <select
                    value={loanType}
                    onChange={e => setLoanType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-paper-dim border border-paper-dim rounded-xl text-xs text-ink focus:outline-none focus:border-gold"
                  >
                    {LOAN_TYPES.map(t => (
                      <option key={t.type} value={t.type}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-ink-muted mb-1">
                    Loan Account Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={accountNo}
                    onChange={e => setAccountNo(e.target.value)}
                    placeholder="Optional: 123456789"
                    className="w-full px-3 py-2 bg-paper-dim border border-paper-dim rounded-xl text-sm text-ink focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Principal & Interest Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-paper-dim/40 p-3 rounded-2xl">
                <div>
                  <label className="block font-semibold text-ink-muted mb-1">
                    Bacha Hua Principal (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={principal}
                    onChange={e => setPrincipal(e.target.value)}
                    placeholder="2500000"
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-mono font-bold text-sm text-coral"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink-muted mb-1">
                    Byaj Dar (% p.a.) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={e => setInterestRate(e.target.value)}
                    placeholder="8.5"
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-mono font-bold text-sm text-ink"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink-muted mb-1">
                    Tenure (Mahine)
                  </label>
                  <input
                    type="number"
                    value={tenureMonths}
                    onChange={e => setTenureMonths(e.target.value)}
                    placeholder="180"
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-mono font-bold text-sm text-ink"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink-muted mb-1">
                    Original Loan (Optional)
                  </label>
                  <input
                    type="number"
                    value={originalPrincipal}
                    onChange={e => setOriginalPrincipal(e.target.value)}
                    placeholder="Purana liya hua amount"
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-mono text-xs text-ink"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink-muted mb-1">
                    Processing Fees (Optional)
                  </label>
                  <input
                    type="number"
                    value={processingFee}
                    onChange={e => setProcessingFee(e.target.value)}
                    placeholder="Net fee"
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-mono text-xs text-ink"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink-muted mb-1">
                    EMI Ki Tareekh
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={emiDueDay}
                    onChange={e => setEmiDueDay(e.target.value)}
                    placeholder="5"
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-mono text-xs text-ink"
                  />
                </div>
              </div>

              {/* Monthly EMI Auto / Manual override */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-900 block">Monthly EMI</span>
                  <span className="text-xs text-ink-muted">
                    Auto-calculated: ₹{computedEmi.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="w-36">
                  <input
                    type="number"
                    value={manualEmi || (computedEmi > 0 ? computedEmi.toString() : '')}
                    onChange={e => setManualEmi(e.target.value)}
                    placeholder="EMI Amount"
                    className="w-full px-2.5 py-1.5 bg-paper rounded-xl border border-indigo-300 font-mono font-bold text-sm text-indigo-900 text-right"
                  />
                </div>
              </div>

              {/* MULTI-MEMBER SPLIT SECTION */}
              <div className="p-3.5 bg-paper rounded-2xl border border-paper-dim space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                      👥 Loan Split: Sadasyon Ka Hissa
                    </h4>
                    <p className="text-[10px] text-ink-muted">
                      Aap amount (₹) ya percentage (%) dono me se jo chahein daal sakte hain
                    </p>
                  </div>

                  <div className="flex gap-1 bg-paper-dim p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setSplitMode('percent')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        splitMode === 'percent' ? 'bg-navy text-paper' : 'text-ink-muted'
                      }`}
                    >
                      Percent (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSplitMode('amount')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        splitMode === 'amount' ? 'bg-navy text-paper' : 'text-ink-muted'
                      }`}
                    >
                      Amount (₹)
                    </button>
                  </div>
                </div>

                {/* Member Selection Checkboxes */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {members.map(m => {
                    const isSelected = selectedMemberIds.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            if (selectedMemberIds.length > 1) {
                              setSelectedMemberIds(selectedMemberIds.filter(id => id !== m.id));
                            }
                          } else {
                            setSelectedMemberIds([...selectedMemberIds, m.id]);
                          }
                        }}
                        className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-paper-dim text-ink-muted border-paper-dim hover:border-gold'
                        }`}
                      >
                        <Avatar m={m} size={20} />
                        <span>{m.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Member Split Inputs */}
                <div className="space-y-2 pt-2 border-t border-paper-dim">
                  {selectedMemberIds.map(mId => {
                    const mObj = members.find(m => m.id === mId);
                    const currentPct = parseFloat(memberPercents[mId]) || 0;
                    const estimatedMemberEmi = activeEmi > 0 ? Math.round((activeEmi * currentPct) / 100) : 0;

                    return (
                      <div key={mId} className="flex items-center justify-between gap-2 p-2 bg-paper-dim/40 rounded-xl">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Avatar m={mObj} size={26} />
                          <span className="text-xs font-bold text-ink truncate">{mObj?.name || 'Sadasya'}</span>
                        </div>

                        {splitMode === 'percent' ? (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <input
                              type="number"
                              value={memberPercents[mId] || ''}
                              onChange={e => setMemberPercents({ ...memberPercents, [mId]: e.target.value })}
                              placeholder="50"
                              className="w-16 px-2 py-1 bg-paper border border-paper-dim rounded-lg font-mono font-bold text-xs text-right"
                            />
                            <span className="text-xs font-bold text-ink-muted">%</span>
                            <span className="text-[10px] text-indigo-900 font-bold ml-1">
                              (EMI: ₹{estimatedMemberEmi.toLocaleString('en-IN')})
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs font-bold text-ink-muted">₹</span>
                            <input
                              type="number"
                              value={memberAmounts[mId] || ''}
                              onChange={e => setMemberAmounts({ ...memberAmounts, [mId]: e.target.value })}
                              placeholder="1250000"
                              className="w-28 px-2 py-1 bg-paper border border-paper-dim rounded-lg font-mono font-bold text-xs text-right"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-3 border border-paper-dim rounded-xl text-xs font-semibold text-ink-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gold text-white rounded-xl text-xs font-bold shadow-xs hover:bg-gold/90 transition-all"
                >
                  {editingLoan ? '✓ Update Loan' : '✓ Save Bank Loan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* INTEREST HIKE MODAL (AUTO RE-CALCULATE RATIOS)             */}
      {/* ========================================================= */}
      {hikeLoan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-paper rounded-2xl border border-paper-dim shadow-2xl p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">Interest Rate Hike (Byaj Badha)</h3>
                  <p className="text-[10px] text-ink-muted">{hikeLoan.loan_name}</p>
                </div>
              </div>
              <button onClick={() => setHikeLoan(null)} className="w-7 h-7 rounded-full bg-paper-dim flex items-center justify-center">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveInterestHike} className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                <div className="flex justify-between">
                  <span>Purana Byaj Dar:</span>
                  <strong>{hikeLoan.annual_interest_rate}% p.a.</strong>
                </div>
                <div className="flex justify-between">
                  <span>Purani Monthly EMI:</span>
                  <strong>₹{hikeLoan.monthly_emi.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-ink-muted mb-1">
                  Naya Interest Rate (% p.a.) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newHikeRate}
                  onChange={e => setNewHikeRate(e.target.value)}
                  placeholder="Jaise: 9.15"
                  className="w-full px-3 py-2 bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold text-sm text-ink"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-muted mb-1">
                  Kis Tareekh Se Lagu Hua
                </label>
                <input
                  type="date"
                  value={hikeEffectiveDate}
                  onChange={e => setHikeEffectiveDate(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim border border-paper-dim rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-muted mb-1">
                  Wajah (Reason)
                </label>
                <input
                  type="text"
                  value={hikeReason}
                  onChange={e => setHikeReason(e.target.value)}
                  placeholder="RBI Repo Rate Hike / MCLR Reset"
                  className="w-full px-3 py-2 bg-paper-dim border border-paper-dim rounded-xl text-xs"
                />
              </div>

              <div className="p-3 bg-paper-dim/60 rounded-xl text-[11px] text-ink-muted">
                💡 Naya rate aate hi EMI calculate hogi aur sabhi participating sadasyon ke purane hisse (ratio) me barabar auto-distribute ho jayegi!
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setHikeLoan(null)}
                  className="flex-1 py-2.5 border border-paper-dim rounded-xl text-xs font-semibold text-ink-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-all"
                >
                  ✓ Update &amp; Re-Distribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* WHATSAPP AGREEMENT & OPTIONAL OTP VERIFICATION MODAL       */}
      {/* ========================================================= */}
      {whatsappLoan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-paper rounded-2xl border border-paper-dim shadow-2xl p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Share2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">WhatsApp Samjhauta &amp; OTP</h3>
                  <p className="text-[10px] text-ink-muted">{whatsappLoan.loan_name}</p>
                </div>
              </div>
              <button onClick={() => setWhatsappLoan(null)} className="w-7 h-7 rounded-full bg-paper-dim flex items-center justify-center">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-ink-muted">
                Aap is loan ke hisab aur har sadasya ki EMI responsibility ka message WhatsApp par share kar sakte hain:
              </p>

              {/* 1-Click WhatsApp Button */}
              <a
                href={`https://wa.me/?text=${generateWhatsAppMessage(whatsappLoan)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <MessageCircle size={15} /> WhatsApp Par Samjhauta Bhejo
              </a>

              {/* OTP Verification Section (Optional) */}
              <div className="p-3.5 bg-paper-dim/60 rounded-2xl border border-paper-dim space-y-2.5 pt-3">
                <span className="text-[10px] uppercase font-bold text-ink-muted block">
                  Optional: Member OTP Verification
                </span>
                <p className="text-[11px] text-ink-muted">
                  Sadasya dwara WhatsApp par bheja gaya verification code daalkar samjhauta verify mark karein:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={otpVerifyMemberId}
                    onChange={e => setOtpVerifyMemberId(e.target.value)}
                    className="px-2 py-1.5 bg-paper rounded-xl border border-paper-dim text-xs text-ink"
                  >
                    <option value="">— Sadasya Chunen —</option>
                    {whatsappLoan.member_splits.map(s => {
                      const mObj = members.find(m => m.id === s.member_id);
                      return (
                        <option key={s.member_id} value={s.member_id}>
                          {mObj?.name} {s.is_verified ? '(Verified)' : ''}
                        </option>
                      );
                    })}
                  </select>

                  <input
                    type="text"
                    value={enteredOtp}
                    onChange={e => setEnteredOtp(e.target.value)}
                    placeholder="6-digit Code"
                    className="px-2 py-1.5 bg-paper rounded-xl border border-paper-dim text-xs font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleVerifyOtp(whatsappLoan)}
                  className="w-full py-2 bg-navy text-paper rounded-xl font-bold text-xs hover:bg-navy-light"
                >
                  ✓ Verify Member Agreement
                </button>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setWhatsappLoan(null)}
                  className="px-4 py-2 border border-paper-dim rounded-xl text-xs font-semibold text-ink-muted"
                >
                  Band Karein
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE LOAN CONFIRMATION                                  */}
      {/* ========================================================= */}
      {loanToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-paper rounded-2xl border border-paper-dim shadow-2xl p-5 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-ink">Bank Loan Hatayein?</h3>
              <p className="text-xs text-ink-muted">
                Kya aap sach me <strong>{loanToDelete.loan_name}</strong> ({loanToDelete.bank_name}) ko hatana chahte hain?
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLoanToDelete(null)}
                className="flex-1 py-2.5 border border-paper-dim rounded-xl text-xs font-semibold text-ink-muted"
              >
                Raho Do
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteBankLoan(loanToDelete.id);
                  setLoanToDelete(null);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                ✓ Haan, Hatayein
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
