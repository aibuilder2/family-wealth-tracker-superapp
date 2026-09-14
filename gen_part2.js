const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
  console.log('Wrote:', relPath);
}

// 3. components/money/TransactionForm.tsx
save('components/money/TransactionForm.tsx', `'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { TransactionType, PaymentMode, ExpenseScope } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ArrowDownRight, ArrowUpRight, HandCoins, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TransactionFormProps {
  initialType?: 'expense' | 'income' | 'udhar';
  onSuccess?: () => void;
}

export function TransactionForm({
  initialType = 'expense',
  onSuccess,
}: TransactionFormProps) {
  const { members, addTransaction } = useFamilyStore();

  const [type, setType] = useState<TransactionType>(
    initialType === 'udhar' ? 'udhar_given' : initialType
  );
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [category, setCategory] = useState<string>('Ghar kharch');
  const [mode, setMode] = useState<PaymentMode>('online');
  const [scope, setScope] = useState<ExpenseScope>('ghar');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    members[0]?.id || 'm-papa'
  );
  const [udharPerson, setUdharPerson] = useState<string>('');
  const [txnDate, setTxnDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      mode,
      scope,
      note: note || (type.startsWith('udhar') ? (type === 'udhar_given' ? \`Udhar diya — \${udharPerson}\` : \`Udhar liya — \${udharPerson}\`) : category),
      udhar_person: type.startsWith('udhar') ? udharPerson : undefined,
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
      {/* Type Selector */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-paper-dim rounded-xl">
        <button
          type="button"
          onClick={() => {
            setType('expense');
            setCategory('Ghar kharch');
          }}
          className={\`py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-all \${
            type === 'expense'
              ? 'bg-coral text-white shadow-sm'
              : 'text-ink-muted hover:text-ink'
          }\`}
        >
          <ArrowDownRight size={14} /> Kharch
        </button>

        <button
          type="button"
          onClick={() => {
            setType('income');
            setCategory('Salary');
          }}
          className={\`py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-all \${
            type === 'income'
              ? 'bg-green text-white shadow-sm'
              : 'text-ink-muted hover:text-ink'
          }\`}
        >
          <ArrowUpRight size={14} /> Income
        </button>

        <button
          type="button"
          onClick={() => {
            setType('udhar_given');
            setCategory('Udhar');
          }}
          className={\`py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-all \${
            type.startsWith('udhar')
              ? 'bg-gold text-white shadow-sm'
              : 'text-ink-muted hover:text-ink'
          }\`}
        >
          <HandCoins size={14} /> Udhar
        </button>
      </div>

      {/* Sub-toggle for Udhar */}
      {type.startsWith('udhar') && (
        <div className="flex gap-2 p-1 bg-paper-dim/60 rounded-lg">
          <button
            type="button"
            onClick={() => setType('udhar_given')}
            className={\`flex-1 py-1 text-xs rounded-md font-medium transition-all \${
              type === 'udhar_given' ? 'bg-paper text-coral shadow-sm' : 'text-ink-muted'
            }\`}
          >
            Maine diya (Lena hai)
          </button>
          <button
            type="button"
            onClick={() => setType('udhar_taken')}
            className={\`flex-1 py-1 text-xs rounded-md font-medium transition-all \${
              type === 'udhar_taken' ? 'bg-paper text-green shadow-sm' : 'text-ink-muted'
            }\`}
          >
            Maine liya (Dena hai)
          </button>
        </div>
      )}

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
                className={\`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all \${
                  isSelected
                    ? 'border-gold bg-gold/10 shadow-sm'
                    : 'border-paper-dim bg-paper hover:bg-paper-dim/40'
                }\`}
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

      {/* Udhar Person Input */}
      {type.startsWith('udhar') && (
        <div>
          <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block mb-1">
            Kisko Diya / Kisse Liya? (Person Name)
          </label>
          <input
            type="text"
            placeholder="e.g. Ramesh Uncle, Chacha ji, Dost"
            value={udharPerson}
            onChange={(e) => setUdharPerson(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-paper border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
            required
          />
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
                className={\`text-xs px-2.5 py-1 rounded-lg border transition-all \${
                  category === cat
                    ? 'bg-navy text-paper border-navy'
                    : 'bg-paper text-ink-muted border-paper-dim hover:bg-paper-dim'
                }\`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode & Scope (Online vs Offline / Ghar vs Bahar) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block mb-1">
            Payment Mode
          </label>
          <div className="flex bg-paper-dim p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('online')}
              className={\`flex-1 py-1.5 text-xs font-medium rounded-md transition-all \${
                mode === 'online' ? 'bg-paper text-navy shadow-sm' : 'text-ink-muted'
              }\`}
            >
              Online
            </button>
            <button
              type="button"
              onClick={() => setMode('offline')}
              className={\`flex-1 py-1.5 text-xs font-medium rounded-md transition-all \${
                mode === 'offline' ? 'bg-paper text-navy shadow-sm' : 'text-ink-muted'
              }\`}
            >
              Offline (Cash)
            </button>
          </div>
        </div>

        {type === 'expense' && (
          <div>
            <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block mb-1">
              Ghar / Bahar
            </label>
            <div className="flex bg-paper-dim p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setScope('ghar')}
                className={\`flex-1 py-1.5 text-xs font-medium rounded-md transition-all \${
                  scope === 'ghar' ? 'bg-paper text-navy shadow-sm' : 'text-ink-muted'
                }\`}
              >
                Ghar
              </button>
              <button
                type="button"
                onClick={() => setScope('bahar')}
                className={\`flex-1 py-1.5 text-xs font-medium rounded-md transition-all \${
                  scope === 'bahar' ? 'bg-paper text-navy shadow-sm' : 'text-ink-muted'
                }\`}
              >
                Bahar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Note / Description */}
      <div>
        <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block mb-1">
          Note / Vivran
        </label>
        <input
          type="text"
          placeholder="e.g. Sabzi Mandi, Amazon order, Petrol"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-paper border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
        />
      </div>

      {/* Date */}
      <div>
        <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block mb-1">
          Tarikh (Date)
        </label>
        <input
          type="date"
          value={txnDate}
          onChange={(e) => setTxnDate(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-paper border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
        />
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
`);

// 4. components/money/AddTransactionModal.tsx
save('components/money/AddTransactionModal.tsx', `'use client';

import React from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { TransactionForm } from '@/components/money/TransactionForm';
import { X } from 'lucide-react';

export function AddTransactionModal() {
  const { isQuickAddOpen, quickAddType, closeQuickAdd } = useFamilyStore();

  if (!isQuickAddOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-[430px] bg-[#EFEAE0] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-paper-dim"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 bg-navy text-paper">
          <div>
            <h2 className="text-base font-semibold font-serif">Naya Entry Jodein</h2>
            <p className="text-xs text-gold-soft">Kharch, Income ya Udhar add karein</p>
          </div>
          <button
            onClick={closeQuickAdd}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-navy-light text-paper hover:text-gold-soft transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto flex-1">
          <TransactionForm
            initialType={quickAddType}
            onSuccess={closeQuickAdd}
          />
        </div>
      </div>
    </div>
  );
}
`);
