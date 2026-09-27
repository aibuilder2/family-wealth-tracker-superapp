'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Store, Plus, ShoppingBag, ArrowUpRight, ArrowDownRight, CreditCard, 
  X, TrendingUp, Calculator, Share2, CheckCircle2, Clock, Users,
  Sliders, FileText, Check, AlertCircle, Trash2, Phone
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export interface PartyTradeInvoice {
  id: string;
  partyName: string;
  phone?: string;
  billNumber?: string;
  date: string;
  saleAmount: number; // बिक्री राशि (e.g. ₹16,590)
  costCalculationType: 'margin_percent' | 'manual_purchase';
  marginPercent: number; // e.g. 10% or 15%
  purchaseCost: number; // खरीद लागत (e.g. ₹14,931 at 10%)
  grossProfit: number; // शुद्ध मुनाफा (e.g. ₹1,659 at 10%)
  paymentStatus: 'PAID' | 'UDHAR_PENDING';
  paidAmount: number;
  notes?: string;
}

export default function RetailShopModule() {
  // Global Standard Profit Margin Setting (Default 10%)
  const [defaultMarginPercent, setDefaultMarginPercent] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_trade_default_margin_v1');
      if (saved) return Number(saved) || 10;
    }
    return 10;
  });

  // Party Invoices Ledger State
  const [invoices, setInvoices] = useState<PartyTradeInvoice[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_trade_party_invoices_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {}
      }
    }
    // Pre-seeded with the user's exact ₹16,590 party bill showing 10% true profit!
    return [
      {
        id: 'inv-16590',
        partyName: 'गुप्ता जी ट्रेडर्स (पार्टी 1)',
        phone: '9876543210',
        billNumber: 'BILL-001',
        date: new Date().toISOString().split('T')[0],
        saleAmount: 16590,
        costCalculationType: 'margin_percent',
        marginPercent: 10,
        purchaseCost: 14931,
        grossProfit: 1659,
        paymentStatus: 'UDHAR_PENDING',
        paidAmount: 0,
        notes: 'माल सप्लाई बिल (10% मानक मुनाफा मार्जिन)',
      },
    ];
  });

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [partyName, setPartyName] = useState('');
  const [phone, setPhone] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [saleAmount, setSaleAmount] = useState<string>('16590');
  const [costMethod, setCostMethod] = useState<'margin_percent' | 'manual_purchase'>('margin_percent');
  const [customMargin, setCustomMargin] = useState<string>('10');
  const [manualPurchaseCost, setManualPurchaseCost] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'PAID' | 'UDHAR_PENDING'>('UDHAR_PENDING');
  const [notes, setNotes] = useState('');

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('fwa_trade_party_invoices_v1', JSON.stringify(invoices));
      localStorage.setItem('fwa_trade_default_margin_v1', String(defaultMarginPercent));
    } catch (e) {}
  }, [invoices, defaultMarginPercent]);

  // Real-time calculation inside modal
  const computedCalculation = useMemo(() => {
    const sale = Number(saleAmount) || 0;
    if (sale <= 0) return { purchaseCost: 0, profit: 0, margin: 0 };

    if (costMethod === 'margin_percent') {
      const margin = Number(customMargin) || 10;
      const profit = Math.round((sale * margin) / 100);
      const purchase = sale - profit;
      return { purchaseCost: purchase, profit, margin };
    } else {
      const purchase = Number(manualPurchaseCost) || 0;
      const profit = sale - purchase;
      const margin = sale > 0 ? Number(((profit / sale) * 100).toFixed(1)) : 0;
      return { purchaseCost: purchase, profit, margin };
    }
  }, [saleAmount, costMethod, customMargin, manualPurchaseCost]);

  // Overall KPI Aggregations
  const totalSales = useMemo(() => invoices.reduce((sum, inv) => sum + inv.saleAmount, 0), [invoices]);
  const totalPurchaseCost = useMemo(() => invoices.reduce((sum, inv) => sum + inv.purchaseCost, 0), [invoices]);
  const totalGrossProfit = useMemo(() => invoices.reduce((sum, inv) => sum + inv.grossProfit, 0), [invoices]);
  const overallMarginPercent = totalSales > 0 ? ((totalGrossProfit / totalSales) * 100).toFixed(1) : '0';
  const totalPendingUdhar = useMemo(() => 
    invoices.filter(inv => inv.paymentStatus === 'UDHAR_PENDING')
      .reduce((sum, inv) => sum + (inv.saleAmount - inv.paidAmount), 0), 
    [invoices]
  );
  const totalCashCollected = totalSales - totalPendingUdhar;

  // Add Invoice Handler
  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const sale = Number(saleAmount) || 0;
    if (!partyName.trim() || sale <= 0) return;

    const newInvoice: PartyTradeInvoice = {
      id: 'inv-' + Date.now(),
      partyName: partyName.trim(),
      phone: phone.trim() || undefined,
      billNumber: billNumber.trim() || `BILL-${invoices.length + 1}`,
      date: billDate,
      saleAmount: sale,
      costCalculationType: costMethod,
      marginPercent: computedCalculation.margin,
      purchaseCost: computedCalculation.purchaseCost,
      grossProfit: computedCalculation.profit,
      paymentStatus,
      paidAmount: paymentStatus === 'PAID' ? sale : 0,
      notes: notes.trim() || undefined,
    };

    setInvoices([newInvoice, ...invoices]);
    setShowAddModal(false);

    // Reset Form
    setPartyName('');
    setPhone('');
    setBillNumber('');
    setSaleAmount('');
    setManualPurchaseCost('');
    setNotes('');
  };

  // Toggle Payment Status
  const handleTogglePayment = (id: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== id) return inv;
      const nextStatus = inv.paymentStatus === 'PAID' ? 'UDHAR_PENDING' : 'PAID';
      return {
        ...inv,
        paymentStatus: nextStatus,
        paidAmount: nextStatus === 'PAID' ? inv.saleAmount : 0,
      };
    }));
  };

  // Delete Invoice
  const handleDeleteInvoice = (id: string) => {
    if (confirm('क्या आप इस पार्टी बिल को हटाना चाहते हैं?')) {
      setInvoices(prev => prev.filter(inv => inv.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* 🚀 Header & Business P&L Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-emerald-950 text-white shadow-xl border border-indigo-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Store className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">व्यापारिक पार्टी बिलिंग व लाभ-हानि (P&L Hub)</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  {invoices.length} पार्टियां
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                हर बिक्री के विरुद्ध खरीद लागत व 10%/15% मुनाफा मार्जिन का शुद्ध हिसाब-किताब
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setCustomMargin(String(defaultMarginPercent));
                setShowAddModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={15} /> + नया पार्टी बिल जोड़ें
            </button>
          </div>
        </div>

        {/* 📊 KPI Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3.5 border-t border-white/10 text-center">
          <div className="bg-white/5 p-2.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">कुल बिक्री (Turnover)</span>
            <Mono className="text-base sm:text-lg font-black text-white block mt-0.5">
              ₹{totalSales.toLocaleString('en-IN')}
            </Mono>
          </div>

          <div className="bg-white/5 p-2.5 rounded-2xl">
            <span className="text-[10px] text-amber-300 uppercase tracking-wider block">खरीद लागत (COGS)</span>
            <Mono className="text-base sm:text-lg font-black text-amber-300 block mt-0.5">
              ₹{totalPurchaseCost.toLocaleString('en-IN')}
            </Mono>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-2xl">
            <span className="text-[10px] text-emerald-300 uppercase tracking-wider block">शुद्ध व्यापार मुनाफा (Profit)</span>
            <Mono className="text-base sm:text-lg font-black text-emerald-400 block mt-0.5">
              ₹{totalGrossProfit.toLocaleString('en-IN')}
            </Mono>
            <span className="text-[10px] text-emerald-300/80 font-bold block mt-0.5">
              औसत मार्जिन: {overallMarginPercent}%
            </span>
          </div>

          <div className="bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-2xl">
            <span className="text-[10px] text-rose-300 uppercase tracking-wider block">मार्केट में बाकी उधारी</span>
            <Mono className="text-base sm:text-lg font-black text-rose-300 block mt-0.5">
              ₹{totalPendingUdhar.toLocaleString('en-IN')}
            </Mono>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              प्राप्त नकद: ₹{totalCashCollected.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* ⚙️ Standard Profit Margin % Bar (How Companies Manage It) */}
      <div className="p-3.5 bg-paper rounded-2xl border border-paper-dim shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-ink">मानक व्यापार मुनाफा दर (Default Profit Margin %)</h4>
          </div>
          <p className="text-[11px] text-ink-muted">
            बड़ी कंपनियां हर छोटे बिल पर अलग से खरीद दर्ज नहीं करतीं; वे एक मानक मार्जिन (जैसे 10% या 15%) तय करती हैं जिससे ₹16,590 जैसी बिक्री में शुद्ध मुनाफा (₹1,659) स्वतः निकल जाता है।
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          {[8, 10, 12, 15, 20].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setDefaultMarginPercent(pct)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                defaultMarginPercent === pct
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-paper-dim text-ink-muted hover:text-ink'
              }`}
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>

      {/* 📋 Parties P&L Ledger Table */}
      <div className="bg-paper rounded-2xl border border-paper-dim shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-paper-dim flex justify-between items-center bg-paper-dim/30">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
              पार्टी-वार खरीद-बिक्री व शुद्ध लाभ-हानि खाता ({invoices.length} बिल)
            </h4>
          </div>
          <span className="text-[11px] text-ink-muted">
            कुल शुद्ध मुनाफा: <strong className="text-emerald-700 font-mono">₹{totalGrossProfit.toLocaleString('en-IN')}</strong>
          </span>
        </div>

        {invoices.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Store className="w-8 h-8 text-ink-muted mx-auto" />
            <p className="text-xs font-bold text-ink">अभी कोई पार्टी बिल दर्ज नहीं है</p>
            <p className="text-[11px] text-ink-muted max-w-sm mx-auto">
              पार्टी का नाम और बिक्री राशि (जैसे ₹16,590) दर्ज करें। सिस्टम 10% या 15% मार्जिन के आधार पर खरीद लागत और शुद्ध मुनाफा स्वतः निकालेगा।
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              + पहला पार्टी बिल जोड़ें
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper-dim/60 text-ink-muted text-[10px] uppercase border-b border-paper-dim">
                <tr>
                  <th className="py-2.5 px-3.5">पार्टी का नाम व बिल नं</th>
                  <th className="py-2.5 px-3.5">तारीख</th>
                  <th className="py-2.5 px-3.5 text-right">बिक्री राशि (Sale)</th>
                  <th className="py-2.5 px-3.5 text-right">खरीद लागत (Purchase/COGS)</th>
                  <th className="py-2.5 px-3.5 text-center">मार्जिन %</th>
                  <th className="py-2.5 px-3.5 text-right">शुद्ध मुनाफा (Profit)</th>
                  <th className="py-2.5 px-3.5 text-center">भुगतान स्थिति</th>
                  <th className="py-2.5 px-3.5 text-center">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-dim">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-paper-dim/40 transition">
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-ink text-xs">{inv.partyName}</div>
                      <div className="text-[10px] text-ink-muted flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono bg-paper-dim px-1.5 py-0.2 rounded">{inv.billNumber || 'BILL'}</span>
                        {inv.phone && <span>📞 {inv.phone}</span>}
                      </div>
                    </td>

                    <td className="py-3 px-3.5 text-ink-muted text-[11px] whitespace-nowrap">
                      {inv.date}
                    </td>

                    <td className="py-3 px-3.5 text-right">
                      <Mono className="font-bold text-ink text-xs sm:text-sm">
                        ₹{inv.saleAmount.toLocaleString('en-IN')}
                      </Mono>
                    </td>

                    <td className="py-3 px-3.5 text-right">
                      <Mono className="font-bold text-amber-700 text-xs">
                        ₹{inv.purchaseCost.toLocaleString('en-IN')}
                      </Mono>
                      <span className="text-[9px] text-ink-muted block">
                        {inv.costCalculationType === 'margin_percent' ? `${100 - inv.marginPercent}% लागत` : 'खरीद बिल'}
                      </span>
                    </td>

                    <td className="py-3 px-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200">
                        {inv.marginPercent}%
                      </span>
                    </td>

                    <td className="py-3 px-3.5 text-right">
                      <Mono className="font-black text-emerald-700 text-xs sm:text-sm">
                        +₹{inv.grossProfit.toLocaleString('en-IN')}
                      </Mono>
                    </td>

                    <td className="py-3 px-3.5 text-center">
                      <button
                        onClick={() => handleTogglePayment(inv.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          inv.paymentStatus === 'PAID'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse'
                        }`}
                      >
                        {inv.paymentStatus === 'PAID' ? '✓ नकद प्राप्त (Paid)' : 'बाकी (उधार)'}
                      </button>
                    </td>

                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            const text = `*पार्टी बिल विवरण*\nपार्टी: ${inv.partyName}\nबिल नं: ${inv.billNumber}\nतारीख: ${inv.date}\nबिक्री राशि: ₹${inv.saleAmount.toLocaleString('en-IN')}\nभुगतान स्थिति: ${inv.paymentStatus === 'PAID' ? 'प्राप्त' : 'बाकी'}`;
                            window.open(`https://wa.me/${inv.phone ? inv.phone.replace(/[^0-9]/g, '') : ''}?text=${encodeURIComponent(text)}`, '_blank');
                          }}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="WhatsApp बिल भेजें"
                        >
                          <Share2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(inv.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          title="हटाएं"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 📝 Add Party Bill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 border border-paper-dim shadow-2xl">
            <div className="flex justify-between items-center border-b border-paper-dim pb-3">
              <div>
                <h4 className="font-bold text-sm text-ink flex items-center gap-1.5">
                  <Plus size={16} className="text-emerald-600" />
                  <span>नया पार्टी बिल व खरीद-बिक्री प्रविष्टि</span>
                </h4>
                <p className="text-[11px] text-ink-muted">बिक्री के विरुद्ध खरीद लागत व मुनाफा मार्जिन जोड़ें</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-ink-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddInvoice} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink block mb-1">पार्टी का नाम *</label>
                  <input
                    type="text"
                    placeholder="उदा. गुप्ता जी ट्रेडर्स"
                    value={partyName}
                    onChange={e => setPartyName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-ink block mb-1">मोबाइल नंबर (वैकल्पिक)</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink block mb-1">बिल / इनवॉइस नंबर</label>
                  <input
                    type="text"
                    placeholder={`BILL-${invoices.length + 1}`}
                    value={billNumber}
                    onChange={e => setBillNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-ink block mb-1">बिल तारीख</label>
                  <input
                    type="date"
                    value={billDate}
                    onChange={e => setBillDate(e.target.value)}
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-semibold"
                  />
                </div>
              </div>

              {/* Sale Amount */}
              <div>
                <label className="text-[11px] font-bold text-ink block mb-1">
                  कुल बिक्री राशि (Sale Amount) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 font-bold text-ink-muted">₹</span>
                  <input
                    type="number"
                    placeholder="16590"
                    value={saleAmount}
                    onChange={e => setSaleAmount(e.target.value)}
                    required
                    className="w-full pl-7 pr-3 py-2 bg-paper border border-paper-dim rounded-xl font-black text-sm text-ink"
                  />
                </div>
              </div>

              {/* Purchase / Cost Calculation Method */}
              <div className="p-3 bg-paper-dim/40 rounded-2xl border border-paper-dim space-y-2.5">
                <span className="text-[11px] font-bold text-ink block">
                  खरीद लागत व मुनाफा तय करने का तरीका:
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCostMethod('margin_percent')}
                    className={`py-1.5 px-2 rounded-xl font-bold text-center border transition cursor-pointer ${
                      costMethod === 'margin_percent'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-paper text-ink-muted border-paper-dim'
                    }`}
                  >
                    1. मुनाफा मार्जिन % (Auto)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCostMethod('manual_purchase')}
                    className={`py-1.5 px-2 rounded-xl font-bold text-center border transition cursor-pointer ${
                      costMethod === 'manual_purchase'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-paper text-ink-muted border-paper-dim'
                    }`}
                  >
                    2. खरीद बिल लागत (Manual)
                  </button>
                </div>

                {costMethod === 'margin_percent' ? (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold text-ink-muted">मुनाफा मार्जिन (%)</label>
                      <div className="flex gap-1">
                        {[10, 12, 15, 20].map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setCustomMargin(String(m))}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${customMargin === String(m) ? 'bg-indigo-600 text-white' : 'bg-paper text-ink-muted'}`}
                          >
                            {m}%
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="number"
                      placeholder="10"
                      value={customMargin}
                      onChange={e => setCustomMargin(e.target.value)}
                      className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-lg font-bold"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-bold text-ink-muted block mb-1">
                      इस पार्टी के माल की वास्तविक खरीद लागत (Purchase Cost ₹)
                    </label>
                    <input
                      type="number"
                      placeholder="उदा. 14500"
                      value={manualPurchaseCost}
                      onChange={e => setManualPurchaseCost(e.target.value)}
                      className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-lg font-bold text-amber-700"
                    />
                  </div>
                )}

                {/* Instant Calculation Preview */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-paper-dim/60 text-[11px]">
                  <div className="bg-paper p-2 rounded-xl">
                    <span className="text-ink-muted text-[10px] block">खरीद लागत (Purchase/COGS):</span>
                    <Mono className="font-bold text-amber-800">
                      ₹{computedCalculation.purchaseCost.toLocaleString('en-IN')}
                    </Mono>
                  </div>
                  <div className="bg-paper p-2 rounded-xl">
                    <span className="text-emerald-700 text-[10px] font-bold block">शुद्ध मुनाफा (Profit):</span>
                    <Mono className="font-black text-emerald-700">
                      +₹{computedCalculation.profit.toLocaleString('en-IN')} ({computedCalculation.margin}%)
                    </Mono>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div>
                <label className="text-[11px] font-bold text-ink block mb-1">भुगतान स्थिति</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('PAID')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      paymentStatus === 'PAID'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-paper text-ink-muted border-paper-dim'
                    }`}
                  >
                    ✓ नकद/UPI प्राप्त (Paid)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('UDHAR_PENDING')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      paymentStatus === 'UDHAR_PENDING'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-paper text-ink-muted border-paper-dim'
                    }`}
                  >
                    बाकी (उधार दिया)
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold transition hover:bg-paper-dim/80"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-md transition"
                >
                  बिल सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
