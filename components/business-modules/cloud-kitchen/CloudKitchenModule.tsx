'use client';

import React, { useState, useEffect } from 'react';
import { 
  Flame, Plus, ShoppingCart, IndianRupee, Users, 
  Calendar, CheckCircle2, TrendingUp, Package, Bike, X, ChefHat, Store
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

// 🍱 Tiffin Subscription Customer
export interface TiffinCustomer {
  id: string;
  name: string;
  phone: string;
  planType: 'MONTHLY' | 'DAILY';
  monthlyRate: number; // e.g. ₹3,000 / month
  deliveryAddress: string;
  status: 'ACTIVE' | 'PAUSED';
  paymentStatus: 'PAID' | 'DUE';
  dueAmount: number;
}

// 🍳 Daily Kitchen Sales & Operational Cost
export interface KitchenDayRecord {
  id: string;
  date: string;
  // Income Breakdown:
  counterSale: number;        // Direct takeaway / dining cash
  swiggyZomatoSale: number;   // Swiggy & Zomato payout
  tiffinDailyCollection: number; // Tiffin cash received today
  totalSales: number;
  // Expense Breakdown:
  vegetablesDairyCost: number; // Sabzi, Milk, Paneer
  grocerySpicesCost: number;   // Rice, Atta, Oil, Masale
  packagingBoxCost: number;    // Containers, bags, foil
  gasFuelCost: number;         // Commercial cylinder
  staffSalaryBhatta: number;   // Cook, Helper, Delivery boy
  totalExpenses: number;
  netMargin: number;
  notes?: string;
}

const INITIAL_TIFFIN_CUSTOMERS: TiffinCustomer[] = [];

const INITIAL_RECORDS: KitchenDayRecord[] = [];

export default function CloudKitchenModule() {
  const [activeTab, setActiveTab] = useState<'DAILY_SALES' | 'TIFFIN_CUSTOMERS' | 'RECIPES'>('DAILY_SALES');
  const [records, setRecords] = useState<KitchenDayRecord[]>(INITIAL_RECORDS);
  const [tiffinList, setTiffinList] = useState<TiffinCustomer[]>(INITIAL_TIFFIN_CUSTOMERS);

  // Modals
  const [showAddDayModal, setShowAddDayModal] = useState(false);
  const [showAddTiffinModal, setShowAddTiffinModal] = useState(false);

  // Daily Form State
  const [counterSale, setCounterSale] = useState('');
  const [swiggySale, setSwiggySale] = useState('');
  const [tiffinSale, setTiffinSale] = useState('');
  const [veggieCost, setVeggieCost] = useState('');
  const [groceryCost, setGroceryCost] = useState('');
  const [pkgCost, setPkgCost] = useState('');
  const [gasCost, setGasCost] = useState('');
  const [staffCost, setStaffCost] = useState('');
  const [notes, setNotes] = useState('');

  // Tiffin Form State
  const [tifName, setTifName] = useState('');
  const [tifPhone, setTifPhone] = useState('');
  const [tifRate, setTifRate] = useState('3000');
  const [tifAddress, setTifAddress] = useState('');

  // Load from local storage
  useEffect(() => {
    try {
      const savedRecs = localStorage.getItem('fwa_kitchen_records_v2');
      if (savedRecs) {
        const parsed = JSON.parse(savedRecs);
        if (Array.isArray(parsed)) {
          setRecords(parsed.filter((r: any) => r?.id !== 'k-1'));
        }
      }
      const savedTif = localStorage.getItem('fwa_tiffin_customers_v2');
      if (savedTif) {
        const parsed = JSON.parse(savedTif);
        if (Array.isArray(parsed)) {
          setTiffinList(parsed.filter((t: any) => !['tif-1', 'tif-2', 'tif-3'].includes(t?.id)));
        }
      }
    } catch (e) {}
  }, []);

  const saveRecords = (rList: KitchenDayRecord[]) => {
    setRecords(rList);
    try { localStorage.setItem('fwa_kitchen_records_v2', JSON.stringify(rList)); } catch (e) {}
  };

  const saveTiffins = (tList: TiffinCustomer[]) => {
    setTiffinList(tList);
    try { localStorage.setItem('fwa_tiffin_customers_v2', JSON.stringify(tList)); } catch (e) {}
  };

  const handleSaveDay = (e: React.FormEvent) => {
    e.preventDefault();
    const cSale = Number(counterSale) || 0;
    const sSale = Number(swiggySale) || 0;
    const tSale = Number(tiffinSale) || 0;
    const totalS = cSale + sSale + tSale;

    const vCost = Number(veggieCost) || 0;
    const gCost = Number(groceryCost) || 0;
    const pCost = Number(pkgCost) || 0;
    const gasC = Number(gasCost) || 0;
    const sCost = Number(staffCost) || 0;
    const totalE = vCost + gCost + pCost + gasC + sCost;

    const newRecord: KitchenDayRecord = {
      id: 'k-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      counterSale: cSale,
      swiggyZomatoSale: sSale,
      tiffinDailyCollection: tSale,
      totalSales: totalS,
      vegetablesDairyCost: vCost,
      grocerySpicesCost: gCost,
      packagingBoxCost: pCost,
      gasFuelCost: gasC,
      staffSalaryBhatta: sCost,
      totalExpenses: totalE,
      netMargin: totalS - totalE,
      notes: notes.trim(),
    };

    saveRecords([newRecord, ...records]);
    setShowAddDayModal(false);

    // Reset Form
    setCounterSale('');
    setSwiggySale('');
    setTiffinSale('');
    setVeggieCost('');
    setGroceryCost('');
    setPkgCost('');
    setGasCost('');
    setStaffCost('');
    setNotes('');
  };

  const handleSaveTiffin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tifName.trim()) return;

    const newT: TiffinCustomer = {
      id: 'tif-' + Date.now(),
      name: tifName.trim(),
      phone: tifPhone.trim(),
      planType: 'MONTHLY',
      monthlyRate: Number(tifRate) || 3000,
      deliveryAddress: tifAddress.trim(),
      status: 'ACTIVE',
      paymentStatus: 'PAID',
      dueAmount: 0,
    };

    saveTiffins([...tiffinList, newT]);
    setShowAddTiffinModal(false);
    setTifName('');
    setTifPhone('');
    setTifRate('3000');
    setTifAddress('');
  };

  const toggleTiffinPayment = (id: string) => {
    const updated = tiffinList.map(t => {
      if (t.id === id) {
        const isNowPaid = t.paymentStatus !== 'PAID';
        const newStatus: 'PAID' | 'DUE' = isNowPaid ? 'PAID' : 'DUE';
        return {
          ...t,
          paymentStatus: newStatus,
          dueAmount: isNowPaid ? 0 : t.monthlyRate,
        };
      }
      return t;
    });
    saveTiffins(updated);
  };

  // KPIs
  const totalKitchenSales = records.reduce((sum, r) => sum + r.totalSales, 0);
  const totalKitchenCosts = records.reduce((sum, r) => sum + r.totalExpenses, 0);
  const netKitchenProfit = totalKitchenSales - totalKitchenCosts;
  const activeTiffinsCount = tiffinList.filter(t => t.status === 'ACTIVE').length;
  const tiffinMonthlyRecurring = tiffinList.reduce((sum, t) => sum + (t.status === 'ACTIVE' ? t.monthlyRate : 0), 0);
  const totalTiffinDue = tiffinList.reduce((sum, t) => sum + t.dueAmount, 0);

  return (
    <div className="space-y-4">
      {/* 🚀 Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-800 via-rose-900 to-amber-950 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/25 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-orange-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm">क्लाउड किचन, टिफ़िन व रेस्टोरेंट ERP</h3>
                <span className="text-[9px] bg-orange-500/30 text-orange-200 px-1.5 py-0.2 rounded font-mono">
                  {activeTiffinsCount} टिफ़िन ग्राहक
                </span>
              </div>
              <p className="text-[11px] text-orange-200">घर का टिफ़िन + Zomato/Swiggy + काउंटर सेल व राशन खर्च</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddDayModal(true)}
              className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Plus size={14} /> + दैनिक हिसाब जोड़ें
            </button>
            <button
              onClick={() => setShowAddTiffinModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
            >
              <Users size={13} /> + नया टिफ़िन ग्राहक
            </button>
          </div>
        </div>

        {/* 📊 KPI Strip */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
          <div>
            <span className="text-[10px] text-orange-200">कुल बिक्री</span>
            <Mono className="text-xs font-bold text-white block">₹{totalKitchenSales.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-orange-200">राशन/सामग्री खर्च</span>
            <Mono className="text-xs font-bold text-rose-300 block">₹{totalKitchenCosts.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-orange-200">शुद्ध मुनाफा</span>
            <Mono className="text-xs font-bold text-emerald-300 block">₹{netKitchenProfit.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-amber-200">टिफ़िन मंथली आय</span>
            <Mono className="text-xs font-bold text-amber-300 block">₹{tiffinMonthlyRecurring.toLocaleString('en-IN')}</Mono>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center justify-between gap-2 border-b border-paper-dim pb-1 text-xs">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('DAILY_SALES')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'DAILY_SALES' ? 'bg-navy text-gold-soft' : 'text-ink-muted hover:bg-paper-dim'
            }`}
          >
            दैनिक सेल व राशन खर्च ({records.length})
          </button>
          <button
            onClick={() => setActiveTab('TIFFIN_CUSTOMERS')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'TIFFIN_CUSTOMERS' ? 'bg-navy text-gold-soft' : 'text-ink-muted hover:bg-paper-dim'
            }`}
          >
            टिफ़िन ग्राहक व बकाया ({tiffinList.length})
          </button>
        </div>

        {activeTab === 'TIFFIN_CUSTOMERS' && totalTiffinDue > 0 && (
          <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
            टिफ़िन उधारी बाकी: ₹{totalTiffinDue.toLocaleString('en-IN')}
          </span>
        )}
      </div>

      {/* TAB 1: DAILY SALES & EXPENSES */}
      {activeTab === 'DAILY_SALES' && (
        <div className="space-y-2.5">
          {records.length === 0 ? (
            <div className="p-8 bg-paper border border-paper-dim rounded-2xl text-center shadow-sm space-y-2">
              <p className="text-xs text-ink-muted">कोई दैनिक किचन बिक्री रिकॉर्ड दर्ज नहीं है।</p>
              <button
                onClick={() => setShowAddDayModal(true)}
                className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs inline-flex items-center gap-1"
              >
                <Plus size={14} /> + दैनिक हिसाब जोड़ें
              </button>
            </div>
          ) : (
            records.map(r => (
              <div key={r.id} className="p-3.5 bg-paper rounded-xl border border-paper-dim shadow-xs space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink text-xs">तारीख: {r.date}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-900">
                        मार्जिन: {Math.round((r.netMargin / (r.totalSales || 1)) * 100)}%
                      </span>
                    </div>
                    {r.notes && <p className="text-[11px] text-ink-muted mt-0.5">{r.notes}</p>}
                  </div>
                  <div className="text-right">
                    <Mono className="font-bold text-emerald-700 text-sm block">
                      +₹{r.netMargin.toLocaleString('en-IN')}
                    </Mono>
                    <span className="text-[10px] text-ink-muted">कुल सेल: ₹{r.totalSales.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Breakdown Pill Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-paper-dim/40 rounded-lg p-2 text-[10px] text-ink-muted">
                  <span>📱 Zomato/Swiggy: <b className="text-ink">₹{r.swiggyZomatoSale}</b></span>
                  <span>💵 काउंटर सेल: <b className="text-ink">₹{r.counterSale}</b></span>
                  <span>🍱 टिफ़िन जमा: <b className="text-ink">₹{r.tiffinDailyCollection}</b></span>
                  <span>🥦 सब्ज़ी/दूध: <b className="text-rose-700">₹{r.vegetablesDairyCost}</b></span>
                  <span>🍚 राशन/किराना: <b className="text-rose-700">₹{r.grocerySpicesCost}</b></span>
                  <span>📦 पैकेजिंग डिब्बे: <b className="text-rose-700">₹{r.packagingBoxCost}</b></span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: TIFFIN SUBSCRIPTION REGISTER */}
      {activeTab === 'TIFFIN_CUSTOMERS' && (
        <div className="space-y-2.5">
          {tiffinList.length === 0 ? (
            <div className="p-8 bg-paper border border-paper-dim rounded-2xl text-center shadow-sm space-y-2">
              <p className="text-xs text-ink-muted">कोई टिफ़िन ग्राहक दर्ज नहीं है।</p>
              <button
                onClick={() => setShowAddTiffinModal(true)}
                className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs inline-flex items-center gap-1"
              >
                <Users size={13} /> + नया टिफ़िन ग्राहक जोड़ें
              </button>
            </div>
          ) : (
            tiffinList.map(t => (
            <div key={t.id} className="p-3 bg-paper rounded-xl border border-paper-dim shadow-xs flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-ink">{t.name}</h4>
                  <span className="text-[10px] text-ink-muted">📞 {t.phone}</span>
                </div>
                <p className="text-[11px] text-ink-muted">📍 {t.deliveryAddress}</p>
                <div className="text-[10px] text-gold font-bold">
                  मासिक फ़ीस: ₹{t.monthlyRate}/महीना
                </div>
              </div>

              <div className="text-right space-y-1">
                <button
                  onClick={() => toggleTiffinPayment(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                    t.paymentStatus === 'PAID'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                  }`}
                >
                  {t.paymentStatus === 'PAID' ? '✓ इस माह जमा' : `बाकी ₹${t.dueAmount}`}
                </button>
              </div>
            </div>
          )))}
        </div>
      )}

      {/* ➕ MODAL: ADD DAILY SALE & COST */}
      {showAddDayModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-sm w-full p-5 space-y-3.5 border border-paper-dim shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-paper-dim pb-2">
              <h4 className="font-bold text-sm text-ink">दैनिक सेल व सामग्री खर्च प्रविष्टि</h4>
              <button onClick={() => setShowAddDayModal(false)} className="text-ink-muted hover:text-ink"><X size={16} /></button>
            </div>

            <form onSubmit={handleSaveDay} className="space-y-3 text-xs">
              {/* Sales Section */}
              <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 space-y-2">
                <span className="font-bold text-[10px] text-emerald-900 uppercase">आज की कुल सेल / आमदनी</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Swiggy/Zomato ₹"
                    value={swiggySale}
                    onChange={(e) => setSwiggySale(e.target.value)}
                    className="w-full px-2 py-1.5 bg-paper border border-paper-dim rounded-lg font-bold"
                  />
                  <input
                    type="number"
                    placeholder="काउंटर नकद सेल ₹"
                    value={counterSale}
                    onChange={(e) => setCounterSale(e.target.value)}
                    className="w-full px-2 py-1.5 bg-paper border border-paper-dim rounded-lg font-bold"
                  />
                  <input
                    type="number"
                    placeholder="टिफ़िन आज प्राप्त ₹"
                    value={tiffinSale}
                    onChange={(e) => setTiffinSale(e.target.value)}
                    className="w-full px-2 py-1.5 bg-paper border border-paper-dim rounded-lg col-span-2"
                  />
                </div>
              </div>

              {/* Expense Section */}
              <div className="bg-rose-50/40 p-2.5 rounded-xl border border-rose-100 space-y-2">
                <span className="font-bold text-[10px] text-rose-900 uppercase">आज के खर्चे (सामग्री व राशन)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="सब्ज़ी, पनीर व दूध ₹"
                    value={veggieCost}
                    onChange={(e) => setVeggieCost(e.target.value)}
                    className="w-full px-2 py-1.5 bg-paper border border-paper-dim rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="किराना, तेल व आटा ₹"
                    value={groceryCost}
                    onChange={(e) => setGroceryCost(e.target.value)}
                    className="w-full px-2 py-1.5 bg-paper border border-paper-dim rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="पैकेजिंग डिब्बे/थैली ₹"
                    value={pkgCost}
                    onChange={(e) => setPkgCost(e.target.value)}
                    className="w-full px-2 py-1.5 bg-paper border border-paper-dim rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="गैस सिलिंडर / ईंधन ₹"
                    value={gasCost}
                    onChange={(e) => setGasCost(e.target.value)}
                    className="w-full px-2 py-1.5 bg-paper border border-paper-dim rounded-lg"
                  />
                </div>
              </div>

              <input
                type="text"
                placeholder="विशेष टिप्पणी (e.g. आज स्पेशल थाली बिकी)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl text-ink"
              />

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddDayModal(false)} className="flex-1 py-2 rounded-xl border border-paper-dim font-bold text-ink-muted">रद्द</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold">हिसाब सेव करें</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ➕ MODAL: ADD TIFFIN CUSTOMER */}
      {showAddTiffinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-sm w-full p-5 space-y-3.5 border border-paper-dim shadow-2xl">
            <div className="flex justify-between items-center border-b border-paper-dim pb-2">
              <h4 className="font-bold text-sm text-ink">नया टिफ़िन ग्राहक जोड़ें</h4>
              <button onClick={() => setShowAddTiffinModal(false)} className="text-ink-muted hover:text-ink"><X size={16} /></button>
            </div>

            <form onSubmit={handleSaveTiffin} className="space-y-2.5 text-xs">
              <input
                type="text"
                required
                placeholder="ग्राहक का नाम *"
                value={tifName}
                onChange={(e) => setTifName(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold"
              />
              <input
                type="tel"
                placeholder="मोबाइल नंबर"
                value={tifPhone}
                onChange={(e) => setTifPhone(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl"
              />
              <input
                type="number"
                required
                placeholder="मासिक टिफ़िन दर (उदा. 3000) ₹"
                value={tifRate}
                onChange={(e) => setTifRate(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold"
              />
              <input
                type="text"
                placeholder="डिलीवरी पता / रूम नंबर / ऑफिस"
                value={tifAddress}
                onChange={(e) => setTifAddress(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl"
              />

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddTiffinModal(false)} className="flex-1 py-2 rounded-xl border border-paper-dim font-bold text-ink-muted">रद्द</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-navy text-gold font-bold">ग्राहक जोड़ें</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
