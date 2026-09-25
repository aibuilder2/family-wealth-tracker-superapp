'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, ArrowUpRight, ArrowDownLeft, Trash2, Calendar, MessageSquare, CheckCircle2, ShoppingBag, Banknote } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

interface MemberLedgerEntry {
  id: string;
  fromMember: string; // kisne diya / kharch kiya
  toMember: string; // kiske liye kharch kiya / kisko diya
  amount: number;
  type: 'cash_transfer' | 'bought_item' | 'online_bill';
  title: string;
  date: string;
  isSettled: boolean;
}

const DEFAULT_ENTRIES: MemberLedgerEntry[] = [];

export function FamilyHisabModule() {
  const [entries, setEntries] = useState<MemberLedgerEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_family_hisab_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((e: any) => !['mle-1', 'mle-2', 'mle-3'].includes(e?.id));
          }
        } catch (e) {}
      }
    }
    return DEFAULT_ENTRIES;
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activePartner, setActivePartner] = useState<string>('पापा');

  // Form State
  const [fromMember, setFromMember] = useState('रोहन');
  const [toMember, setToMember] = useState('पापा');
  const [amount, setAmount] = useState<number | ''>('');
  const [type, setType] = useState<MemberLedgerEntry['type']>('cash_transfer');
  const [title, setTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('fwa_family_hisab_v1', JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || fromMember === toMember) {
      if (fromMember === toMember) alert('दोनों सदस्य एक ही नहीं हो सकते!');
      return;
    }

    const newEntry: MemberLedgerEntry = {
      id: `mle-${Date.now()}`,
      fromMember,
      toMember,
      amount: Number(amount),
      type,
      title,
      date: new Date().toISOString().split('T')[0],
      isSettled: false
    };

    setEntries([newEntry, ...entries]);
    setIsAddOpen(false);
    setTitle('');
    setAmount('');
  };

  const toggleSettle = (id: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, isSettled: !e.isSettled } : e));
  };

  const handleDelete = (id: string) => {
    if (confirm('क्या आप इस प्रविष्टि को हटाना चाहते हैं?')) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  // Calculate net balance between Rohan and Active Partner
  const rohanPaidForPartner = entries
    .filter(e => !e.isSettled && e.fromMember === 'रोहन' && e.toMember === activePartner)
    .reduce((sum, e) => sum + e.amount, 0);

  const partnerPaidForRohan = entries
    .filter(e => !e.isSettled && e.fromMember === activePartner && e.toMember === 'रोहन')
    .reduce((sum, e) => sum + e.amount, 0);

  const netBalance = rohanPaidForPartner - partnerPaidForRohan; // positive means Rohan will receive

  const activeLedgerEntries = entries.filter(
    e => (e.fromMember === 'रोहन' && e.toMember === activePartner) ||
         (e.fromMember === activePartner && e.toMember === 'रोहन')
  );

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-navy text-paper p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gold/20 text-gold rounded-xl">
              <Users size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold font-serif">Member Aapsi Hisab (आपसी लेन-देन)</h2>
              <p className="text-[11px] text-paper-dim/80">परिवार के सदस्यों का आपस में खर्च, सामान लाना व रनिंग बैलेंस</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3 py-1.5 bg-gold text-navy text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-gold-light active:scale-95 transition-all shadow-sm"
          >
            <Plus size={15} /> नया लेन-देन
          </button>
        </div>

        {/* Member Partner Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs pt-1 border-t border-navy-light/40">
          {['पापा', 'मम्मी', 'प्रिया', 'अमित भैया'].map(partner => (
            <button
              key={partner}
              onClick={() => setActivePartner(partner)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activePartner === partner ? 'bg-gold text-navy shadow-sm' : 'bg-navy-light/50 text-paper-dim hover:bg-navy-light'
              }`}
            >
              👤 रोहन ⇄ {partner}
            </button>
          ))}
        </div>

        {/* Net Running Balance Card */}
        <div className="bg-navy-light/40 p-3 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-paper-dim/70">रोहन और {activePartner} का कुल रनिंग बैलेंस:</p>
            <h3 className="text-sm font-bold text-paper mt-0.5">
              {netBalance > 0 ? (
                <span className="text-green font-bold">रोहन को {activePartner} से लेना है</span>
              ) : netBalance < 0 ? (
                <span className="text-coral-light font-bold">रोहन को {activePartner} को देना है</span>
              ) : (
                <span className="text-gold font-bold">हिसाब पूरी तरह बराबर है (0)</span>
              )}
            </h3>
          </div>
          <Mono className={`text-lg font-bold ${netBalance >= 0 ? 'text-green' : 'text-coral-light'}`}>
            ₹{Math.abs(netBalance).toLocaleString('en-IN')}
          </Mono>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-ink uppercase tracking-wider px-1">
          लेन-देन खाता: रोहन ⇄ {activePartner} ({activeLedgerEntries.length})
        </h3>

        {activeLedgerEntries.length === 0 ? (
          <div className="p-6 bg-paper border border-paper-dim rounded-2xl text-center text-xs text-ink-muted">
            कोई बकाया लेन-देन दर्ज नहीं है।
          </div>
        ) : (
          activeLedgerEntries.map(e => (
            <div key={e.id} className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                      e.fromMember === 'रोहन' ? 'bg-green/15 text-green' : 'bg-coral/15 text-coral'
                    }`}>
                      {e.fromMember} ने दिया → {e.toMember} को
                    </span>
                    <span className="text-[10px] text-ink-muted">
                      {e.type === 'cash_transfer' ? '💵 कैश' : e.type === 'online_bill' ? '⚡ बिल' : '🛍️ सामान'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-ink mt-1">{e.title}</h4>
                </div>

                <div className="text-right">
                  <Mono className="text-base font-bold text-ink">₹{e.amount.toLocaleString('en-IN')}</Mono>
                  <p className="text-[10px] text-ink-muted">{e.date}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-paper-dim text-xs">
                <button
                  onClick={() => toggleSettle(e.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                    e.isSettled ? 'bg-green/15 text-green' : 'bg-paper-dim text-ink-muted hover:text-ink'
                  }`}
                >
                  <CheckCircle2 size={13} /> {e.isSettled ? '✓ चुकता हो गया' : 'बकाया (पेंडिंग)'}
                </button>
                <button
                  onClick={() => handleDelete(e.id)}
                  className="text-coral hover:text-coral-dark p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <h3 className="text-sm font-bold text-ink">नया पारिवारिक लेन-देन जोड़ें</h3>
            <form onSubmit={handleAddEntry} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">किसने दिया/ख़र्च किया?</label>
                  <select
                    value={fromMember}
                    onChange={e => setFromMember(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-semibold"
                  >
                    <option value="रोहन">रोहन</option>
                    <option value="पापा">पापा</option>
                    <option value="मम्मी">मम्मी</option>
                    <option value="प्रिया">प्रिया</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">कॉल/कन्फर्म किसके लिए?</label>
                  <select
                    value={toMember}
                    onChange={e => setToMember(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-semibold"
                  >
                    <option value="पापा">पापा</option>
                    <option value="रोहन">रोहन</option>
                    <option value="मम्मी">मम्मी</option>
                    <option value="प्रिया">प्रिया</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-ink-muted mb-1">रकम (₹)</label>
                <input
                  type="number"
                  placeholder="2000"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">प्रकार</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  >
                    <option value="cash_transfer">कैश दिया (Cash)</option>
                    <option value="bought_item">सामान खरीद कर लाया</option>
                    <option value="online_bill">ऑनलाइन बिल भरा</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">विवरण / सामान</label>
                  <input
                    type="text"
                    placeholder="उदा. ग्रोसरी या दवाई"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
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
