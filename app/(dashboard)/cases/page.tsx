'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Button } from '@/components/ui/Button';
import { Scale, Plus, DollarSign, Banknote, Calendar, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import { formatDueDays } from '@/lib/utils/dateHelpers';
import { LawyerPaymentType } from '@/types';
import confetti from 'canvas-confetti';

export default function CasesPage() {
  const { courtCases, recordLawyerFeePayment } = useFamilyStore();
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Fee payment form modal
  const [payAmount, setPayAmount] = useState('2000');
  const [payType, setPayType] = useState<LawyerPaymentType>('peshi_fee');
  const [payNote, setPayNote] = useState('Peshi fee di gayi');

  const activeCase = courtCases.find(c => c.id === selectedCaseId);

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(payAmount);
    if (!selectedCaseId || !amt || amt <= 0) return;

    recordLawyerFeePayment(selectedCaseId, {
      amount: amt,
      payment_type: payType,
      note: payNote
    });

    try { confetti({ particleCount: 50, spread: 50 }); } catch (err) {}
    setSelectedCaseId(null);
    setPayAmount('2000');
    setPayNote('Peshi fee di gayi');
    alert('Wakil ki fee payment record ho gayi aur family kharch me add ho gayi!');
  };

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Court Case & Legal Tracker"
        subtitle="Zameen/Dispute tareekh, Wakil ki peshi fees aur hearing logs"
      />

      <div className="px-4 space-y-4">
        {courtCases.map((cs: any) => {
          const due = formatDueDays(cs.next_hearing_date);
          const totalFee = cs.lawyer_total_agreed_fee || 65000;
          const totalPaid = cs.lawyer_total_paid || 28000;
          const balanceDue = cs.lawyer_balance_due !== undefined ? cs.lawyer_balance_due : (totalFee - totalPaid);

          return (
            <div key={cs.id} className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-sm space-y-3.5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-purple-700 text-xs font-bold mb-0.5">
                    <Scale size={15} />
                    <span>{cs.case_number}</span>
                  </div>
                  <h3 className="text-sm font-bold text-ink font-serif">{cs.case_title}</h3>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {cs.current_status}
                </span>
              </div>

              {/* Next Hearing Banner */}
              <div className="bg-gold/10 p-3 rounded-xl border border-gold/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-ink-muted uppercase font-bold block">Next Hearing Date (Agli Peshi)</span>
                  <span className="text-xs font-bold text-ink">{cs.next_hearing_date}</span>
                </div>
                <span className="text-xs font-bold text-coral bg-coral/10 px-2.5 py-1 rounded-lg">
                  {due.text}
                </span>
              </div>

              {/* Case Info */}
              <div className="text-xs text-ink-muted space-y-1">
                <p><strong className="text-ink">Court:</strong> {cs.court_name}</p>
                <p><strong className="text-ink">Advocate / Wakil:</strong> {cs.judge_advocate_name}</p>
                <p><strong className="text-ink">Summary:</strong> {cs.summary}</p>
              </div>

              {/* LAWYER FEES & PESHI LEDGER */}
              <div className="p-3 bg-paper-dim/60 rounded-2xl border border-paper-dim space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-ink-muted block">Wakil Fees & Peshi Hisab</span>
                    <p className="text-xs font-bold text-ink">
                      Kul Teh Shuda: <Mono>₹{totalFee.toLocaleString('en-IN')}</Mono>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCaseId(cs.id);
                      setPayAmount(cs.lawyer_per_peshi_fee?.toString() || '2000');
                    }}
                    className="text-xs font-bold px-2.5 py-1 bg-navy text-paper rounded-lg flex items-center gap-1 shadow-sm hover:bg-navy-light"
                  >
                    <Plus size={12} /> Fee / Peshi Pay Karein
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2 bg-paper rounded-xl border border-paper-dim">
                    <span className="text-[9px] text-ink-muted block uppercase">Chukta (Total Paid)</span>
                    <Mono className="font-bold text-green">₹{totalPaid.toLocaleString('en-IN')}</Mono>
                  </div>
                  <div className="p-2 bg-paper rounded-xl border border-paper-dim">
                    <span className="text-[9px] text-ink-muted block uppercase">Bakaya (Balance Due)</span>
                    <Mono className="font-bold text-coral">₹{balanceDue.toLocaleString('en-IN')}</Mono>
                  </div>
                </div>

                {/* Past Fee Payments Log */}
                {cs.lawyer_payments && cs.lawyer_payments.length > 0 && (
                  <div className="pt-2 border-t border-paper-dim space-y-1">
                    <span className="text-[9px] font-bold uppercase text-ink-muted block">Fee Payment History:</span>
                    {cs.lawyer_payments.map((p: any) => (
                      <div key={p.id} className="flex justify-between text-[11px] bg-paper px-2 py-1 rounded-lg">
                        <div>
                          <span className="font-medium text-ink">{p.note}</span>
                          <span className="text-[9px] text-ink-muted block">{p.date} · {p.payment_type.replace('_', ' ')}</span>
                        </div>
                        <Mono className="font-bold text-coral">-₹{p.amount.toLocaleString('en-IN')}</Mono>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hearing History Log */}
              {cs.hearings && cs.hearings.length > 0 && (
                <div className="pt-2 border-t border-paper-dim space-y-1.5">
                  <h4 className="text-[11px] font-bold text-ink uppercase tracking-wider">Hearing Result Log (Pichli Peshi)</h4>
                  {cs.hearings.map((h: any) => (
                    <div key={h.id} className="p-2.5 rounded-lg bg-paper-dim/40 text-xs space-y-1">
                      <div className="flex justify-between text-ink-muted text-[10px]">
                        <span>Peshi Date: {h.hearing_date}</span>
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

      {/* Pay Lawyer Fee Modal */}
      {selectedCaseId && activeCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-gold tracking-wider">Legal Fee Payment</span>
              <h3 className="text-sm font-bold font-serif text-ink mt-0.5">{activeCase.case_title}</h3>
              <p className="text-xs text-ink-muted">Advocate: <strong className="text-ink">{activeCase.judge_advocate_name}</strong></p>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Payment Type</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'peshi_fee', label: 'Tarikh / Peshi Fee' },
                    { id: 'advance_filing', label: 'Starting Advance' },
                    { id: 'munshi_fee', label: 'Munshiana Clerkage' },
                    { id: 'misc_court_fee', label: 'Court Stamp / Misc' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayType(m.id as any)}
                      className={'py-1.5 px-2 text-[11px] font-medium rounded-lg border text-center ' + (payType === m.id ? 'bg-navy text-paper border-navy font-bold' : 'bg-paper text-ink-muted border-paper-dim')}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Payment Amount (₹ Raqam)</label>
                <input
                  type="number"
                  placeholder="2000"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Vivran / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Tarikh peshi fee di gayi"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setSelectedCaseId(null)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-navy text-paper font-semibold">
                  Record Payment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
