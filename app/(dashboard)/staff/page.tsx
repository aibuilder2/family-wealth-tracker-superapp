'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Button } from '@/components/ui/Button';
import { Users, Phone, Plus, Trash2, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { HouseholdStaff } from '@/types';

export default function StaffPage() {
  const { staff, markStaffAttendance, addStaffPayment, addStaff, deleteStaff } = useFamilyStore();
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staff[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentType, setPaymentType] = useState<'salary' | 'advance' | 'bonus'>('salary');

  // Modal for New Staff
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'maid' | 'driver' | 'cook' | 'gardener' | 'guard' | 'other'>('maid');
  const [newSalary, setNewSalary] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const activeStaff = staff.find(s => s.id === selectedStaffId) || staff[0];
  const daysInMonth = Array.from({ length: 15 }, (_, i) => i + 1);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(paymentAmount);
    if (!amt || amt <= 0 || !activeStaff) return;
    addStaffPayment(activeStaff.id, amt, paymentType);
    setPaymentAmount('');
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSalary) return;
    addStaff({
      name: newName.trim(),
      role: newRole,
      monthly_salary: Number(newSalary) || 0,
      phone: newPhone.trim() || undefined,
      joining_date: new Date().toISOString().split('T')[0]
    });
    setNewName('');
    setNewSalary('');
    setNewPhone('');
    setIsAddStaffOpen(false);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (confirm(name + ' ko staff list se hatayein?')) {
      deleteStaff(id);
      if (selectedStaffId === id) {
        setSelectedStaffId(staff.find(s => s.id !== id)?.id || '');
      }
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <ScreenHeader
        title="Household Staff Register"
        subtitle="Maid, Driver, Cook ki attendance, advance hisab aur monthly salary"
        action={
          <button
            onClick={() => setIsAddStaffOpen(true)}
            className="px-3 py-1.5 bg-navy hover:bg-navy-light text-paper rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus size={14} /> + Staff Jodein
          </button>
        }
      />

      {staff.length === 0 ? (
        <div className="p-8 text-center bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-3 mx-4">
          <Users size={36} className="mx-auto text-ink-muted opacity-50" />
          <h3 className="text-sm font-bold text-ink">Koi Staff Record Nahi Hai</h3>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            Ghar ke karmchari (maid, cook, driver, mali) ko yahan jodein aur unka attendance v vetan track karein.
          </p>
          <button
            onClick={() => setIsAddStaffOpen(true)}
            className="px-4 py-2 bg-navy text-paper rounded-xl text-xs font-bold shadow-md hover:bg-navy-light"
          >
            + Naya Staff Jodein
          </button>
        </div>
      ) : (
        <>
          {/* Staff Selector Tabs */}
          <div className="px-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {staff.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStaffId(st.id)}
                className={'px-3.5 py-2 rounded-xl text-left border shrink-0 transition-all ' + (activeStaff?.id === st.id ? 'bg-navy text-paper border-navy shadow-sm' : 'bg-paper text-ink border-paper-dim hover:bg-paper-dim')}
              >
                <p className="text-xs font-semibold">{st.name}</p>
                <p className="text-[10px] opacity-80 capitalize">{st.role} · ₹{st.monthly_salary.toLocaleString('en-IN')}/mo</p>
              </button>
            ))}
          </div>

          {activeStaff && (
            <div className="px-4 space-y-3">
              {/* Staff Overview Card */}
              <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-paper-dim text-ink-muted">
                      {activeStaff.role}
                    </span>
                    <h3 className="text-base font-bold text-ink font-serif mt-1">{activeStaff.name}</h3>
                    {activeStaff.phone && (
                      <a href={'tel:' + activeStaff.phone} className="text-xs text-ink-muted flex items-center gap-1 mt-0.5 hover:text-navy">
                        <Phone size={12} /> {activeStaff.phone}
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteStaff(activeStaff.id, activeStaff.name)}
                    className="p-1.5 text-ink-muted hover:text-coral transition-colors rounded-lg"
                    title="Staff hatayein"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-paper-dim text-xs">
                  <div>
                    <span className="text-ink-muted text-[10px] block">Monthly Salary</span>
                    <Mono className="font-semibold text-ink">₹{activeStaff.monthly_salary.toLocaleString('en-IN')}</Mono>
                  </div>
                  <div>
                    <span className="text-ink-muted text-[10px] block">Advance Balance (Bakaya)</span>
                    <Mono className={'font-semibold ' + (activeStaff.advance_balance > 0 ? 'text-coral' : 'text-green')}>
                      ₹{activeStaff.advance_balance.toLocaleString('en-IN')}
                    </Mono>
                  </div>
                </div>
              </div>

              {/* Attendance Tracker */}
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

              {/* Pay Form */}
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
        </>
      )}

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3">
            <h3 className="text-sm font-bold font-serif text-ink">Naya Staff Sadasya Jodein</h3>
            <form onSubmit={handleCreateStaff} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Staff Ka Naam *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh (Driver), Sunita Bai (Maid)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Kaam / Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl capitalize"
                  >
                    <option value="maid">Maid / Bai</option>
                    <option value="driver">Driver</option>
                    <option value="cook">Cook / Rasoiya</option>
                    <option value="gardener">Mali / Gardener</option>
                    <option value="guard">Chowkidar / Guard</option>
                    <option value="other">Anya / Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Monthly Vetan (₹) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 12000"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddStaffOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-navy text-paper">
                  Save Staff
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
