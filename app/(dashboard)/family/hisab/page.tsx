'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { 
  Users, Plus, ArrowUpRight, ArrowDownRight, ShoppingBag, Banknote, 
  CheckCircle2, Scale, Trash2, Calendar, MessageSquare, ChevronRight, 
  Filter, X, AlertCircle, Sparkles, FileText, Wrench
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { MemberLedgerType } from '@/types';

export default function FamilyMemberHisabPage() {
  const { members, memberLedgers, addMemberLedgerEntry, deleteMemberLedgerEntry, settleMemberLedger, currentUserId, family } = useFamilyStore();
  
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [isSettleOpen, setIsSettleOpen] = useState(false);

  // Form State
  const [fromMember, setFromMember] = useState(currentUserId || 'm-head');
  const [toMember, setToMember] = useState(members.find(m => m.id !== (currentUserId || 'm-head'))?.id || 'm-rahul');
  const [entryType, setEntryType] = useState<MemberLedgerType>('cash_transfer');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [itemsDetail, setItemsDetail] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Settlement Form State
  const [settleAmount, setSettleAmount] = useState('');
  const [settleNote, setSettleNote] = useState('');

  // Calculate Net Running Balance between currentUser and selected partner
  const activePartner = members.find(m => m.id === selectedPartnerId);

  // Calculate pairwise balances
  const calculateBalance = (memberA: string, memberB: string) => {
    // Money MemberA gave or spent FOR MemberB
    const aGaveB = memberLedgers
      .filter(l => l.from_member_id === memberA && l.to_member_id === memberB)
      .reduce((sum, l) => sum + Number(l.amount || 0), 0);
    
    // Money MemberB gave or spent FOR MemberA
    const bGaveA = memberLedgers
      .filter(l => l.from_member_id === memberB && l.to_member_id === memberA)
      .reduce((sum, l) => sum + Number(l.amount || 0), 0);

    return aGaveB - bGaveA;
  };

  const partnerNetBalance = selectedPartnerId !== 'all' 
    ? calculateBalance(currentUserId, selectedPartnerId)
    : 0;

  // Filtered Entries
  const filteredLedgers = memberLedgers.filter(l => {
    if (selectedPartnerId !== 'all') {
      const match = (l.from_member_id === currentUserId && l.to_member_id === selectedPartnerId) ||
                    (l.from_member_id === selectedPartnerId && l.to_member_id === currentUserId);
      if (!match) return false;
    }
    if (filterType !== 'all') {
      if (l.type !== filterType) return false;
    }
    return true;
  });

  const handleAddEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = Number(amount);
    if (!numAmt || numAmt <= 0 || !title || fromMember === toMember) return;

    addMemberLedgerEntry({
      from_member_id: fromMember,
      to_member_id: toMember,
      type: entryType,
      amount: numAmt,
      title: title,
      items_detail: itemsDetail || undefined,
      notes: notes || undefined,
      date: date || new Date().toISOString().split('T')[0],
      is_settled: false
    });

    setIsAddEntryOpen(false);
    setAmount('');
    setTitle('');
    setItemsDetail('');
    setNotes('');
  };

  const handleSettleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = Number(settleAmount);
    if (!numAmt || numAmt <= 0 || selectedPartnerId === 'all') return;

    settleMemberLedger(currentUserId, selectedPartnerId, numAmt, settleNote);
    try { confetti({ particleCount: 70, spread: 60 }); } catch (e) {}

    setIsSettleOpen(false);
    setSettleAmount('');
    setSettleNote('');
  };

  // WhatsApp Summary Message Generator
  const getWhatsAppSummary = () => {
    if (!activePartner) return '';
    const myName = members.find(m => m.id === currentUserId)?.name || 'Family Member';
    const partnerName = activePartner.name;
    const isReceivable = partnerNetBalance > 0;
    const isPayable = partnerNetBalance < 0;

    let text = `📋 *Aapsi Hisab-Kitab Statement* 📋\n` +
      `🏠 *Family:* ${family.name}\n` +
      `👤 *From:* ${myName}\n` +
      `👤 *To:* ${partnerName}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n`;

    if (partnerNetBalance === 0) {
      text += `✅ *Current Status: Hisab Bilkul Barabar (₹0)*\n`;
    } else if (isReceivable) {
      text += `🟢 *Net Lena Hai: ₹${partnerNetBalance.toLocaleString('en-IN')}*` +
        ` (${partnerName} se ${myName} ko lene hain)\n`;
    } else {
      text += `🔴 *Net Dena Hai: ₹${Math.abs(partnerNetBalance).toLocaleString('en-IN')}*` +
        ` (${myName} ko ${partnerName} ko dene hain)\n`;
    }

    text += `━━━━━━━━━━━━━━━━━━━━\n` +
      `📝 *Recent Entries / Transactions:*\n`;

    filteredLedgers.slice(0, 5).forEach((l, idx) => {
      const fromName = members.find(m => m.id === l.from_member_id)?.name || 'Member';
      const toName = members.find(m => m.id === l.to_member_id)?.name || 'Member';
      text += `${idx + 1}. ${l.date}: ₹${l.amount.toLocaleString('en-IN')} - ${l.title} (${fromName} ➔ ${toName})\n`;
      if (l.items_detail) {
        text += `   ↳ Details: ${l.items_detail}\n`;
      }
    });

    text += `\n📲 *Generated via ${family.name} SuperApp*`;
    return encodeURIComponent(text);
  };

  return (
    <div className="space-y-4 pt-4 pb-12">
      {/* 1. Header */}
      <div className="px-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-serif text-ink flex items-center gap-2">
            <Scale className="text-gold" size={22} /> Member Aapsi Hisab Khata
          </h1>
          <p className="text-xs text-ink-muted">Pariwar ke aapsi len-den, samaan shopping aur running balance</p>
        </div>

        <button
          onClick={() => setIsAddEntryOpen(true)}
          className="px-3 py-2 bg-gold hover:bg-gold-soft text-navy font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all hover:scale-105"
        >
          <Plus size={15} strokeWidth={2.5} /> Naya Hisab
        </button>
      </div>

      {/* 2. Member Selector Tabs (Whose account are you viewing?) */}
      <div className="px-4 flex gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setSelectedPartnerId('all')}
          className={`px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedPartnerId === 'all'
              ? 'bg-navy text-gold-soft border border-gold/40 shadow-sm'
              : 'bg-paper border border-paper-dim text-ink-muted hover:text-ink'
          }`}
        >
          <Users size={14} /> Sabhi Members
        </button>

        {members.filter(m => m.id !== currentUserId).map((m) => {
          const bal = calculateBalance(currentUserId, m.id);
          return (
            <button
              key={m.id}
              onClick={() => setSelectedPartnerId(m.id)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedPartnerId === m.id
                  ? 'bg-navy text-gold-soft border border-gold/40 shadow-sm'
                  : 'bg-paper border border-paper-dim text-ink-muted hover:text-ink'
              }`}
            >
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
                style={{ backgroundColor: m.color || '#B98B2A' }}
              >
                {m.initials || m.name.charAt(0)}
              </div>
              <span>{m.name}</span>
              {bal !== 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${bal > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {bal > 0 ? `+₹${bal}` : `-₹${Math.abs(bal)}`}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Net Running Balance Cockpit Card (If partner selected) */}
      {selectedPartnerId !== 'all' && activePartner && (
        <div className="px-4">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-navy via-[#162738] to-navy border border-gold/30 shadow-lg text-white space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow"
                  style={{ backgroundColor: activePartner.color || '#B98B2A' }}
                >
                  {activePartner.initials}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200">Aap ↔ {activePartner.name}</h3>
                  <p className="text-[10px] text-slate-400">{activePartner.relationship}</p>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                partnerNetBalance > 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : partnerNetBalance < 0
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {partnerNetBalance > 0 ? '🟢 Lene Hain' : partnerNetBalance < 0 ? '🔴 Dene Hain' : '⚪ Barabar'}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <p className="text-[11px] text-slate-300">
                  {partnerNetBalance >= 0 ? `${activePartner.name} se lene baaki hain` : `${activePartner.name} ko dene baaki hain`}
                </p>
                <Mono className={`text-2xl font-black ${partnerNetBalance >= 0 ? 'text-emerald-400' : 'text-coral'}`}>
                  ₹{Math.abs(partnerNetBalance).toLocaleString('en-IN')}
                </Mono>
              </div>

              <div className="flex items-center gap-2">
                {partnerNetBalance !== 0 && (
                  <button
                    onClick={() => {
                      setSettleAmount(String(Math.abs(partnerNetBalance)));
                      setIsSettleOpen(true);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow transition-all"
                  >
                    <CheckCircle2 size={13} /> Settle Hisab
                  </button>
                )}

                <a
                  href={`https://api.whatsapp.com/send?text=${getWhatsAppSummary()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl border border-emerald-500/30 transition-all"
                  title="Share on WhatsApp"
                >
                  <MessageSquare size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Type Filters */}
      <div className="px-4 flex gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: 'Sabhi Entries', icon: '📝' },
          { key: 'cash_transfer', label: 'Cash / Transfer', icon: '💵' },
          { key: 'samaan_shopping', label: 'Samaan / Shopping', icon: '🛍️' },
          { key: 'settlement', label: 'Settlement', icon: '✅' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === tab.key
                ? 'bg-paper-dim text-ink font-bold border border-gold/40'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 5. Ledger Entries Timeline Feed */}
      <div className="px-4 space-y-2.5">
        {filteredLedgers.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-paper border border-paper-dim text-ink-muted space-y-2">
            <Scale size={28} className="mx-auto text-gold/40" />
            <p className="text-xs font-bold text-ink">Abhi koi hisab entry nahi hai</p>
            <p className="text-[11px]">Naya hisab likhne ke liye upar "+ Naya Hisab" dabayein</p>
          </div>
        ) : (
          filteredLedgers.map((l) => {
            const fromM = members.find(m => m.id === l.from_member_id);
            const toM = members.find(m => m.id === l.to_member_id);
            const isMeSender = l.from_member_id === currentUserId;

            return (
              <div 
                key={l.id}
                className="rounded-2xl p-3.5 bg-paper border border-paper-dim shadow-sm hover:border-gold/40 transition-all space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base ${
                      l.type === 'cash_transfer' ? 'bg-blue-500/10 text-blue-600' :
                      l.type === 'samaan_shopping' ? 'bg-amber-500/10 text-amber-600' :
                      'bg-emerald-500/10 text-emerald-600'
                    }`}>
                      {l.type === 'cash_transfer' ? '💵' : l.type === 'samaan_shopping' ? '🛍️' : '✅'}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-ink text-xs">{l.title}</h4>
                      <p className="text-[10px] text-ink-muted flex items-center gap-1.5 mt-0.5">
                        <span>{l.date}</span>
                        <span>•</span>
                        <span className="font-bold text-ink">{fromM?.name || 'Member'}</span>
                        <span>➔</span>
                        <span className="font-bold text-ink">{toM?.name || 'Member'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Mono className={`text-sm font-black ${isMeSender ? 'text-emerald-600' : 'text-coral'}`}>
                      {isMeSender ? '+' : '-'}₹{l.amount.toLocaleString('en-IN')}
                    </Mono>
                    <button
                      onClick={() => deleteMemberLedgerEntry(l.id)}
                      className="text-ink-muted hover:text-coral p-1 block ml-auto mt-0.5"
                      title="Delete Entry"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Samaan details if present */}
                {l.items_detail && (
                  <div className="p-2 rounded-xl bg-paper-dim/60 text-[11px] text-ink-muted border border-paper-dim">
                    <span className="font-bold text-ink">Items / Samaan: </span>
                    <span>{l.items_detail}</span>
                  </div>
                )}

                {l.notes && (
                  <p className="text-[10px] text-ink-muted italic pl-1">{l.notes}</p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 6. Add New Hisab Entry Modal */}
      {isAddEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[390px] bg-paper rounded-3xl p-5 border border-paper-dim shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <h3 className="font-serif font-bold text-ink text-base flex items-center gap-2">
                <Scale size={18} className="text-gold" /> Naya Member Hisab Likhein
              </h3>
              <button onClick={() => setIsAddEntryOpen(false)} className="text-ink-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddEntrySubmit} className="space-y-3">
              {/* From & To Member Selectors */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-ink-muted block mb-1">Kisne Paise Diye/Kharch Kiye? *</label>
                  <select
                    value={fromMember}
                    onChange={(e) => setFromMember(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-paper-dim bg-white text-ink text-xs focus:border-gold outline-none"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.relationship})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink-muted block mb-1">Kiske Kaam/Samaan Ke Liye? *</label>
                  <select
                    value={toMember}
                    onChange={(e) => setToMember(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-paper-dim bg-white text-ink text-xs focus:border-gold outline-none"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.relationship})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Type Selection */}
              <div>
                <label className="text-xs font-bold text-ink-muted block mb-1">Entry Ka Type</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { key: 'cash_transfer', label: '💵 Cash Transfer' },
                    { key: 'samaan_shopping', label: '🛍️ Samaan/Item' },
                    { key: 'work_payment', label: '🛠️ Kaam/Bill' }
                  ].map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setEntryType(t.key as any)}
                      className={`py-2 text-[11px] font-bold rounded-xl border transition-all ${
                        entryType === t.key
                          ? 'bg-navy text-gold-soft border-gold shadow-sm'
                          : 'bg-white border-paper-dim text-ink-muted hover:text-ink'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount & Title */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="text-xs font-bold text-ink-muted block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 3500"
                    required
                    className="w-full p-2.5 rounded-xl border border-paper-dim bg-white text-ink text-xs font-mono font-bold focus:border-gold outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-ink-muted block mb-1">Kaam / Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Ration & Paint Samaan Laya"
                    required
                    className="w-full p-2.5 rounded-xl border border-paper-dim bg-white text-ink text-xs focus:border-gold outline-none"
                  />
                </div>
              </div>

              {/* Samaan Items List (Crucial for shopping tasks) */}
              <div>
                <label className="text-xs font-bold text-ink-muted block mb-1">Samaan ki List / Details (Optional)</label>
                <textarea
                  value={itemsDetail}
                  onChange={(e) => setItemsDetail(e.target.value)}
                  placeholder="e.g. Atta 10kg (₹400), Mustard Oil 2L (₹360), Dawa (₹1200)"
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-paper-dim bg-white text-ink text-xs focus:border-gold outline-none"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-bold text-ink-muted block mb-1">Tareeq (Date)</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 rounded-xl border border-paper-dim bg-white text-ink text-xs focus:border-gold outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEntryOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-paper-dim text-xs font-bold text-ink-muted hover:bg-paper-dim"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gold hover:bg-gold-soft text-navy font-bold text-xs shadow"
                >
                  Hisab Save Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Settlement Modal */}
      {isSettleOpen && activePartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[360px] bg-paper rounded-3xl p-5 border border-paper-dim shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <h3 className="font-serif font-bold text-ink text-base flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" /> Hisab Settle / Barabar Karein
              </h3>
              <button onClick={() => setIsSettleOpen(false)} className="text-ink-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSettleSubmit} className="space-y-3.5">
              <p className="text-xs text-ink-muted">
                <span className="font-bold text-ink">{activePartner.name}</span> ke sath hisab barabar karne ke liye payment confirm karein:
              </p>

              <div>
                <label className="text-xs font-bold text-ink-muted block mb-1">Settlement Amount (₹)</label>
                <input
                  type="number"
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  placeholder="e.g. 1800"
                  required
                  className="w-full p-2.5 rounded-xl border border-paper-dim bg-white text-ink text-sm font-mono font-bold focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ink-muted block mb-1">Payment Note (Optional)</label>
                <input
                  type="text"
                  value={settleNote}
                  onChange={(e) => setSettleNote(e.target.value)}
                  placeholder="e.g. Google Pay / Cash diya"
                  className="w-full p-2.5 rounded-xl border border-paper-dim bg-white text-ink text-xs focus:border-gold outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsSettleOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-paper-dim text-xs font-bold text-ink-muted hover:bg-paper-dim"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                >
                  Confirm Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
