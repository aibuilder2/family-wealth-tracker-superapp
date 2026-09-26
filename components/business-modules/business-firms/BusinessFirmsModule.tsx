'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, ArrowRight, DollarSign, Receipt, CheckCircle, ShieldCheck, Wallet, ArrowDownRight, Briefcase, Trash2 } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import { useFamilyStore } from '@/lib/store/familyStore';

interface FirmDrawing {
  id: string;
  amount: number;
  type: 'partner_salary' | 'profit_dividend' | 'director_remuneration';
  targetMember: string;
  date: string;
  note: string;
}

interface BusinessFirm {
  id: string;
  firmName: string;
  entityType: 'Proprietorship' | 'Partnership' | 'Pvt Ltd' | 'LLP';
  gstin?: string;
  pan?: string;
  bankAccount: string;
  totalRevenueThisYear: number;
  totalExpensesThisYear: number;
  currentBankBalance: number;
  drawingsHistory: FirmDrawing[];
}

const DEFAULT_FIRMS: BusinessFirm[] = [];

export function BusinessFirmsModule() {
  const [firms, setFirms] = useState<BusinessFirm[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_biz_firms_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((f: any) => !['firm-1', 'firm-2'].includes(f?.id));
          }
        } catch (e) {}
      }
    }
    return DEFAULT_FIRMS;
  });

  const [selectedFirmId, setSelectedFirmId] = useState<string>(firms[0]?.id || '');
  const [isAddFirmOpen, setIsAddFirmOpen] = useState(false);
  const [isDrawingOpen, setIsDrawingOpen] = useState(false);

  // Form State: New Firm
  const [firmName, setFirmName] = useState('');
  const [entityType, setEntityType] = useState<BusinessFirm['entityType']>('Proprietorship');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [bankAccount, setBankAccount] = useState('');

  // Form State: Drawing
  const [drawAmount, setDrawAmount] = useState<number | ''>('');
  const [drawType, setDrawType] = useState<FirmDrawing['type']>('profit_dividend');
  const { members } = useFamilyStore();
  const [targetMember, setTargetMember] = useState(() => members[0]?.name || 'Ankush kesharwani');

  useEffect(() => {
    if (members.length > 0 && !members.some(m => m.name === targetMember)) {
      setTargetMember(members[0].name);
    }
  }, [members]);
  const [drawNote, setDrawNote] = useState('Month-end business profit payout');

  useEffect(() => {
    localStorage.setItem('fwa_biz_firms_v1', JSON.stringify(firms));
  }, [firms]);

  const activeFirm = firms.find(f => f.id === selectedFirmId) || firms[0];

  const handleAddFirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firmName) return;

    const newFirm: BusinessFirm = {
      id: `firm-${Date.now()}`,
      firmName,
      entityType,
      gstin: gstin ? gstin.toUpperCase() : undefined,
      pan: pan ? pan.toUpperCase() : undefined,
      bankAccount: bankAccount || 'Current Account',
      totalRevenueThisYear: 0,
      totalExpensesThisYear: 0,
      currentBankBalance: 0,
      drawingsHistory: []
    };

    setFirms([...firms, newFirm]);
    setSelectedFirmId(newFirm.id);
    setIsAddFirmOpen(false);
    setFirmName('');
    setGstin('');
    setPan('');
    setBankAccount('');
  };

  const handleDrawingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFirm || !drawAmount) return;

    const amt = Number(drawAmount);
    if (amt > activeFirm.currentBankBalance) {
      if (!confirm('चेतावनी: ट्रांसफर की जाने वाली रकम फर्म के करंट बैंक बैलेंस से अधिक है। क्या आप जारी रखना चाहते हैं?')) {
        return;
      }
    }

    const newDrawing: FirmDrawing = {
      id: `dr-${Date.now()}`,
      amount: amt,
      type: drawType,
      targetMember,
      date: new Date().toISOString().split('T')[0],
      note: drawNote
    };

    const updated: BusinessFirm = {
      ...activeFirm,
      currentBankBalance: Math.max(0, activeFirm.currentBankBalance - amt),
      drawingsHistory: [newDrawing, ...activeFirm.drawingsHistory]
    };

    setFirms(firms.map(f => f.id === activeFirm.id ? updated : f));
    setIsDrawingOpen(false);
    setDrawAmount('');
    alert(`सफलतापूर्वक ₹${amt.toLocaleString('en-IN')} का प्रॉफिट ${targetMember} के पारिवारिक खाते में ट्रांसफर दर्ज हो गया!`);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-navy text-paper p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gold/20 text-gold rounded-xl">
              <Building2 size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold font-serif">Business Firms, GST & Drawings</h2>
              <p className="text-[11px] text-paper-dim/80">पार्टनरशिप/प्रोपराइटरशिप फर्म, GSTIN, करंट अकाउंट व फैमिली ट्रांसफर</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddFirmOpen(true)}
            className="px-3 py-1.5 bg-gold text-navy text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-gold-light active:scale-95 transition-all shadow-sm"
          >
            <Plus size={15} /> नई फर्म
          </button>
        </div>

        {/* Firm Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs pt-1 border-t border-navy-light/40">
          {firms.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFirmId(f.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedFirmId === f.id ? 'bg-gold text-navy shadow-sm' : 'bg-navy-light/50 text-paper-dim hover:bg-navy-light'
              }`}
            >
              🏢 {f.firmName}
            </button>
          ))}
        </div>
      </div>

      {firms.length === 0 && (
        <div className="bg-paper border border-paper-dim rounded-2xl p-8 text-center shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-paper-dim/50 flex items-center justify-center mx-auto text-ink-muted">
            <Building2 size={24} />
          </div>
          <h3 className="text-sm font-bold text-ink">कोई फर्म दर्ज नहीं है</h3>
          <p className="text-xs text-ink-muted max-w-xs mx-auto">
            अपनी प्रोपराइटरशिप या पार्टनरशिप फर्म जोड़ें ताकि व्यापारिक मुनाफ़ा और फैमिली ट्रांसफर ट्रैक हो सके।
          </p>
          <button
            onClick={() => setIsAddFirmOpen(true)}
            className="mt-2 px-4 py-2 bg-gold text-navy text-xs font-bold rounded-xl inline-flex items-center gap-1 hover:bg-gold-light"
          >
            <Plus size={15} /> नई फर्म जोड़ें
          </button>
        </div>
      )}

      {activeFirm && (
        <div className="space-y-3">
          {/* Active Firm Card */}
          <div className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 bg-gold/15 text-gold-dark text-[10px] font-bold rounded uppercase">
                  {activeFirm.entityType}
                </span>
                <h3 className="text-sm font-bold text-ink mt-1">{activeFirm.firmName}</h3>
                <p className="text-xs text-ink-muted">{activeFirm.bankAccount}</p>
                {activeFirm.gstin && (
                  <p className="text-[11px] text-ink-muted mt-0.5">GSTIN: <strong className="font-mono">{activeFirm.gstin}</strong></p>
                )}
              </div>

              <div className="text-right">
                <p className="text-[10px] text-ink-muted">फर्म करंट अकाउंट बैलेंस</p>
                <Mono className="text-base font-bold text-green">₹{activeFirm.currentBankBalance.toLocaleString('en-IN')}</Mono>
              </div>
            </div>

            {/* Action Transfer Profit to Family */}
            <div className="pt-2 border-t border-paper-dim flex items-center justify-between">
              <span className="text-xs text-ink-muted">बिज़नेस का मुनाफ़ा परिवार में लाएं:</span>
              <button
                onClick={() => setIsDrawingOpen(true)}
                className="px-3 py-1.5 bg-gold text-navy font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-gold-light shadow-sm"
              >
                <ArrowDownRight size={15} /> + Transfer Profit to Family
              </button>
            </div>
          </div>

          {/* Drawings History */}
          <div className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
              परिवार को दिया गया प्रॉफिट (Partner Drawings / Payouts)
            </h4>
            {activeFirm.drawingsHistory.length === 0 ? (
              <p className="text-xs text-ink-muted py-2">इस फर्म से अब तक कोई मुनाफ़ा परिवार में ट्रांसफर नहीं हुआ है।</p>
            ) : (
              activeFirm.drawingsHistory.map(dr => (
                <div key={dr.id} className="flex justify-between items-center text-xs border-b border-paper-dim pb-2 last:border-0 last:pb-0">
                  <div>
                    <span className="font-bold text-ink">{dr.targetMember} के खाते में भेजा</span>
                    <p className="text-[10px] text-ink-muted">{dr.date} • {dr.note}</p>
                  </div>
                  <Mono className="font-bold text-green">₹{dr.amount.toLocaleString('en-IN')}</Mono>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Firm Modal */}
      {isAddFirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <h3 className="text-sm font-bold text-ink">नई व्यावसायिक फर्म जोड़ें</h3>
            <form onSubmit={handleAddFirm} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">फर्म का नाम</label>
                <input
                  type="text"
                  placeholder="उदा. शर्मा ट्रेडर्स & सप्लायर्स"
                  value={firmName}
                  onChange={e => setFirmName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">फर्म का प्रकार</label>
                  <select
                    value={entityType}
                    onChange={e => setEntityType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  >
                    <option value="Proprietorship">Proprietorship</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Pvt Ltd">Pvt Ltd</option>
                    <option value="LLP">LLP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">GSTIN (वैकल्पिक)</label>
                  <input
                    type="text"
                    placeholder="09AAAAA0000A1Z5"
                    value={gstin}
                    onChange={e => setGstin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim uppercase font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-ink-muted mb-1">करंट बैंक अकाउंट विवरण</label>
                <input
                  type="text"
                  placeholder="उदा. HDFC Bank Current A/c - 50200..."
                  value={bankAccount}
                  onChange={e => setBankAccount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddFirmOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gold text-navy font-bold hover:bg-gold-light"
                >
                  फर्म जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Drawing Modal */}
      {isDrawingOpen && activeFirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <h3 className="text-sm font-bold text-ink">फर्म का मुनाफ़ा परिवार में ट्रांसफर करें</h3>
            <p className="text-xs text-ink-muted">फर्म: {activeFirm.firmName} (करंट बैलेंस: ₹{activeFirm.currentBankBalance.toLocaleString('en-IN')})</p>

            <form onSubmit={handleDrawingSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">ट्रांसफर रकम (₹)</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={drawAmount}
                  onChange={e => setDrawAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">किस सदस्य को?</label>
                  <select
                    value={targetMember}
                    onChange={e => setTargetMember(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-semibold"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.name}>
                        {m.name} {m.relationship ? `(${m.relationship})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">भुगतान प्रकार</label>
                  <select
                    value={drawType}
                    onChange={e => setDrawType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  >
                    <option value="profit_dividend">मुनाफ़ा (Profit Dividend)</option>
                    <option value="partner_salary">पार्टनर वेतन (Salary)</option>
                    <option value="director_remuneration">रेमुनरेशन (Remuneration)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-ink-muted mb-1">नोट / विवरण</label>
                <input
                  type="text"
                  value={drawNote}
                  onChange={e => setDrawNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDrawingOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-green text-paper font-bold"
                >
                  ट्रांसफर दर्ज करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
