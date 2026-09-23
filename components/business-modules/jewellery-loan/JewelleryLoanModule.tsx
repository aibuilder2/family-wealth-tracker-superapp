'use client';

import React, { useState, useEffect } from 'react';
import { 
  Gem, Plus, Calendar, Percent, ShieldCheck, Coins, Share2, 
  Trash2, AlertTriangle, FileText, CheckCircle2, Clock, Phone, MapPin 
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export interface GoldLoanRecord {
  id: string;
  customerName: string;
  fatherName?: string;
  phone: string;
  address?: string;
  metalType: 'gold' | 'silver';
  purity: '18K' | '20K' | '22K' | '24K' | '925_silver';
  itemDescription: string;
  grossWeightGrams: number;
  netWeightGrams: number;
  estimatedMarketValue: number;
  principalAmount: number;
  monthlyInterestPct: number; // e.g. 1.5% or 2% (सैकड़ा)
  interestType: 'monthly' | 'yearly';
  startDate: string;
  dueDate: string;
  tenurePreset: '3_months' | '6_months' | '1_year' | 'custom';
  forfeitureClause: string;
  customLegalTerms?: string;
  otpCode: string;
  isOtpVerified: boolean;
  status: 'ACTIVE' | 'RELEASED' | 'FORFEITED'; // Forfeited = doob gaya / zabt
}

const DEFAULT_GOLD_LOANS: GoldLoanRecord[] = [
  {
    id: 'g-1',
    customerName: 'सुरेश गुर्जर',
    fatherName: 'श्री रामचरण गुर्जर',
    phone: '9829012345',
    address: 'ग्राम रामपुर, तहसील सदर',
    metalType: 'gold',
    purity: '22K',
    itemDescription: 'सोने की चेन (1 हॉलमार्क) व अंगूठी',
    grossWeightGrams: 30.5,
    netWeightGrams: 28.5,
    estimatedMarketValue: 195000,
    principalAmount: 110000,
    monthlyInterestPct: 1.5,
    interestType: 'monthly',
    startDate: '2026-06-15',
    dueDate: '2026-12-15',
    tenurePreset: '6_months',
    forfeitureClause: 'तय तारीख 15/12/2026 तक संपूर्ण मूलधन व ब्याज चुकता न करने पर गिरवी रखी सोने की चैन व अंगूठी पूर्णतः ज़ब्त/डूब मानी जाएगी और दुकान/फर्म का उस पर पूर्ण मालिकाना हक होगा।',
    customLegalTerms: 'ऋणी ने गिरवी आभूषण की शुद्धता स्वयं परखी है और किसी भी वाद की स्थिति में स्थानीय न्याय क्षेत्र मान्य होगा।',
    otpCode: '742918',
    isOtpVerified: true,
    status: 'ACTIVE'
  },
  {
    id: 'g-2',
    customerName: 'दिनेश वर्मा',
    fatherName: 'श्री मूलचंद वर्मा',
    phone: '9826114455',
    address: 'वार्ड 8, मेन मार्केट',
    metalType: 'silver',
    purity: '925_silver',
    itemDescription: 'चाँदी की भारी पायल (जोड़ी)',
    grossWeightGrams: 260,
    netWeightGrams: 250,
    estimatedMarketValue: 24000,
    principalAmount: 15000,
    monthlyInterestPct: 2,
    interestType: 'monthly',
    startDate: '2026-08-01',
    dueDate: '2026-11-01',
    tenurePreset: '3_months',
    forfeitureClause: 'तय तारीख 01/11/2026 तक ब्याज व मूलधन न मिलने पर चाँदी की पायल ज़ब्त मानी जाएगी।',
    otpCode: '319804',
    isOtpVerified: false,
    status: 'ACTIVE'
  }
];

export default function JewelleryLoanModule() {
  const [loans, setLoans] = useState<GoldLoanRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_gold_loans_v2');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return DEFAULT_GOLD_LOANS;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [viewStampLoan, setViewStampLoan] = useState<GoldLoanRecord | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [metalType, setMetalType] = useState<'gold' | 'silver'>('gold');
  const [purity, setPurity] = useState<GoldLoanRecord['purity']>('22K');
  const [itemDescription, setItemDescription] = useState('');
  const [grossWeight, setGrossWeight] = useState('');
  const [netWeight, setNetWeight] = useState('');
  const [marketValue, setMarketValue] = useState('');
  const [principalAmount, setPrincipalAmount] = useState('');
  const [interestPct, setInterestPct] = useState('1.5');
  const [interestType, setInterestType] = useState<'monthly' | 'yearly'>('monthly');
  
  // Tenure Presets
  const [tenurePreset, setTenurePreset] = useState<GoldLoanRecord['tenurePreset']>('6_months');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  });

  // Forfeiture & Custom Terms
  const [forfeitureClause, setForfeitureClause] = useState('');
  const [customLegalTerms, setCustomLegalTerms] = useState('');

  useEffect(() => {
    localStorage.setItem('fwa_gold_loans_v2', JSON.stringify(loans));
  }, [loans]);

  const handleTenureChange = (preset: GoldLoanRecord['tenurePreset']) => {
    setTenurePreset(preset);
    const d = new Date();
    if (preset === '3_months') {
      d.setMonth(d.getMonth() + 3);
      setDueDate(d.toISOString().split('T')[0]);
    } else if (preset === '6_months') {
      d.setMonth(d.getMonth() + 6);
      setDueDate(d.toISOString().split('T')[0]);
    } else if (preset === '1_year') {
      d.setFullYear(d.getFullYear() + 1);
      setDueDate(d.toISOString().split('T')[0]);
    }
  };

  const handleSaveLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !principalAmount) return;

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const defaultForfeit = forfeitureClause.trim() || 
      `तय तारीख ${dueDate} तक संपूर्ण मूलधन व ब्याज चुकता न करने पर गिरवी रखा आभूषण (${itemDescription || (metalType === 'gold' ? 'सोना' : 'चांदी')}) पूर्णतः ज़ब्त/डूब माना जाएगा और ऋणदाता का उस पर पूर्ण मालिकाना हक होगा।`;

    const newLoan: GoldLoanRecord = {
      id: 'gloan-' + Date.now(),
      customerName: customerName.trim(),
      fatherName: fatherName.trim() || undefined,
      phone: phone.trim() || '98XXXXXXXX',
      address: address.trim() || undefined,
      metalType,
      purity,
      itemDescription: itemDescription.trim() || (metalType === 'gold' ? 'सोने के जेवर' : 'चांदी के जेवर'),
      grossWeightGrams: Number(grossWeight) || Number(netWeight) || 10,
      netWeightGrams: Number(netWeight) || 10,
      estimatedMarketValue: Number(marketValue) || (Number(principalAmount) * 1.35),
      principalAmount: Number(principalAmount),
      monthlyInterestPct: Number(interestPct) || 1.5,
      interestType,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
      tenurePreset,
      forfeitureClause: defaultForfeit,
      customLegalTerms: customLegalTerms.trim() || undefined,
      otpCode: generatedOtp,
      isOtpVerified: false,
      status: 'ACTIVE'
    };

    setLoans([newLoan, ...loans]);
    setShowAddModal(false);
    setCustomerName('');
    setFatherName('');
    setPhone('');
    setAddress('');
    setItemDescription('');
    setGrossWeight('');
    setNetWeight('');
    setMarketValue('');
    setPrincipalAmount('');
    setForfeitureClause('');
    setCustomLegalTerms('');
  };

  const handleRelease = (id: string) => {
    if (confirm('क्या पार्टी ने पूरा मूलधन व ब्याज देकर गिरवी आभूषण छुड़ा लिया है?')) {
      setLoans(loans.map(l => l.id === id ? { ...l, status: 'RELEASED' } : l));
    }
  };

  const handleForfeit = (id: string) => {
    if (confirm('चेतावनी: क्या अवधि समाप्त होने पर इस आभूषण को "ज़ब्त / डूब गया" (Forfeited) घोषित करना चाहते हैं?')) {
      setLoans(loans.map(l => l.id === id ? { ...l, status: 'FORFEITED' } : l));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('क्या आप इस लोन रिकॉर्ड को हटाना चाहते हैं?')) {
      setLoans(loans.filter(l => l.id !== id));
    }
  };

  const shareWhatsAppAgreement = (l: GoldLoanRecord) => {
    const text = `📜 *सोना/चाँदी गिरवी रसीद व प्रॉमिसरी इकरारनामा (Gold Loan Note)*\n` +
      `------------------------------------\n` +
      `👤 *ग्राहक/ऋणी:* ${l.customerName}\n` +
      `${l.fatherName ? `👨‍🦳 *पिता का नाम:* ${l.fatherName}\n` : ''}` +
      `📞 *फ़ोन:* ${l.phone}\n` +
      `🥇 *गिरवी आभूषण:* ${l.itemDescription} (${l.purity})\n` +
      `⚖️ *शुद्ध वजन:* ${l.netWeightGrams} ग्राम (अनुमानित मूल्य: ₹${l.estimatedMarketValue.toLocaleString('en-IN')})\n` +
      `💰 *दी गई ऋण राशि:* ₹${l.principalAmount.toLocaleString('en-IN')}\n` +
      `📈 *ब्याज दर:* ${l.monthlyInterestPct}% ${l.interestType === 'monthly' ? 'प्रति माह (सैकड़ा)' : 'सालाना'}\n` +
      `📅 *तय वापसी तारीख:* ${l.dueDate}\n` +
      `⚠️ *ज़ब्ती/डूबने की शर्त:* ${l.forfeitureClause}\n` +
      `${l.customLegalTerms ? `📝 *विशेष शर्तें:* ${l.customLegalTerms}\n` : ''}` +
      `🔐 *प्रमाणन OTP कोड:* *${l.otpCode}*\n` +
      `------------------------------------\n` +
      `_फैमिली वेल्थ ज्वैलरी बही-खाता_`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const totalActivePrincipal = loans.filter(l => l.status === 'ACTIVE').reduce((sum, l) => sum + l.principalAmount, 0);
  const totalGoldWeight = loans.filter(l => l.status === 'ACTIVE' && l.metalType === 'gold').reduce((sum, l) => sum + l.netWeightGrams, 0);
  const totalSilverWeight = loans.filter(l => l.status === 'ACTIVE' && l.metalType === 'silver').reduce((sum, l) => sum + l.netWeightGrams, 0);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-navy text-paper p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gold/20 text-gold rounded-xl">
              <Coins size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold font-serif">Gold & Silver Jewellery Loan (गिरवी बही-खाता)</h2>
              <p className="text-[11px] text-paper-dim/80">शुद्ध वजन, मासिक सैकड़ा ब्याज, गिरवी ज़ब्ती शर्त व प्रॉमिसरी OTP रसीद</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-gold text-navy text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-gold-light active:scale-95 transition-all shadow-sm"
          >
            <Plus size={15} /> नया गिरवी लोन
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-navy-light/40 text-center">
          <div className="bg-navy-light/40 p-2 rounded-xl">
            <p className="text-[10px] text-paper-dim/70">कुल सक्रिय गिरवी कर्ज़</p>
            <Mono className="text-sm font-bold text-gold">₹{totalActivePrincipal.toLocaleString('en-IN')}</Mono>
          </div>
          <div className="bg-navy-light/40 p-2 rounded-xl">
            <p className="text-[10px] text-paper-dim/70">तिजोरी में सोना (Net Gold)</p>
            <Mono className="text-sm font-bold text-paper">{totalGoldWeight.toFixed(1)}g</Mono>
          </div>
          <div className="bg-navy-light/40 p-2 rounded-xl">
            <p className="text-[10px] text-paper-dim/70">तिजोरी में चाँदी (Silver)</p>
            <Mono className="text-sm font-bold text-paper">{totalSilverWeight.toFixed(0)}g</Mono>
          </div>
        </div>
      </div>

      {/* Loans List */}
      <div className="space-y-3">
        {loans.map(l => {
          const isOverdue = new Date() > new Date(l.dueDate) && l.status === 'ACTIVE';

          return (
            <div key={l.id} className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 bg-gold/15 text-gold-dark text-[10px] font-bold rounded uppercase">
                      {l.metalType === 'gold' ? '🥇 सोना' : '🥈 चाँदी'} • {l.purity}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      l.status === 'ACTIVE' ? (isOverdue ? 'bg-coral/15 text-coral' : 'bg-green/15 text-green') :
                      l.status === 'RELEASED' ? 'bg-paper-dim text-ink-muted' : 'bg-red-700 text-white'
                    }`}>
                      {l.status === 'ACTIVE' ? (isOverdue ? '⚠️ तारीख बीत गई' : 'सक्रिय गिरवी') :
                       l.status === 'RELEASED' ? '✓ छूट गया' : '❌ ज़ब्त / डूब गया'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-ink mt-1">{l.customerName}</h4>
                  {l.fatherName && <p className="text-xs text-ink-muted">पिता: {l.fatherName}</p>}
                  <p className="text-[11px] text-ink-muted">{l.phone} {l.address ? `• ${l.address}` : ''}</p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-ink-muted">दी गई रकम</p>
                  <Mono className="text-base font-bold text-ink">₹{l.principalAmount.toLocaleString('en-IN')}</Mono>
                  <p className="text-[10px] text-gold-dark font-semibold">
                    {l.monthlyInterestPct}% {l.interestType === 'monthly' ? 'माह (सैकड़ा)' : 'सालाना'}
                  </p>
                </div>
              </div>

              {/* Item Details Box */}
              <div className="bg-paper-dim/40 rounded-xl p-2.5 text-xs text-ink space-y-1">
                <div className="flex justify-between">
                  <span><strong>आभूषण:</strong> {l.itemDescription}</span>
                  <span className="font-bold">वजन: {l.netWeightGrams}g (सकल: {l.grossWeightGrams}g)</span>
                </div>
                <div className="flex justify-between text-[11px] text-ink-muted">
                  <span>बाज़ार मूल्य: ₹{l.estimatedMarketValue.toLocaleString('en-IN')}</span>
                  <span>वापसी तारीख: <strong>{l.dueDate}</strong></span>
                </div>
              </div>

              {/* Forfeiture Warning Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 text-xs text-amber-900 space-y-0.5">
                <div className="flex items-center gap-1 font-bold text-[11px] text-amber-800">
                  <AlertTriangle size={12} />
                  <span>ज़ब्ती व डूबने की कानूनी शर्त:</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-tight">
                  {l.forfeitureClause}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1 text-xs border-t border-paper-dim">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewStampLoan(l)}
                    className="text-gold-dark font-bold hover:underline flex items-center gap-1"
                  >
                    <FileText size={13} /> रसीद/स्टाम्प
                  </button>
                  <button
                    onClick={() => shareWhatsAppAgreement(l)}
                    className="text-green font-bold hover:underline flex items-center gap-1"
                  >
                    <Share2 size={13} /> WhatsApp
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {l.status === 'ACTIVE' && (
                    <>
                      <button
                        onClick={() => handleRelease(l.id)}
                        className="px-2.5 py-1 bg-green/15 text-green font-bold rounded-lg hover:bg-green/25 text-[11px]"
                      >
                        ✓ छुड़ा लिया
                      </button>
                      <button
                        onClick={() => handleForfeit(l.id)}
                        className="px-2.5 py-1 bg-coral/15 text-coral font-bold rounded-lg hover:bg-coral/25 text-[11px]"
                      >
                        ज़ब्त करें
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="text-coral hover:text-coral-dark p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Gold Loan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4 max-h-[92vh] overflow-y-auto">
            <h3 className="text-base font-bold text-ink">नया सोना/चाँदी गिरवी लोन जोड़ें</h3>
            <form onSubmit={handleSaveLoan} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">ग्राहक / ऋणी का नाम</label>
                <input
                  type="text"
                  placeholder="उदा. सुरेश गुर्जर"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">पिता का नाम</label>
                  <input
                    type="text"
                    placeholder="उदा. श्री रामचरण जी"
                    value={fatherName}
                    onChange={e => setFatherName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">फ़ोन नंबर</label>
                  <input
                    type="tel"
                    placeholder="98XXXXXXXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">धातु (Metal)</label>
                  <select
                    value={metalType}
                    onChange={e => setMetalType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-semibold"
                  >
                    <option value="gold">🥇 सोना (Gold)</option>
                    <option value="silver">🥈 चाँदी (Silver)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">शुद्धता (Karat)</label>
                  <select
                    value={purity}
                    onChange={e => setPurity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-semibold"
                  >
                    <option value="22K">22 Karat (916 Hallmark)</option>
                    <option value="20K">20 Karat</option>
                    <option value="18K">18 Karat (750)</option>
                    <option value="24K">24 Karat (999)</option>
                    <option value="925_silver">92.5 Sterling Silver</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-ink-muted mb-1">आभूषण का विवरण</label>
                <input
                  type="text"
                  placeholder="उदा. सोने की 2 चूड़ी व 1 लॉकेट"
                  value={itemDescription}
                  onChange={e => setItemDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-ink-muted mb-0.5">सकल वजन (Gross g)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="25.5"
                    value={grossWeight}
                    onChange={e => setGrossWeight(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-paper border border-paper-dim font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-ink-muted mb-0.5">शुद्ध वजन (Net g) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="24.0"
                    value={netWeight}
                    onChange={e => setNetWeight(e.target.value)}
                    required
                    className="w-full px-2 py-1.5 rounded-lg bg-paper border border-paper-dim font-bold text-gold-dark"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-ink-muted mb-0.5">बाज़ार मूल्य (₹)</label>
                  <input
                    type="number"
                    placeholder="160000"
                    value={marketValue}
                    onChange={e => setMarketValue(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-paper border border-paper-dim"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">दी गई रकम (₹) *</label>
                  <input
                    type="number"
                    placeholder="90000"
                    value={principalAmount}
                    onChange={e => setPrincipalAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">ब्याज दर (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestPct}
                    onChange={e => setInterestPct(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">प्रकार</label>
                  <select
                    value={interestType}
                    onChange={e => setInterestType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  >
                    <option value="monthly">% प्रति माह (सैकड़ा)</option>
                    <option value="yearly">% प्रति वर्ष</option>
                  </select>
                </div>
              </div>

              {/* Tenure Presets */}
              <div className="space-y-1">
                <label className="block text-ink-muted">अवधि व वापसी तारीख:</label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { key: '3_months', label: '3 माह' },
                    { key: '6_months', label: '6 माह' },
                    { key: '1_year', label: '1 साल' },
                    { key: 'custom', label: 'कस्टम' },
                  ].map(p => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => handleTenureChange(p.key as any)}
                      className={`py-1 rounded-lg font-bold border transition-all text-xs ${
                        tenurePreset === p.key ? 'bg-gold text-navy border-gold' : 'bg-paper text-ink-muted border-paper-dim'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => {
                    setDueDate(e.target.value);
                    setTenurePreset('custom');
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim mt-1 font-semibold"
                />
              </div>

              {/* Forfeiture Clause Box */}
              <div>
                <label className="block text-amber-900 font-bold mb-1">
                  ⚠️ ज़ब्ती शर्त (तय तारीख तक न चुकाने पर डूबने का नियम):
                </label>
                <textarea
                  rows={2}
                  value={forfeitureClause}
                  onChange={e => setForfeitureClause(e.target.value)}
                  placeholder="उदा. तय तारीख तक ब्याज या मूलधन न चुकाने पर गिरवी रखा सोना पूर्णतः ज़ब्त/डूब माना जाएगा।"
                  className="w-full px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 font-medium"
                />
              </div>

              {/* Custom Legal Terms Box */}
              <div>
                <label className="block text-ink-muted mb-1">अन्य कोई विशेष कानूनी शर्त या बात:</label>
                <textarea
                  rows={2}
                  value={customLegalTerms}
                  onChange={e => setCustomLegalTerms(e.target.value)}
                  placeholder="उदा. विवाद की स्थिति में स्थानीय कोर्ट का क्षेत्राधिकार रहेगा।"
                  className="w-full px-3 py-1.5 rounded-xl bg-paper border border-paper-dim text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gold text-navy font-bold hover:bg-gold-light"
                >
                  गिरवी रसीद बनाएं
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promissory Legal Stamp Preview Modal */}
      {viewStampLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-5 border-2 border-gold space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center border-b border-paper-dim pb-3 space-y-1">
              <span className="px-3 py-1 bg-gold/20 text-gold-dark font-serif text-xs font-bold uppercase rounded-full">
                ⚖️ सोना/चाँदी गिरवी वचन-पत्र (Pledge Note)
              </span>
              <h3 className="text-base font-bold font-serif text-ink mt-1">शपथ-पत्र एवं गिरवी अनुबंध</h3>
              <p className="text-[10px] text-ink-muted">दिनांक: {viewStampLoan.startDate} • कोड: #{viewStampLoan.otpCode}</p>
            </div>

            <div className="space-y-2 text-xs text-ink leading-relaxed bg-paper-dim/30 p-3 rounded-xl">
              <p>
                मैं <strong>{viewStampLoan.customerName}</strong>
                {viewStampLoan.fatherName ? `, सुपुत्र श्री ${viewStampLoan.fatherName}` : ''}, 
                सत्यनिष्ठा से स्वीकार करता हूँ कि मैंने ऋणदाता से 
                <strong className="text-sm font-mono text-gold-dark"> ₹{viewStampLoan.principalAmount.toLocaleString('en-IN')} </strong>
                प्राप्त किए हैं। इसके बदले में मैंने अपनी स्वेच्छा से निम्न आभूषण धरोहर/गिरवी स्वरूप रखे हैं:
              </p>

              <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-950 font-medium space-y-1">
                <p><strong>🥇 आभूषण विवरण:</strong> {viewStampLoan.itemDescription} ({viewStampLoan.purity})</p>
                <p><strong>⚖️ शुद्ध वजन:</strong> {viewStampLoan.netWeightGrams} ग्राम (सकल: {viewStampLoan.grossWeightGrams} ग्राम)</p>
                <p><strong>📈 ब्याज दर:</strong> {viewStampLoan.monthlyInterestPct}% {viewStampLoan.interestType === 'monthly' ? 'प्रति माह (सैकड़ा)' : 'सालाना'}</p>
                <p><strong>📅 वापसी की अंतिम तारीख:</strong> {viewStampLoan.dueDate}</p>
              </div>

              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-950 text-[11px] font-semibold space-y-0.5">
                <p className="uppercase text-red-700 font-bold">⚠️ ज़ब्ती / डूबने की कानूनी शर्त:</p>
                <p>{viewStampLoan.forfeitureClause}</p>
              </div>

              {viewStampLoan.customLegalTerms && (
                <p className="text-[11px] text-ink-muted italic border-t border-paper-dim pt-1">
                  &ldquo;{viewStampLoan.customLegalTerms}&rdquo;
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setViewStampLoan(null)}
                className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold text-xs"
              >
                बंद करें
              </button>
              <button
                type="button"
                onClick={() => shareWhatsAppAgreement(viewStampLoan)}
                className="flex-1 py-2 rounded-xl bg-green text-paper font-bold text-xs flex items-center justify-center gap-1"
              >
                <Share2 size={14} /> WhatsApp भेजें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
