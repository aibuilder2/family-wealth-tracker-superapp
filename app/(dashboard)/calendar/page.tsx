'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Avatar } from '@/components/ui/Avatar';
import {
  Calendar as CalendarIcon, Clock, ArrowDownRight, ArrowUpRight,
  Bell, Scale, CreditCard, Users, Cake, Phone, MessageCircle,
  Filter, Sparkles, ChevronRight, Gift, HandCoins, ArrowRightLeft,
  CheckCircle2, ShoppingBag, Banknote
} from 'lucide-react';
import { getRelativeDateLabel } from '@/lib/utils/dateHelpers';
import Link from 'next/link';

export default function CalendarPage() {
  const { allCalendarEvents, members, transactions, memberLedgers, currentUserId } = useFamilyStore();
  const [activeTab, setActiveTab] = useState<'family' | 'expense' | 'member_ledger' | 'dues' | 'hearings' | 'all'>('family');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');

  // Sorted Events
  const sortedEvents = [...allCalendarEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Sorted Member Ledgers (Latest First)
  const sortedMemberLedgers = [...memberLedgers].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Helper: Birthday calculations for family members
  const getMemberBirthdayInfo = (dobString?: string) => {
    if (!dobString) return null;
    const today = new Date();
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return null;

    let nextBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    // If already passed this year, next year
    if (nextBday.getTime() < new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) {
      nextBday = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate());
    }

    const diffMs = nextBday.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const age = today.getFullYear() - dob.getFullYear();

    return {
      formattedDate: dob.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      birthYear: dob.getFullYear(),
      turningAge: age,
      diffDays,
      isToday: diffDays === 0,
      isUpcoming: diffDays > 0 && diffDays <= 30,
    };
  };

  // Helper: Calculate pairwise balance between currentUser and another member
  const calculateBalance = (memberA: string, memberB: string) => {
    const aGaveB = memberLedgers
      .filter(l => l.from_member_id === memberA && l.to_member_id === memberB)
      .reduce((sum, l) => sum + Number(l.amount || 0), 0);
    const bGaveA = memberLedgers
      .filter(l => l.from_member_id === memberB && l.to_member_id === memberA)
      .reduce((sum, l) => sum + Number(l.amount || 0), 0);

    return aGaveB - bGaveA;
  };

  // Filtered transactions for the Expense tab
  const expenseEvents = sortedEvents.filter(ev => {
    const isTx = ev.type === 'expense' || ev.type === 'income';
    if (!isTx) return false;
    if (selectedMemberFilter !== 'all') {
      return ev.member_name === members.find(m => m.id === selectedMemberFilter)?.name;
    }
    return true;
  });

  // Calculate totals for expense tab
  const totalExpense = expenseEvents
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + Math.abs(e.amount || 0), 0);
  const totalIncome = expenseEvents
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + Math.abs(e.amount || 0), 0);

  // Filtered dues
  const dueEvents = sortedEvents.filter(
    ev => ev.type === 'bill' || ev.type === 'emi' || ev.type === 'reminder'
  );

  // Filtered hearings
  const hearingEvents = sortedEvents.filter(ev => ev.type === 'hearing');

  // Event icons
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'expense': return <ArrowDownRight size={14} className="text-coral" />;
      case 'income': return <ArrowUpRight size={14} className="text-green" />;
      case 'hearing': return <Scale size={14} className="text-purple-600" />;
      case 'bill': return <CreditCard size={14} className="text-coral" />;
      default: return <Bell size={14} className="text-gold" />;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      <ScreenHeader
        title="Calendar & Timeline"
        subtitle="Ghar ke kharche, sadasya janamdin aur aapsi len-den alag-alag dekhein"
      />

      {/* TOP NAVIGATION TABS */}
      <div className="px-4 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: 'family', label: '👨‍👩‍👧‍👦 Parivar & Janamdin', count: members.length },
          { key: 'expense', label: '💸 Ghar ke Kharche', count: transactions.length },
          { key: 'member_ledger', label: '🤝 Sadasya Len-Den', count: memberLedgers.length },
          { key: 'dues', label: '🧾 Bill & EMI Dues', count: dueEvents.length },
          { key: 'hearings', label: '⚖️ Court Dates', count: hearingEvents.length },
          { key: 'all', label: '🗓️ Sabhi Events', count: sortedEvents.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`text-xs px-3.5 py-2 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === t.key
                ? 'bg-navy text-paper shadow-sm'
                : 'bg-paper border border-paper-dim text-ink-muted hover:text-ink hover:border-gold/40'
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === t.key ? 'bg-gold text-white' : 'bg-paper-dim text-ink-muted'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* ============================================================= */}
      {/* TAB 1: PARIVAR KE SADASYA & JANAMDIN (CLEAN, SEPARATE VIEW)   */}
      {/* ============================================================= */}
      {activeTab === 'family' && (
        <div className="px-4 space-y-4">
          {/* Header Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-gold/10 to-emerald-50 border border-gold/30 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-gold-dark tracking-wider bg-gold/15 px-2 py-0.5 rounded-full">
                Parivar Profile Hub
              </span>
              <h3 className="text-sm font-bold text-ink mt-1">
                Parivar Sadasya, Rishta aur Aapsi Khata
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Yahan parivar sadasya, unka janamdin aur aapsi hisab ka status dikhta hai
              </p>
            </div>
            <Link
              href="/family/tree"
              className="px-3 py-1.5 bg-navy text-paper text-xs font-semibold rounded-xl hover:bg-navy-light transition-all flex items-center gap-1 shadow-xs shrink-0"
            >
              Vansh Tree <ChevronRight size={12} />
            </Link>
          </div>

          {/* Members List */}
          <div className="space-y-3">
            {members.map((m) => {
              const bdayInfo = getMemberBirthdayInfo(m.dob);
              const isMukhiya = m.role === 'owner' || m.relationship?.toLowerCase().includes('mukhiya');
              const isSelf = m.id === currentUserId;
              const balance = !isSelf ? calculateBalance(currentUserId, m.id) : 0;

              return (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-xs hover:border-gold/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* Member Details */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar m={m} size={46} />
                      {isMukhiya && (
                        <span className="absolute -top-1 -right-1 text-xs">👑</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-ink">{m.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/15 text-gold-dark border border-gold/30">
                          {m.relationship || (isMukhiya ? 'Mukhiya (Self)' : 'Sadasya')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-ink-muted mt-1 flex-wrap">
                        {m.phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={11} className="text-gold" /> {m.phone}
                          </span>
                        )}
                        {m.dob && (
                          <span className="flex items-center gap-1">
                            • <CalendarIcon size={11} /> Janam: {m.dob}
                          </span>
                        )}
                      </div>

                      {/* Aapsi Len-Den Status for this member */}
                      {!isSelf && (
                        <div className="mt-2 flex items-center gap-2">
                          <Link
                            href="/family/hisab"
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md border inline-flex items-center gap-1 transition-all ${
                              balance > 0
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                : balance < 0
                                ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                                : 'bg-paper-dim text-ink-muted border-paper-dim hover:border-gold/40'
                            }`}
                          >
                            <HandCoins size={11} />
                            {balance > 0
                              ? `₹${balance.toLocaleString('en-IN')} Inse Lena Hai`
                              : balance < 0
                              ? `₹${Math.abs(balance).toLocaleString('en-IN')} Inhe Dena Hai`
                              : 'Aapsi Hisab Barabar ✓'}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Birthday Countdown & Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {bdayInfo ? (
                      <div
                        className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold ${
                          bdayInfo.isToday
                            ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                            : bdayInfo.isUpcoming
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-paper-dim text-ink-muted border-paper-dim'
                        }`}
                      >
                        <Cake size={14} className={bdayInfo.isToday ? 'text-rose-600' : 'text-amber-600'} />
                        {bdayInfo.isToday ? (
                          <span>🎂 Aaj Janamdin Hai! ({bdayInfo.turningAge} Saal)</span>
                        ) : (
                          <span>
                            {bdayInfo.formattedDate} • {bdayInfo.diffDays} din baaki
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] text-ink-muted/60 italic">
                        DOB nahi dali
                      </span>
                    )}

                    {m.phone && (
                      <a
                        href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center transition-colors"
                        title="WhatsApp par message karein"
                      >
                        <MessageCircle size={15} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 2: GHAR KE KHARCHE (HOUSEHOLD EXPENSES & INCOMES ONLY)    */}
      {/* ============================================================= */}
      {activeTab === 'expense' && (
        <div className="px-4 space-y-4">
          {/* Informational Guidance */}
          <div className="p-3 bg-paper-dim/60 border border-paper-dim rounded-xl text-xs text-ink-muted flex items-center gap-2">
            <Sparkles size={14} className="text-gold shrink-0" />
            <span>
              <strong>Ghar ke Samuhik Kharche</strong>: Rashan, doodh, bijli bill, school fees jaisa kharch. (Sadasya aapsi hisab ke liye <strong>'Sadasya Len-Den'</strong> tab dekhein).
            </span>
          </div>

          {/* Summary Box & Filter Bar */}
          <div className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-dim pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-coral tracking-wider">
                  Ghar ke Kharche
                </span>
                <h3 className="text-sm font-bold text-ink">Daily Household Transactions</h3>
              </div>

              {/* Member Filter Dropdown */}
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-ink-muted" />
                <select
                  value={selectedMemberFilter}
                  onChange={(e) => setSelectedMemberFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-paper-dim border border-paper-dim rounded-xl text-xs text-ink font-semibold focus:outline-none focus:border-gold"
                >
                  <option value="all">Sabhi Sadasya</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.relationship || 'Member'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Total Summary */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded-xl bg-coral/10 border border-coral/20">
                <span className="text-[10px] text-coral font-bold uppercase">Kul Kharch</span>
                <p className="text-sm font-bold text-coral">
                  -₹{totalExpense.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-green/10 border border-green/20">
                <span className="text-[10px] text-green font-bold uppercase">Kul Kamai</span>
                <p className="text-sm font-bold text-green">
                  +₹{totalIncome.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Events List */}
          <div className="space-y-2.5">
            {expenseEvents.length === 0 ? (
              <div className="p-8 text-center bg-paper rounded-2xl border border-paper-dim text-ink-muted text-xs">
                Is filter me koi kharch ya kamai record nahi mila.
              </div>
            ) : (
              expenseEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-xl bg-paper border border-paper-dim shadow-xs flex items-start gap-3 hover:border-gold/40 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-paper-dim flex items-center justify-center shrink-0 mt-0.5">
                    {getEventIcon(ev.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-ink truncate">{ev.title}</h4>
                      {ev.amount && (
                        <Mono
                          className={`text-xs font-bold ${
                            ev.type === 'income' ? 'text-green' : 'text-coral'
                          }`}
                        >
                          {ev.type === 'income' ? '+' : '-'}₹{Math.abs(ev.amount).toLocaleString('en-IN')}
                        </Mono>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-ink-muted">
                      <span className="flex items-center gap-0.5">
                        <CalendarIcon size={11} /> {getRelativeDateLabel(ev.date)} ({ev.date})
                      </span>
                      {ev.time && (
                        <span className="flex items-center gap-0.5 text-gold">
                          <Clock size={11} /> {ev.time}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      {ev.details && (
                        <span className="text-[10px] text-ink-muted bg-paper-dim px-2 py-0.5 rounded">
                          {ev.details}
                        </span>
                      )}
                      {ev.member_name && (
                        <span className="text-[10px] font-bold text-gold-dark bg-gold/15 px-2 py-0.5 rounded border border-gold/30">
                          👤 {ev.member_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 3: SADASYA AAPSI LEN-DEN (MEMBER LEDGER / KHATA)          */}
      {/* ============================================================= */}
      {activeTab === 'member_ledger' && (
        <div className="px-4 space-y-4">
          {/* Informational Guidance */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-900 tracking-wider bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
                Aapsi Hisab-Kitab • Member Khata
              </span>
              <h3 className="text-sm font-bold text-ink mt-1">
                Parivar Sadasyon ka Aapsi Len-Den
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Kis sadasya ne kisko cash diya, samaan laya, ya reimbursement lena hai — ye sab yahan alag darj hota hai.
              </p>
            </div>
            <Link
              href="/family/hisab"
              className="px-3.5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-center"
            >
              + Aapsi Hisab Kholein <ChevronRight size={14} />
            </Link>
          </div>

          {/* Member-by-Member Khata Summary Cards */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider">
              Sadasya-wise Aapsi Balance (Aapke sath):
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {members
                .filter(m => m.id !== currentUserId)
                .map((m) => {
                  const netBalance = calculateBalance(currentUserId, m.id);
                  const memberEntries = memberLedgers.filter(
                    l => (l.from_member_id === currentUserId && l.to_member_id === m.id) ||
                         (l.from_member_id === m.id && l.to_member_id === currentUserId)
                  );

                  return (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-xs hover:border-gold/50 transition-all flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar m={m} size={38} />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-ink truncate">{m.name}</p>
                          <p className="text-[10px] text-ink-muted truncate">
                            {m.relationship || 'Sadasya'} • {memberEntries.length} Len-Den
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {netBalance > 0 ? (
                          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                            +₹{netBalance.toLocaleString('en-IN')} <br />
                            <span className="text-[9px] font-normal">Lena Hai</span>
                          </div>
                        ) : netBalance < 0 ? (
                          <div className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg">
                            -₹{Math.abs(netBalance).toLocaleString('en-IN')} <br />
                            <span className="text-[9px] font-normal">Dena Hai</span>
                          </div>
                        ) : (
                          <div className="text-[10px] font-semibold text-ink-muted bg-paper-dim px-2 py-1 rounded-lg">
                            Barabar ✓
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Member Ledger Chronological Timeline */}
          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider">
              Aapsi Len-Den Timeline (Tareekh-wise):
            </h4>

            {sortedMemberLedgers.length === 0 ? (
              <div className="p-8 text-center bg-paper rounded-2xl border border-paper-dim text-ink-muted text-xs">
                Abhi tak sadasyon ke beech koi aapsi len-den darj nahi hua hai.
                <div className="mt-2">
                  <Link
                    href="/family/hisab"
                    className="inline-block px-3 py-1.5 bg-gold text-white rounded-xl text-xs font-bold"
                  >
                    + Pehla Len-Den Dalein
                  </Link>
                </div>
              </div>
            ) : (
              sortedMemberLedgers.map((item) => {
                const fromM = members.find(m => m.id === item.from_member_id);
                const toM = members.find(m => m.id === item.to_member_id);

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-paper border border-paper-dim shadow-xs flex items-start gap-3 hover:border-gold/40 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                      <ArrowRightLeft size={14} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-ink truncate">{item.title}</h4>
                        <Mono className="text-xs font-bold text-indigo-900">
                          ₹{Number(item.amount || 0).toLocaleString('en-IN')}
                        </Mono>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-ink-muted mt-1 flex-wrap">
                        <span className="font-semibold text-ink">
                          {fromM?.name || 'Sadasya'}
                        </span>
                        <span className="text-gold font-bold">➔</span>
                        <span className="font-semibold text-ink">
                          {toM?.name || 'Sadasya'}
                        </span>
                        <span>• {getRelativeDateLabel(item.date)} ({item.date})</span>
                      </div>

                      {item.items_detail && (
                        <p className="text-[10px] text-ink-muted mt-1 bg-paper-dim px-2 py-0.5 rounded inline-block">
                          {item.items_detail}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 4: BILL & EMI DUES                                        */}
      {/* ============================================================= */}
      {activeTab === 'dues' && (
        <div className="px-4 space-y-3">
          {dueEvents.length === 0 ? (
            <div className="p-8 text-center bg-paper rounded-2xl border border-paper-dim text-ink-muted text-xs">
              Koi aane wala Bill ya EMI due nahi hai.
            </div>
          ) : (
            dueEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 rounded-xl bg-paper border border-paper-dim shadow-xs flex items-start gap-3 hover:border-gold/40 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-paper-dim flex items-center justify-center shrink-0 mt-0.5">
                  {getEventIcon(ev.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-ink truncate">{ev.title}</h4>
                    {ev.amount && (
                      <Mono className="text-xs font-bold text-coral">
                        ₹{Math.abs(ev.amount).toLocaleString('en-IN')}
                      </Mono>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-ink-muted">
                    <span className="flex items-center gap-0.5">
                      <CalendarIcon size={11} /> {getRelativeDateLabel(ev.date)} ({ev.date})
                    </span>
                  </div>
                  {ev.details && (
                    <p className="text-[10px] text-ink-muted mt-1 bg-paper-dim px-2 py-0.5 rounded inline-block">
                      {ev.details}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 5: COURT DATES                                            */}
      {/* ============================================================= */}
      {activeTab === 'hearings' && (
        <div className="px-4 space-y-3">
          {hearingEvents.length === 0 ? (
            <div className="p-8 text-center bg-paper rounded-2xl border border-paper-dim text-ink-muted text-xs">
              Koi court date ya legal hearing schedule nahi hai.
            </div>
          ) : (
            hearingEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 rounded-xl bg-paper border border-purple-200 shadow-xs flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0 text-purple-600 mt-0.5">
                  <Scale size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-ink truncate">{ev.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-ink-muted">
                    <span className="flex items-center gap-0.5">
                      <CalendarIcon size={11} /> Tareekh: {ev.date}
                    </span>
                  </div>
                  {ev.details && (
                    <p className="text-[10px] text-purple-800 bg-purple-50 px-2 py-0.5 rounded inline-block mt-1">
                      {ev.details}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 6: COMBINED (ALL EVENTS CHRONOLOGICAL)                    */}
      {/* ============================================================= */}
      {activeTab === 'all' && (
        <div className="px-4 space-y-2.5">
          {sortedEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-3.5 rounded-xl bg-paper border border-paper-dim shadow-xs flex items-start gap-3 hover:border-gold/40 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-paper-dim flex items-center justify-center shrink-0 mt-0.5">
                {getEventIcon(ev.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-ink truncate">{ev.title}</h4>
                  {ev.amount && (
                    <Mono
                      className={`text-xs font-bold ${
                        ev.type === 'income' ? 'text-green' : 'text-coral'
                      }`}
                    >
                      {ev.type === 'income' ? '+' : '-'}₹{Math.abs(ev.amount).toLocaleString('en-IN')}
                    </Mono>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-ink-muted">
                  <span className="flex items-center gap-0.5">
                    <CalendarIcon size={11} /> {getRelativeDateLabel(ev.date)} ({ev.date})
                  </span>
                  {ev.time && (
                    <span className="flex items-center gap-0.5 text-gold">
                      <Clock size={11} /> {ev.time}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-paper-dim text-ink-muted">
                    {ev.type}
                  </span>
                  {ev.member_name && (
                    <span className="text-[10px] text-gold-dark font-medium">
                      👤 {ev.member_name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
