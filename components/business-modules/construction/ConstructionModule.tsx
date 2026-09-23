'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Hammer, Layers, ShieldCheck, 
  IndianRupee, Users, Truck, Calendar, CheckCircle2, AlertCircle, X, ChevronRight
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export interface ConstructionStage {
  id: string;
  stageName: string; // Foundation, Plinth, Lenter, Plaster, Tiles/Finishing
  budgetAmount: number;
  spentAmount: number;
  contractorName: string;
  contractorPending: number;
  targetFinishDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
}

export interface MaterialOrder {
  id: string;
  materialName: string; // Cement, Sariya, Bricks, Sand, Kota Stone
  vendorName: string;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  deliveryStatus: 'ORDERED' | 'PARTIAL' | 'DELIVERED';
}

export interface DailyLabourRecord {
  id: string;
  date: string;
  masonCount: number; // Mistry count
  labourCount: number; // Mazdoor count
  dailyWagesPaid: number;
  workDone: string;
}

const INITIAL_STAGES: ConstructionStage[] = [
  {
    id: 'c-1',
    stageName: 'नींव व प्लिंथ वर्क (Foundation & Plinth)',
    budgetAmount: 450000,
    spentAmount: 435000,
    contractorName: 'मुकेश ठेकेदार',
    contractorPending: 25000,
    targetFinishDate: '2026-06-30',
    status: 'COMPLETED',
  },
  {
    id: 'c-2',
    stageName: 'आरसीसी लेंटर व दीवारें (Structure & Lenter)',
    budgetAmount: 850000,
    spentAmount: 620000,
    contractorName: 'मुकेश ठेकेदार',
    contractorPending: 75000,
    targetFinishDate: '2026-10-15',
    status: 'IN_PROGRESS',
  },
  {
    id: 'c-3',
    stageName: 'प्लास्टर व फ्लोरिंग (Plaster & Tiles)',
    budgetAmount: 500000,
    spentAmount: 80000,
    contractorName: 'सुरेश टाइल्स कांट्रैक्टर',
    contractorPending: 0,
    targetFinishDate: '2026-12-30',
    status: 'IN_PROGRESS',
  },
];

const INITIAL_MATERIALS: MaterialOrder[] = [
  {
    id: 'mat-1',
    materialName: 'अल्ट्राटेक सीमेंट (300 कट्टे)',
    vendorName: 'श्री श्याम बिल्डिंग मैटेरियल',
    totalAmount: 114000,
    advancePaid: 60000,
    balanceDue: 54000,
    deliveryStatus: 'PARTIAL',
  },
  {
    id: 'mat-2',
    materialName: 'टाटा टिस्कॉन सरिया (4 टन - 12mm & 10mm)',
    vendorName: 'अग्रवाल स्टील कॉर्पोरेशन',
    totalAmount: 264000,
    advancePaid: 264000,
    balanceDue: 0,
    deliveryStatus: 'DELIVERED',
  },
  {
    id: 'mat-3',
    materialName: 'लाल ईंटें (15,000 ईंट भट्टा)',
    vendorName: 'महावीर ईंट उद्योग',
    totalAmount: 90000,
    advancePaid: 40000,
    balanceDue: 50000,
    deliveryStatus: 'ORDERED',
  },
];

const INITIAL_LABOUR: DailyLabourRecord[] = [
  {
    id: 'lab-1',
    date: new Date().toISOString().split('T')[0],
    masonCount: 3,
    labourCount: 6,
    dailyWagesPaid: 6300,
    workDone: 'पहली मंजिल की बाहरी दीवारों की चिनाई व कॉलम ढलाई',
  }
];

export default function ConstructionModule() {
  const [stages, setStages] = useState<ConstructionStage[]>(INITIAL_STAGES);
  const [materials, setMaterials] = useState<MaterialOrder[]>(INITIAL_MATERIALS);
  const [labourRecords, setLabourRecords] = useState<DailyLabourRecord[]>(INITIAL_LABOUR);
  const [activeSubTab, setActiveSubTab] = useState<'STAGES' | 'MATERIALS' | 'LABOUR' | 'FUNDING'>('STAGES');

  // Modals
  const [showAddStageModal, setShowAddStageModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showAddLabourModal, setShowAddLabourModal] = useState(false);

  // Forms State
  const [newStageName, setNewStageName] = useState('');
  const [newStageBudget, setNewStageBudget] = useState('');
  const [newContractorName, setNewContractorName] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('');

  const [matName, setMatName] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [matTotal, setMatTotal] = useState('');
  const [matAdvance, setMatAdvance] = useState('');

  const [mistryCount, setMistryCount] = useState('2');
  const [mazdoorCount, setMazdoorCount] = useState('4');
  const [wagesPaid, setWagesPaid] = useState('');
  const [workDoneDesc, setWorkDoneDesc] = useState('');

  // Funding Overview (Loan vs Self)
  const [homeLoanAmount] = useState(1500000);
  const [selfSavingsAmount] = useState(800000);

  useEffect(() => {
    try {
      const s = localStorage.getItem('fwa_const_stages');
      if (s) setStages(JSON.parse(s));
      const m = localStorage.getItem('fwa_const_materials');
      if (m) setMaterials(JSON.parse(m));
      const l = localStorage.getItem('fwa_const_labour');
      if (l) setLabourRecords(JSON.parse(l));
    } catch (e) {}
  }, []);

  const saveStages = (newList: ConstructionStage[]) => {
    setStages(newList);
    try { localStorage.setItem('fwa_const_stages', JSON.stringify(newList)); } catch (e) {}
  };

  const saveMaterials = (newList: MaterialOrder[]) => {
    setMaterials(newList);
    try { localStorage.setItem('fwa_const_materials', JSON.stringify(newList)); } catch (e) {}
  };

  const saveLabour = (newList: DailyLabourRecord[]) => {
    setLabourRecords(newList);
    try { localStorage.setItem('fwa_const_labour', JSON.stringify(newList)); } catch (e) {}
  };

  // KPI Calculations
  const totalBudget = stages.reduce((s, item) => s + item.budgetAmount, 0);
  const totalSpent = stages.reduce((s, item) => s + item.spentAmount, 0);
  const totalContractorDue = stages.reduce((s, item) => s + item.contractorPending, 0);
  const totalMaterialDue = materials.reduce((s, item) => s + item.balanceDue, 0);
  const totalOutstandingDue = totalContractorDue + totalMaterialDue;

  return (
    <div className="space-y-4">
      {/* 🚀 Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-slate-900 to-zinc-950 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm">मकान निर्माण व प्रोजेक्ट ERP</h3>
                <span className="text-[9px] bg-amber-500/30 text-amber-200 px-1.5 py-0.2 rounded font-mono">
                  {stages.length} चरण (Stages)
                </span>
              </div>
              <p className="text-[11px] text-stone-300">नींव, लेंटर, ठेकेदार हिसाब, सीमेंट-सरिया व लेबर हाजिरी</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddLabourModal(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Users size={13} /> + दैनिक हाजिरी
            </button>
            <button
              onClick={() => setShowAddMaterialModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
            >
              <Truck size={13} /> + सामग्री ऑर्डर
            </button>
          </div>
        </div>

        {/* 📊 KPI Strip */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
          <div>
            <span className="text-[10px] text-stone-300">कुल प्रोजेक्ट बजट</span>
            <Mono className="text-xs font-bold text-white block">₹{totalBudget.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-stone-300">अब तक खर्च</span>
            <Mono className="text-xs font-bold text-amber-300 block">₹{totalSpent.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-rose-300">मार्केट व ठेकेदार बाकी</span>
            <Mono className="text-xs font-bold text-rose-400 block">₹{totalOutstandingDue.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-emerald-300">फंडिंग उपलब्ध</span>
            <Mono className="text-xs font-bold text-emerald-400 block">₹{(homeLoanAmount + selfSavingsAmount - totalSpent).toLocaleString('en-IN')}</Mono>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-paper-dim pb-1 text-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('STAGES')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'STAGES' ? 'bg-navy text-gold-soft' : 'text-ink-muted hover:bg-paper-dim'
          }`}
        >
          निर्माण चरण ({stages.length})
        </button>
        <button
          onClick={() => setActiveSubTab('MATERIALS')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'MATERIALS' ? 'bg-navy text-gold-soft' : 'text-ink-muted hover:bg-paper-dim'
          }`}
        >
          सीमेंट-सरिया मैटेरियल ({materials.length})
        </button>
        <button
          onClick={() => setActiveSubTab('LABOUR')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'LABOUR' ? 'bg-navy text-gold-soft' : 'text-ink-muted hover:bg-paper-dim'
          }`}
        >
          मिस्त्री व लेबर हाजिरी ({labourRecords.length})
        </button>
        <button
          onClick={() => setActiveSubTab('FUNDING')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'FUNDING' ? 'bg-navy text-gold-soft' : 'text-ink-muted hover:bg-paper-dim'
          }`}
        >
          फंडिंग (लोन vs बचत)
        </button>
      </div>

      {/* TAB 1: STAGES & CONTRACTOR */}
      {activeSubTab === 'STAGES' && (
        <div className="space-y-2.5">
          {stages.map(st => {
            const pct = Math.min(100, Math.round((st.spentAmount / (st.budgetAmount || 1)) * 100));
            return (
              <div key={st.id} className="p-3.5 bg-paper rounded-xl border border-paper-dim shadow-xs space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-ink text-sm">{st.stageName}</h4>
                    <p className="text-[11px] text-ink-muted mt-0.5">
                      ठेकेदार: <b>{st.contractorName}</b> • लक्ष्य तारीख: {st.targetFinishDate}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    st.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {st.status === 'COMPLETED' ? '✓ पूरा हुआ' : 'चल रहा है'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-paper-dim rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-emerald-600' : 'bg-amber-600'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] text-ink-muted pt-0.5">
                  <span>खर्च: <b className="text-ink">₹{st.spentAmount.toLocaleString('en-IN')}</b> / ₹{st.budgetAmount.toLocaleString('en-IN')}</span>
                  <span>ठेकेदार बकाया: <b className="text-rose-700">₹{st.contractorPending.toLocaleString('en-IN')}</b></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: MATERIALS & SUPPLIERS */}
      {activeSubTab === 'MATERIALS' && (
        <div className="space-y-2.5">
          {materials.map(mat => (
            <div key={mat.id} className="p-3 bg-paper rounded-xl border border-paper-dim shadow-xs flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <h4 className="font-bold text-ink">{mat.materialName}</h4>
                <p className="text-[11px] text-ink-muted">सप्लायर: <b>{mat.vendorName}</b></p>
                <div className="text-[10px] text-ink-muted">
                  एडवांस दिया: ₹{mat.advancePaid.toLocaleString('en-IN')} • कुल: ₹{mat.totalAmount.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-right space-y-1">
                <Mono className="font-bold text-sm block text-rose-700">
                  {mat.balanceDue > 0 ? `बाकी ₹${mat.balanceDue.toLocaleString('en-IN')}` : '✓ पूरा चुकता'}
                </Mono>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                  mat.deliveryStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {mat.deliveryStatus === 'DELIVERED' ? 'साइट पर पहुंच गया' : 'आना बाकी'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: DAILY LABOUR WAGES */}
      {activeSubTab === 'LABOUR' && (
        <div className="space-y-2.5">
          {labourRecords.map(rec => (
            <div key={rec.id} className="p-3 bg-paper rounded-xl border border-paper-dim shadow-xs flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink">{rec.date}</span>
                  <span className="text-[10px] bg-paper-dim px-1.5 py-0.2 rounded font-medium">
                    {rec.masonCount} मिस्त्री + {rec.labourCount} मजदूर
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted">{rec.workDone}</p>
              </div>
              <div className="text-right">
                <Mono className="font-bold text-rose-700 text-sm block">
                  -₹{rec.dailyWagesPaid.toLocaleString('en-IN')}
                </Mono>
                <span className="text-[9px] text-ink-muted">दैनिक नकद भुगतान</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: FUNDING SOURCE (Home Loan vs Savings) */}
      {activeSubTab === 'FUNDING' && (
        <div className="p-4 bg-paper rounded-xl border border-paper-dim shadow-xs space-y-3 text-xs">
          <h4 className="font-bold text-sm text-ink border-b border-paper-dim pb-2">फंडिंग स्रोत (Fund Source Breakdown)</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
              <span className="text-[10px] font-bold text-blue-900 uppercase">बैंक होम लोन (Sanctioned)</span>
              <Mono className="text-base font-bold text-blue-900 block mt-1">₹{homeLoanAmount.toLocaleString('en-IN')}</Mono>
              <p className="text-[10px] text-blue-700 mt-1">SBI / HDFC होम लोन</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-900 uppercase">खुद की पारिवारिक बचत</span>
              <Mono className="text-base font-bold text-emerald-900 block mt-1">₹{selfSavingsAmount.toLocaleString('en-IN')}</Mono>
              <p className="text-[10px] text-emerald-700 mt-1">बैंक FD व लिक्विड फंड</p>
            </div>
          </div>
          <div className="p-3 bg-paper-dim/40 rounded-xl flex justify-between items-center text-[11px]">
            <span>कुल उपलब्ध फंड: <b>₹{(homeLoanAmount + selfSavingsAmount).toLocaleString('en-IN')}</b></span>
            <span>अब तक लगा: <b className="text-amber-800">₹{totalSpent.toLocaleString('en-IN')}</b></span>
          </div>
        </div>
      )}

      {/* ➕ MODAL: ADD DAILY LABOUR */}
      {showAddLabourModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-sm w-full p-5 space-y-3.5 border border-paper-dim shadow-2xl">
            <div className="flex justify-between items-center border-b border-paper-dim pb-2">
              <h4 className="font-bold text-sm text-ink">दैनिक लेबर व मिस्त्री हाजिरी</h4>
              <button onClick={() => setShowAddLabourModal(false)} className="text-ink-muted hover:text-ink"><X size={16} /></button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const newL: DailyLabourRecord = {
                id: 'lab-' + Date.now(),
                date: new Date().toISOString().split('T')[0],
                masonCount: Number(mistryCount) || 0,
                labourCount: Number(mazdoorCount) || 0,
                dailyWagesPaid: Number(wagesPaid) || 0,
                workDone: workDoneDesc.trim() || 'साइट पर दैनिक निर्माण कार्य',
              };
              saveLabour([newL, ...labourRecords]);
              setShowAddLabourModal(false);
              setWagesPaid('');
              setWorkDoneDesc('');
            }} className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">मिस्त्री संख्या</label>
                  <input
                    type="number"
                    value={mistryCount}
                    onChange={(e) => setMistryCount(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">मजदूर संख्या</label>
                  <input
                    type="number"
                    value={mazdoorCount}
                    onChange={(e) => setMazdoorCount(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">आज कुल दिया नकद वेतन (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="उदा. 4800"
                  value={wagesPaid}
                  onChange={(e) => setWagesPaid(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold text-sm text-ink"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">आज क्या काम हुआ?</label>
                <input
                  type="text"
                  placeholder="उदा. दूसरी मंजिल की चिनाई व तराई"
                  value={workDoneDesc}
                  onChange={(e) => setWorkDoneDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddLabourModal(false)} className="flex-1 py-2 rounded-xl border border-paper-dim font-bold text-ink-muted">रद्द</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold">हाजिरी सेव करें</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ➕ MODAL: ADD MATERIAL ORDER */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-sm w-full p-5 space-y-3.5 border border-paper-dim shadow-2xl">
            <div className="flex justify-between items-center border-b border-paper-dim pb-2">
              <h4 className="font-bold text-sm text-ink">नया निर्माण सामग्री ऑर्डर</h4>
              <button onClick={() => setShowAddMaterialModal(false)} className="text-ink-muted hover:text-ink"><X size={16} /></button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const tot = Number(matTotal) || 0;
              const adv = Number(matAdvance) || 0;
              const newM: MaterialOrder = {
                id: 'mat-' + Date.now(),
                materialName: matName.trim(),
                vendorName: vendorName.trim() || 'General Supplier',
                totalAmount: tot,
                advancePaid: adv,
                balanceDue: Math.max(0, tot - adv),
                deliveryStatus: 'ORDERED',
              };
              saveMaterials([newM, ...materials]);
              setShowAddMaterialModal(false);
              setMatName('');
              setVendorName('');
              setMatTotal('');
              setMatAdvance('');
            }} className="space-y-2.5 text-xs">
              <input
                type="text"
                required
                placeholder="सामग्री (उदा. अल्ट्राटेक सीमेंट 200 कट्टे, रोड़ी 2 ट्राली)"
                value={matName}
                onChange={(e) => setMatName(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold"
              />
              <input
                type="text"
                placeholder="दुकान/सप्लायर का नाम"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  required
                  placeholder="कुल बिल राशि ₹"
                  value={matTotal}
                  onChange={(e) => setMatTotal(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold"
                />
                <input
                  type="number"
                  placeholder="एडवांस दिया ₹"
                  value={matAdvance}
                  onChange={(e) => setMatAdvance(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddMaterialModal(false)} className="flex-1 py-2 rounded-xl border border-paper-dim font-bold text-ink-muted">रद्द</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-navy text-gold font-bold">ऑर्डर सेव करें</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
