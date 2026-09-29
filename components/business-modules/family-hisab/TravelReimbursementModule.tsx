'use client';

import React, { useState } from 'react';
import { 
  Plane, Briefcase, Plus, Calendar, CheckCircle2, AlertCircle, 
  Clock, DollarSign, Camera, Image as ImageIcon, Trash2, 
  ExternalLink, Check, Download, Share2, Filter, Receipt, 
  MapPin, User, ChevronRight, X, ArrowUpRight
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import { useFamilyStore } from '@/lib/store/familyStore';
import { TravelClaim, TravelExpenseItem, TravelTripType, TravelClaimStatus } from '@/types';

const INITIAL_TRAVEL_CLAIMS: TravelClaim[] = [
  {
    id: 'trv-1',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    member_id: 'm-ankush',
    member_name: 'Ankush kesharwani',
    trip_title: 'रायपुर थोक व्यापारी बैठक व सप्लायर डील',
    trip_type: 'business_tour',
    destination: 'रायपुर (छ.ग.)',
    start_date: '2026-09-18',
    end_date: '2026-09-20',
    total_amount: 14250,
    status: 'reimbursed',
    reimbursed_amount: 14250,
    reimbursement_date: '2026-09-22',
    reimbursement_note: 'दुकान के चालू खाते (Current A/c) से प्रतिपूर्ति प्राप्त हुई - UTR #904812',
    expenses: [
      {
        id: 'exp-1',
        category: 'ticket_transport',
        amount: 3200,
        description: 'ट्रेन टिकट (2nd AC राउंड ट्रिप)',
        expense_date: '2026-09-18'
      },
      {
        id: 'exp-2',
        category: 'hotel_stay',
        amount: 5800,
        description: 'होटल ग्रैंड भारत (2 रातें)',
        expense_date: '2026-09-19'
      },
      {
        id: 'exp-3',
        category: 'client_meeting',
        amount: 3450,
        description: 'सप्लायर डील डिनर मीटिंग',
        expense_date: '2026-09-19'
      },
      {
        id: 'exp-4',
        category: 'fuel_petrol',
        amount: 1800,
        description: 'लोकल टैक्सी व ऑटो किराया',
        expense_date: '2026-09-20'
      }
    ],
    created_at: '2026-09-20'
  },
  {
    id: 'trv-2',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    member_id: 'm-1789566934699',
    member_name: 'Akshay kesharwani',
    trip_title: 'कंपनी ट्रेनिंग व क्लाइंट ऑनबोर्डिंग टूर',
    trip_type: 'job_official',
    destination: 'इंदौर (म.प्र.)',
    start_date: '2026-09-25',
    end_date: '2026-09-28',
    total_amount: 18600,
    status: 'submitted',
    reimbursement_note: 'कंपनी एचआर/अकाउंट्स में क्लेम फॉर्म व सभी ओरिजिनल बिल्स जमा किए गए हैं',
    expenses: [
      {
        id: 'exp-5',
        category: 'ticket_transport',
        amount: 6500,
        description: 'फ्लाइट / बस टिकट',
        expense_date: '2026-09-25'
      },
      {
        id: 'exp-6',
        category: 'hotel_stay',
        amount: 7200,
        description: 'होटल स्टे (3 रातें)',
        expense_date: '2026-09-27'
      },
      {
        id: 'exp-7',
        category: 'food_meal',
        amount: 3100,
        description: 'दैनिक भोजन व अल्पाहार',
        expense_date: '2026-09-27'
      },
      {
        id: 'exp-8',
        category: 'other',
        amount: 1800,
        description: 'लोकल कैब (Uber/Ola)',
        expense_date: '2026-09-28'
      }
    ],
    created_at: '2026-09-28'
  }
];

export function TravelReimbursementModule() {
  const { members } = useFamilyStore();
  const [claims, setClaims] = useState<TravelClaim[]>(INITIAL_TRAVEL_CLAIMS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'job_official' | 'business_tour' | 'submitted' | 'reimbursed'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClaimForView, setSelectedClaimForView] = useState<TravelClaim | null>(null);

  // Form State
  const [memberId, setMemberId] = useState(members[0]?.id || '');
  const [tripTitle, setTripTitle] = useState('');
  const [tripType, setTripType] = useState<TravelTripType>('job_official');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expenseRows, setExpenseRows] = useState<{
    id: string;
    category: TravelExpenseItem['category'];
    amount: string;
    description: string;
    receiptImage?: string;
  }[]>([
    { id: '1', category: 'ticket_transport', amount: '', description: '' }
  ]);

  // Settlement Modal State
  const [settlingClaimId, setSettlingClaimId] = useState<string | null>(null);
  const [settleAmount, setSettleAmount] = useState('');
  const [settleMode, setSettleMode] = useState<'bank_transfer' | 'cash' | 'upi'>('bank_transfer');
  const [settleNote, setSettleNote] = useState('');

  // Stats
  const totalClaimAmount = claims.reduce((sum, c) => sum + c.total_amount, 0);
  const pendingAmount = claims.filter(c => c.status === 'submitted' || c.status === 'draft').reduce((sum, c) => sum + c.total_amount, 0);
  const reimbursedAmount = claims.filter(c => c.status === 'reimbursed').reduce((sum, c) => sum + (c.reimbursed_amount || c.total_amount), 0);

  const handleAddExpenseRow = () => {
    setExpenseRows([
      ...expenseRows,
      { id: String(Date.now()), category: 'food_meal', amount: '', description: '' }
    ]);
  };

  const handleRemoveExpenseRow = (rowId: string) => {
    if (expenseRows.length === 1) return;
    setExpenseRows(expenseRows.filter(r => r.id !== rowId));
  };

  const handleRowChange = (rowId: string, field: string, value: any) => {
    setExpenseRows(expenseRows.map(r => r.id === rowId ? { ...r, [field]: value } : r));
  };

  const handleImageUpload = (rowId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleRowChange(rowId, 'receiptImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripTitle.trim() || !destination.trim()) return;

    const member = members.find(m => m.id === memberId);
    const validExpenses: TravelExpenseItem[] = expenseRows
      .filter(r => Number(r.amount) > 0)
      .map(r => ({
        id: `exp-${Date.now()}-${Math.random()}`,
        category: r.category,
        amount: Number(r.amount),
        description: r.description.trim() || r.category,
        expense_date: startDate || new Date().toISOString().split('T')[0],
        receipt_url: r.receiptImage
      }));

    const total = validExpenses.reduce((sum, e) => sum + e.amount, 0);
    const receiptImages = validExpenses.map(e => e.receipt_url).filter(Boolean) as string[];

    const newClaim: TravelClaim = {
      id: `trv-${Date.now()}`,
      family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
      member_id: memberId,
      member_name: member?.name || 'पारिवारिक सदस्य',
      trip_title: tripTitle.trim(),
      trip_type: tripType,
      destination: destination.trim(),
      start_date: startDate,
      end_date: endDate || startDate,
      total_amount: total,
      status: 'submitted',
      reimbursement_note: 'क्लेम फॉर्म सबमिट किया गया है',
      receipt_images: receiptImages,
      expenses: validExpenses,
      created_at: new Date().toISOString().split('T')[0]
    };

    setClaims([newClaim, ...claims]);
    setIsModalOpen(false);

    // Reset Form
    setTripTitle('');
    setDestination('');
    setStartDate('');
    setEndDate('');
    setExpenseRows([{ id: '1', category: 'ticket_transport', amount: '', description: '' }]);
  };

  const handleOpenSettle = (claim: TravelClaim) => {
    setSettlingClaimId(claim.id);
    setSettleAmount(String(claim.total_amount));
    setSettleNote(`कंपनी/दुकान से ${claim.total_amount.toLocaleString('en-IN')} का भुगतान प्राप्त हुआ`);
  };

  const handleConfirmSettle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlingClaimId) return;

    const amt = Number(settleAmount);
    setClaims(claims.map(c => {
      if (c.id === settlingClaimId) {
        return {
          ...c,
          status: 'reimbursed',
          reimbursed_amount: amt,
          reimbursement_date: new Date().toISOString().split('T')[0],
          reimbursement_note: `${settleNote.trim()} (${settleMode === 'bank_transfer' ? 'बैंक ट्रांसफर' : settleMode === 'upi' ? 'UPI' : 'नकद'})`
        };
      }
      return c;
    }));

    setSettlingClaimId(null);
  };

  const filteredClaims = claims.filter(c => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'job_official') return c.trip_type === 'job_official';
    if (activeFilter === 'business_tour') return c.trip_type === 'business_tour';
    if (activeFilter === 'submitted') return c.status === 'submitted' || c.status === 'draft';
    if (activeFilter === 'reimbursed') return c.status === 'reimbursed';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-paper border border-blue-800/40 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Plane size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-paper">ऑफिशियल टूर व बिज़नेस यात्रा क्लेम (Reimbursement Engine)</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/25 text-blue-300 font-bold border border-blue-400/30">
                  बिल फोटो सेविंग एक्टिव
                </span>
              </div>
              <p className="text-xs text-blue-200/80 mt-0.5">
                नौकरी (Job) या व्यापार (Business) के सभी टूर, टिकट, होटल, और भोजन खर्चों का हिसाब व प्रतिपूर्ति
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <Plus size={15} /> + नया यात्रा क्लेम जोड़ें
          </button>
        </div>

        {/* 3 Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-blue-200/70 uppercase block">पेंडिंग क्लेम (वापस लेना बाकी)</span>
            <Mono className="text-lg font-black text-amber-400 block mt-0.5">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </Mono>
            <span className="text-[9px] text-amber-300/80">कंपनी/व्यापार से देय</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-blue-200/70 uppercase block">प्रतिपूर्ति हुई (Reimbursed)</span>
            <Mono className="text-lg font-black text-emerald-400 block mt-0.5">
              ₹{reimbursedAmount.toLocaleString('en-IN')}
            </Mono>
            <span className="text-[9px] text-emerald-300/80">खाते में प्राप्त</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-blue-200/70 uppercase block">कुल यात्रा खर्च</span>
            <Mono className="text-lg font-black text-paper block mt-0.5">
              ₹{totalClaimAmount.toLocaleString('en-IN')}
            </Mono>
            <span className="text-[9px] text-blue-200/80">{claims.length} यात्राएं रिकॉर्डेड</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setActiveFilter('all')}
          className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
            activeFilter === 'all'
              ? 'bg-navy text-white shadow-xs'
              : 'bg-paper text-ink-muted hover:text-ink border border-paper-dim'
          }`}
        >
          सभी टूर ({claims.length})
        </button>
        <button
          onClick={() => setActiveFilter('submitted')}
          className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
            activeFilter === 'submitted'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-paper text-ink-muted hover:text-ink border border-paper-dim'
          }`}
        >
          पेंडिंग क्लेम (⏳)
        </button>
        <button
          onClick={() => setActiveFilter('reimbursed')}
          className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
            activeFilter === 'reimbursed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-paper text-ink-muted hover:text-ink border border-paper-dim'
          }`}
        >
          प्रतिपूर्ति हुई (✅)
        </button>
        <button
          onClick={() => setActiveFilter('job_official')}
          className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
            activeFilter === 'job_official'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-paper text-ink-muted hover:text-ink border border-paper-dim'
          }`}
        >
          💼 जॉब टूर
        </button>
        <button
          onClick={() => setActiveFilter('business_tour')}
          className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
            activeFilter === 'business_tour'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-paper text-ink-muted hover:text-ink border border-paper-dim'
          }`}
        >
          🏬 व्यापार टूर
        </button>
      </div>

      {/* Claims List */}
      <div className="space-y-3">
        {filteredClaims.map((claim) => {
          const isReimbursed = claim.status === 'reimbursed';
          return (
            <div
              key={claim.id}
              className={`p-4 rounded-2xl bg-paper border shadow-xs space-y-3 animate-fade-in hover:shadow-md transition-all ${
                isReimbursed ? 'border-emerald-500/30' : 'border-amber-500/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-dim pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">{claim.trip_title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      claim.trip_type === 'job_official' 
                        ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400' 
                        : 'bg-purple-500/15 text-purple-700 dark:text-purple-400'
                    }`}>
                      {claim.trip_type === 'job_official' ? '💼 जॉब / नौकरी टूर' : '🏬 व्यापारिक यात्रा'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-ink-muted mt-1">
                    <span className="flex items-center gap-1">
                      <User size={12} /> {claim.member_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {claim.destination}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {claim.start_date} से {claim.end_date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] text-ink-muted uppercase block">कुल क्लेम राशि</span>
                    <Mono className="text-base font-bold text-ink">
                      ₹{claim.total_amount.toLocaleString('en-IN')}
                    </Mono>
                  </div>

                  {isReimbursed ? (
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} /> ₹{claim.reimbursed_amount?.toLocaleString('en-IN')} वापस मिले
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenSettle(claim)}
                      className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-navy font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                    >
                      <DollarSign size={13} />
                      <span>प्रतिपूर्ति दर्ज करें</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Itemized Expenses Breakdown */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                  खर्च विवरण (Itemized Expenses & Receipts):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {claim.expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-2.5 rounded-xl bg-paper-subtle border border-paper-dim flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {exp.receipt_url ? (
                          <div 
                            className="w-8 h-8 rounded-lg overflow-hidden border border-paper-dim shrink-0 cursor-pointer hover:opacity-80"
                            onClick={() => window.open(exp.receipt_url, '_blank')}
                            title="रसीद की फोटो देखें"
                          >
                            <img src={exp.receipt_url} alt="Receipt" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-paper border border-dashed border-paper-dim flex items-center justify-center text-ink-muted shrink-0">
                            <Receipt size={14} />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-ink">{exp.description}</p>
                          <span className="text-[10px] text-ink-muted capitalize">
                            {exp.category.replace('_', ' ')} • {exp.expense_date}
                          </span>
                        </div>
                      </div>
                      <Mono className="font-bold text-ink">
                        ₹{exp.amount.toLocaleString('en-IN')}
                      </Mono>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Note Strip */}
              {claim.reimbursement_note && (
                <div className="p-2.5 rounded-xl bg-paper-subtle border border-paper-dim text-[11px] text-ink-muted flex items-center justify-between">
                  <span><strong>स्टेटस नोट:</strong> {claim.reimbursement_note}</span>
                  {claim.reimbursement_date && (
                    <span className="text-[10px]">तारीख: {claim.reimbursement_date}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: ADD NEW TRAVEL CLAIM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-paper border border-paper-dim rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-sm text-ink">नया यात्रा / टूर क्लेम दर्ज करें</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-muted hover:text-ink p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitClaim} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">यात्री सदस्य *</label>
                  <select
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-subtle border border-paper-dim rounded-xl text-ink font-semibold"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">यात्रा का प्रकार *</label>
                  <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value as TravelTripType)}
                    className="w-full px-3 py-2 text-xs bg-paper-subtle border border-paper-dim rounded-xl text-ink font-semibold"
                  >
                    <option value="job_official">💼 नौकरी / ऑफिशियल टूर</option>
                    <option value="business_tour">🏬 व्यापारिक यात्रा (Business)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">टूर का नाम / उद्देश्य *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. रायपुर मंडी सप्लायर मीटिंग व माल खरीद"
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-paper-subtle border border-paper-dim rounded-xl text-ink font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">गंतव्य शहर *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. रायपुर / दिल्ली"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-paper-subtle border border-paper-dim rounded-xl text-ink"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">प्रस्थान तिथि</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-paper-subtle border border-paper-dim rounded-xl text-ink"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">वापसी तिथि</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-paper-subtle border border-paper-dim rounded-xl text-ink"
                  />
                </div>
              </div>

              {/* Dynamic Expense Rows with Receipt Camera Image Upload */}
              <div className="space-y-2 pt-2 border-t border-paper-dim">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-ink">खर्च मद व रसीद फोटो (Expense Items & Receipts)</span>
                  <button
                    type="button"
                    onClick={handleAddExpenseRow}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> + और खर्च जोड़ें
                  </button>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {expenseRows.map((row, idx) => (
                    <div
                      key={row.id}
                      className="p-2.5 rounded-xl bg-paper-subtle border border-paper-dim space-y-2"
                    >
                      <div className="grid grid-cols-12 gap-1.5 items-center">
                        <select
                          value={row.category}
                          onChange={(e) => handleRowChange(row.id, 'category', e.target.value)}
                          className="col-span-4 px-2 py-1.5 text-xs bg-paper border border-paper-dim rounded-lg text-ink"
                        >
                          <option value="ticket_transport">ट्रेन/फ्लाइट/बस</option>
                          <option value="hotel_stay">होटल/ठहरना</option>
                          <option value="food_meal">भोजन/खाना</option>
                          <option value="fuel_petrol">लोकल कैब/पेट्रोल</option>
                          <option value="client_meeting">क्लाइंट मीटिंग</option>
                          <option value="other">अन्य खर्च</option>
                        </select>

                        <input
                          type="text"
                          placeholder="विवरण (होटल का नाम/टिकट)"
                          value={row.description}
                          onChange={(e) => handleRowChange(row.id, 'description', e.target.value)}
                          className="col-span-4 px-2 py-1.5 text-xs bg-paper border border-paper-dim rounded-lg text-ink"
                        />

                        <input
                          type="number"
                          placeholder="रकम (₹)"
                          value={row.amount}
                          onChange={(e) => handleRowChange(row.id, 'amount', e.target.value)}
                          className="col-span-3 px-2 py-1.5 text-xs bg-paper border border-paper-dim rounded-lg text-ink font-mono font-bold"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveExpenseRow(row.id)}
                          className="col-span-1 text-ink-muted hover:text-rose-500 p-1 flex justify-center"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Image / Bill Photo Upload */}
                      <div className="flex items-center gap-2 pt-1 border-t border-paper-dim/60">
                        <label className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 cursor-pointer hover:bg-blue-500/20 transition-all">
                          <Camera size={12} />
                          <span>{row.receiptImage ? 'बिल फोटो बदलें' : 'बिल/रसीद फोटो लें या चुनें'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => handleImageUpload(row.id, e)}
                            className="hidden"
                          />
                        </label>
                        {row.receiptImage && (
                          <div className="flex items-center gap-1.5">
                            <img src={row.receiptImage} alt="Receipt thumbnail" className="w-6 h-6 rounded object-cover border border-paper-dim" />
                            <span className="text-[10px] text-emerald-600 font-bold">✓ रसीद जुड़ी</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-paper-dim">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  + क्लेम जमा करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SETTLE / MARK REIMBURSED */}
      {settlingClaimId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper border border-paper-dim rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-ink">प्रतिपूर्ति (Reimbursement) दर्ज करें</h3>
              </div>
              <button
                onClick={() => setSettlingClaimId(null)}
                className="text-ink-muted hover:text-ink p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmSettle} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">वापस मिली राशि (₹) *</label>
                <input
                  type="number"
                  required
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-paper-subtle border border-paper-dim rounded-xl font-mono font-bold text-emerald-600"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">भुगतान माध्यम *</label>
                <select
                  value={settleMode}
                  onChange={(e) => setSettleMode(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-paper-subtle border border-paper-dim rounded-xl text-ink font-semibold"
                >
                  <option value="bank_transfer">🏛️ बैंक ट्रांसफर (NEFT/IMPS)</option>
                  <option value="upi">📱 UPI</option>
                  <option value="cash">💵 नकद (Cash)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">टिप्पणी / UTR नंबर</label>
                <input
                  type="text"
                  placeholder="उदा. कंपनी से खाते में जमा, UTR #12345"
                  value={settleNote}
                  onChange={(e) => setSettleNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-subtle border border-paper-dim rounded-xl text-ink"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-paper-dim">
                <button
                  type="button"
                  onClick={() => setSettlingClaimId(null)}
                  className="px-3.5 py-1.5 text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  ✓ प्रतिपूर्ति पूर्ण मार्क करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
