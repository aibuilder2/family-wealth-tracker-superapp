'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Plus, Users, Wallet, Share2, Calendar, MapPin, Trash2, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import { useFamilyStore } from '@/lib/store/familyStore';

interface TripExpense {
  id: string;
  title: string;
  category: 'hotel' | 'food' | 'transport' | 'tickets' | 'misc';
  amount: number;
  paidBy: string; // member who paid
  date: string;
}

interface TripMember {
  name: string;
  advanceContributed: number;
}

interface TripRecord {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  members: TripMember[];
  expenses: TripExpense[];
}

const DEFAULT_TRIPS: TripRecord[] = [];

export function TripsSplitterModule() {
  const [trips, setTrips] = useState<TripRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_trips_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((t: any) => t?.id !== 'trip-1');
          }
        } catch (e) {}
      }
    }
    return DEFAULT_TRIPS;
  });

  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddPoolOpen, setIsAddPoolOpen] = useState(false);

  // Form State: New Trip
  const [tripTitle, setTripTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Form State: Expense
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState<TripExpense['category']>('food');
  const [expAmount, setExpAmount] = useState<number | ''>('');
  const { members } = useFamilyStore();
  const [expPaidBy, setExpPaidBy] = useState(() => members[0]?.name || 'Ankush kesharwani');

  // Form State: Pool Fund
  const [poolMember, setPoolMember] = useState(() => members[0]?.name || 'Ankush kesharwani');
  const [poolAmount, setPoolAmount] = useState<number | ''>('');

  useEffect(() => {
    if (members.length > 0 && !members.some(m => m.name === expPaidBy)) {
      setExpPaidBy(members[0].name);
      setPoolMember(members[0].name);
    }
  }, [members]);

  useEffect(() => {
    localStorage.setItem('fwa_trips_v1', JSON.stringify(trips));
  }, [trips]);

  const activeTrip = trips.find(t => t.id === selectedTripId) || trips[0];

  const handleAddTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripTitle || !destination) return;

    const initialTripMembers = members.length > 0
      ? members.slice(0, 4).map(m => ({ name: m.name, advanceContributed: 0 }))
      : [{ name: 'Ankush kesharwani', advanceContributed: 0 }];

    const newTrip: TripRecord = {
      id: `trip-${Date.now()}`,
      title: tripTitle,
      destination,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      members: initialTripMembers,
      expenses: []
    };

    setTrips([newTrip, ...trips]);
    setSelectedTripId(newTrip.id);
    setIsAddTripOpen(false);
    setTripTitle('');
    setDestination('');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip || !expTitle || !expAmount) return;

    const newExp: TripExpense = {
      id: `te-${Date.now()}`,
      title: expTitle,
      category: expCategory,
      amount: Number(expAmount),
      paidBy: expPaidBy,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = {
      ...activeTrip,
      expenses: [newExp, ...activeTrip.expenses]
    };

    setTrips(trips.map(t => t.id === activeTrip.id ? updated : t));
    setIsAddExpenseOpen(false);
    setExpTitle('');
    setExpAmount('');
  };

  const handleAddPool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip || !poolAmount) return;

    const amt = Number(poolAmount);
    const existing = activeTrip.members.find(m => m.name === poolMember);

    let updatedMembers: TripMember[];
    if (existing) {
      updatedMembers = activeTrip.members.map(m => m.name === poolMember ? { ...m, advanceContributed: m.advanceContributed + amt } : m);
    } else {
      updatedMembers = [...activeTrip.members, { name: poolMember, advanceContributed: amt }];
    }

    const updated = {
      ...activeTrip,
      members: updatedMembers
    };

    setTrips(trips.map(t => t.id === activeTrip.id ? updated : t));
    setIsAddPoolOpen(false);
    setPoolAmount('');
  };

  const totalTripSpent = activeTrip?.expenses.reduce((sum, e) => sum + e.amount, 0) || 0;
  const totalPoolCollected = activeTrip?.members.reduce((sum, m) => sum + m.advanceContributed, 0) || 0;
  const memberCount = Math.max(1, activeTrip?.members.length || 1);
  const perPersonShare = Math.round(totalTripSpent / memberCount);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-navy text-paper p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gold/20 text-gold rounded-xl">
              <Compass size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold font-serif">Holiday & Trips Splitter (टूर हिसाब)</h2>
              <p className="text-[11px] text-paper-dim/80">एडवांस पूल फंड, ग्रुप होटल/टैक्सी ख़र्च व प्रति व्यक्ति बराबर हिस्सा</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddTripOpen(true)}
            className="px-3 py-1.5 bg-gold text-navy text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-gold-light active:scale-95 transition-all shadow-sm"
          >
            <Plus size={15} /> नई ट्रिप
          </button>
        </div>

        {/* Trip Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs pt-1 border-t border-navy-light/40">
          {trips.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTripId(t.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedTripId === t.id ? 'bg-gold text-navy shadow-sm' : 'bg-navy-light/50 text-paper-dim hover:bg-navy-light'
              }`}
            >
              🏖️ {t.title}
            </button>
          ))}
        </div>

        {/* Active Trip Metrics */}
        {activeTrip && (
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-navy-light/40 text-center">
            <div className="bg-navy-light/40 p-2 rounded-xl">
              <p className="text-[10px] text-paper-dim/70">कुल ट्रिप ख़र्च</p>
              <Mono className="text-sm font-bold text-coral-light">₹{totalTripSpent.toLocaleString('en-IN')}</Mono>
            </div>
            <div className="bg-navy-light/40 p-2 rounded-xl">
              <p className="text-[10px] text-paper-dim/70">पूल फंड जमा</p>
              <Mono className="text-sm font-bold text-green">₹{totalPoolCollected.toLocaleString('en-IN')}</Mono>
            </div>
            <div className="bg-navy-light/40 p-2 rounded-xl">
              <p className="text-[10px] text-paper-dim/70">प्रति व्यक्ति हिस्सा</p>
              <Mono className="text-sm font-bold text-gold">₹{perPersonShare.toLocaleString('en-IN')}</Mono>
            </div>
          </div>
        )}
      </div>

      {trips.length === 0 && (
        <div className="bg-paper border border-paper-dim rounded-2xl p-8 text-center shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-paper-dim/50 flex items-center justify-center mx-auto text-ink-muted">
            <Compass size={24} />
          </div>
          <h3 className="text-sm font-bold text-ink">कोई ट्रिप दर्ज नहीं है</h3>
          <p className="text-xs text-ink-muted max-w-xs mx-auto">
            फैमिली वेकेशन, दोस्तों के साथ टूर, होटल-टैक्सी के बिल और प्रति व्यक्ति हिसाब ट्रैक करने के लिए ट्रिप जोड़ें।
          </p>
          <button
            onClick={() => setIsAddTripOpen(true)}
            className="mt-2 px-4 py-2 bg-gold text-navy text-xs font-bold rounded-xl inline-flex items-center gap-1 hover:bg-gold-light"
          >
            <Plus size={15} /> नई ट्रिप जोड़ें
          </button>
        </div>
      )}

      {activeTrip && (
        <div className="space-y-3">
          {/* Member Settlement Cards */}
          <div className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
                सदस्य हिसाब-किताब (Settlement Sheet)
              </h3>
              <button
                onClick={() => setIsAddPoolOpen(true)}
                className="px-2.5 py-1 bg-paper-dim hover:bg-paper-dim/80 text-ink text-xs font-semibold rounded-lg flex items-center gap-1"
              >
                <Plus size={13} /> + पूल फंड जमा
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {activeTrip.members.map((m, idx) => {
                const totalPaidByMember = activeTrip.expenses
                  .filter(e => e.paidBy === m.name)
                  .reduce((sum, e) => sum + e.amount, 0);
                
                const totalContributed = m.advanceContributed + totalPaidByMember;
                const netBalance = totalContributed - perPersonShare;

                return (
                  <div key={idx} className="p-3 bg-paper-dim/40 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-ink">
                      <span>👤 {m.name}</span>
                      <span className={netBalance >= 0 ? 'text-green' : 'text-coral'}>
                        {netBalance >= 0 ? `+₹${netBalance.toLocaleString('en-IN')} (मिलेगा)` : `-₹${Math.abs(netBalance).toLocaleString('en-IN')} (देना है)`}
                      </span>
                    </div>
                    <div className="text-[10px] text-ink-muted flex justify-between">
                      <span>पूल दिया: ₹{m.advanceContributed}</span>
                      <span>सीधे चुकाया: ₹{totalPaidByMember}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expenses List */}
          <div className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
                ट्रिप के सभी बिल व ख़र्चे ({activeTrip.expenses.length})
              </h3>
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="px-3 py-1 bg-gold text-navy text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-gold-light"
              >
                <Plus size={14} /> + बिल जोड़ें
              </button>
            </div>

            <div className="space-y-2">
              {activeTrip.expenses.map(e => (
                <div key={e.id} className="flex items-center justify-between p-2.5 bg-paper rounded-xl border border-paper-dim text-xs">
                  <div>
                    <span className="px-1.5 py-0.2 bg-paper-dim text-ink-muted text-[10px] font-bold rounded uppercase">
                      {e.category}
                    </span>
                    <h4 className="font-bold text-ink mt-0.5">{e.title}</h4>
                    <p className="text-[10px] text-ink-muted">{e.date} • भुगतान किया: <strong className="text-ink">{e.paidBy}</strong></p>
                  </div>
                  <Mono className="font-bold text-sm text-coral">₹{e.amount.toLocaleString('en-IN')}</Mono>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Trip Modal */}
      {isAddTripOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <h3 className="text-sm font-bold text-ink">नई ट्रिप / वेकेशन शुरू करें</h3>
            <form onSubmit={handleAddTrip} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">ट्रिप का नाम</label>
                <input
                  type="text"
                  placeholder="उदा. गोवा ट्रिप 2026 या वैष्णो देवी यात्रा"
                  value={tripTitle}
                  onChange={e => setTripTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-semibold"
                />
              </div>
              <div>
                <label className="block text-ink-muted mb-1">गंतव्य (Destination)</label>
                <input
                  type="text"
                  placeholder="उदा. Goa, India"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">शुरू तारीख</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">समाप्ति तारीख</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTripOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gold text-navy font-bold hover:bg-gold-light"
                >
                  ट्रिप बनाएं
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
            <h3 className="text-sm font-bold text-ink">ट्रिप ख़र्च / बिल जोड़ें</h3>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">ख़र्च शीर्षक</label>
                <input
                  type="text"
                  placeholder="उदा. होटल रूम बिल या डीजल"
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
                    placeholder="4500"
                    value={expAmount}
                    onChange={e => setExpAmount(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">श्रेणी</label>
                  <select
                    value={expCategory}
                    onChange={e => setExpCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  >
                    <option value="hotel">होटल / स्टे</option>
                    <option value="food">खाना-पीना</option>
                    <option value="transport">टैक्सी / पेट्रोल</option>
                    <option value="tickets">टिकट व एंट्री</option>
                    <option value="misc">अन्य</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-ink-muted mb-1">भुगतान किसने किया?</label>
                <select
                  value={expPaidBy}
                  onChange={e => setExpPaidBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-semibold"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.name}>
                      {m.name} {m.relationship ? `(${m.relationship})` : ''}
                    </option>
                  ))}
                </select>
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
                  className="flex-1 py-2 rounded-xl bg-gold text-navy font-bold"
                >
                  बिल जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Pool Contribution Modal */}
      {isAddPoolOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <h3 className="text-sm font-bold text-ink">पूल फंड (Advance) जमा करें</h3>
            <form onSubmit={handleAddPool} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">सदस्य का नाम</label>
                <select
                  value={poolMember}
                  onChange={e => setPoolMember(e.target.value)}
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
                <label className="block text-ink-muted mb-1">जमा की गई रकम (₹)</label>
                <input
                  type="number"
                  placeholder="10000"
                  value={poolAmount}
                  onChange={e => setPoolAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddPoolOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-green text-paper font-bold"
                >
                  पूल में जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
