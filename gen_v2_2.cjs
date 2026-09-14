const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
  console.log('Wrote:', relPath);
}

// 1. app/(dashboard)/calendar/page.tsx
save('app/(dashboard)/calendar/page.tsx', `'use client';

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
`);

// 2. app/(dashboard)/staff/page.tsx
save('app/(dashboard)/staff/page.tsx', `'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Button } from '@/components/ui/Button';
import { Users, Phone } from 'lucide-react';

export default function StaffPage() {
  const { staff, markStaffAttendance, addStaffPayment } = useFamilyStore();
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staff[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentType, setPaymentType] = useState<'salary' | 'advance' | 'bonus'>('salary');

  const activeStaff = staff.find(s => s.id === selectedStaffId) || staff[0];
  const daysInMonth = Array.from({ length: 15 }, (_, i) => i + 1);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(paymentAmount);
    if (!amt || amt <= 0) return;
    addStaffPayment(activeStaff.id, amt, paymentType);
    setPaymentAmount('');
    alert(activeStaff.name + ' ko payment record ho gaya.');
  };

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Household Staff"
        subtitle="Maid, Driver, Cook ki attendance aur salary calculation"
      />

      <div className="px-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {staff.map((st) => (
          <button
            key={st.id}
            onClick={() => setSelectedStaffId(st.id)}
            className={'px-3.5 py-2 rounded-xl text-left border shrink-0 transition-all ' + (selectedStaffId === st.id ? 'bg-navy text-paper border-navy shadow-sm' : 'bg-paper text-ink border-paper-dim hover:bg-paper-dim')}
          >
            <p className="text-xs font-semibold">{st.name}</p>
            <p className="text-[10px] opacity-80 capitalize">{st.role} · ₹{st.monthly_salary.toLocaleString('en-IN')}/mo</p>
          </button>
        ))}
      </div>

      {activeStaff && (
        <div className="px-4 space-y-3">
          <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-ink">{activeStaff.name}</h3>
                <p className="text-xs text-ink-muted capitalize flex items-center gap-1 mt-0.5">
                  <Phone size={12} /> {activeStaff.phone || 'No phone added'}
                </p>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-gold/10 text-gold rounded">
                {activeStaff.role}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-paper-dim text-xs">
              <div>
                <span className="text-ink-muted text-[10px] block">Monthly Salary</span>
                <Mono className="font-semibold text-ink">₹{activeStaff.monthly_salary.toLocaleString('en-IN')}</Mono>
              </div>
              <div>
                <span className="text-ink-muted text-[10px] block">Advance Balance (Bakaya)</span>
                <Mono className="font-semibold text-coral">₹{activeStaff.advance_balance.toLocaleString('en-IN')}</Mono>
              </div>
            </div>
          </div>

          <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-ink">Is Mahine Ki Attendance (1 to 15)</h4>
              <span className="text-[10px] text-ink-muted">Tap to toggle</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {daysInMonth.map((d) => {
                const status = activeStaff.attendance_this_month?.[d] || 'present';
                return (
                  <button
                    key={d}
                    onClick={() => {
                      const nextStatus = status === 'present' ? 'absent' : status === 'absent' ? 'half_day' : 'present';
                      markStaffAttendance(activeStaff.id, d, nextStatus);
                    }}
                    className={'p-1.5 rounded-lg border text-center text-xs font-mono font-semibold transition-all ' + (status === 'present' ? 'bg-green/10 text-green border-green/30' : status === 'absent' ? 'bg-coral/10 text-coral border-coral/30' : 'bg-gold/10 text-gold border-gold/30')}
                  >
                    <div>{d}</div>
                    <div className="text-[9px] uppercase">{status === 'half_day' ? 'Half' : status === 'present' ? 'P' : 'A'}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handlePay} className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-ink">Salary / Advance Pay Karein</h4>
            <div className="grid grid-cols-3 gap-1.5">
              {(['salary', 'advance', 'bonus'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPaymentType(t)}
                  className={'py-1.5 text-xs font-medium rounded-lg capitalize border ' + (paymentType === t ? 'bg-navy text-paper border-navy' : 'bg-paper text-ink-muted border-paper-dim')}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Amount (₹)"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl focus:outline-none focus:border-gold font-mono"
                required
              />
              <Button type="submit" size="sm" className="bg-navy text-paper">
                Record Pay
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
`);

// 3. app/(dashboard)/cases/page.tsx
save('app/(dashboard)/cases/page.tsx', `'use client';

import React from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Scale } from 'lucide-react';
import { formatDueDays } from '@/lib/utils/dateHelpers';

export default function CasesPage() {
  const { courtCases } = useFamilyStore();

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Court Case Tracker"
        subtitle="Zameen & dispute hearing dates aur legal result logs"
      />

      <div className="px-4 space-y-3">
        {courtCases.map((cs) => {
          const due = formatDueDays(cs.next_hearing_date);
          return (
            <div key={cs.id} className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-purple-700 text-xs font-bold mb-1">
                    <Scale size={15} />
                    <span>{cs.case_number}</span>
                  </div>
                  <h3 className="text-sm font-bold text-ink font-serif">{cs.case_title}</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  {cs.current_status}
                </span>
              </div>

              <div className="bg-gold/10 p-3 rounded-xl border border-gold/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-ink-muted uppercase font-bold block">Next Hearing Date</span>
                  <span className="text-xs font-bold text-ink">{cs.next_hearing_date}</span>
                </div>
                <span className="text-xs font-bold text-coral bg-coral/10 px-2.5 py-1 rounded-lg">
                  {due.text}
                </span>
              </div>

              <div className="text-xs text-ink-muted space-y-1">
                <p><strong className="text-ink">Court:</strong> {cs.court_name}</p>
                <p><strong className="text-ink">Advocate:</strong> {cs.judge_advocate_name}</p>
                <p><strong className="text-ink">Summary:</strong> {cs.summary}</p>
              </div>

              {cs.hearings && cs.hearings.length > 0 && (
                <div className="pt-2 border-t border-paper-dim space-y-2">
                  <h4 className="text-[11px] font-bold text-ink uppercase tracking-wider">Hearing History Log</h4>
                  {cs.hearings.map((h) => (
                    <div key={h.id} className="p-2.5 rounded-lg bg-paper-dim/60 text-xs space-y-1">
                      <div className="flex justify-between text-ink-muted text-[10px]">
                        <span>Hearing Date: {h.hearing_date}</span>
                        {h.documents_filed && <span>Filed: {h.documents_filed.join(', ')}</span>}
                      </div>
                      <p className="text-ink font-medium">{h.result_notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
`);

// 4. app/(dashboard)/settings/members/page.tsx
save('app/(dashboard)/settings/members/page.tsx', `'use client';

import React from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Avatar } from '@/components/ui/Avatar';

export default function MemberPermissionsPage() {
  const { members, updateMemberPermissions, currentUserId, setCurrentUserId } = useFamilyStore();

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Member Permissions"
        subtitle="Family Head har sadasya ke module rights control kar sakta hai"
      />

      <div className="px-4">
        <div className="p-3 bg-paper rounded-xl border border-paper-dim">
          <span className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Simulate Login As:</span>
          <div className="flex gap-2">
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() => setCurrentUserId(m.id)}
                className={'text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ' + (currentUserId === m.id ? 'bg-navy text-paper border-navy' : 'bg-paper text-ink-muted border-paper-dim')}
              >
                {m.name} ({m.role})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3">
        {members.map((m) => (
          <div key={m.id} className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <Avatar m={m} size={32} />
              <div>
                <h3 className="text-sm font-bold text-ink">{m.name}</h3>
                <p className="text-[10px] text-ink-muted capitalize">{m.relationship || m.role}</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-paper-dim">
              {[
                { key: 'can_view_investments', label: 'Investments & Shares' },
                { key: 'can_view_bills', label: 'Utility & Card Bills' },
                { key: 'can_view_vault', label: 'Documents Vault' },
                { key: 'can_view_staff', label: 'Household Staff' },
                { key: 'can_view_cases', label: 'Court Cases' },
              ].map((p) => {
                const isAllowed = (m.permissions as any)?.[p.key] !== false;
                return (
                  <div key={p.key} className="flex items-center justify-between text-xs">
                    <span className="text-ink font-medium">{p.label}</span>
                    <button
                      type="button"
                      onClick={() => updateMemberPermissions(m.id, { [p.key]: !isAllowed })}
                      className={'px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ' + (isAllowed ? 'bg-green/10 text-green' : 'bg-paper-dim text-ink-muted')}
                    >
                      {isAllowed ? 'ON' : 'OFF'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`);

// 5. components/ui/BottomNav.tsx
save('components/ui/BottomNav.tsx', `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, PiggyBank, Calendar, Menu, FileText, Users, Scale, HeartPulse, Sparkles, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function BottomNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { key: 'home', href: '/home', label: 'Home', icon: Home },
    { key: 'money', href: '/money', label: 'Money', icon: Wallet },
    { key: 'wealth', href: '/wealth', label: 'Wealth', icon: PiggyBank },
    { key: 'calendar', href: '/calendar', label: 'Calendar', icon: Calendar },
  ];

  const moreItems = [
    { href: '/vault', label: 'Documents Vault', icon: FileText, desc: 'Digital insurance & papers' },
    { href: '/family', label: 'Family & Tree', icon: Users, desc: 'Members & vansh hierarchy' },
    { href: '/staff', label: 'Household Staff', icon: Users, desc: 'Maid & Driver attendance/pay' },
    { href: '/cases', label: 'Court Case Tracker', icon: Scale, desc: 'Hearing dates & judgments' },
    { href: '/medical', label: 'Medical Records', icon: HeartPulse, desc: 'Blood group & emergency meds' },
    { href: '/advisor', label: 'AI Advisor', icon: Sparkles, desc: 'Smart savings tips' },
    { href: '/settings/members', label: 'Permissions & Roles', icon: Settings, desc: 'Access control' },
  ];

  return (
    <>
      <nav className="flex items-center justify-around px-2 py-2 bg-paper border-t border-paper-dim shrink-0 z-20">
        {mainTabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all rounded-lg hover:bg-paper-dim/40"
            >
              <Icon
                size={19}
                className={cn('transition-colors', isActive ? 'text-gold' : 'text-ink-muted')}
                strokeWidth={isActive ? 2.4 : 2}
              />
              <span className={cn('text-[10px] font-medium font-sans', isActive ? 'text-gold font-semibold' : 'text-ink-muted')}>
                {tab.label}
              </span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setIsMoreOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all rounded-lg hover:bg-paper-dim/40"
        >
          <Menu size={19} className="text-ink-muted" strokeWidth={2} />
          <span className="text-[10px] font-medium font-sans text-ink-muted">More</span>
        </button>
      </nav>

      {isMoreOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-[430px] bg-paper rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 border border-paper-dim space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <h3 className="text-base font-serif font-bold text-ink">All Family Modules</h3>
              <button onClick={() => setIsMoreOpen(false)} className="p-1 rounded-full text-ink-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {moreItems.map((it) => {
                const Icon = it.icon;
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    onClick={() => setIsMoreOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-paper-dim/40 hover:bg-paper-dim transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-navy text-gold-soft flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink">{it.label}</p>
                      <p className="text-[10px] text-ink-muted">{it.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
`);

// 6. app/(dashboard)/layout.tsx
save('app/(dashboard)/layout.tsx', `'use client';

import React, { useState } from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';
import { AddTransactionModal } from '@/components/money/AddTransactionModal';
import { useFamilyStore } from '@/lib/store/familyStore';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { family, reminders, triggerEmergencySOS, currentUser } = useFamilyStore();
  const [sosStatus, setSosStatus] = useState<string | null>(null);

  const handleSOS = () => {
    const res = triggerEmergencySOS();
    setSosStatus(res.message);
    setTimeout(() => setSosStatus(null), 6000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-6 bg-[#E7E1D2]">
      <div className="w-full sm:max-w-[430px] h-screen sm:h-[840px] bg-navy sm:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col sm:border-[8px] sm:border-[#0B1B28] relative">
        
        <header className="flex items-center justify-between px-5 pt-4 pb-3 bg-navy text-paper shrink-0 z-10 border-b border-navy-light/40">
          <div>
            <Link href="/home" className="flex items-center gap-1.5">
              <span className="text-base font-semibold font-serif tracking-tight text-paper hover:text-gold-soft transition-colors">
                {family.name}
              </span>
            </Link>
            <p className="text-[10px] text-gold-soft font-mono tracking-wider">
              {currentUser.name} ({currentUser.role})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSOS}
              className="px-2 py-1 bg-coral text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow animate-pulse hover:opacity-90 transition-all"
              title="Emergency SOS"
            >
              <AlertTriangle size={12} /> SOS
            </button>

            <Link
              href="/calendar"
              className="relative w-8 h-8 rounded-full flex items-center justify-center bg-navy-light text-gold-soft hover:bg-navy-light/80 transition-colors"
              title="Calendar Reminders"
            >
              <Bell size={15} />
              {reminders.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-coral text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                  {reminders.length}
                </span>
              )}
            </Link>
          </div>
        </header>

        {sosStatus && (
          <div className="bg-coral text-white text-xs p-3 font-semibold text-center shrink-0 animate-bounce">
            {sosStatus}
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-[#EFEAE0] no-scrollbar pb-6">
          {children}
        </main>

        <BottomNav />
        <AddTransactionModal />
      </div>
    </div>
  );
}
`);

// 7. app/(dashboard)/medical/page.tsx
save('app/(dashboard)/medical/page.tsx', `'use client';

import React from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { HeartPulse, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function MedicalPage() {
  const { medicalRecords, toggleMedicalVerification } = useFamilyStore();

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Medical & Health Vault"
        subtitle="Blood group, daily dawaiyan aur verification status"
      />

      <div className="px-4">
        <div className="p-3 bg-coral/10 border border-coral/20 rounded-xl flex items-start gap-2 text-xs text-coral">
          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
          <span>
            Emergency data: Parivar ka koi bhi sadasya kisi ki bhi zaroori dawai aur blood group yahan se dekh sakta hai.
          </span>
        </div>
      </div>

      <div className="px-4 space-y-3">
        {medicalRecords.map((rec) => (
          <div key={rec.id} className="rounded-xl p-4 bg-paper border border-paper-dim shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse size={16} className="text-coral" />
                <h3 className="text-sm font-semibold text-ink">{rec.member_name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-coral/15 text-coral">
                  {rec.blood_group}
                </span>

                <button
                  type="button"
                  onClick={() => toggleMedicalVerification(rec.id)}
                  className={'text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ' + (rec.is_verified ? 'bg-green/10 text-green' : 'bg-gray-200 text-gray-600')}
                  title="Tap to verify/unverify"
                >
                  {rec.is_verified ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                  {rec.is_verified ? 'Verified' : 'Unverified'}
                </button>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <p className="text-ink-muted">
                <span className="font-medium text-ink">Condition: </span>
                {rec.condition}
              </p>
              <p className="text-ink-muted flex items-start gap-1">
                <Clock size={13} className="text-gold mt-0.5 shrink-0" />
                <span>
                  <strong className="text-ink">{rec.medicine_name}</strong> — {rec.medicine_time}
                </span>
              </p>
              {rec.notes && (
                <p className="text-ink-muted text-[11px] bg-paper-dim/50 p-2 rounded-lg mt-1">
                  {rec.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`);

console.log('Part 2 saved successfully');
