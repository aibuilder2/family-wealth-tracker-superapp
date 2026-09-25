'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, Plus, TrendingUp, Calendar, Trash2, CheckCircle2, DollarSign } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

interface AgriLand {
  id: string;
  name: string;
  areaAcres: number;
  mode: 'self' | 'theka' | 'adhiya'; // self kheti, contract theka, half sharing
  thekaAmountPerYear?: number;
  thekedaarName?: string;
  currentCrop: string;
  expenses: { id: string; title: string; amount: number; category: string; date: string }[];
  sales: { id: string; cropName: string; quintals: number; ratePerQuintal: number; govtBonus: number; totalAmount: number; date: string }[];
}

const DEFAULT_AGRI: AgriLand[] = [];

export function AgricultureModule() {
  const [lands, setLands] = useState<AgriLand[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_agri_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((l: any) => !['land-1', 'land-2'].includes(l?.id));
          }
        } catch (e) { }
      }
    }
    return DEFAULT_AGRI;
  });

  const [selectedLandId, setSelectedLandId] = useState<string>(lands[0]?.id || '');
  const [isAddLandOpen, setIsAddLandOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);

  // Form State
  const [landName, setLandName] = useState('');
  const [area, setArea] = useState<number | ''>('');
  const [mode, setMode] = useState<'self' | 'theka' | 'adhiya'>('self');
  const [thekaAmt, setThekaAmt] = useState<number | ''>('');
  const [crop, setCrop] = useState('');

  // Expense Form
  const [expTitle, setExpTitle] = useState('');
  const [expAmt, setExpAmt] = useState<number | ''>('');
  const [expCat, setExpCat] = useState('खाद/बीज');

  // Sale Form
  const [saleCrop, setSaleCrop] = useState('');
  const [quintals, setQuintals] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [bonus, setBonus] = useState<number | ''>('');

  useEffect(() => {
    localStorage.setItem('fwa_agri_v1', JSON.stringify(lands));
  }, [lands]);

  const activeLand = lands.find(l => l.id === selectedLandId) || lands[0];

  const handleAddLand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landName || !area) return;

    const newLand: AgriLand = {
      id: `land-${Date.now()}`,
      name: landName,
      areaAcres: Number(area),
      mode,
      thekaAmountPerYear: thekaAmt ? Number(thekaAmt) : undefined,
      currentCrop: crop || 'गेहूं',
      expenses: [],
      sales: []
    };

    setLands([...lands, newLand]);
    setSelectedLandId(newLand.id);
    setIsAddLandOpen(false);
    setLandName('');
    setArea('');
    setThekaAmt('');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLand || !expTitle || !expAmt) return;

    const updated = {
      ...activeLand,
      expenses: [
        { id: `e-${Date.now()}`, title: expTitle, amount: Number(expAmt), category: expCat, date: new Date().toISOString().split('T')[0] },
        ...activeLand.expenses
      ]
    };

    setLands(lands.map(l => l.id === activeLand.id ? updated : l));
    setIsAddExpenseOpen(false);
    setExpTitle('');
    setExpAmt('');
  };

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLand || !saleCrop || !quintals || !rate) return;

    const q = Number(quintals);
    const r = Number(rate);
    const b = Number(bonus) || 0;
    const total = (q * r) + b;

    const updated = {
      ...activeLand,
      sales: [
        { id: `s-${Date.now()}`, cropName: saleCrop, quintals: q, ratePerQuintal: r, govtBonus: b, totalAmount: total, date: new Date().toISOString().split('T')[0] },
        ...activeLand.sales
      ]
    };

    setLands(lands.map(l => l.id === activeLand.id ? updated : l));
    setIsAddSaleOpen(false);
    setSaleCrop('');
    setQuintals('');
    setRate('');
    setBonus('');
  };

  const totalAgriIncome = lands.reduce((sum, l) => {
    const theka = l.thekaAmountPerYear || 0;
    const cropSales = l.sales.reduce((s, sale) => s + sale.totalAmount, 0);
    return sum + theka + cropSales;
  }, 0);

  const totalAgriExpense = lands.reduce((sum, l) => {
    return sum + l.expenses.reduce((s, exp) => s + exp.amount, 0);
  }, 0);

  const netAgriProfit = totalAgriIncome - totalAgriExpense;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-navy text-paper p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-green/20 text-green rounded-xl">
              <Sprout size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold font-serif">Krishi & Agri Land (कृषि बही-खाता)</h2>
              <p className="text-[11px] text-paper-dim/80">खुद की खेती, ठेका/अधिया, खाद/डीजल ख़र्च व मंडी बोनस हिसाब</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddLandOpen(true)}
            className="px-3 py-1.5 bg-gold text-navy text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-gold-light active:scale-95 transition-all shadow-sm"
          >
            <Plus size={15} /> नया खेत
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-navy-light/40 text-center">
          <div className="bg-navy-light/40 p-2 rounded-xl">
            <p className="text-[10px] text-paper-dim/70">कुल फसल/ठेका आय</p>
            <Mono className="text-sm font-bold text-green">₹{totalAgriIncome.toLocaleString('en-IN')}</Mono>
          </div>
          <div className="bg-navy-light/40 p-2 rounded-xl">
            <p className="text-[10px] text-paper-dim/70">कुल खेती ख़र्च</p>
            <Mono className="text-sm font-bold text-coral-light">₹{totalAgriExpense.toLocaleString('en-IN')}</Mono>
          </div>
          <div className="bg-navy-light/40 p-2 rounded-xl">
            <p className="text-[10px] text-paper-dim/70">शुद्ध खेती मुनाफा</p>
            <Mono className="text-sm font-bold text-gold">₹{netAgriProfit.toLocaleString('en-IN')}</Mono>
          </div>
        </div>
      </div>

      {/* Land Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {lands.map(l => (
          <button
            key={l.id}
            onClick={() => setSelectedLandId(l.id)}
            className={`px-3 py-2 rounded-xl whitespace-nowrap font-bold transition-all ${
              selectedLandId === l.id ? 'bg-gold text-navy shadow-sm' : 'bg-paper text-ink-muted border border-paper-dim'
            }`}
          >
            🌾 {l.name} ({l.areaAcres} एकड़)
          </button>
        ))}
      </div>

      {lands.length === 0 && (
        <div className="bg-paper border border-paper-dim rounded-2xl p-8 text-center shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-paper-dim/50 flex items-center justify-center mx-auto text-ink-muted">
            <Sprout size={24} />
          </div>
          <h3 className="text-sm font-bold text-ink">कोई कृषि भूमि दर्ज नहीं है</h3>
          <p className="text-xs text-ink-muted max-w-xs mx-auto">
            अपने खेत, ठेका/बटाई, खाद-बीज के ख़र्चे और मंडी की फसल बिक्री ट्रैक करने के लिए खेत जोड़ें।
          </p>
          <button
            onClick={() => setIsAddLandOpen(true)}
            className="mt-2 px-4 py-2 bg-gold text-navy text-xs font-bold rounded-xl inline-flex items-center gap-1 hover:bg-gold-light"
          >
            <Plus size={15} /> नया खेत जोड़ें
          </button>
        </div>
      )}

      {activeLand && (
        <div className="space-y-3">
          {/* Active Land Details */}
          <div className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 bg-paper-dim text-[10px] font-bold uppercase rounded-md text-ink">
                  {activeLand.mode === 'self' ? 'खुद की खेती' : activeLand.mode === 'theka' ? 'वार्षिक ठेका' : 'अधिया (50-50)'}
                </span>
                <h3 className="text-sm font-bold text-ink mt-1">{activeLand.name}</h3>
                <p className="text-xs text-ink-muted">फसल: {activeLand.currentCrop}</p>
              </div>

              {activeLand.mode === 'theka' && activeLand.thekaAmountPerYear && (
                <div className="text-right">
                  <p className="text-[10px] text-ink-muted">सालाना ठेका आय</p>
                  <Mono className="text-sm font-bold text-green">₹{activeLand.thekaAmountPerYear.toLocaleString('en-IN')}/वर्ष</Mono>
                  <p className="text-[10px] text-ink-muted">ठेकेदार: {activeLand.thekedaarName || 'दर्ज नहीं'}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-paper-dim">
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="flex-1 py-1.5 rounded-xl bg-paper-dim text-coral font-bold text-xs flex items-center justify-center gap-1 hover:bg-paper-dim/80"
              >
                <Plus size={14} /> + खाद/डीजल ख़र्च
              </button>
              <button
                onClick={() => setIsAddSaleOpen(true)}
                className="flex-1 py-1.5 rounded-xl bg-green text-paper font-bold text-xs flex items-center justify-center gap-1 hover:bg-green/90"
              >
                <Plus size={14} /> + मंडी फसल बिक्री
              </button>
            </div>
          </div>

          {/* Expenses & Sales List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Expenses */}
            <div className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">खेती ख़र्च ({activeLand.expenses.length})</h4>
              {activeLand.expenses.length === 0 ? (
                <p className="text-xs text-ink-muted py-2">कोई ख़र्च दर्ज नहीं</p>
              ) : (
                activeLand.expenses.map(e => (
                  <div key={e.id} className="flex justify-between items-center text-xs border-b border-paper-dim pb-1.5 last:border-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-ink">{e.title}</p>
                      <p className="text-[10px] text-ink-muted">{e.date} • {e.category}</p>
                    </div>
                    <Mono className="font-bold text-coral">₹{e.amount.toLocaleString('en-IN')}</Mono>
                  </div>
                ))
              )}
            </div>

            {/* Sales */}
            <div className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">मंडी बिक्री व बोनस ({activeLand.sales.length})</h4>
              {activeLand.sales.length === 0 ? (
                <p className="text-xs text-ink-muted py-2">कोई बिक्री दर्ज नहीं</p>
              ) : (
                activeLand.sales.map(s => (
                  <div key={s.id} className="flex justify-between items-center text-xs border-b border-paper-dim pb-1.5 last:border-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-ink">{s.cropName}</p>
                      <p className="text-[10px] text-ink-muted">{s.quintals} क्विंटल @ ₹{s.ratePerQuintal} + ₹{s.govtBonus} बोनस</p>
                    </div>
                    <Mono className="font-bold text-green">₹{s.totalAmount.toLocaleString('en-IN')}</Mono>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Land Modal */}
      {isAddLandOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <h3 className="text-sm font-bold text-ink">नया खेत / ज़मीन जोड़ें</h3>
            <form onSubmit={handleAddLand} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">खेत का नाम</label>
                <input
                  type="text"
                  placeholder="उदा. बोरवेल वाला खेत"
                  value={landName}
                  onChange={e => setLandName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">क्षेत्रफल (एकड़)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="3.5"
                    value={area}
                    onChange={e => setArea(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">प्रकार</label>
                  <select
                    value={mode}
                    onChange={e => setMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  >
                    <option value="self">खुद की खेती</option>
                    <option value="theka">ठेका (Theka)</option>
                    <option value="adhiya">अधिया (50-50)</option>
                  </select>
                </div>
              </div>

              {mode === 'theka' && (
                <div>
                  <label className="block text-ink-muted mb-1">सालाना ठेका रकम (₹)</label>
                  <input
                    type="number"
                    placeholder="120000"
                    value={thekaAmt}
                    onChange={e => setThekaAmt(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
              )}

              <div>
                <label className="block text-ink-muted mb-1">मौजूदा फसल</label>
                <input
                  type="text"
                  placeholder="उदा. गेहूं / धान / सरसों"
                  value={crop}
                  onChange={e => setCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddLandOpen(false)}
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

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <h3 className="text-sm font-bold text-ink">खेती ख़र्च जोड़ें</h3>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">ख़र्च का विवरण</label>
                <input
                  type="text"
                  placeholder="उदा. DAP खाद 4 बोरी"
                  value={expTitle}
                  onChange={e => setExpTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">रकम (₹)</label>
                  <input
                    type="number"
                    placeholder="5400"
                    value={expAmt}
                    onChange={e => setExpAmt(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">श्रेणी</label>
                  <select
                    value={expCat}
                    onChange={e => setExpCat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  >
                    <option value="खाद/बीज">खाद/बीज</option>
                    <option value="डीजल/ट्रैक्टर">डीजल/ट्रैक्टर</option>
                    <option value="मजदूरी/निराई">मजदूरी/निराई</option>
                    <option value="सिंचाई/बिजली">सिंचाई/बिजली</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-coral text-paper font-bold"
                >
                  ख़र्च जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Sale Modal */}
      {isAddSaleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <h3 className="text-sm font-bold text-ink">मंडी फसल बिक्री व सरकारी बोनस</h3>
            <form onSubmit={handleAddSale} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">फसल का नाम</label>
                <input
                  type="text"
                  placeholder="उदा. गेहूं (Wheat)"
                  value={saleCrop}
                  onChange={e => setSaleCrop(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">कुल वजन (क्विंटल)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="50"
                    value={quintals}
                    onChange={e => setQuintals(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">मंडी भाव (₹/क्विंटल)</label>
                  <input
                    type="number"
                    placeholder="2275"
                    value={rate}
                    onChange={e => setRate(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink-muted mb-1">सरकारी बोनस / सब्सिडी (₹ यदि मिली हो)</label>
                <input
                  type="number"
                  placeholder="10000"
                  value={bonus}
                  onChange={e => setBonus(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSaleOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-green text-paper font-bold"
                >
                  बिक्री दर्ज करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
