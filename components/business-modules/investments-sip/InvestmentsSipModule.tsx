'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, PiggyBank, Landmark, ShieldCheck, ArrowUpRight, Sparkles, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

interface InvestmentRecord {
  id: string;
  title: string;
  type: 'sip' | 'fd' | 'rd' | 'stock' | 'gold_bond';
  institution: string; // e.g. Zerodha, SBI, HDFC Mutual Fund
  investedAmount: number;
  currentValue: number;
  monthlySipAmount?: number;
  sipDate?: number; // e.g. 5th
  maturityDate?: string;
  interestRate?: number;
  member: string; // Papa, Rohan, Mummy, Priya
}

const DEFAULT_INVESTMENTS: InvestmentRecord[] = [];

export function InvestmentsSipModule() {
  const [investments, setInvestments] = useState<InvestmentRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_investments_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed.filter(i => !['inv-1', 'inv-2', 'inv-3', 'inv-4'].includes(i.id));
        } catch (e) { }
      }
    }
    return [];
  });

  const [filterType, setFilterType] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'sip' | 'fd' | 'rd' | 'stock' | 'gold_bond'>('sip');
  const [institution, setInstitution] = useState('');
  const [investedAmount, setInvestedAmount] = useState<number | ''>('');
  const [currentValue, setCurrentValue] = useState<number | ''>('');
  const [monthlySip, setMonthlySip] = useState<number | ''>('');
  const [sipDate, setSipDate] = useState<number>(5);
  const [interestRate, setInterestRate] = useState<number | ''>('');
  const [maturityDate, setMaturityDate] = useState('');
  const [member, setMember] = useState('रोहन');

  useEffect(() => {
    localStorage.setItem('fwa_investments_v1', JSON.stringify(investments));
  }, [investments]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !institution || !investedAmount) return;

    const inv: InvestmentRecord = {
      id: `inv-${Date.now()}`,
      title,
      type,
      institution,
      investedAmount: Number(investedAmount),
      currentValue: Number(currentValue) || Number(investedAmount),
      monthlySipAmount: monthlySip ? Number(monthlySip) : undefined,
      sipDate: type === 'sip' || type === 'rd' ? sipDate : undefined,
      interestRate: interestRate ? Number(interestRate) : undefined,
      maturityDate: maturityDate || undefined,
      member
    };

    setInvestments([inv, ...investments]);
    setIsAddOpen(false);
    setTitle('');
    setInstitution('');
    setInvestedAmount('');
    setCurrentValue('');
    setMonthlySip('');
    setInterestRate('');
    setMaturityDate('');
  };

  const handleDelete = (id: string) => {
    if (confirm('क्या आप इस निवेश को हटाना चाहते हैं?')) {
      setInvestments(investments.filter(i => i.id !== id));
    }
  };

  const filtered = filterType === 'all' ? investments : investments.filter(i => i.type === filterType);

  const totalInvested = investments.reduce((sum, i) => sum + i.investedAmount, 0);
  const totalCurrent = investments.reduce((sum, i) => sum + i.currentValue, 0);
  const totalProfit = totalCurrent - totalInvested;
  const profitPercentage = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(1) : '0';
  const totalMonthlySip = investments.filter(i => i.type === 'sip').reduce((sum, i) => sum + (i.monthlySipAmount || 0), 0);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-navy text-paper p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-green/20 text-green rounded-xl">
              <TrendingUp size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold font-serif">SIP, RD, FD & Stock Investments</h2>
              <p className="text-[11px] text-paper-dim/80">म्यूचुअल फंड SIP, बैंक FD/RD, शेयर्स व गोल्ड बॉन्ड पोर्टफोलियो</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3 py-1.5 bg-gold text-navy text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-gold-light active:scale-95 transition-all shadow-sm"
          >
            <Plus size={15} /> नया निवेश
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-navy-light/40 text-center">
          <div className="bg-navy-light/40 p-2 rounded-xl">
            <p className="text-[10px] text-paper-dim/70">कुल निवेशित रकम</p>
            <Mono className="text-sm font-bold text-paper">₹{totalInvested.toLocaleString('en-IN')}</Mono>
          </div>
          <div className="bg-navy-light/40 p-2 rounded-xl">
            <p className="text-[10px] text-paper-dim/70">वर्तमान मूल्य</p>
            <Mono className="text-sm font-bold text-gold">₹{totalCurrent.toLocaleString('en-IN')}</Mono>
          </div>
          <div className="bg-navy-light/40 p-2 rounded-xl">
            <p className="text-[10px] text-paper-dim/70">कुल मुनाफा</p>
            <Mono className="text-sm font-bold text-green">+{profitPercentage}%</Mono>
          </div>
        </div>

        {totalMonthlySip > 0 && (
          <div className="bg-green/10 border border-green/30 px-3 py-2 rounded-xl flex items-center justify-between text-xs">
            <span className="text-paper-dim">मासिक ऑटो-डेबिट SIP:</span>
            <Mono className="font-bold text-green">₹{totalMonthlySip.toLocaleString('en-IN')}/माह</Mono>
          </div>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'all', label: 'सभी निवेश' },
          { key: 'sip', label: '📈 SIP (Mutual Funds)' },
          { key: 'fd', label: '🏦 FD (Fixed Deposit)' },
          { key: 'rd', label: '🪙 RD (Recurring)' },
          { key: 'stock', label: '📊 Shares/Demat' }
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilterType(f.key)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
              filterType === f.key ? 'bg-gold text-navy shadow-sm' : 'bg-paper text-ink-muted border border-paper-dim'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Investments List */}
      <div className="space-y-3">
        {filtered.map(inv => {
          const gain = inv.currentValue - inv.investedAmount;
          const gainPct = inv.investedAmount > 0 ? ((gain / inv.investedAmount) * 100).toFixed(1) : '0';

          return (
            <div key={inv.id} className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-paper-dim text-ink-muted text-[10px] font-bold rounded-md uppercase">
                      {inv.type}
                    </span>
                    <span className="text-[11px] text-ink-muted">{inv.institution}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-gold/15 text-gold-dark rounded font-semibold">
                      👤 {inv.member}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-ink mt-0.5">{inv.title}</h4>
                </div>
                <div className="text-right">
                  <Mono className="text-sm font-bold text-ink">₹{inv.currentValue.toLocaleString('en-IN')}</Mono>
                  <p className={`text-[10px] font-semibold ${gain >= 0 ? 'text-green' : 'text-coral'}`}>
                    {gain >= 0 ? `+₹${gain.toLocaleString('en-IN')} (+${gainPct}%)` : `-₹${Math.abs(gain).toLocaleString('en-IN')} (${gainPct}%)`}
                  </p>
                </div>
              </div>

              {inv.monthlySipAmount && (
                <div className="bg-paper-dim/40 px-3 py-1.5 rounded-xl text-xs flex justify-between text-ink-muted">
                  <span>मासिक SIP किस्त:</span>
                  <span className="font-semibold text-ink">₹{inv.monthlySipAmount.toLocaleString('en-IN')} (हर महीने {inv.sipDate} तारीख)</span>
                </div>
              )}

              {inv.maturityDate && (
                <div className="bg-paper-dim/40 px-3 py-1.5 rounded-xl text-xs flex justify-between text-ink-muted">
                  <span>FD मैच्योरिटी तारीख:</span>
                  <span className="font-semibold text-ink">{inv.maturityDate} ({inv.interestRate}% ब्याज)</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[11px] text-ink-muted">निवेशित: ₹{inv.investedAmount.toLocaleString('en-IN')}</span>
                <button
                  onClick={() => handleDelete(inv.id)}
                  className="text-coral hover:text-coral-dark p-1"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-ink">नया निवेश जोड़ें</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">फंड / स्कीम का नाम</label>
                <input
                  type="text"
                  placeholder="उदा. SBI Nifty Index Fund या SBI 3-Year FD"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">निवेश का प्रकार</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                  >
                    <option value="sip">SIP (Mutual Fund)</option>
                    <option value="fd">Fixed Deposit (FD)</option>
                    <option value="rd">Recurring Deposit (RD)</option>
                    <option value="stock">Direct Stock / Demat</option>
                    <option value="gold_bond">Sovereign Gold Bond (SGB)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">संस्थान / ब्रोकर</label>
                  <input
                    type="text"
                    placeholder="उदा. Zerodha / SBI / Groww"
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">कुल निवेशित रकम (₹)</label>
                  <input
                    type="number"
                    placeholder="100000"
                    value={investedAmount}
                    onChange={e => setInvestedAmount(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">वर्तमान मूल्य (₹)</label>
                  <input
                    type="number"
                    placeholder="115000"
                    value={currentValue}
                    onChange={e => setCurrentValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {type === 'sip' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-ink-muted mb-1">मासिक SIP (₹)</label>
                    <input
                      type="number"
                      placeholder="5000"
                      value={monthlySip}
                      onChange={e => setMonthlySip(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-ink-muted mb-1">SIP तारीख (हर महीने)</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={sipDate}
                      onChange={e => setSipDate(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              )}

              {type === 'fd' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-ink-muted mb-1">ब्याज दर (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="7.1"
                      value={interestRate}
                      onChange={e => setInterestRate(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-ink-muted mb-1">मैच्योरिटी तारीख</label>
                    <input
                      type="date"
                      value={maturityDate}
                      onChange={e => setMaturityDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-ink-muted mb-1">किस सदस्य का निवेश है?</label>
                <select
                  value={member}
                  onChange={e => setMember(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                >
                  <option value="पापा">पापा</option>
                  <option value="मम्मी">मम्मी</option>
                  <option value="रोहन">रोहन</option>
                  <option value="प्रिया">प्रिया</option>
                </select>
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
    </div>
  );
}
