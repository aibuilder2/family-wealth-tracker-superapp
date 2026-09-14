'use client';

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
