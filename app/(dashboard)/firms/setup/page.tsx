'use client';

import React, { useState, useMemo } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import {
  BusinessSetupProject, ProjectFundingSource, PreOpExpense,
  ProjectRepayment, PreOpExpenseCategory, FundingSourceType
} from '@/types';
import {
  Building2, Plus, Landmark, Wallet, ShieldCheck, DollarSign,
  PieChart, ArrowRightLeft, FileSpreadsheet, CheckCircle2,
  AlertCircle, Share2, Calendar, Lock, Layers, Receipt,
  Sparkles, Trash2, ArrowUpRight, ArrowDownLeft, FileText,
  BadgeCheck, Clock, RefreshCw, Briefcase, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function BusinessSetupPage() {
  const {
    businessSetupProjects,
    businessFirms,
    addSetupProject,
    updateSetupProject,
    deleteSetupProject,
    addProjectFundingSource,
    addDisbursalTranche,
    addPreOpExpense,
    deletePreOpExpense,
    recordProjectRepayment,
    capitalizeProjectToFirm,
    closeSetupProject
  } = useFamilyStore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(businessSetupProjects[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'expenses' | 'funding' | 'analytics' | 'capitalize' | 'repayments'>('expenses');

  // Modals
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [isAddTrancheOpen, setIsAddTrancheOpen] = useState(false);
  const [selectedSourceForTranche, setSelectedSourceForTranche] = useState<string>('');
  const [isCapitalizeModalOpen, setIsCapitalizeModalOpen] = useState(false);
  const [isCloseProjectOpen, setIsCloseProjectOpen] = useState(false);
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // New Project Form
  const [newProjectName, setNewProjectName] = useState('');
  const [newBusinessType, setNewBusinessType] = useState('');
  const [newTargetLaunchDate, setNewTargetLaunchDate] = useState(new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]);
  const [newProjectNotes, setNewProjectNotes] = useState('');

  // New Expense Form
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState<number | ''>('');
  const [expCategory, setExpCategory] = useState<PreOpExpenseCategory>('interior_furniture');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [expSourceId, setExpSourceId] = useState('');
  const [expVendor, setExpVendor] = useState('');
  const [expGstAmount, setExpGstAmount] = useState<number | ''>('');
  const [expInvoiceNo, setExpInvoiceNo] = useState('');
  const [expIsFixedAsset, setExpIsFixedAsset] = useState(true);
  const [expNotes, setExpNotes] = useState('');

  // New Funding Source Form
  const [sourceType, setSourceType] = useState<FundingSourceType>('bank_term_loan');
  const [providerName, setProviderName] = useState('');
  const [sanctionedAmount, setSanctionedAmount] = useState<number | ''>('');
  const [initialDisbursed, setInitialDisbursed] = useState<number | ''>('');
  const [interestRate, setInterestRate] = useState<number | ''>(9.0);
  const [chargeInterest, setChargeInterest] = useState(true);
  const [processingFees, setProcessingFees] = useState<number | ''>('');
  const [bankCharges, setBankCharges] = useState<number | ''>('');
  const [isPledged, setIsPledged] = useState(false);
  const [collateralType, setCollateralType] = useState<'real_estate_property' | 'fixed_deposit_lien' | 'gold_pledge' | 'machinery_hypothecation' | 'personal_guarantee' | 'other'>('real_estate_property');
  const [collateralTitle, setCollateralTitle] = useState('');
  const [collateralValuation, setCollateralValuation] = useState<number | ''>('');
  const [collateralCustody, setCollateralCustody] = useState('');
  const [sourceNotes, setSourceNotes] = useState('');

  // New Tranche Form
  const [trancheAmount, setTrancheAmount] = useState<number | ''>('');
  const [trancheDate, setTrancheDate] = useState(new Date().toISOString().split('T')[0]);
  const [trancheNotes, setTrancheNotes] = useState('');

  // Capitalize Form
  const [targetFirmId, setTargetFirmId] = useState(businessFirms[0]?.id || '');
  const [capitalizeClosingNotes, setCapitalizeClosingNotes] = useState('');

  // Close Project Form
  const [closingNoteText, setClosingNoteText] = useState('');

  // Repayment Form
  const [repaySourceId, setRepaySourceId] = useState('');
  const [repayAmount, setRepayAmount] = useState<number | ''>('');
  const [repayPrincipal, setRepayPrincipal] = useState<number | ''>('');
  const [repayInterest, setRepayInterest] = useState<number | ''>('');
  const [repayMode, setRepayMode] = useState<'bank' | 'upi' | 'cash'>('bank');
  const [repayDate, setRepayDate] = useState(new Date().toISOString().split('T')[0]);
  const [repayNotes, setRepayNotes] = useState('');

  // Active Project resolution
  const activeProject = useMemo(() => {
    if (!businessSetupProjects.length) return null;
    const found = businessSetupProjects.find(p => p.id === selectedProjectId);
    return found || businessSetupProjects[0];
  }, [businessSetupProjects, selectedProjectId]);

  // Project Metrics & Source Breakdown Calculations
  const metrics = useMemo(() => {
    if (!activeProject) {
      return {
        totalPreOpSpent: 0,
        fixedAssetsTotal: 0,
        preOp35DTotal: 0,
        totalSanctioned: 0,
        totalDisbursed: 0,
        selfSavingsTotal: 0,
        bankLoanTotal: 0,
        privateNbfcTotal: 0,
        friendsFamilyTotal: 0,
        otherSourcesTotal: 0,
        totalProcessingFees: 0,
        totalAccruedPreOpInterest: 0,
        totalPledgedCollateralValue: 0,
        totalRepaid: 0,
        netFundingBalance: 0
      };
    }

    const expenses = activeProject.expenses || [];
    const sources = activeProject.funding_sources || [];
    const repayments = activeProject.repayments || [];

    const totalPreOpSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const fixedAssetsTotal = expenses.filter(e => e.is_fixed_asset).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const preOp35DTotal = expenses.filter(e => !e.is_fixed_asset).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const totalSanctioned = sources.reduce((sum, s) => sum + (Number(s.sanctioned_amount) || 0), 0);
    const totalDisbursed = sources.reduce((sum, s) => sum + (Number(s.disbursed_amount) || 0), 0);

    const selfSavingsTotal = sources.filter(s => s.source_type === 'self_savings').reduce((sum, s) => sum + (Number(s.disbursed_amount) || 0), 0);
    const bankLoanTotal = sources.filter(s => s.source_type === 'bank_term_loan').reduce((sum, s) => sum + (Number(s.disbursed_amount) || 0), 0);
    const privateNbfcTotal = sources.filter(s => s.source_type === 'private_bank_nbfc').reduce((sum, s) => sum + (Number(s.disbursed_amount) || 0), 0);
    const friendsFamilyTotal = sources.filter(s => s.source_type === 'friends_family_debt').reduce((sum, s) => sum + (Number(s.disbursed_amount) || 0), 0);
    const otherSourcesTotal = sources.filter(s => s.source_type === 'investor_seed_equity' || s.source_type === 'other_source').reduce((sum, s) => sum + (Number(s.disbursed_amount) || 0), 0);

    const totalProcessingFees = sources.reduce((sum, s) => sum + (Number(s.processing_fees) || 0) + (Number(s.documentation_bank_charges) || 0), 0);

    const totalPledgedCollateralValue = sources
      .filter(s => s.collateral?.is_pledged)
      .reduce((sum, s) => sum + (Number(s.collateral?.estimated_valuation) || 0), 0);

    // Calculate Interest from Tranche Disbursal Date up to Target Launch Date (IDC)
    let totalAccruedPreOpInterest = 0;
    const launchDateObj = new Date(activeProject.actual_launch_date || activeProject.target_launch_date || new Date().toISOString().split('T')[0]);

    sources.forEach(s => {
      if (s.charge_interest && s.interest_rate_annual > 0) {
        (s.tranches || []).forEach(tr => {
          const trancheDateObj = new Date(tr.disbursal_date);
          const diffDays = Math.max(0, Math.round((launchDateObj.getTime() - trancheDateObj.getTime()) / (1000 * 60 * 60 * 24)));
          const trancheInterest = (Number(tr.amount) * (s.interest_rate_annual / 100) * (diffDays / 365));
          totalAccruedPreOpInterest += trancheInterest;
        });
      }
    });

    const totalRepaid = repayments.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
    const netFundingBalance = Math.max(0, totalDisbursed - totalPreOpSpent - totalProcessingFees);

    return {
      totalPreOpSpent,
      fixedAssetsTotal,
      preOp35DTotal,
      totalSanctioned,
      totalDisbursed,
      selfSavingsTotal,
      bankLoanTotal,
      privateNbfcTotal,
      friendsFamilyTotal,
      otherSourcesTotal,
      totalProcessingFees,
      totalAccruedPreOpInterest: Math.round(totalAccruedPreOpInterest),
      totalPledgedCollateralValue,
      totalRepaid,
      netFundingBalance
    };
  }, [activeProject]);

  // Handlers
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    addSetupProject({
      project_name: newProjectName.trim(),
      business_type: newBusinessType.trim() || 'New Business Inception',
      target_launch_date: newTargetLaunchDate,
      status: 'setup_in_progress',
      notes: newProjectNotes
    });

    setIsAddProjectOpen(false);
    setNewProjectName('');
    setNewBusinessType('');
    setNewProjectNotes('');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !expTitle.trim() || !expAmount) return;

    const source = activeProject.funding_sources.find(s => s.id === expSourceId);

    addPreOpExpense(activeProject.id, {
      title: expTitle.trim(),
      amount: Number(expAmount),
      category: expCategory,
      date: expDate,
      funding_source_id: expSourceId || undefined,
      funding_source_name: source ? source.provider_name : 'Direct Cash / Mixed',
      vendor_name: expVendor.trim() || undefined,
      gst_amount: expGstAmount ? Number(expGstAmount) : 0,
      invoice_no: expInvoiceNo.trim() || undefined,
      is_fixed_asset: expIsFixedAsset,
      notes: expNotes
    });

    setIsAddExpenseOpen(false);
    setExpTitle('');
    setExpAmount('');
    setExpVendor('');
    setExpGstAmount('');
    setExpInvoiceNo('');
    setExpNotes('');
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !providerName.trim() || !sanctionedAmount) return;

    const sanctioned = Number(sanctionedAmount);
    const disbursed = initialDisbursed !== '' ? Number(initialDisbursed) : sanctioned;

    addProjectFundingSource(activeProject.id, {
      source_type: sourceType,
      provider_name: providerName.trim(),
      sanctioned_amount: sanctioned,
      disbursed_amount: disbursed,
      interest_rate_annual: chargeInterest ? Number(interestRate) : 0,
      charge_interest: chargeInterest,
      processing_fees: processingFees ? Number(processingFees) : 0,
      documentation_bank_charges: bankCharges ? Number(bankCharges) : 0,
      collateral: {
        is_pledged: isPledged,
        asset_type: isPledged ? collateralType : undefined,
        title: isPledged ? collateralTitle : undefined,
        estimated_valuation: isPledged && collateralValuation ? Number(collateralValuation) : undefined,
        bank_charge_status: isPledged ? 'equitable_mortgage' : undefined,
        safe_custody_notes: isPledged ? collateralCustody : undefined
      },
      notes: sourceNotes
    });

    setIsAddSourceOpen(false);
    setProviderName('');
    setSanctionedAmount('');
    setInitialDisbursed('');
    setSourceNotes('');
    setIsPledged(false);
    setCollateralTitle('');
    setCollateralValuation('');
  };

  const handleAddTranche = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !selectedSourceForTranche || !trancheAmount) return;

    const source = activeProject.funding_sources.find(s => s.id === selectedSourceForTranche);
    const nextTrancheNo = (source?.tranches?.length || 0) + 1;

    addDisbursalTranche(activeProject.id, selectedSourceForTranche, {
      tranche_no: nextTrancheNo,
      amount: Number(trancheAmount),
      disbursal_date: trancheDate,
      notes: trancheNotes
    });

    setIsAddTrancheOpen(false);
    setTrancheAmount('');
    setTrancheNotes('');
  };

  const handleCapitalizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !targetFirmId) return;

    capitalizeProjectToFirm(activeProject.id, targetFirmId, capitalizeClosingNotes);
    setIsCapitalizeModalOpen(false);
    alert('🎉 Mubarak! Business Setup safalta-purvak Firm Capital Account me capitalize ho gaya hai!');
  };

  const handleCloseProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    closeSetupProject(activeProject.id, closingNoteText);
    setIsCloseProjectOpen(false);
    setClosingNoteText('');
  };

  const handleRepaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !repaySourceId || !repayAmount) return;

    const source = activeProject.funding_sources.find(s => s.id === repaySourceId);
    const amt = Number(repayAmount);
    const princ = repayPrincipal !== '' ? Number(repayPrincipal) : amt;
    const intr = repayInterest !== '' ? Number(repayInterest) : 0;

    recordProjectRepayment(activeProject.id, {
      funding_source_id: repaySourceId,
      funding_source_name: source?.provider_name || 'Funding Source',
      amount: amt,
      repayment_date: repayDate,
      payment_mode: repayMode,
      principal_portion: princ,
      interest_portion: intr,
      notes: repayNotes
    });

    setIsRepayModalOpen(false);
    setRepayAmount('');
    setRepayPrincipal('');
    setRepayInterest('');
    setRepayNotes('');
  };

  const generateWhatsAppSummary = () => {
    if (!activeProject) return '';

    let text = `🏛️ *BUSINESS SETUP & PRE-OPERATIVE CAPEX REPORT*\n`;
    text += `🏢 Project: *${activeProject.project_name.toUpperCase()}*\n`;
    text += `📋 Category: ${activeProject.business_type}\n`;
    text += `📅 Target Launch Date: ${activeProject.target_launch_date}\n`;
    text += `🚦 Status: ${activeProject.status.toUpperCase()}\n`;
    text += `---------------------------------\n`;
    text += `💰 *TOTAL SETUP INCEPTION COST: ₹${metrics.totalPreOpSpent.toLocaleString('en-IN')}*\n`;
    text += `   • Fixed Assets (Furniture/Machinery/Tech): ₹${metrics.fixedAssetsTotal.toLocaleString('en-IN')}\n`;
    text += `   • Pre-Op Preliminary Exp (Sec 35D): ₹${metrics.preOp35DTotal.toLocaleString('en-IN')}\n`;
    text += `   • Bank Processing & Doc Fees: ₹${metrics.totalProcessingFees.toLocaleString('en-IN')}\n`;
    text += `   • Pre-Launch Accrued Interest (IDC): ₹${metrics.totalAccruedPreOpInterest.toLocaleString('en-IN')}\n`;
    text += `---------------------------------\n`;
    text += `🏦 *FUNDING & FINANCING BREAKDOWN:*\n`;
    text += `   • 💵 Khud Ki Savings (Promoter Equity): ₹${metrics.selfSavingsTotal.toLocaleString('en-IN')} (${metrics.totalDisbursed > 0 ? Math.round((metrics.selfSavingsTotal / metrics.totalDisbursed) * 100) : 0}%)\n`;
    text += `   • 🏛️ Bank Term Loan: ₹${metrics.bankLoanTotal.toLocaleString('en-IN')} (${metrics.totalDisbursed > 0 ? Math.round((metrics.bankLoanTotal / metrics.totalDisbursed) * 100) : 0}%)\n`;
    if (metrics.privateNbfcTotal > 0) {
      text += `   • 🏢 Private Bank / NBFC: ₹${metrics.privateNbfcTotal.toLocaleString('en-IN')}\n`;
    }
    if (metrics.friendsFamilyTotal > 0) {
      text += `   • 🤝 Dost / Family Udhar: ₹${metrics.friendsFamilyTotal.toLocaleString('en-IN')}\n`;
    }
    if (metrics.totalPledgedCollateralValue > 0) {
      text += `---------------------------------\n`;
      text += `🔐 *GIRVI / COLLATERAL SECURITY PLEDGED:*\n`;
      text += `   • Total Pledged Valuation: ₹${metrics.totalPledgedCollateralValue.toLocaleString('en-IN')}\n`;
      activeProject.funding_sources.filter(s => s.collateral?.is_pledged).forEach(s => {
        text += `   • ${s.collateral.title} (Valuation: ₹${s.collateral.estimated_valuation?.toLocaleString('en-IN')}) with ${s.provider_name}\n`;
      });
    }
    text += `\n_Generated via Parivar SuperApp Business CapEx Engine_ ✨`;
    return text;
  };

  const handleCopySummary = () => {
    const text = generateWhatsAppSummary();
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppSummary());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-24 font-sans max-w-7xl mx-auto px-2 sm:px-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Business Pre-Operative CapEx & Setup Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              🏛️ Naya Business Setup & Pre-Launch Kharcha Hub
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Day 0 se launch date tak aane wale sabhi pre-operative kharche (GST, Furniture, IT, Machinery, Security Deposit), Tranche-wise Bank Loans, Girvi Collateral aur 1-Click Capital Account Transfer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/firms"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-gold" /> Registered Firms
            </Link>
            <button
              onClick={() => setIsAddProjectOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Naya Setup Project
            </button>
          </div>
        </div>

        {/* Project Switcher Bar */}
        {businessSetupProjects.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Projects:</span>
            {businessSetupProjects.map(p => {
              const isSelected = activeProject?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>{p.project_name}</span>
                  <span className="text-[10px] opacity-75 font-mono">({p.status})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {!activeProject ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 p-8 space-y-4">
          <Building2 className="w-16 h-16 text-indigo-400 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold text-white">Koi Business Setup Project Nahi Hai</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Aapne abhi tak koi naya business pre-operative project add nahi kiya hai. Pehla setup shuru karein!
          </p>
          <button
            onClick={() => setIsAddProjectOpen(true)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Naya Setup Project Banayein
          </button>
        </div>
      ) : (
        <>
          {/* KPI Snapshot Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. Total Pre-Op Spent */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>Kul Setup Kharcha (CapEx)</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                ₹{metrics.totalPreOpSpent.toLocaleString('en-IN')}
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Fixed Assets: <strong className="text-emerald-400">₹{metrics.fixedAssetsTotal.toLocaleString('en-IN')}</strong> · Pre-Op: ₹{metrics.preOp35DTotal.toLocaleString('en-IN')}
              </div>
            </div>

            {/* 2. Total Disbursed Financing */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>Total Funds Disbursed</span>
                <Wallet className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-indigo-400">
                ₹{metrics.totalDisbursed.toLocaleString('en-IN')}
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Sanctioned: ₹{metrics.totalSanctioned.toLocaleString('en-IN')}
              </div>
            </div>

            {/* 3. Own Savings vs Debt Mix */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>Khud Ka Paisa vs Loan</span>
                <PieChart className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-400">
                {metrics.totalDisbursed > 0 ? `${Math.round((metrics.selfSavingsTotal / metrics.totalDisbursed) * 100)}% Equity` : '0%'}
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Own: ₹{metrics.selfSavingsTotal.toLocaleString('en-IN')} | Bank: ₹{metrics.bankLoanTotal.toLocaleString('en-IN')}
              </div>
            </div>

            {/* 4. Collateral / Girvi Pledged */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>Girvi / Pledged Security</span>
                <Lock className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-rose-400">
                ₹{metrics.totalPledgedCollateralValue.toLocaleString('en-IN')}
              </div>
              <div className="mt-2 text-[11px] text-slate-400 truncate">
                {activeProject.funding_sources.filter(s => s.collateral?.is_pledged).length} Mortgaged Assets
              </div>
            </div>
          </div>

          {/* Action Tabs Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 rounded-2xl p-3 sm:p-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'expenses'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>Pre-Op Kharche ({activeProject.expenses?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('funding')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'funding'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Landmark className="w-4 h-4" />
                <span>Funding & Bank Loans ({activeProject.funding_sources?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'analytics'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <PieChart className="w-4 h-4" />
                <span>Source & Girvi Mix</span>
              </button>

              <button
                onClick={() => setActiveTab('capitalize')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'capitalize'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Capital Account Transfer</span>
              </button>

              <button
                onClick={() => setActiveTab('repayments')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'repayments'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Repay / Refund ({activeProject.repayments?.length || 0})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Kharcha Jodein
              </button>
              <button
                onClick={() => setIsAddSourceOpen(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Bank / Fund Jodein
              </button>
            </div>
          </div>

          {/* TAB 1: PRE-OPERATIVE EXPENSES */}
          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-emerald-400" />
                    Pre-Operative Kharcha Ledger ({activeProject.expenses?.length || 0} Entries)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Day 0 se lekar business launch tak ke sabhi establishment kharche.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Naya Kharcha Likhein
                </button>
              </div>

              {(!activeProject.expenses || activeProject.expenses.length === 0) ? (
                <div className="p-10 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm space-y-2">
                  <Receipt className="w-10 h-10 mx-auto text-slate-600" />
                  <p>Abhi tak koi pre-operative kharcha darj nahi kiya gaya hai.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activeProject.expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{exp.title}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            exp.is_fixed_asset
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {exp.is_fixed_asset ? '🏛️ Fixed Asset' : '📑 Pre-Op (Sec 35D)'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Funded via: <strong className="text-slate-200">{exp.funding_source_name || 'Self/Mixed'}</strong> · {exp.date}
                          {exp.vendor_name && ` · Vendor: ${exp.vendor_name}`}
                          {exp.gst_amount ? ` · GST: ₹${exp.gst_amount}` : ''}
                        </p>
                        {exp.notes && (
                          <p className="text-[11px] text-slate-500 italic">{exp.notes}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                        <div className="text-left sm:text-right">
                          <div className="text-base sm:text-lg font-black text-emerald-400">
                            ₹{Number(exp.amount).toLocaleString('en-IN')}
                          </div>
                          {exp.invoice_no && (
                            <span className="text-[10px] text-slate-400 font-mono">Inv: {exp.invoice_no}</span>
                          )}
                        </div>

                        <button
                          onClick={() => deletePreOpExpense(activeProject.id, exp.id)}
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FUNDING SOURCES & TRANCHES */}
          {activeTab === 'funding' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-indigo-400" />
                    Financing Sources, Tranches & Girvi Security ({activeProject.funding_sources?.length || 0} Sources)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Bank loans, Promoter equity, Dost/Family loans, Tranches aur Pledged Collaterals.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddSourceOpen(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Naya Funding Source
                </button>
              </div>

              {(!activeProject.funding_sources || activeProject.funding_sources.length === 0) ? (
                <div className="p-10 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm space-y-2">
                  <Landmark className="w-10 h-10 mx-auto text-slate-600" />
                  <p>Abhi tak koi funding source add nahi kiya gaya hai.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeProject.funding_sources.map((s) => (
                    <div
                      key={s.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-white">{s.provider_name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-indigo-500/20 text-indigo-300">
                              {s.source_type.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Interest: {s.charge_interest ? `${s.interest_rate_annual}% p.a.` : '0% (Interest-Free)'}
                            {s.processing_fees ? ` · Proc. Fee: ₹${s.processing_fees}` : ''}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Disbursed / Sanctioned</span>
                          <span className="text-base font-black text-indigo-400">
                            ₹{s.disbursed_amount?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            / ₹{s.sanctioned_amount?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Collateral Pledged Details */}
                      {s.collateral?.is_pledged && (
                        <div className="bg-rose-950/30 border border-rose-900/40 rounded-xl p-3 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                            <Lock className="w-3.5 h-3.5" /> Girvi Rakha Gaya (Pledged Collateral):
                          </div>
                          <p className="text-slate-200 font-semibold">{s.collateral.title}</p>
                          <p className="text-slate-400">
                            Valuation: <strong>₹{s.collateral.estimated_valuation?.toLocaleString('en-IN')}</strong> · Custody: {s.collateral.safe_custody_notes || 'Bank Vault'}
                          </p>
                        </div>
                      )}

                      {/* Tranches Breakdown */}
                      <div className="space-y-2 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 text-xs">
                        <div className="flex items-center justify-between text-slate-300 font-bold">
                          <span>Disbursal Tranches ({s.tranches?.length || 0})</span>
                          <button
                            onClick={() => {
                              setSelectedSourceForTranche(s.id);
                              setIsAddTrancheOpen(true);
                            }}
                            className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Agla Tranche Jodein
                          </button>
                        </div>

                        {s.tranches?.map(t => (
                          <div key={t.id} className="flex items-center justify-between py-1 border-t border-slate-700/50 text-[11px]">
                            <span className="text-slate-300">Tranche #{t.tranche_no} ({t.disbursal_date})</span>
                            <span className="font-bold text-white">₹{Number(t.amount).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SOURCE & COLLATERAL MIX ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* WhatsApp Share Card */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-900/50 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Share2 className="w-4 h-4" /> 1-Click WhatsApp Setup Project Summary Slip
                  </div>
                  <p className="text-xs text-slate-400">
                    Pure business inception, Capex breakdown, girvi collateral aur funding mix ka slip generate karein.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleCopySummary}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center gap-2"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>{copySuccess ? 'Copied!' : 'Copy Slip'}</span>
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" /> WhatsApp Share
                  </button>
                </div>
              </div>

              {/* Source Breakdown Table */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-indigo-400" />
                  Project Funding Mix Breakdown (Paisa Kaha Se Aaya)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Self Savings */}
                  <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-1.5">
                    <span className="text-xs text-slate-400 font-bold block">💵 Khud Ki Savings (Equity)</span>
                    <span className="text-lg font-black text-emerald-400">
                      ₹{metrics.selfSavingsTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {metrics.totalDisbursed > 0 ? Math.round((metrics.selfSavingsTotal / metrics.totalDisbursed) * 100) : 0}% of Total Inception
                    </span>
                  </div>

                  {/* Public Bank Loan */}
                  <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-1.5">
                    <span className="text-xs text-slate-400 font-bold block">🏛️ Bank Term Loan (MSME)</span>
                    <span className="text-lg font-black text-indigo-400">
                      ₹{metrics.bankLoanTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {metrics.totalDisbursed > 0 ? Math.round((metrics.bankLoanTotal / metrics.totalDisbursed) * 100) : 0}% of Total Inception
                    </span>
                  </div>

                  {/* Private/NBFC */}
                  <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-1.5">
                    <span className="text-xs text-slate-400 font-bold block">🏢 Private Bank / NBFC</span>
                    <span className="text-lg font-black text-purple-400">
                      ₹{metrics.privateNbfcTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {metrics.totalDisbursed > 0 ? Math.round((metrics.privateNbfcTotal / metrics.totalDisbursed) * 100) : 0}% of Total Inception
                    </span>
                  </div>

                  {/* Friends / Family */}
                  <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-1.5">
                    <span className="text-xs text-slate-400 font-bold block">🤝 Dost / Rishtedaar Udhar</span>
                    <span className="text-lg font-black text-amber-400">
                      ₹{metrics.friendsFamilyTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {metrics.totalDisbursed > 0 ? Math.round((metrics.friendsFamilyTotal / metrics.totalDisbursed) * 100) : 0}% of Total Inception
                    </span>
                  </div>
                </div>
              </div>

              {/* Collateral Pledged Summary */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-rose-400" />
                  Girvi Rakhi Gayi Security / Property Details
                </h3>

                {activeProject.funding_sources.filter(s => s.collateral?.is_pledged).length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm bg-slate-800/40 rounded-xl">
                    Koi property ya sona girvi nahi rakha gaya hai (Unsecured Project).
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeProject.funding_sources.filter(s => s.collateral?.is_pledged).map(s => (
                      <div
                        key={s.id}
                        className="bg-slate-800/60 border border-rose-900/40 rounded-xl p-4 space-y-2 hover:border-slate-600 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs px-2 py-0.5 rounded font-bold uppercase bg-rose-500/20 text-rose-300">
                            {s.collateral.asset_type?.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-mono text-slate-400 font-bold">Lien with: {s.provider_name}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{s.collateral.title}</h4>
                        <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-700/60">
                          <span>Market Valuation:</span>
                          <strong className="text-emerald-400">₹{s.collateral.estimated_valuation?.toLocaleString('en-IN')}</strong>
                        </div>
                        {s.collateral.safe_custody_notes && (
                          <p className="text-[11px] text-slate-400 italic">Custody: {s.collateral.safe_custody_notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CAPITAL ACCOUNT TRANSFER */}
          {activeTab === 'capitalize' && (
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gold" />
                    Capitalization into Business Firm Balance Sheet
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Jab business start ho jaye, to pure pre-operative kharcho aur assets ko officially firm ke Capital Account me transfer karein.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 text-xs">
                  <div>
                    <span className="text-slate-400 block">Total Fixed Assets to Capitalize:</span>
                    <span className="text-lg font-bold text-emerald-400">₹{metrics.fixedAssetsTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Preliminary Expenses (Sec 35D):</span>
                    <span className="text-lg font-bold text-blue-400">₹{metrics.preOp35DTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Promoter's Equity Capital:</span>
                    <span className="text-lg font-bold text-gold">₹{metrics.selfSavingsTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {activeProject.status === 'capitalized_live' ? (
                  <div className="p-4 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-emerald-300 text-xs flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold">Ye project successfully firm capital me capitalize ho chuka hai!</p>
                      <p className="text-slate-400">Capitalization Date: {activeProject.capitalization_date}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsCapitalizeModalOpen(true)}
                      className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/30 inline-flex items-center gap-2"
                    >
                      <Building2 className="w-4 h-4" /> 1-Click Capitalize to Firm
                    </button>
                    <button
                      onClick={() => setIsCloseProjectOpen(true)}
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold transition-all"
                    >
                      Close Project with Note
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: REPAYMENTS & REFUNDS */}
          {activeTab === 'repayments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                    Loan Repayment & Promoter Equity Refunds ({activeProject.repayments?.length || 0} Entries)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Business shuru hone ke baad khud ka lagaya paisa refund lena ya bank/private debt chukana.
                  </p>
                </div>
                <button
                  onClick={() => setIsRepayModalOpen(true)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Repayment / Refund Likhein
                </button>
              </div>

              {(!activeProject.repayments || activeProject.repayments.length === 0) ? (
                <div className="p-10 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm space-y-2">
                  <ArrowRightLeft className="w-10 h-10 mx-auto text-slate-600" />
                  <p>Abhi tak koi repayment ya promoter refund record nahi kiya gaya hai.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activeProject.repayments.map((r) => (
                    <div
                      key={r.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">Paid to: {r.funding_source_name}</h4>
                        <p className="text-xs text-slate-400">
                          Date: {r.repayment_date} · Mode: {r.payment_mode.toUpperCase()}
                          {r.interest_portion ? ` · Interest: ₹${r.interest_portion}` : ''}
                        </p>
                        {r.notes && (
                          <p className="text-[11px] text-slate-500 italic">{r.notes}</p>
                        )}
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-base sm:text-lg font-black text-rose-400">
                          ₹{Number(r.amount).toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Principal: ₹{r.principal_portion}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* MODAL 1: ADD SETUP PROJECT */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" /> Naya Business Setup Project
              </h3>
              <button onClick={() => setIsAddProjectOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Project / Business Ka Naam *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Sweets & Restro, Modern Logistics Depot"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Business Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Restaurant, Bakery, Transport"
                    value={newBusinessType}
                    onChange={e => setNewBusinessType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Target Launch Date</label>
                  <input
                    type="date"
                    value={newTargetLaunchDate}
                    onChange={e => setNewTargetLaunchDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Notes / Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newProjectNotes}
                  onChange={e => setNewProjectNotes(e.target.value)}
                  placeholder="Premises details, electricity load, capacity etc."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddProjectOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
                >
                  Project Banayein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD PRE-OP EXPENSE */}
      {isAddExpenseOpen && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" /> Pre-Operative Kharcha Likhein
              </h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Kharcha Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. False ceiling & electricals, POS billing machine"
                  value={expTitle}
                  onChange={e => setExpTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Rashi (Amount ₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="25000"
                    value={expAmount}
                    onChange={e => setExpAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Category</label>
                  <select
                    value={expCategory}
                    onChange={e => setExpCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="interior_furniture">🛋️ Interior & Furniture Fitout</option>
                    <option value="machinery_equipment">⚙️ Plant, Machinery & Tools</option>
                    <option value="it_website_software">💻 Website, App & POS Software</option>
                    <option value="legal_incorporation">⚖️ Legal, CA & Incorporation</option>
                    <option value="licensing_gst_ip">📑 GST, Trade Lic, FSSAI, TM</option>
                    <option value="advance_rent_security">🏢 Shop Advance Security Deposit</option>
                    <option value="travelling_conveyance">🚗 Travelling & Site Meetings</option>
                    <option value="marketing_prelaunch">📢 Pre-Launch Branding & Ads</option>
                    <option value="inventory_raw_material">📦 Initial Stock / Raw Material</option>
                    <option value="other_preoperative">📝 Other Pre-Op Kharcha</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Paid From (Funding Source)</label>
                  <select
                    value={expSourceId}
                    onChange={e => setExpSourceId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="">Direct Cash / Mixed</option>
                    {activeProject.funding_sources.map(s => (
                      <option key={s.id} value={s.id}>{s.provider_name} ({s.source_type})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Date</label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={e => setExpDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Vendor / Dukandar</label>
                  <input
                    type="text"
                    placeholder="Vendor Name"
                    value={expVendor}
                    onChange={e => setExpVendor(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">GST Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="Optional GST"
                    value={expGstAmount}
                    onChange={e => setExpGstAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Asset vs Expense Switch */}
              <label className="flex items-center gap-3 p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={expIsFixedAsset}
                  onChange={e => setExpIsFixedAsset(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-200 block">🏛️ Fixed Capital Asset Banega (Furniture, Machinery, Deposit)</span>
                  <span className="text-slate-400">Unchecked hone par ye Pre-Operative Preliminary Expense (Sec 35D) banega</span>
                </div>
              </label>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/30"
                >
                  Kharcha Save Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD FUNDING SOURCE WITH COLLATERAL */}
      {isAddSourceOpen && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-indigo-400" /> Naya Funding / Loan Source Jodein
              </h3>
              <button onClick={() => setIsAddSourceOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleAddSource} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Source Type</label>
                  <select
                    value={sourceType}
                    onChange={e => setSourceType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="self_savings">💵 Khud Ki Savings (Promoter Equity)</option>
                    <option value="bank_term_loan">🏛️ Bank Term Loan (Public / MSME)</option>
                    <option value="private_bank_nbfc">🏢 Private Bank / NBFC Loan</option>
                    <option value="friends_family_debt">🤝 Dost / Family Udhar</option>
                    <option value="investor_seed_equity">🌟 Seed Investor / Partner</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Provider / Bank Naam *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. State Bank of India, Papa's Savings, HDFC"
                    value={providerName}
                    onChange={e => setProviderName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Sanctioned Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="1000000"
                    value={sanctionedAmount}
                    onChange={e => setSanctionedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Initial Disbursed (₹)</label>
                  <input
                    type="number"
                    placeholder="Same as sanctioned if full"
                    value={initialDisbursed}
                    onChange={e => setInitialDisbursed(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Interest settings */}
              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chargeInterest}
                    onChange={e => setChargeInterest(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300 font-bold">Interest / Byaaj Lagega</span>
                </label>

                {chargeInterest && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Annual Interest Rate (% p.a.)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="9.25"
                        value={interestRate}
                        onChange={e => setInterestRate(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Bank Processing Fee (₹)</label>
                      <input
                        type="number"
                        placeholder="10000"
                        value={processingFees}
                        onChange={e => setProcessingFees(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Collateral / Girvi Security Section */}
              <div className="bg-rose-950/20 p-3.5 rounded-xl border border-rose-900/40 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPledged}
                    onChange={e => setIsPledged(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-0"
                  />
                  <span className="text-xs text-rose-300 font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Is Loan ke liye koi Property / Sona Girvi rakha hai?
                  </span>
                </label>

                {isPledged && (
                  <div className="space-y-2.5 pt-1">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1">Girvi Asset Type</label>
                        <select
                          value={collateralType}
                          onChange={e => setCollateralType(e.target.value as any)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none"
                        >
                          <option value="real_estate_property">🏠 Property Registry / Plot</option>
                          <option value="fixed_deposit_lien">💰 FD Lien / Bank Deposit</option>
                          <option value="gold_pledge">🥇 Gold / Sona</option>
                          <option value="machinery_hypothecation">⚙️ Machinery Hypothecation</option>
                          <option value="personal_guarantee">✍️ Personal Guarantee</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Asset Title / Document</label>
                        <input
                          type="text"
                          placeholder="e.g. Plot Registry #402"
                          value={collateralTitle}
                          onChange={e => setCollateralTitle(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1">Market Valuation (₹)</label>
                        <input
                          type="number"
                          placeholder="3000000"
                          value={collateralValuation}
                          onChange={e => setCollateralValuation(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Safe Custody Details</label>
                        <input
                          type="text"
                          placeholder="e.g. SBI Main Branch Vault"
                          value={collateralCustody}
                          onChange={e => setCollateralCustody(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddSourceOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
                >
                  Source Save Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD TRANCHE */}
      {isAddTrancheOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" /> Agla Loan Tranche Disbursal
              </h3>
              <button onClick={() => setIsAddTrancheOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleAddTranche} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Disbursal Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="300000"
                  value={trancheAmount}
                  onChange={e => setTrancheAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Disbursal Date</label>
                <input
                  type="date"
                  value={trancheDate}
                  onChange={e => setTrancheDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Notes / Stage (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Stage 2 machinery disbursal"
                  value={trancheNotes}
                  onChange={e => setTrancheNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddTrancheOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
                >
                  Tranche Jodein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: CAPITALIZE TO FIRM */}
      {isCapitalizeModalOpen && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gold" /> Firm Capital Account me Transfer
              </h3>
              <button onClick={() => setIsCapitalizeModalOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleCapitalizeSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Target Business Firm Select Karein *</label>
                <select
                  value={targetFirmId}
                  onChange={e => setTargetFirmId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                >
                  {businessFirms.map(f => (
                    <option key={f.id} value={f.id}>{f.firm_name} ({f.entity_type})</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-1">
                <span className="text-slate-400 block">Total Capitalization Amount:</span>
                <span className="text-lg font-black text-emerald-400">
                  ₹{(metrics.totalPreOpSpent + metrics.totalProcessingFees).toLocaleString('en-IN')}
                </span>
                <p className="text-[11px] text-slate-400 pt-1">
                  Fixed Assets: ₹{metrics.fixedAssetsTotal.toLocaleString('en-IN')} | Pre-Op 35D: ₹{metrics.preOp35DTotal.toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Closing & Capitalization Note</label>
                <input
                  type="text"
                  placeholder="e.g. Commercial operations commenced on 1st Nov"
                  value={capitalizeClosingNotes}
                  onChange={e => setCapitalizeClosingNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCapitalizeModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gold hover:bg-gold-light text-slate-950 rounded-xl text-xs font-bold transition-all shadow-lg shadow-gold/20"
                >
                  Poonji Khata me Transfer Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: REPAYMENT / REFUND */}
      {isRepayModalOpen && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-400" /> Repayment / Equity Refund
              </h3>
              <button onClick={() => setIsRepayModalOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleRepaySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Kis Fund / Lender ko chukaya *</label>
                <select
                  value={repaySourceId || activeProject.funding_sources[0]?.id}
                  onChange={e => setRepaySourceId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                >
                  {activeProject.funding_sources.map(s => (
                    <option key={s.id} value={s.id}>{s.provider_name} ({s.source_type})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Total Paid (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="50000"
                    value={repayAmount}
                    onChange={e => setRepayAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Payment Mode</label>
                  <select
                    value={repayMode}
                    onChange={e => setRepayMode(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="bank">Bank Transfer</option>
                    <option value="upi">UPI / GPay</option>
                    <option value="cash">Cash (Nagad)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Date</label>
                <input
                  type="date"
                  value={repayDate}
                  onChange={e => setRepayDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Loan tranche repayment from cash profits"
                  value={repayNotes}
                  onChange={e => setRepayNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRepayModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-600/30"
                >
                  Repayment Record Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: CLOSE PROJECT */}
      {isCloseProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Project Close Karein</h3>
              <button onClick={() => setIsCloseProjectOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleCloseProject} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Closing Reconciliation Note *</label>
                <textarea
                  rows={3}
                  required
                  value={closingNoteText}
                  onChange={e => setClosingNoteText(e.target.value)}
                  placeholder="Write details on why and how the setup phase is finalized..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCloseProjectOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/30"
                >
                  Close Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
