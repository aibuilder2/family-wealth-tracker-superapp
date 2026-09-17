'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Button } from '@/components/ui/Button';
import { 
  HandCoins, Plus, ArrowUpRight, ArrowDownRight, Phone, CheckCircle, Clock, 
  Package, Wrench, Banknote, ChevronLeft, ShieldCheck, Share2, MapPin, User,
  Calendar, CreditCard, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { UdharSettlementMode, UdharContact } from '@/types';
import confetti from 'canvas-confetti';

export default function UdharManagerPage() {
  const { 
    udharContacts, 
    addUdharContact, 
    recordUdharSettlement, 
    verifyUdharOTP, 
    members, 
    currentUserId 
  } = useFamilyStore();

  const [filter, setFilter] = useState<'all' | 'given' | 'taken' | 'settled'>('all');
  
  // Modals
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [otpVerifyContact, setOtpVerifyContact] = useState<UdharContact | null>(null);
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // New Contact Form
  const [personName, setPersonName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [udharType, setUdharType] = useState<'given' | 'taken'>('given');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'bank_transfer' | 'upi' | 'cheque'>('cash');
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

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    addUdharContact({
      member_id: memberId,
      person_name: personName,
      father_name: fatherName.trim() || undefined,
      address: address.trim() || undefined,
      phone: phone.trim() || undefined,
      type: udharType,
      original_amount: numAmt,
      remaining_balance: numAmt,
      payment_mode: paymentMode,
      due_date: dueDate || undefined,
      promised_return_date: dueDate || undefined,
      otp_code: generatedOtp,
      is_otp_verified: false,
      notes: notes.trim() || undefined,
      status: 'active'
    });

    setIsAddContactOpen(false);
    setPersonName('');
    setFatherName('');
    setAddress('');
    setPhone('');
    setAmount('');
    setPaymentMode('cash');
    setDueDate('');
    setNotes('');

    try { confetti({ particleCount: 50, spread: 50 }); } catch (err) {}
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
      try { confetti({ particleCount: 70, spread: 70 }); } catch (err) {}
    }

    setSelectedContactId(null);
    setSettleAmount('');
    setSettleNote('');
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpVerifyContact) return;

    const success = verifyUdharOTP(otpVerifyContact.id, inputOtp);
    if (success) {
      try { confetti({ particleCount: 60, spread: 60 }); } catch (err) {}
      setOtpVerifyContact(null);
      setInputOtp('');
      setOtpError('');
    } else {
      setOtpError('Galat OTP! Kripya sahi 6-digit code darj karein ya WhatsApp check karein.');
    }
  };

  const getWhatsAppShareUrl = (contact: UdharContact) => {
    const memberName = members.find(m => m.id === contact.member_id)?.name || 'Parivar Sadasya';
    const modeLabel = contact.payment_mode === 'bank_transfer' ? 'Bank Transfer' :
                      contact.payment_mode === 'upi' ? 'UPI (PhonePe/GPay)' :
                      contact.payment_mode === 'cheque' ? 'Cheque' : 'Cash (Nagad)';

    let msg = `*🤝 Digital Udhar & Rin Praman-Patra (Mutual Agreement)*\n\n` +
      `Namaste *${contact.person_name}* ji,\n` +
      (contact.father_name ? `Pita ji: *${contact.father_name}*\n` : '') +
      (contact.address ? `Niwas/Pata: *${contact.address}*\n\n` : '\n') +
      `Aapke aur *${memberName}* ji ke beech nimn udhar len-den darj kiya gaya hai:\n` +
      `• *Raqam (Amount):* ₹${contact.original_amount.toLocaleString('en-IN')}\n` +
      `• *Prakar:* ${contact.type === 'given' ? 'Humne aapko diya (Lena baaki)' : 'Aapse prapt kiya'}\n` +
      `• *Bhugtan Madhyam (Mode):* ${modeLabel}\n` +
      (contact.due_date || contact.promised_return_date ? `• *Wapsi Tithi (Promise Date):* ${contact.promised_return_date || contact.due_date}\n` : '') +
      `• *Suraksha OTP:* *${contact.otp_code || '123456'}*\n\n` +
      `Kripya apsi samjhote ke anusaar is OTP ki pushti karein taaki records me koi vivad na rahe.\n` +
      `_Dhanyawad, Family Wealth Hub._`;

    const cleanPhone = contact.phone ? contact.phone.replace(/[^0-9]/g, '') : '';
    const phoneParam = cleanPhone.length >= 10 ? (cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone) : '';
    
    return phoneParam 
      ? ('https://wa.me/' + phoneParam + '?text=' + encodeURIComponent(msg))
      : ('https://wa.me/?text=' + encodeURIComponent(msg));
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
      <div className="px-4 pt-2">
        <Link href="/money" className="text-xs text-ink-muted hover:text-ink flex items-center gap-1 font-medium transition-colors">
          <ChevronLeft size={16} /> Money par wapas jayein
        </Link>
      </div>

      <ScreenHeader
        title="Udhar & Lending Ledger"
        subtitle="Nagad ya Bank Transfer, Pita ka naam, wapsi tareekh aur apsi WhatsApp OTP praman"
        action={
          <button
            type="button"
            onClick={() => setIsAddContactOpen(true)}
            className="w-9 h-9 rounded-full bg-navy text-paper flex items-center justify-center shadow-md hover:bg-navy-light transition-all"
            title="Naya Udhar Jodein"
          >
            <Plus size={18} />
          </button>
        }
      />

      {/* Overview Cards */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-coral uppercase tracking-wide">
            <ArrowUpRight size={14} /> Lena Baaki Hai (Receivable)
          </div>
          <Mono className="text-xl font-bold text-ink block mt-1.5">
            ₹{totalReceivable.toLocaleString('en-IN')}
          </Mono>
          <p className="text-[10px] text-ink-muted mt-0.5">Dusro ko diya hua hisab</p>
        </div>

        <div className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-green uppercase tracking-wide">
            <ArrowDownRight size={14} /> Dena Baaki Hai (Payable)
          </div>
          <Mono className="text-xl font-bold text-ink block mt-1.5">
            ₹{totalPayable.toLocaleString('en-IN')}
          </Mono>
          <p className="text-[10px] text-ink-muted mt-0.5">Dusro se liya hua udhar</p>
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
            className={'text-xs px-3.5 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ' + (filter === t.key ? 'bg-navy text-paper shadow-sm' : 'bg-paper border border-paper-dim text-ink-muted hover:text-ink')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Udhar Contacts List */}
      <div className="px-4 space-y-3">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center bg-paper rounded-2xl border border-paper-dim">
            <HandCoins size={36} className="mx-auto text-ink-muted opacity-40 mb-2" />
            <p className="text-sm font-medium text-ink">Koi udhar record nahi mila</p>
            <p className="text-xs text-ink-muted mt-0.5">Naya record jodane ke liye upar diye gaye "+" button par click karein.</p>
          </div>
        ) : (
          filteredContacts.map((c) => {
            const associatedMember = members.find(m => m.id === c.member_id);
            const isGiven = c.type === 'given';
            const isFullySettled = c.status === 'settled';

            return (
              <div key={c.id} className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-sm space-y-3 hover:border-navy/20 transition-all">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-ink">{c.person_name}</h3>
                      {c.father_name && (
                        <span className="text-[11px] text-ink-muted font-normal">
                          (Pita: {c.father_name})
                        </span>
                      )}
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

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-muted">
                      <span>Parivar Sadasya: <strong className="text-ink">{associatedMember?.name || 'Papa'}</strong></span>
                      {c.phone && (
                        <span>· <a href={'tel:' + c.phone} className="text-gold font-mono underline hover:text-ink">{c.phone}</a></span>
                      )}
                      {c.address && (
                        <span className="flex items-center gap-0.5 text-ink-muted">
                          <MapPin size={11} className="text-ink-muted" /> {c.address}
                        </span>
                      )}
                    </div>

                    {/* Payment Mode & Promised Date badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-paper-dim text-ink font-medium border border-paper-dim flex items-center gap-1">
                        <CreditCard size={10} className="text-navy" />
                        {c.payment_mode === 'bank_transfer' ? '🏦 Bank Transfer' :
                         c.payment_mode === 'upi' ? '📱 UPI Online' :
                         c.payment_mode === 'cheque' ? '📝 Cheque' : '💵 Nagad / Cash'}
                      </span>

                      {(c.promised_return_date || c.due_date) && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold-dark font-medium flex items-center gap-1">
                          <Calendar size={10} /> Wapsi: {c.promised_return_date || c.due_date}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-ink-muted block uppercase font-bold">Bakaya Balance</span>
                    <Mono className={'text-base font-bold ' + (isFullySettled ? 'text-ink-muted line-through' : isGiven ? 'text-coral' : 'text-green')}>
                      ₹{c.remaining_balance.toLocaleString('en-IN')}
                    </Mono>
                    <span className="text-[10px] text-ink-muted block">Mool: ₹{c.original_amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {c.notes && (
                  <p className="text-xs text-ink-muted bg-paper-dim/40 p-2 rounded-lg italic">
                    "{c.notes}"
                  </p>
                )}

                {/* Digital Praman / OTP Verification Status Box */}
                <div className="p-2.5 rounded-xl bg-paper-dim/40 border border-paper-dim flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5">
                    {c.is_otp_verified ? (
                      <span className="flex items-center gap-1 font-semibold text-green text-[11px]">
                        <ShieldCheck size={14} className="text-green" /> Digital OTP Verified (No Vivad)
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-ink-muted uppercase">Security OTP:</span>
                        <code className="text-xs font-mono font-bold bg-paper px-1.5 py-0.5 rounded border border-paper-dim text-navy">
                          {c.otp_code || '123456'}
                        </code>
                        <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                          Pending
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={getWhatsAppShareUrl(c)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-[11px] flex items-center gap-1 shadow-sm transition-all"
                      title="WhatsApp par promissory note aur OTP bhejein"
                    >
                      <Share2 size={12} /> WhatsApp Agreement
                    </a>

                    {!c.is_otp_verified && (
                      <button
                        type="button"
                        onClick={() => {
                          setOtpVerifyContact(c);
                          setInputOtp(c.otp_code || '');
                          setOtpError('');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-navy hover:bg-navy-light text-paper font-medium text-[11px] flex items-center gap-1 shadow-sm transition-all"
                      >
                        <ShieldCheck size={12} /> OTP Verify
                      </button>
                    )}
                  </div>
                </div>

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
          })
        )}
      </div>

      {/* OTP Verification Modal */}
      {otpVerifyContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green/15 text-green flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink font-serif">OTP Se Satyapit Karein</h3>
                <p className="text-[11px] text-ink-muted">{otpVerifyContact.person_name} ka digital praman</p>
              </div>
            </div>

            <p className="text-xs text-ink-muted bg-paper-dim/40 p-2.5 rounded-xl leading-relaxed">
              WhatsApp par bheja gaya 6-digit OTP code enter karein. Isse future me apsi len-den ka pakka hisab bana rahega (Optional & Flexible).
            </p>

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 842109"
                  value={inputOtp}
                  onChange={(e) => {
                    setInputOtp(e.target.value);
                    setOtpError('');
                  }}
                  className="w-full px-3 py-2 text-center tracking-widest text-lg bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold text-navy"
                  required
                />
                {otpError && (
                  <p className="text-[11px] text-coral font-medium mt-1">{otpError}</p>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setOtpVerifyContact(null);
                    setInputOtp('');
                    setOtpError('');
                  }} 
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold">
                  Confirm OTP
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <Button type="submit" size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold">
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
          <div className="w-full max-w-md bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2">
              <h3 className="text-base font-bold font-serif text-ink">Naya Udhar Entry Jodein</h3>
              <span className="text-[10px] bg-paper-dim px-2 py-0.5 rounded text-ink-muted">Old ya New dono chalega</span>
            </div>

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
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Kiska Naam Hai? (Person / Dukandar) *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Uncle, Sunil Kirana Store, Verma Ji"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Pita Ka Naam (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Shri Ramswaroop Ji"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Pata / Gaon / Shehar (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Ward 4, Rampur"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Raqam (₹ Amount) *</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Mobile No (WhatsApp ke liye)</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                  Len-Den Ka Madhyam (Payment Mode)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'cash', label: '💵 Cash' },
                    { id: 'bank_transfer', label: '🏦 Bank A/C' },
                    { id: 'upi', label: '📱 UPI' },
                    { id: 'cheque', label: '📝 Cheque' },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMode(pm.id as any)}
                      className={'py-1.5 text-xs font-medium rounded-lg border text-center transition-all ' + (paymentMode === pm.id ? 'bg-navy text-paper border-navy shadow-sm' : 'bg-paper text-ink-muted border-paper-dim')}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Kis Sadasya Ka Hisab Hai?</label>
                  <select
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Wapsi Tithi (Promise Date)</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Vivran / Karan / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Urgent zaroorat ke liye diya tha"
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
                  Save Udhar Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
