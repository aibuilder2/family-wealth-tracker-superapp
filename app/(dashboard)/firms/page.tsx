'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Button } from '@/components/ui/Button';
import { Building2, Plus, ArrowRight, DollarSign, Receipt, FileSpreadsheet, CheckCircle, ShieldCheck, Wallet, ArrowDownRight, Briefcase } from 'lucide-react';
import { EntityType } from '@/types';
import confetti from 'canvas-confetti';

export default function BusinessFirmsPage() {
  const { businessFirms, addBusinessFirm, recordFirmDrawingToFamily, members, currentUserId } = useFamilyStore();
  const [selectedFirmId, setSelectedFirmId] = useState<string>(businessFirms[0]?.id || '');

  // Modals
  const [isAddFirmOpen, setIsAddFirmOpen] = useState(false);
  const [isDrawingOpen, setIsDrawingOpen] = useState(false);

  // New Firm Form
  const [firmName, setFirmName] = useState('');
  const [entityType, setEntityType] = useState<EntityType>('Proprietorship');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [bankAcc, setBankAcc] = useState('');

  // Drawing Form
  const [drawAmount, setDrawAmount] = useState('');
  const [drawType, setDrawType] = useState<'partner_salary' | 'profit_dividend' | 'director_remuneration'>('profit_dividend');
  const [targetMemberId, setTargetMemberId] = useState(currentUserId || members[0]?.id || 'm-papa');
  const [drawNote, setDrawNote] = useState('Month-end business profit payout');

  const activeFirm = businessFirms.find(f => f.id === selectedFirmId) || businessFirms[0];

  const handleAddFirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firmName) return;

    addBusinessFirm({
      firm_name: firmName,
      entity_type: entityType,
      gstin: gstin ? gstin.toUpperCase() : undefined,
      pan: pan ? pan.toUpperCase() : undefined,
      bank_current_acc: bankAcc || 'Current Account'
    });

    setIsAddFirmOpen(false);
    setFirmName('');
    setGstin('');
    setPan('');
    setBankAcc('');
  };

  const handleDrawingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(drawAmount);
    if (!amt || amt <= 0 || !activeFirm) return;

    recordFirmDrawingToFamily(activeFirm.id, {
      amount: amt,
      drawing_type: drawType,
      credited_to_member_id: targetMemberId,
      note: drawNote
    });

    try { confetti({ particleCount: 60, spread: 60 }); } catch (err) {}
    setIsDrawingOpen(false);
    setDrawAmount('');
    alert(activeFirm.firm_name + ' se ₹' + amt.toLocaleString('en-IN') + ' Family Personal Income me transfer ho gaye!');
  };

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Business Firms & GST Hub"
        subtitle="Registered transport/agro firms, GST/TDS & Family Drawings"
        action={
          <button
            type="button"
            onClick={() => setIsAddFirmOpen(true)}
            className="w-8 h-8 rounded-full bg-navy text-paper flex items-center justify-center shadow hover:bg-navy-light transition-all"
            title="Add Registered Firm"
          >
            <Plus size={16} />
          </button>
        }
      />

      {/* Quick Link to Setup & Pre-Op CapEx Module */}
      <div className="px-4">
        <Link
          href="/firms/setup"
          className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-navy via-navy-light to-navy border border-gold/30 text-paper shadow-md hover:border-gold transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold-light shrink-0">
              <Briefcase size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-paper font-serif">🚀 New Business Setup & Pre-Op CapEx</p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gold/20 text-gold-light uppercase border border-gold/30">Inception Hub</span>
              </div>
              <p className="text-[10px] text-paper-dim/80 line-clamp-1">Day-0 kharcha, Bank loan tranches, Girvi/Collateral & Capital Account Transfer</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-gold-light shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Firm Selector Tabs */}
      <div className="px-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {businessFirms.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFirmId(f.id)}
            className={'px-3.5 py-2 rounded-xl text-left border shrink-0 transition-all ' + (selectedFirmId === f.id ? 'bg-navy text-paper border-navy shadow-sm' : 'bg-paper text-ink border-paper-dim hover:bg-paper-dim')}
          >
            <div className="flex items-center gap-1.5">
              <Building2 size={14} className="text-gold" />
              <p className="text-xs font-bold truncate max-w-[150px]">{f.firm_name}</p>
            </div>
            <p className="text-[10px] opacity-80 mt-0.5">{f.entity_type.replace('_', ' ')}</p>
          </button>
        ))}
      </div>

      {activeFirm && (
        <div className="px-4 space-y-3">
          {/* Active Firm Card */}
          <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-navy text-paper">
                  {activeFirm.entity_type.replace('_', ' ')}
                </span>
                <h3 className="text-base font-bold text-ink font-serif mt-1">{activeFirm.firm_name}</h3>
                <p className="text-xs font-mono text-ink-muted mt-0.5">
                  GSTIN: <strong className="text-ink">{activeFirm.gstin || 'Not Registered'}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-ink-muted block uppercase font-bold">Bank A/c</span>
                <span className="text-[11px] font-medium text-ink">{activeFirm.bank_current_acc}</span>
              </div>
            </div>

            {/* Balances & GST metrics */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-paper-dim text-xs">
              <div className="p-2.5 bg-paper-dim/60 rounded-xl">
                <span className="text-[10px] text-ink-muted block uppercase font-bold">Firm Bank Balance</span>
                <Mono className="text-sm font-bold text-green block mt-0.5">
                  ₹{activeFirm.current_firm_balance.toLocaleString('en-IN')}
                </Mono>
                <span className="text-[9px] text-ink-muted">In Current Account</span>
              </div>

              <div className="p-2.5 bg-paper-dim/60 rounded-xl">
                <span className="text-[10px] text-ink-muted block uppercase font-bold">GST & TDS Tracked</span>
                <Mono className="text-xs font-bold text-ink block mt-0.5">
                  GST: ₹{activeFirm.total_gst_collected.toLocaleString('en-IN')}
                </Mono>
                <span className="text-[9px] text-coral">TDS: ₹{activeFirm.total_tds_deducted.toLocaleString('en-IN')} (194C)</span>
              </div>
            </div>

            {/* Transfer to Family Button */}
            <div className="pt-2 border-t border-paper-dim flex items-center justify-between">
              <div>
                <span className="text-[10px] text-ink-muted block">Kul Drawings (Family ko diya):</span>
                <Mono className="text-xs font-bold text-ink">₹{activeFirm.total_drawings_paid.toLocaleString('en-IN')}</Mono>
              </div>
              <Button
                size="sm"
                onClick={() => setIsDrawingOpen(true)}
                className="bg-green text-white text-xs font-bold py-2 px-3 shadow-sm hover:bg-green/90"
              >
                💰 Transfer Profit to Family
              </Button>
            </div>
          </div>

          {/* Drawings History to Family */}
          <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-ink">Firm Payout & Drawings History to Family</h4>

            {activeFirm.drawings && activeFirm.drawings.length > 0 ? (
              <div className="space-y-2">
                {activeFirm.drawings.map((d) => {
                  const m = members.find(mem => mem.id === d.credited_to_member_id);
                  return (
                    <div key={d.id} className="p-2.5 bg-paper-dim/50 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-ink">{d.note}</span>
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-gold/15 text-gold uppercase">
                            {d.drawing_type.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-[10px] text-ink-muted block mt-0.5">
                          Credited to: <strong className="text-ink">{m?.name || 'Papa'}</strong> ({d.date})
                        </span>
                      </div>
                      <Mono className="font-bold text-green text-sm">
                        +₹{d.amount.toLocaleString('en-IN')}
                      </Mono>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-ink-muted text-center py-2">Abhi tak koi payout transfer nahi hua.</p>
            )}
          </div>
        </div>
      )}

      {/* Transfer to Family Modal */}
      {isDrawingOpen && activeFirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-green tracking-wider">Drawings / Profit Transfer</span>
              <h3 className="text-sm font-bold font-serif text-ink mt-0.5">{activeFirm.firm_name}</h3>
              <p className="text-xs text-ink-muted">Available Firm Balance: <Mono className="font-bold text-green">₹{activeFirm.current_firm_balance.toLocaleString('en-IN')}</Mono></p>
            </div>

            <form onSubmit={handleDrawingSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Transfer Raqam (₹ Amount)</label>
                <input
                  type="number"
                  placeholder="e.g. 200000"
                  value={drawAmount}
                  onChange={(e) => setDrawAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Payout Type</label>
                <select
                  value={drawType}
                  onChange={(e) => setDrawType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                >
                  <option value="profit_dividend">Profit Share / Dividend</option>
                  <option value="partner_salary">Partner / Director Monthly Remuneration</option>
                  <option value="director_remuneration">Owner Personal Drawing</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Kis Parivar Member Ke Account Me?</label>
                <select
                  value={targetMemberId}
                  onChange={(e) => setTargetMemberId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.relationship || m.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Vivran / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Monthly transport profit transfer to savings account"
                  value={drawNote}
                  onChange={(e) => setDrawNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsDrawingOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-green text-white font-bold">
                  Transfer to Family
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Firm Modal */}
      {isAddFirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-bold font-serif text-ink">Nayi Business Firm Jodein</h3>
            <form onSubmit={handleAddFirmSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Firm Ka Naam</label>
                <input
                  type="text"
                  placeholder="e.g. Sharma Roadways & Logistics"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Entity / Business Type</label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                >
                  <option value="Proprietorship">Proprietorship Firm</option>
                  <option value="Partnership_Firm">Partnership Firm</option>
                  <option value="Pvt_Ltd">Private Limited Company</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="Individual_Unregistered">Individual / Unregistered Trade</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    placeholder="07AAAAA0000A1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">PAN Number</label>
                  <input
                    type="text"
                    placeholder="ABCDE1234F"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Bank Current Account Details</label>
                <input
                  type="text"
                  placeholder="e.g. HDFC Bank Current A/c (CA-889102)"
                  value={bankAcc}
                  onChange={(e) => setBankAcc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddFirmOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-navy text-paper">
                  Save Firm
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
