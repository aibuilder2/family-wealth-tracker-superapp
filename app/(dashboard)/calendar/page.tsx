'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Calendar as CalendarIcon, Clock, ArrowDownRight, ArrowUpRight, Bell, Scale, CreditCard } from 'lucide-react';
import { getRelativeDateLabel } from '@/lib/utils/dateHelpers';

export default function CalendarPage() {
  const { allCalendarEvents } = useFamilyStore();
  const [filter, setFilter] = useState<'all' | 'expense' | 'dues' | 'hearings'>('all');

  const sortedEvents = [...allCalendarEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filtered = sortedEvents.filter(ev => {
    if (filter === 'all') return true;
    if (filter === 'expense') return ev.type === 'expense' || ev.type === 'income';
    if (filter === 'dues') return ev.type === 'bill' || ev.type === 'emi' || ev.type === 'reminder';
    if (filter === 'hearings') return ev.type === 'hearing';
    return true;
  });

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
    <div className="space-y-4">
      <ScreenHeader
        title="Calendar Hub"
        subtitle="Time-stamped kharche, hearing dates aur bill dues"
      />

      <div className="px-4 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: 'all', label: 'Sabhi Events' },
          { key: 'expense', label: 'Daily Kharch' },
          { key: 'dues', label: 'Bill & EMI Dues' },
          { key: 'hearings', label: 'Court Dates' },
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

      <div className="px-4 space-y-3">
        {filtered.map((ev) => (
          <div key={ev.id} className="p-3.5 rounded-xl bg-paper border border-paper-dim shadow-sm flex items-start gap-3 hover:border-gold/40 transition-all">
            <div className="w-8 h-8 rounded-full bg-paper-dim flex items-center justify-center shrink-0 mt-0.5">
              {getEventIcon(ev.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-semibold text-ink truncate">{ev.title}</h4>
                {ev.amount && (
                  <Mono className={'text-xs font-bold ' + (ev.type === 'income' ? 'text-green' : 'text-coral')}>
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

              {ev.details && (
                <p className="text-[10px] text-ink-muted mt-1 bg-paper-dim/40 px-2 py-0.5 rounded inline-block">
                  {ev.details} {ev.member_name ? '· ' + ev.member_name : ''}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
