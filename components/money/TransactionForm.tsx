'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { TransactionType, PaymentMode, ExpenseScope, ExpenseCategoryType } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useVoiceInput } from '@/lib/hooks/useVoiceInput';
import { ArrowDownRight, ArrowUpRight, HandCoins, Check, Mic, MicOff, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TransactionFormProps {
  initialType?: 'expense' | 'income' | 'udhar';
  onSuccess?: () => void;
}

export function TransactionForm({
  initialType = 'expense',
  onSuccess,
}: TransactionFormProps) {
  const { members, addTransaction, currentUserId } = useFamilyStore();

  const [type, setType] = useState<TransactionType>(
    initialType === 'udhar' ? 'udhar_given' : initialType
  );
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [category, setCategory] = useState<string>('Ghar kharch');
  const [categoryType, setCategoryType] = useState<ExpenseCategoryType>('main_ghar');
  const [mode, setMode] = useState<PaymentMode>('online');
  const [scope, setScope] = useState<ExpenseScope>('ghar');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    currentUserId || members[0]?.id || 'm-papa'
  );
  const [udharPerson, setUdharPerson] = useState<string>('');
  const [txnDate, setTxnDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [timeStamp, setTimeStamp] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isListening, transcript, startListening } = useVoiceInput((parsed) => {
    if (parsed.amount) setAmount(parsed.amount.toString());
    if (parsed.category) setCategory(parsed.category);
    if (parsed.note) setNote(parsed.note);
    if (parsed.member_name) {
      const matchM = members.find(m => m.name.toLowerCase() === parsed.member_name?.toLowerCase());
      if (matchM) setSelectedMemberId(matchM.id);
    }
  });

  const expenseCategories = [
    'Ghar kharch', 'Bahar kharch', 'Sabzi/Ration', 'Petrol/Fuel',
    'Bills & Recharge', 'Shopping', 'Health/Medicine', 'Education', 'Other'
  ];

  const incomeCategories = ['Salary', 'Business', 'Rent', 'Interest', 'Bonus', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      alert('Kripya valid amount dalein.');
      return;
    }

    setIsSubmitting(true);

    addTransaction({
      member_id: selectedMemberId,
      type,
      amount: numAmount,
      category: type.startsWith('udhar') ? 'Udhar' : category,
      category_type: categoryType,
      mode,
      scope,
      note: note || (type.startsWith('udhar') ? (type === 'udhar_given' ? 'Udhar diya — ' + udharPerson : 'Udhar liya — ' + udharPerson) : category),
      udhar_person: type.startsWith('udhar') ? udharPerson : undefined,
      time_stamp: timeStamp,
      txn_date: txnDate,
    });

    if (type === 'income') {
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
      } catch (err) {}
    }

    setIsSubmitting(false);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Voice Assistant */}
      <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-gold" />
          <div>
            <p className="text-xs font-semibold text-ink">Voice Input (Bolke Entry Karein)</p>
            <p className="text-[11px] text-ink-muted">
              {isListening ? '🎤 Sun rahe hain... boliye' : 'Mic dabayein aur bolkar add karein'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={startListening}
          className={'w-9 h-9 rounded-full flex items-center justify-center transition-all shadow ' + (isListening ? 'bg-coral text-white animate-pulse' : 'bg-navy text-gold-soft hover:bg-navy-light')}
          title="Start Voice Input"
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
      </div>

      {transcript && (
        <p className="text-xs text-ink-muted bg-paper p-2 rounded-lg border border-paper-dim italic">
          &quot;{transcript}&quot;
        </p>
      )}

      {/* Type Selector */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-paper-dim rounded-xl">
        <button
          type="button"
          onClick={() => { setType('expense'); setCategory('Ghar kharch'); }}
          className={'py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-all ' + (type === 'expense' ? 'bg-coral text-white shadow-sm' : 'text-ink-muted hover:text-ink')}
        >
          <ArrowDownRight size={14} /> Kharch
        </button>

        <button
          type="button"
          onClick={() => { setType('income'); setCategory('Salary'); }}
          className={'py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-all ' + (type === 'income' ? 'bg-green text-white shadow-sm' : 'text-ink-muted hover:text-ink')}
        >
          <ArrowUpRight size={14} /> Income
        </button>

        <button
          type="button"
          onClick={() => { setType('udhar_given'); setCategory('Udhar'); }}
          className={'py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-all ' + (type.startsWith('udhar') ? 'bg-gold text-white shadow-sm' : 'text-ink-muted hover:text-ink')}
        >
          <HandCoins size={14} /> Udhar
        </button>
      </div>

      {/* Amount Input */}
      <div className="bg-paper p-4 rounded-xl border border-paper-dim text-center">
        <label className="text-[11px] font-medium text-ink-muted uppercase tracking-wider block mb-1">
          Raqam (Amount)
        </label>
        <div className="flex items-center justify-center gap-1">
          <span className="text-2xl font-serif text-ink font-semibold">₹</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-3xl font-bold font-mono text-ink bg-transparent text-center focus:outline-none w-48"
            autoFocus
            required
          />
        </div>
      </div>

      {/* Member Selection */}
      <div>
        <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block mb-1.5">
          Kis Member Ka Hai?
        </label>
        <div className="grid grid-cols-4 gap-2">
          {members.map((m) => {
            const isSelected = selectedMemberId === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMemberId(m.id)}
                className={'p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ' + (isSelected ? 'border-gold bg-gold/10 shadow-sm' : 'border-paper-dim bg-paper hover:bg-paper-dim/40')}
              >
                <Avatar m={m} size={28} />
                <span className="text-xs font-medium text-ink truncate w-full text-center">
                  {m.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expense Sub-classification */}
      {type === 'expense' && (
        <div>
          <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block mb-1">
            Kharch Type (Classification)
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'main_ghar', label: '🏠 Main Ghar (Common)' },
              { id: 'personal', label: '🛍️ Personal (Apna)' },
              { id: 'child', label: '🎒 Child Specific' },
              { id: 'long_term', label: '🚗 Long-term / EMI' },
            ].map((ct) => (
              <button
                key={ct.id}
                type="button"
                onClick={() => setCategoryType(ct.id as any)}
                className={'text-[11px] p-2 rounded-lg border text-left font-medium transition-all ' + (categoryType === ct.id ? 'bg-navy text-paper border-navy shadow-sm' : 'bg-paper text-ink-muted border-paper-dim hover:bg-paper-dim')}
              >
                {ct.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Selection */}
      {!type.startsWith('udhar') && (
        <div>
          <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block mb-1.5">
            Category
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(type === 'expense' ? expenseCategories : incomeCategories).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={'text-xs px-2.5 py-1 rounded-lg border transition-all ' + (category === cat ? 'bg-navy text-paper border-navy' : 'bg-paper text-ink-muted border-paper-dim hover:bg-paper-dim')}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block mb-1">
            Tarikh (Date)
          </label>
          <input
            type="date"
            value={txnDate}
            onChange={(e) => setTxnDate(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-paper border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block mb-1">
            Waqt (Time)
          </label>
          <input
            type="text"
            placeholder="e.g. 10:30 AM"
            value={timeStamp}
            onChange={(e) => setTimeStamp(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-paper border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-navy text-paper font-semibold hover:bg-navy-light text-sm shadow-md"
      >
        <Check size={16} /> Entry Save Karein
      </Button>
    </form>
  );
}
