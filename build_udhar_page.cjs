const fs = require('fs');
const path = require('path');

const code = `'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Button } from '@/components/ui/Button';
import { HandCoins, Plus, ArrowUpRight, ArrowDownRight, Phone, CheckCircle, Clock, Package, Wrench, Banknote, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { UdharSettlementMode } from '@/types';
import confetti from 'canvas-confetti';

export default function UdharManagerPage() {
  const { udharContacts, addUdharContact, recordUdharSettlement, members, currentUserId } = useFamilyStore();
  const [filter, setFilter] = useState<'all' | 'given' | 'taken' | 'settled'>('all');
  
  // Modals
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  // New Contact Form
  const [personName, setPersonName] = useState('');
  const [phone, setPhone] = useState('');
  const [udharType, setUdharType] = useState<'given' | 'taken'>('given');
  const [amount, setAmount] = useState('');
  const [memberId, setMemberId] = useState(currentUserId || members[0]?.id || 'm-papa');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  // Settlement Form
  const [settleAmount, setSettleAmount] = useState('');
  const [settleMode, setSettleMode] = useState<UdharSettlementMode>('cash_online');
  const [settleNote, setSettleNote] = useState('');

  const totalReceivable = udharContacts
    .filter(u => u.type === 'given' && u.status === 'active')
    .reduce((sum, u) => sum + Number(u.remaining_balance || 0), 0);

  const totalPayable = udharContacts
    .filter(u => u.type === 'taken' && u.status === 'active')
    .reduce((sum, u) => sum + Number(u.remaining_balance || 0), 0);

  const filteredContacts = udharContacts.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'given') return c.type === 'given' && c.status === 'active';
    if (filter === 'taken') return c.type === 'taken' && c.status === 'active';
    if (filter === 'settled') return c.status === 'settled';
    return true;
  });

  const activeContact = udharContacts.find(c => c.id === selectedContactId);

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (!personName || !numAmt || numAmt <= 0) return;

    addUdharContact({
      member_id: memberId,
      person_name: personName,
      phone: phone || undefined,
      type: udharType,
      original_amount: numAmt,
      remaining_balance: numAmt,
      due_date: dueDate || undefined,
      notes: notes || undefined,
      status: 'active'
    });

    setIsAddContactOpen(false);
    setPersonName('');
    setPhone('');
    setAmount('');
    setNotes('');
  };

  const handleSettlementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(settleAmount);
    if (!selectedContactId || !numAmt || numAmt <= 0) return;

    recordUdharSettlement(selectedContactId, {
      amount: numAmt,
      mode: settleMode,
      note: settleNote || (settleMode === 'cash_online' ? 'Cash/Online Payment' : settleMode === 'samaan_goods' ? 'Samaan dekar hisab' : 'Kaam karke adjust kiya')
    });

    if (activeContact && (activeContact.remaining_balance - numAmt) <= 0) {
      try { confetti({ particleCount: 60, spread: 60 }); } catch (err) {}
    }

    setSelectedContactId(null);
    setSettleAmount('');
    setSettleNote('');
    alert('Udhar settlement successfully record ho gaya!');
  };

  return (
    <div className="space-y-4">
      <div className="px-4 pt-2">
        <Link href="/money" className="text-xs text-ink-muted hover:text-ink flex items-center gap-1 font-medium">
          <ChevronLeft size={16} /> Money par wapas jayein
        </Link>
      </div>

      <ScreenHeader
        title="Udhar & Lending Ledger"
        subtitle="Kisi ko diya, kisse liya, aur partial/samaan se hisab chukayein"
        action={
          <button
            type="button"
            onClick={() => setIsAddContactOpen(true)}
            className="w-8 h-8 rounded-full bg-navy text-paper flex items-center justify-center shadow hover:bg-navy-light transition-all"
            title="Add Udhar Contact"
          >
            <Plus size={16} />
          </button>
        }
      />

      {/* Overview Cards */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-sm">
          <div className="flex items-center gap-1 text-[11px] font-bold text-coral uppercase">
            <ArrowUpRight size={14} /> Lena Baaki Hai (Receivable)
          </div>
          <Mono className="text-lg font-bold text-ink block mt-1">
            ₹{totalReceivable.toLocaleString('en-IN')}
          </Mono>
          <p className="text-[10px] text-ink-muted mt-0.5">Maine dusro ko diya hua hai</p>
        </div>

        <div className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-sm">
          <div className="flex items-center gap-1 text-[11px] font-bold text-green uppercase">
            <ArrowDownRight size={14} /> Dena Baaki Hai (Payable)
          </div>
          <Mono className="text-lg font-bold text-ink block mt-1">
            ₹{totalPayable.toLocaleString('en-IN')}
          </Mono>
          <p className="text-[10px] text-ink-muted mt-0.5">Maine kisi se liya hua hai</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: 'all', label: 'Sabhi Udhar' },
          { key: 'given', label: 'Lena Hai (Given)' },
          { key: 'taken', label: 'Dena Hai (Taken)' },
          { key: 'settled', label: 'Chukta (Settled)' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key as any)}
            className={'text-xs px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ' + (filter === t.key ? 'bg-navy text-paper shadow-sm' : 'bg-paper-dim text-ink-muted hover:text-ink')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Udhar Contacts List */}
      <div className="px-4 space-y-3">
        {filteredContacts.map((c) => {
          const associatedMember = members.find(m => m.id === c.member_id);
          const isGiven = c.type === 'given';
          const isFullySettled = c.status === 'settled';

          return (
            <div key={c.id} className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-ink">{c.person_name}</h3>
                    {isFullySettled ? (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-green/15 text-green">
                        ✓ Chukta
                      </span>
                    ) : (
                      <span className={'text-[9px] font-bold px-2 py-0.5 rounded uppercase ' + (isGiven ? 'bg-coral/10 text-coral' : 'bg-green/10 text-green')}>
                        {isGiven ? 'Maine Diya (Lena Hai)' : 'Maine Liya (Dena Hai)'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-ink-muted mt-0.5 flex items-center gap-2">
                    <span>Parivar Member: <strong className="text-ink">{associatedMember?.name || 'Papa'}</strong></span>
                    {c.phone && <span>· <a href={'tel:' + c.phone} className="text-gold underline">{c.phone}</a></span>}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-ink-muted block uppercase font-bold">Bakaya Balance</span>
                  <Mono className={'text-base font-bold ' + (isFullySettled ? 'text-ink-muted line-through' : isGiven ? 'text-coral' : 'text-green')}>
                    ₹{c.remaining_balance.toLocaleString('en-IN')}
                  </Mono>
                  <span className="text-[10px] text-ink-muted block">Original: ₹{c.original_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {c.notes && (
                <p className="text-xs text-ink-muted bg-paper-dim/40 p-2 rounded-lg italic">
                  &quot;{c.notes}&quot;
                </p>
              )}

              {/* Past Settlement History (Cash / Goods / Work) */}
              {c.settlements && c.settlements.length > 0 && (
                <div className="pt-2 border-t border-paper-dim space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                    Settlement & Hisab History:
                  </span>
                  {c.settlements.map((s) => (
                    <div key={s.id} className="p-2 rounded-lg bg-paper-dim/50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {s.settlement_mode === 'cash_online' ? (
                          <Banknote size={14} className="text-green shrink-0" />
                        ) : s.settlement_mode === 'samaan_goods' ? (
                          <Package size={14} className="text-gold shrink-0" />
                        ) : (
                          <Wrench size={14} className="text-purple-600 shrink-0" />
                        )}
                        <div>
                          <span className="text-ink font-medium">{s.note}</span>
                          <span className="text-[10px] text-ink-muted block">{s.date}</span>
                        </div>
                      </div>
                      <Mono className="font-bold text-green">
                        -₹{s.amount.toLocaleString('en-IN')}
                      </Mono>
                    </div>
                  ))}
                </div>
              )}

              {/* Settle / Pay Action Button */}
              {!isFullySettled && (
                <div className="pt-2 border-t border-paper-dim flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedContactId(c.id);
                      setSettleAmount(c.remaining_balance.toString());
                    }}
                    className="bg-navy text-paper text-xs font-semibold py-1.5 px-3"
                  >
                    + Hisab Chukayein / Partial Settle
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Settle Modal (Cash, Samaan, Kaam) */}
      {selectedContactId && activeContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-gold tracking-wider">Udhar Settlement</span>
              <h3 className="text-base font-bold font-serif text-ink mt-0.5">{activeContact.person_name}</h3>
              <p className="text-xs text-ink-muted">Bakaya Raqam: <Mono className="font-bold text-ink">₹{activeContact.remaining_balance.toLocaleString('en-IN')}</Mono></p>
            </div>

            <form onSubmit={handleSettlementSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Settlement Ka Tareeqa</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'cash_online', label: '💵 Cash/GPay', icon: Banknote },
                    { id: 'samaan_goods', label: '🌾 Samaan Dekar', icon: Package },
                    { id: 'kaam_service', label: '🛠️ Kaam Karke', icon: Wrench },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSettleMode(m.id as any)}
                      className={'py-2 px-1 text-[11px] font-medium rounded-lg border text-center transition-all ' + (settleMode === m.id ? 'bg-navy text-paper border-navy shadow-sm' : 'bg-paper text-ink-muted border-paper-dim')}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Kitna Settle / Chukta Hua? (₹ Raqam)</label>
                <input
                  type="number"
                  placeholder="e.g. 2000"
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Vivran / Note</label>
                <input
                  type="text"
                  placeholder={settleMode === 'samaan_goods' ? 'e.g. 1 bora gehu dekar adjust kiya' : settleMode === 'kaam_service' ? 'e.g. Tractor se khet jota' : 'e.g. GPay se transfer kiya'}
                  value={settleNote}
                  onChange={(e) => setSettleNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setSelectedContactId(null)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-green text-white font-semibold">
                  Record Settlement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Udhar Contact Modal */}
      {isAddContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold font-serif text-ink">Naya Udhar Entry Jodein</h3>
            <form onSubmit={handleAddContactSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Udhar Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUdharType('given')}
                    className={'py-2 text-xs font-bold rounded-xl border transition-all ' + (udharType === 'given' ? 'bg-coral text-white border-coral shadow-sm' : 'bg-paper text-ink-muted border-paper-dim')}
                  >
                    Maine Diya (Lena Hai)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUdharType('taken')}
                    className={'py-2 text-xs font-bold rounded-xl border transition-all ' + (udharType === 'taken' ? 'bg-green text-white border-green shadow-sm' : 'bg-paper text-ink-muted border-paper-dim')}
                  >
                    Maine Liya (Dena Hai)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Kiska Naam Hai? (Person / Store Name)</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Uncle, Sunil Kirana Store, Verma Ji"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Raqam (₹ Amount)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Kis Member Ka Hai?</label>
                  <select
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Wapsi Ki Date (Expected Due Date)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Karan / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Urgent zaroorat ke liye diya"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddContactOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-navy text-paper font-semibold">
                  Save Udhar Entry
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.mkdirSync('app/(dashboard)/money/udhar', { recursive: true });
fs.writeFileSync('app/(dashboard)/money/udhar/page.tsx', code.trim() + '\n', 'utf8');
console.log('Saved app/(dashboard)/money/udhar/page.tsx');
