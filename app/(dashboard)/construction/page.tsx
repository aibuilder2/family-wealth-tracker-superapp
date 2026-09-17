'use client';

import React, { useState, useMemo } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import {
  ConstructionProject, ConstructionMaterialLog, ThekedarContract,
  LaborHaziraRecord, ConstructionStage, MaterialCategory,
  ContractorCategory, MeasurementUnitBasis
} from '@/types';
import {
  HardHat, Plus, Hammer, Truck, Users, DollarSign,
  Calendar, CheckCircle2, AlertCircle, Share2, Receipt,
  Building, Layers, Trash2, ArrowUpRight, ArrowDownLeft,
  FileSpreadsheet, ShieldCheck, MapPin, Ruler, Phone,
  Filter, Tag, Sparkles
} from 'lucide-react';

export default function ConstructionPage() {
  const {
    constructionProjects,
    addConstructionProject,
    updateConstructionProject,
    deleteConstructionProject,
    addConstructionMaterial,
    deleteConstructionMaterial,
    addThekedarContract,
    addThekedarRABill,
    addLaborHaziraLog,
    deleteThekedarContract,
    deleteThekedarRABill,
    toggleThekedarRABillPaid,
    deleteLaborHaziraLog
  } = useFamilyStore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(constructionProjects[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'materials' | 'thekedar' | 'labor' | 'progress'>('materials');
  const [vendorFilter, setVendorFilter] = useState<string>('all');

  // Modals
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [isAddThekedarOpen, setIsAddThekedarOpen] = useState(false);
  const [isAddRABillOpen, setIsAddRABillOpen] = useState(false);
  const [selectedThekedarId, setSelectedThekedarId] = useState<string>('');
  const [isAddLaborOpen, setIsAddLaborOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // New Project Form
  const [siteTitle, setSiteTitle] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [plotArea, setPlotArea] = useState<number | ''>('');
  const [builtupArea, setBuiltupArea] = useState<number | ''>('');
  const [targetBudget, setTargetBudget] = useState<number | ''>(5000000);
  const [currentStage, setCurrentStage] = useState<ConstructionStage>('planning_sanction');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState(new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]);
  const [projectNotes, setProjectNotes] = useState('');

  // New Material Form
  const [matName, setMatName] = useState('');
  const [matCategory, setMatCategory] = useState<MaterialCategory>('cement');
  const [vendorName, setVendorName] = useState('');
  const [vendorPhone, setVendorPhone] = useState('');
  const [matQuantity, setMatQuantity] = useState<number | ''>('');
  const [matUnit, setMatUnit] = useState('Bags');
  const [matRate, setMatRate] = useState<number | ''>('');
  const [matPaid, setMatPaid] = useState<number | ''>('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [matDate, setMatDate] = useState(new Date().toISOString().split('T')[0]);
  const [matNotes, setMatNotes] = useState('');

  // New Thekedar Form
  const [thekedarName, setThekedarName] = useState('');
  const [contractorCategory, setContractorCategory] = useState<ContractorCategory>('civil_structure');
  const [thekedarScope, setThekedarScope] = useState('');
  const [thekedarPhone, setThekedarPhone] = useState('');
  const [contractType, setContractType] = useState<'sqft_rate' | 'item_rate' | 'lump_sum_theka'>('sqft_rate');
  const [unitBasis, setUnitBasis] = useState<MeasurementUnitBasis>('sqft');
  const [rateSqft, setRateSqft] = useState<number | ''>('');
  const [totalSqft, setTotalSqft] = useState<number | ''>('');
  const [contractValue, setContractValue] = useState<number | ''>('');
  const [retentionAmt, setRetentionAmt] = useState<number | ''>('');
  const [isThirdPartyDhalai, setIsThirdPartyDhalai] = useState(false);
  const [thekedarNotes, setThekedarNotes] = useState('');

  // New RA Bill Form
  const [raBillNo, setRaBillNo] = useState('RA Bill #1');
  const [raStageName, setRaStageName] = useState('');
  const [raBillAmount, setRaBillAmount] = useState<number | ''>('');
  const [raDate, setRaDate] = useState(new Date().toISOString().split('T')[0]);
  const [raIsPaid, setRaIsPaid] = useState(true);
  const [raNotes, setRaNotes] = useState('');

  // New Labor Hazira Form
  const [haziraDate, setHaziraDate] = useState(new Date().toISOString().split('T')[0]);
  const [mistriCount, setMistriCount] = useState<number | ''>(2);
  const [mistriRate, setMistriRate] = useState<number | ''>(900);
  const [laborCount, setLaborCount] = useState<number | ''>(6);
  const [laborRate, setLaborRate] = useState<number | ''>(550);
  const [laborPaid, setLaborPaid] = useState<number | ''>('');
  const [khurakiAdv, setKhurakiAdv] = useState<number | ''>('');
  const [supervisorName, setSupervisorName] = useState('');
  const [haziraNotes, setHaziraNotes] = useState('');

  // Active Project resolution
  const activeProject = useMemo(() => {
    if (!constructionProjects.length) return null;
    const found = constructionProjects.find(p => p.id === selectedProjectId);
    return found || constructionProjects[0];
  }, [constructionProjects, selectedProjectId]);

  // Project Metrics
  const metrics = useMemo(() => {
    if (!activeProject) {
      return {
        totalSpent: 0,
        materialsTotal: 0,
        materialsPaid: 0,
        materialsPending: 0,
        contractorsTotal: 0,
        contractorsPaid: 0,
        laborWagesTotal: 0,
        budgetRemaining: 0,
        budgetPct: 0
      };
    }

    const materials = activeProject.materials || [];
    const contractors = activeProject.contractors || [];
    const laborLogs = activeProject.daily_labor_logs || [];

    const materialsTotal = materials.reduce((sum, m) => sum + (Number(m.total_amount) || 0), 0);
    const materialsPaid = materials.reduce((sum, m) => sum + (Number(m.paid_amount) || 0), 0);
    const materialsPending = materials.reduce((sum, m) => sum + (Number(m.pending_amount) || 0), 0);

    const contractorsTotal = contractors.reduce((sum, c) => sum + (Number(c.total_contract_value) || 0), 0);
    const contractorsPaid = contractors.reduce((sum, c) => sum + (Number(c.total_paid) || 0), 0);

    const laborWagesTotal = laborLogs.reduce((sum, l) => sum + (Number(l.paid_amount) || Number(l.total_daily_wage) || 0), 0);

    const totalSpent = materialsPaid + contractorsPaid + laborWagesTotal;
    const budget = Number(activeProject.target_budget) || 0;
    const budgetRemaining = Math.max(0, budget - totalSpent);
    const budgetPct = budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0;

    return {
      totalSpent,
      materialsTotal,
      materialsPaid,
      materialsPending,
      contractorsTotal,
      contractorsPaid,
      laborWagesTotal,
      budgetRemaining,
      budgetPct
    };
  }, [activeProject]);

  // Vendor Ledger for Construction Materials
  const vendorLedger = useMemo(() => {
    if (!activeProject?.materials) return [];
    const map = new Map<string, {
      vendor_name: string;
      vendor_phone?: string;
      total_amount: number;
      paid_amount: number;
      pending_amount: number;
      count: number;
      items: string[];
    }>();

    for (const m of activeProject.materials) {
      const v = m.vendor_name || 'Direct / Cash Purchase';
      const cur = map.get(v) || {
        vendor_name: v,
        vendor_phone: m.vendor_phone,
        total_amount: 0,
        paid_amount: 0,
        pending_amount: 0,
        count: 0,
        items: []
      };
      cur.total_amount += Number(m.total_amount) || 0;
      cur.paid_amount += Number(m.paid_amount) || 0;
      cur.pending_amount += Number(m.pending_amount) || 0;
      cur.count += 1;
      if (m.material_name && !cur.items.includes(m.material_name)) {
        cur.items.push(m.material_name);
      }
      map.set(v, cur);
    }
    return Array.from(map.values()).sort((a, b) => b.total_amount - a.total_amount);
  }, [activeProject]);

  const filteredMaterials = useMemo(() => {
    if (!activeProject?.materials) return [];
    if (vendorFilter === 'all') return activeProject.materials;
    return activeProject.materials.filter(m => (m.vendor_name || 'Direct / Cash Purchase') === vendorFilter);
  }, [activeProject, vendorFilter]);

  // Handlers
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteTitle.trim()) return;

    addConstructionProject({
      site_title: siteTitle.trim(),
      site_location: siteLocation.trim() || 'Site Address',
      plot_area_sqft: plotArea ? Number(plotArea) : undefined,
      builtup_area_sqft: builtupArea ? Number(builtupArea) : undefined,
      target_budget: targetBudget ? Number(targetBudget) : 0,
      current_stage: currentStage,
      start_date: startDate,
      target_completion_date: targetDate,
      status: 'ongoing',
      notes: projectNotes
    });

    setIsAddProjectOpen(false);
    setSiteTitle('');
    setSiteLocation('');
    setProjectNotes('');
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !matName.trim() || !matQuantity || !matRate) return;

    const qty = Number(matQuantity);
    const rate = Number(matRate);
    const total = qty * rate;
    const paid = matPaid !== '' ? Number(matPaid) : total;
    const pending = Math.max(0, total - paid);

    addConstructionMaterial(activeProject.id, {
      material_name: matName.trim(),
      category: matCategory,
      vendor_name: vendorName.trim() || 'Local Supplier',
      vendor_phone: vendorPhone.trim() || undefined,
      quantity: qty,
      unit: matUnit,
      rate_per_unit: rate,
      total_amount: total,
      paid_amount: paid,
      pending_amount: pending,
      invoice_no: invoiceNo.trim() || undefined,
      vehicle_no: vehicleNo.trim() || undefined,
      date: matDate,
      notes: matNotes
    });

    setIsAddMaterialOpen(false);
    setMatName('');
    setMatQuantity('');
    setMatRate('');
    setMatPaid('');
    setVendorName('');
    setVendorPhone('');
    setInvoiceNo('');
    setVehicleNo('');
    setMatNotes('');
  };

  const handleAddThekedar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !thekedarName.trim()) return;

    const val = contractValue !== ''
      ? Number(contractValue)
      : (rateSqft && totalSqft ? Number(rateSqft) * Number(totalSqft) : 0);

    addThekedarContract(activeProject.id, {
      contractor_name: thekedarName.trim(),
      contractor_category: contractorCategory,
      work_scope: thekedarScope.trim() || 'Civil / Construction Work',
      phone: thekedarPhone.trim() || '',
      contract_type: contractType,
      unit_basis: unitBasis,
      rate_per_unit: rateSqft ? Number(rateSqft) : undefined,
      total_units: totalSqft ? Number(totalSqft) : undefined,
      rate_per_sqft: rateSqft ? Number(rateSqft) : undefined,
      total_sqft: totalSqft ? Number(totalSqft) : undefined,
      total_contract_value: val,
      retention_amount: retentionAmt ? Number(retentionAmt) : 0,
      is_third_party_dhalai: isThirdPartyDhalai,
      notes: thekedarNotes
    });

    setIsAddThekedarOpen(false);
    setThekedarName('');
    setThekedarScope('');
    setThekedarPhone('');
    setRateSqft('');
    setTotalSqft('');
    setContractValue('');
    setRetentionAmt('');
    setIsThirdPartyDhalai(false);
    setThekedarNotes('');
  };

  const handleAddRABill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !selectedThekedarId || !raBillAmount) return;

    addThekedarRABill(activeProject.id, selectedThekedarId, {
      ra_bill_no: raBillNo.trim(),
      stage_name: raStageName.trim() || 'Work Complete Stage',
      bill_amount: Number(raBillAmount),
      date: raDate,
      is_paid: raIsPaid,
      notes: raNotes
    });

    setIsAddRABillOpen(false);
    setRaStageName('');
    setRaBillAmount('');
    setRaNotes('');
  };

  const handleAddLabor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    const mCount = mistriCount ? Number(mistriCount) : 0;
    const mRate = mistriRate ? Number(mistriRate) : 0;
    const lCount = laborCount ? Number(laborCount) : 0;
    const lRate = laborRate ? Number(laborRate) : 0;
    const totalWage = (mCount * mRate) + (lCount * lRate);
    const paid = laborPaid !== '' ? Number(laborPaid) : totalWage;

    addLaborHaziraLog(activeProject.id, {
      date: haziraDate,
      mistri_count: mCount,
      mistri_rate: mRate,
      labor_count: lCount,
      labor_rate: lRate,
      total_daily_wage: totalWage,
      paid_amount: paid,
      khuraki_advance: khurakiAdv ? Number(khurakiAdv) : 0,
      supervisor_name: supervisorName.trim() || undefined,
      notes: haziraNotes
    });

    setIsAddLaborOpen(false);
    setHaziraNotes('');
  };

  const generateWhatsAppSummary = () => {
    if (!activeProject) return '';

    let text = `🏗️ *CONSTRUCTION SITE HISAB & STATUS REPORT*\n`;
    text += `📍 Site: *${activeProject.site_title.toUpperCase()}*\n`;
    text += `📌 Location: ${activeProject.site_location}\n`;
    text += `🧱 Current Stage: ${activeProject.current_stage.replace('_', ' ').toUpperCase()}\n`;
    text += `💰 Target Budget: ₹${Number(activeProject.target_budget).toLocaleString('en-IN')}\n`;
    text += `💵 Kul Kharch (Spent): ₹${metrics.totalSpent.toLocaleString('en-IN')} (${metrics.budgetPct}% of budget)\n`;
    text += `---------------------------------\n`;
    text += `📦 *MATERIAL KHAREED:*\n`;
    text += `   • Total Purchased: ₹${metrics.materialsTotal.toLocaleString('en-IN')}\n`;
    text += `   • Paid: ₹${metrics.materialsPaid.toLocaleString('en-IN')} | Pending Baki: ₹${metrics.materialsPending.toLocaleString('en-IN')}\n`;
    text += `---------------------------------\n`;
    text += `👷 *THEKEDAR & CONTRACTS:*\n`;
    text += `   • Total Contracts: ₹${metrics.contractorsTotal.toLocaleString('en-IN')}\n`;
    text += `   • Total Thekedar Paid: ₹${metrics.contractorsPaid.toLocaleString('en-IN')}\n`;
    text += `---------------------------------\n`;
    text += `🛠️ *LABOR HAZIRA & WAGES:* ₹${metrics.laborWagesTotal.toLocaleString('en-IN')}\n`;
    text += `\n_Generated via Parivar SuperApp Construction Manager_ ✨`;
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
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              <HardHat className="w-3.5 h-3.5" />
              <span>Construction & Thekedari Project Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              🏗️ Makan, Dukan & Site Nirman Manager
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Cement, Sariya, Rodi, Bricks ki khareed, Thekedar contract & RA bills, Mistri/Labor daily hazira aur budget tracking—sab ek jagah.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddProjectOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-600/30 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Nayi Site / Project Jodein
            </button>
          </div>
        </div>

        {/* Site Switcher Bar */}
        {constructionProjects.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Sites:</span>
            {constructionProjects.map(p => {
              const isSelected = activeProject?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>{p.site_title}</span>
                  <span className="text-[10px] opacity-75 font-mono">({p.current_stage.replace('_', ' ')})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {!activeProject ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 p-8 space-y-4">
          <HardHat className="w-16 h-16 text-amber-400 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold text-white">Koi Construction Project Nahi Hai</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Aapne abhi tak koi makan, dukan ya plaza construction site add nahi ki hai.
          </p>
          <button
            onClick={() => setIsAddProjectOpen(true)}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl text-sm font-bold transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Pehli Site Banayein
          </button>
        </div>
      ) : (
        <>
          {/* KPI Snapshot Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. Total Spent */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>Kul Nirman Kharch (Spent)</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                ₹{metrics.totalSpent.toLocaleString('en-IN')}
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Budget: ₹{Number(activeProject.target_budget).toLocaleString('en-IN')} ({metrics.budgetPct}%)
              </div>
            </div>

            {/* 2. Material Total */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>Material Khareed</span>
                <Truck className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-blue-400">
                ₹{metrics.materialsTotal.toLocaleString('en-IN')}
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Paid: ₹{metrics.materialsPaid.toLocaleString('en-IN')} | Baki: <strong className="text-rose-400">₹{metrics.materialsPending.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* 3. Thekedar Contracts */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>Thekedar Payouts</span>
                <Hammer className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-purple-400">
                ₹{metrics.contractorsPaid.toLocaleString('en-IN')}
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Total Contracts: ₹{metrics.contractorsTotal.toLocaleString('en-IN')}
              </div>
            </div>

            {/* 4. Labor Hazira */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>Daily Labor Wages</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                ₹{metrics.laborWagesTotal.toLocaleString('en-IN')}
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                {activeProject.daily_labor_logs?.length || 0} Hazira records
              </div>
            </div>
          </div>

          {/* Action Tabs Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 rounded-2xl p-3 sm:p-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('materials')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'materials'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Material Khareed ({activeProject.materials?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('thekedar')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'thekedar'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Hammer className="w-4 h-4" />
                <span>Thekedar & Contracts ({activeProject.contractors?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('labor')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'labor'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Daily Labor Hazira ({activeProject.daily_labor_logs?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('progress')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'progress'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Site Stage & Report</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddMaterialOpen(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Material Entry
              </button>
              <button
                onClick={() => setIsAddLaborOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Aaj Ka Hazira
              </button>
            </div>
          </div>

          {/* TAB 1: MATERIAL KHAREED */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              {/* Vendor Supply & Udhar Ledger Card */}
              {vendorLedger.length > 0 && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-400" />
                      <h4 className="text-sm font-bold text-white">🏢 Material Vendor Directory & Udhar Ledger</h4>
                    </div>
                    <span className="text-[11px] text-slate-400">{vendorLedger.length} Vendors Registered</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {vendorLedger.map((v) => (
                      <div
                        key={v.vendor_name}
                        onClick={() => setVendorFilter(vendorFilter === v.vendor_name ? 'all' : v.vendor_name)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          vendorFilter === v.vendor_name
                            ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                            : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-bold text-white truncate max-w-[140px]">{v.vendor_name}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                              {v.items.slice(0, 2).join(', ')}{v.items.length > 2 ? ` +${v.items.length - 2}` : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-blue-400">₹{v.total_amount.toLocaleString('en-IN')}</span>
                            <span className={`text-[9px] font-bold block ${v.pending_amount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {v.pending_amount > 0 ? `Baki: ₹${v.pending_amount.toLocaleString('en-IN')}` : 'Paid'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Filter chips */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800 overflow-x-auto text-xs pb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                      <Filter className="w-3 h-3" /> Filter:
                    </span>
                    <button
                      onClick={() => setVendorFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-all ${
                        vendorFilter === 'all'
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Sabhi Vendors ({activeProject.materials?.length || 0})
                    </button>
                    {vendorLedger.map(v => (
                      <button
                        key={v.vendor_name}
                        onClick={() => setVendorFilter(v.vendor_name)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-all ${
                          vendorFilter === v.vendor_name
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {v.vendor_name} ({v.count})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-400" />
                    Material Khareed Register ({filteredMaterials.length} Deliveries)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cement, Sariya, Ret, Rodi, Bricks, Tiles ki receipt aur payment tracking.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddMaterialOpen(true)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Naya Material Add Karein
                </button>
              </div>

              {filteredMaterials.length === 0 ? (
                <div className="p-10 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm space-y-2">
                  <Truck className="w-10 h-10 mx-auto text-slate-600" />
                  <p>Koi material delivery record nahi mila.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{mat.material_name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-blue-500/20 text-blue-300">
                            {mat.category.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {mat.quantity} {mat.unit} @ ₹{mat.rate_per_unit}/{mat.unit} · Vendor: <strong className="text-slate-200">{mat.vendor_name}</strong>
                          {mat.vehicle_no && ` · Gaadi: ${mat.vehicle_no}`}
                        </p>
                        {mat.notes && (
                          <p className="text-[11px] text-slate-500 italic">{mat.notes}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                        <div className="text-left sm:text-right">
                          <div className="text-base sm:text-lg font-black text-white">
                            ₹{Number(mat.total_amount).toLocaleString('en-IN')}
                          </div>
                          <span className={`text-[10px] font-bold block ${mat.pending_amount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {mat.pending_amount > 0 ? `Baki: ₹${mat.pending_amount.toLocaleString('en-IN')}` : 'Fully Paid'}
                          </span>
                        </div>

                        <button
                          onClick={() => deleteConstructionMaterial(activeProject.id, mat.id)}
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all"
                          title="Delete material log"
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

          {/* TAB 2: THEKEDAR CONTRACTS */}
          {activeTab === 'thekedar' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Hammer className="w-5 h-5 text-purple-400" />
                    Thekedar, Dhalai Gang & Multi-Stage Theka ({activeProject.contractors?.length || 0})
                  </h3>
                  <p className="text-xs text-slate-400">
                    SFT / SMTR / Lump-sum theka, Third-Party Dhalai machine, Chokhat level & stage-wise milestone payouts.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddThekedarOpen(true)}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Naya Thekedar Jodein
                </button>
              </div>

              {(!activeProject.contractors || activeProject.contractors.length === 0) ? (
                <div className="p-10 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm space-y-2">
                  <Hammer className="w-10 h-10 mx-auto text-slate-600" />
                  <p>Abhi tak koi thekedar contract add nahi kiya gaya hai.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeProject.contractors.map((c) => (
                    <div
                      key={c.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-bold text-white">{c.contractor_name}</h4>
                            {c.is_third_party_dhalai && (
                              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                🚜 3rd-Party Dhalai Machine
                              </span>
                            )}
                            {c.contractor_category && (
                              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                {c.contractor_category.replace('_', ' ')}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-purple-400 font-semibold mt-1">{c.work_scope}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Basis: <strong className="text-slate-200 uppercase">{c.unit_basis || (c.contract_type === 'sqft_rate' ? 'sqft' : c.contract_type)}</strong>
                            {c.rate_per_sqft && ` @ ₹${c.rate_per_sqft}/${c.unit_basis || 'sft'}`}
                            {c.total_sqft && ` (${c.total_sqft} ${c.unit_basis || 'sft'})`}
                          </p>
                          {c.phone && <p className="text-xs text-slate-400 font-mono mt-0.5">{c.phone}</p>}
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 block">Total Theka</span>
                          <span className="text-base font-black text-purple-400">
                            ₹{c.total_contract_value?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-emerald-400 block font-bold">
                            Paid: ₹{c.total_paid?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* RA Bills list */}
                      <div className="space-y-2 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 text-xs">
                        <div className="flex items-center justify-between text-slate-300 font-bold">
                          <span>Milestone RA Bills ({c.bills?.length || 0})</span>
                          <button
                            onClick={() => {
                              setSelectedThekedarId(c.id);
                              setIsAddRABillOpen(true);
                            }}
                            className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> RA Bill Jodein
                          </button>
                        </div>

                        {c.bills?.map(b => (
                          <div key={b.id} className="flex items-center justify-between py-1.5 border-t border-slate-700/50 text-[11px] gap-2">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => toggleThekedarRABillPaid(activeProject.id, c.id, b.id)}
                                className={'px-1.5 py-0.5 rounded text-[10px] font-bold ' + (b.is_paid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40')}
                                title="Click to toggle Paid / Pending"
                              >
                                {b.is_paid ? '✓ Paid' : '⏳ Pending'}
                              </button>
                              <span className="text-slate-300">{b.ra_bill_no}: <strong className="text-slate-100">{b.stage_name}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-emerald-400">₹{Number(b.bill_amount).toLocaleString('en-IN')}</span>
                              <button
                                onClick={() => {
                                  if (confirm('Yeh RA Bill hatayein?')) {
                                    deleteThekedarRABill(activeProject.id, c.id, b.id);
                                  }
                                }}
                                className="text-slate-500 hover:text-red-400 text-xs"
                                title="Bill Hatayein"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DAILY LABOR HAZIRA */}
          {activeTab === 'labor' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    Daily Mistri & Labor Hazira Register ({activeProject.daily_labor_logs?.length || 0} Days)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Daily Mistri + Labor ginti, dhihadi aur khuraki advance record.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddLaborOpen(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Aaj Ka Hazira Likhein
                </button>
              </div>

              {(!activeProject.daily_labor_logs || activeProject.daily_labor_logs.length === 0) ? (
                <div className="p-10 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm space-y-2">
                  <Users className="w-10 h-10 mx-auto text-slate-600" />
                  <p>Abhi tak koi daily hazira record nahi kiya gaya hai.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activeProject.daily_labor_logs.map((l) => (
                    <div
                      key={l.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{l.date}</span>
                          <button
                            onClick={() => {
                              if (confirm('Is din ka labor hazira log hatayein?')) {
                                deleteLaborHaziraLog(activeProject.id, l.id);
                              }
                            }}
                            className="text-slate-500 hover:text-red-400 text-xs ml-auto sm:hidden"
                          >
                            ✕
                          </button>
                          {l.supervisor_name && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                              Sup: {l.supervisor_name}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          {l.mistri_count} Mistri (@ ₹{l.mistri_rate}) + {l.labor_count} Labor (@ ₹{l.labor_rate})
                          {l.khuraki_advance ? ` · Khuraki Adv: ₹${l.khuraki_advance}` : ''}
                        </p>
                        {l.notes && (
                          <p className="text-[11px] text-slate-500 italic">{l.notes}</p>
                        )}
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-base sm:text-lg font-black text-emerald-400">
                          ₹{Number(l.paid_amount || l.total_daily_wage).toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Total Wage: ₹{l.total_daily_wage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: STAGE PROGRESS & WHATSAPP REPORT */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* WhatsApp Share Card */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-900/50 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Share2 className="w-4 h-4" /> 1-Click WhatsApp Construction Report
                  </div>
                  <p className="text-xs text-slate-400">
                    Pure site ka material, thekedar aur labor hazira report WhatsApp par bhejne ke liye taiyar hai.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleCopySummary}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center gap-2"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>{copySuccess ? 'Copied!' : 'Copy Summary'}</span>
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" /> WhatsApp Share
                  </button>
                </div>
              </div>

              {/* Stage Progress Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  Site Construction Stage Milestones
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
                  {[
                    { key: 'planning_sanction', label: '1. Map & Pass' },
                    { key: 'foundation_plinth', label: '2. Foundation' },
                    { key: 'structure_lintel', label: '3. RCC Slab' },
                    { key: 'plumbing_electrical', label: '4. Pipes & Wire' },
                    { key: 'plaster_flooring', label: '5. Plaster Tiles' },
                    { key: 'finishing_paint', label: '6. Paint Putty' },
                    { key: 'handover_ready', label: '7. Handover' },
                  ].map(st => {
                    const isCurrent = activeProject.current_stage === st.key;
                    return (
                      <button
                        key={st.key}
                        onClick={() => updateConstructionProject(activeProject.id, { current_stage: st.key as any })}
                        className={`p-3 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md'
                            : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* MODAL 1: ADD CONSTRUCTION PROJECT */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HardHat className="w-5 h-5 text-amber-400" /> Nayi Construction Site Jodein
              </h3>
              <button onClick={() => setIsAddProjectOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Site Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 14 Villa, Commercial Plaza 2nd Floor"
                  value={siteTitle}
                  onChange={e => setSiteTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Site Location / Address</label>
                  <input
                    type="text"
                    placeholder="Plot #, City, Area"
                    value={siteLocation}
                    onChange={e => setSiteLocation(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Target Budget (₹)</label>
                  <input
                    type="number"
                    placeholder="5000000"
                    value={targetBudget}
                    onChange={e => setTargetBudget(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Plot Area (Sqft)</label>
                  <input
                    type="number"
                    placeholder="2000"
                    value={plotArea}
                    onChange={e => setPlotArea(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Built-up Area (Sqft)</label>
                  <input
                    type="number"
                    placeholder="4000"
                    value={builtupArea}
                    onChange={e => setBuiltupArea(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 outline-none"
                  />
                </div>
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
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-500/30"
                >
                  Site Save Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD MATERIAL */}
      {isAddMaterialOpen && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-400" /> Material Delivery Record Karein
              </h3>
              <button onClick={() => setIsAddMaterialOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Material Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ultratech Cement, Tata Sariya 12mm"
                    value={matName}
                    onChange={e => setMatName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Category</label>
                  <select
                    value={matCategory}
                    onChange={e => setMatCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
                  >
                    <option value="cement">🧱 Cement</option>
                    <option value="sariya_steel">🔩 Sariya / Steel</option>
                    <option value="sand_ret_balu">🏖️ Ret / Balu (Sand)</option>
                    <option value="aggregate_rodi_gitti">🪨 Rodi / Gitti</option>
                    <option value="bricks_eent_blocks">🧱 Bricks / Eent</option>
                    <option value="tiles_marble">🏛️ Tiles / Marble</option>
                    <option value="plumbing_sanitary">🚿 Sanitary & Pipes</option>
                    <option value="electrical_wiring">⚡ Electrical Wires</option>
                    <option value="wood_doors_windows">🚪 Doors & Windows</option>
                    <option value="paint_putty">🎨 Paint & Putty</option>
                    <option value="other_material">📝 Other Material</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Quantity *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="100"
                    value={matQuantity}
                    onChange={e => setMatQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="Bags, Tons, Sqft, Brass"
                    value={matUnit}
                    onChange={e => setMatUnit(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Rate / Unit (₹) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="380"
                    value={matRate}
                    onChange={e => setMatRate(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Vendor / Dukandar Name</label>
                  <input
                    type="text"
                    placeholder="Aggarwal Building Store"
                    value={vendorName}
                    onChange={e => setVendorName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Vehicle / Gaadi No.</label>
                  <input
                    type="text"
                    placeholder="e.g. DL 1L 9921"
                    value={vehicleNo}
                    onChange={e => setVehicleNo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddMaterialOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30"
                >
                  Delivery Save Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD THEKEDAR */}
      {isAddThekedarOpen && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Hammer className="w-5 h-5 text-purple-400" /> Naya Thekedar / Contract Jodein
              </h3>
              <button onClick={() => setIsAddThekedarOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleAddThekedar} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Contractor / Agency Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Raju Mistri, Jai Balaji Dhalai Gang"
                    value={thekedarName}
                    onChange={e => setThekedarName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Contractor Category</label>
                  <select
                    value={contractorCategory}
                    onChange={e => setContractorCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-500 outline-none"
                  >
                    <option value="civil_structure">🏗️ Civil Structure & Masonry</option>
                    <option value="dhalai_slab_machine">🚜 3rd-Party Dhalai Machine & Lanter Gang</option>
                    <option value="chokhat_doors">🚪 Chokhat & Door Framing</option>
                    <option value="shuttering">🪵 Shuttering & Scaffolding</option>
                    <option value="lintel_chajja">🧱 Lintel Beam & Chajja</option>
                    <option value="plaster_masonry">🎨 Plaster & Masonry</option>
                    <option value="tiles_flooring">🏛️ Tiles & Flooring</option>
                    <option value="electrician">⚡ Electrician Contract</option>
                    <option value="plumber">🚿 Plumber Contract</option>
                    <option value="painter">🖌️ Paint & Putty</option>
                    <option value="other">📝 Other Speciality</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Work Scope Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Ground+1 Floor RCC, Dhalai Machine with Vibrator"
                    value={thekedarScope}
                    onChange={e => setThekedarScope(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Contractor Mobile No.</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={thekedarPhone}
                    onChange={e => setThekedarPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Unit Basis & Rate Calculation */}
              <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Measurement Unit Basis</label>
                    <select
                      value={unitBasis}
                      onChange={e => setUnitBasis(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                    >
                      <option value="sqft">📐 Per SqFt (sft)</option>
                      <option value="sqmtr">📏 Per SqMtr (smtr)</option>
                      <option value="rft">📏 Running Feet (rft)</option>
                      <option value="lump_sum">📦 Lump-Sum (Total Theka)</option>
                      <option value="item_rate">🔢 Item / Piece Rate</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Rate per Unit (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 240 / sft"
                      value={rateSqft}
                      onChange={e => {
                        const r = e.target.value === '' ? '' : Number(e.target.value);
                        setRateSqft(r);
                        if (r && totalSqft) setContractValue(Number(r) * Number(totalSqft));
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Total Units (Area / Area sft)</label>
                    <input
                      type="number"
                      placeholder="e.g. 2500"
                      value={totalSqft}
                      onChange={e => {
                        const s = e.target.value === '' ? '' : Number(e.target.value);
                        setTotalSqft(s);
                        if (rateSqft && s) setContractValue(Number(rateSqft) * Number(s));
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Total Agreed Theka (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="600000"
                      value={contractValue}
                      onChange={e => setContractValue(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={isThirdPartyDhalai}
                      onChange={e => setIsThirdPartyDhalai(e.target.checked)}
                      className="w-4 h-4 rounded text-purple-600 bg-slate-800 border-slate-700"
                    />
                    <span>🚜 Yeh Third-Party Dhalai / Machine Thekedar hai</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddThekedarOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/30"
                >
                  Thekedar Save Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD RA BILL WITH STAGE PRESETS */}
      {isAddRABillOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-purple-400" /> Milestone Running Account (RA) Bill
              </h3>
              <button onClick={() => setIsAddRABillOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            {/* Quick Stage Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Milestone Presets (Click to Select Stage):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                {[
                  { name: '🧱 Plinth & Foundation Complete', prefix: 'Plinth Level Payment' },
                  { name: '🚪 Chokhat & Frame Level', prefix: 'Chokhat Fitting Payment' },
                  { name: '🏗️ Lintel Beam & Chajja', prefix: 'Lintel Level Payment' },
                  { name: '🏢 Roof Dhalai (Slab Lanter)', prefix: 'Roof Dhalai Major Milestone' },
                  { name: '🧱 Brickwork / Masonry Done', prefix: 'Brickwork Complete' },
                  { name: '🎨 Plaster (Inner & Outer)', prefix: 'Plaster Stage Payment' },
                  { name: '🪟 Tiles & Flooring Complete', prefix: 'Flooring Payment' },
                  { name: '🔑 Final Handover & Retention', prefix: 'Final Handover Balance' },
                  { name: '👷 Daily Wages Kharcha / Khuraki', prefix: 'Daily Running Advance' }
                ].map((st) => (
                  <button
                    key={st.name}
                    type="button"
                    onClick={() => setRaStageName(st.name)}
                    className={`p-2 rounded-xl text-left border transition-all text-[11px] truncate ${
                      raStageName === st.name
                        ? 'bg-purple-600 text-white font-bold border-purple-400 shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddRABill} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">RA Bill No. / Title</label>
                  <input
                    type="text"
                    value={raBillNo}
                    onChange={e => setRaBillNo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Bill Date</label>
                  <input
                    type="date"
                    value={raDate}
                    onChange={e => setRaDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Stage Completed Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1st Floor Roof Dhalai Complete (Badi Rakam)"
                  value={raStageName}
                  onChange={e => setRaStageName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Milestone Bill Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="150000"
                  value={raBillAmount}
                  onChange={e => setRaBillAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-bold focus:border-purple-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="raPaid"
                  checked={raIsPaid}
                  onChange={e => setRaIsPaid(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 bg-slate-800 border-slate-700"
                />
                <label htmlFor="raPaid" className="text-xs text-slate-300 cursor-pointer">
                  Yeh payment abhi de di gayi hai (Mark as Paid)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddRABillOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/30"
                >
                  Milestone Bill Save Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD LABOR HAZIRA */}
      {isAddLaborOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" /> Daily Mistri & Labor Hazira
              </h3>
              <button onClick={() => setIsAddLaborOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleAddLabor} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Date</label>
                <input
                  type="date"
                  value={haziraDate}
                  onChange={e => setHaziraDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Mistri Ginti (Count)</label>
                  <input
                    type="number"
                    value={mistriCount}
                    onChange={e => setMistriCount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Mistri Rate / Day (₹)</label>
                  <input
                    type="number"
                    value={mistriRate}
                    onChange={e => setMistriRate(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Labor Ginti (Count)</label>
                  <input
                    type="number"
                    value={laborCount}
                    onChange={e => setLaborCount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Labor Rate / Day (₹)</label>
                  <input
                    type="number"
                    value={laborRate}
                    onChange={e => setLaborRate(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Supervisor / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Mukesh (Outer wall brick masonry)"
                  value={haziraNotes}
                  onChange={e => setHaziraNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddLaborOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/30"
                >
                  Hazira Record Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
