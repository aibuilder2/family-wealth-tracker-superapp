'use client';

import React, { useState } from 'react';
import { Transaction, Member, TransactionType, PaymentMode } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Mono } from '@/components/ui/Mono';
import { getRelativeDateLabel } from '@/lib/utils/dateHelpers';
import { Trash2, Edit3, X, Check } from 'lucide-react';
import { useFamilyStore } from '@/lib/store/familyStore';

interface TransactionListProps {
  transactions: Transaction[];
  members: Member[];
  groupByDate?: boolean;
  showDelete?: boolean;
}

export function TransactionList({
  transactions,
  members,
  groupByDate = true,
  showDelete = true,
}: TransactionListProps) {
  const { deleteTransaction, updateTransaction, openQuickAdd } = useFamilyStore();

  // Edit Transaction State
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editAmount, setEditAmount] = useState<number | ''>('');
  const [editCategory, setEditCategory] = useState('');
  const [editType, setEditType] = useState<TransactionType>('expense');
  const [editMode, setEditMode] = useState<PaymentMode>('online');
  const [editMemberId, setEditMemberId] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editUdharPerson, setEditUdharPerson] = useState('');

  const getMember = (memberId: string) => {
    return members.find((m) => m.id === memberId) || {
      name: 'Member',
      color: '#B98B2A',
      initials: 'M',
    };
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setEditAmount(Math.abs(tx.amount));
    setEditCategory(tx.category || 'other');
    setEditType(tx.type);
    setEditMode(tx.mode || 'online');
    setEditMemberId(tx.member_id || members[0]?.id || '');
    setEditDate(tx.txn_date || new Date().toISOString().split('T')[0]);
    setEditNote(tx.note || '');
    setEditUdharPerson(tx.udhar_person || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx || !editAmount) return;

    updateTransaction(editingTx.id, {
      amount: Number(editAmount),
      category: editCategory,
      type: editType,
      mode: editMode,
      member_id: editMemberId,
      txn_date: editDate,
      note: editNote.trim(),
      udhar_person: editUdharPerson.trim() || undefined,
    });

    setEditingTx(null);
  };

  if (transactions.length === 0) {
    return (
      <div className="p-6 text-center bg-paper rounded-xl border border-dashed border-paper-dim space-y-2">
        <p className="text-xs font-bold text-ink">इस समयावधि में कोई लेन-देन नहीं मिला</p>
        <p className="text-[11px] text-ink-muted">घर का ख़र्च, सैलरी, बिज़नेस आमदनी या उधारी जोड़ें।</p>
        <button
          type="button"
          onClick={() => openQuickAdd('expense')}
          className="px-3.5 py-1.5 bg-gold text-navy text-xs font-bold rounded-xl shadow-sm hover:bg-gold-light transition-all inline-block mt-1"
        >
          + नया लेन-देन जोड़ें
        </button>
      </div>
    );
  }

  const renderTxRow = (tx: Transaction) => {
    const m = getMember(tx.member_id);
    const isPositive = tx.type === 'income' || tx.type === 'udhar_taken';
    const isUdhar = tx.type === 'udhar_given' || tx.type === 'udhar_taken';

    return (
      <div key={tx.id} className="flex items-center gap-3 px-4 py-3 hover:bg-paper-dim/30 transition-colors group">
        <Avatar m={m} size={34} />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-ink font-medium truncate">{tx.note || tx.category}</p>
          <p className="text-[11px] text-ink-muted flex items-center gap-1.5 mt-0.5">
            <span>{m.name}</span>
            <span>·</span>
            <span className="capitalize">{tx.category}</span>
            {tx.mode && (
              <>
                <span>·</span>
                <span className="capitalize">{tx.mode}</span>
              </>
            )}
            {isUdhar && tx.udhar_person && (
              <span className="text-gold font-medium">({tx.udhar_person})</span>
            )}
          </p>
        </div>

        <div className="text-right">
          <Mono
            className="text-[13px] font-semibold block"
            style={{ color: isPositive ? '#4C7A5E' : '#C1502E' }}
          >
            {isPositive ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
          </Mono>
          <span className="text-[10px] text-ink-muted">
            {getRelativeDateLabel(tx.txn_date)}
          </span>
        </div>

        {/* Action Buttons (Edit & Delete) */}
        <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => handleOpenEdit(tx)}
            className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper-dim rounded-lg transition-all"
            title="संपादित करें (Edit)"
          >
            <Edit3 size={14} />
          </button>
          {showDelete && (
            <button
              type="button"
              onClick={() => {
                if (confirm('क्या आप इस लेन-देन को हटाना चाहते हैं?')) {
                  deleteTransaction(tx.id);
                }
              }}
              className="p-1.5 text-ink-muted hover:text-coral hover:bg-coral/10 rounded-lg transition-all"
              title="हटाएं (Delete)"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    );
  };

  if (!groupByDate) {
    return (
      <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim">
        {transactions.map(renderTxRow)}

        {/* Edit Modal */}
        {renderEditModal()}
      </div>
    );
  }

  // Group by date
  const groups: Record<string, Transaction[]> = {};
  transactions.forEach((tx) => {
    const label = getRelativeDateLabel(tx.txn_date);
    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  });

  function renderEditModal() {
    if (!editingTx) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in">
        <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
              <Edit3 size={16} className="text-gold" />
              लेन-देन संपादित करें (Edit Transaction)
            </h3>
            <button onClick={() => setEditingTx(null)} className="text-ink-muted hover:text-ink">✕</button>
          </div>

          <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-ink-muted block mb-1">राशि (Amount ₹) *</label>
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono font-bold text-sm"
                required
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">प्रकार (Type)</label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as TransactionType)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-paper-dim/40 border border-paper-dim text-ink font-bold"
                >
                  <option value="expense">ख़र्च (Expense)</option>
                  <option value="income">आमदनी (Income)</option>
                  <option value="udhar_given">उधार दिया (Lent)</option>
                  <option value="udhar_taken">उधार लिया (Borrowed)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">माध्यम (Mode)</label>
                <select
                  value={editMode}
                  onChange={(e) => setEditMode(e.target.value as PaymentMode)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-paper-dim/40 border border-paper-dim text-ink font-bold"
                >
                  <option value="online">Online / UPI</option>
                  <option value="offline">Cash (नकद)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">सदस्य (Member)</label>
                <select
                  value={editMemberId}
                  onChange={(e) => setEditMemberId(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-paper-dim/40 border border-paper-dim text-ink font-bold"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">तारीख (Date)</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-paper-dim/40 border border-paper-dim text-ink"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-ink-muted block mb-1">कैटेगरी (Category)</label>
              <input
                type="text"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                required
              />
            </div>

            {(editType === 'udhar_given' || editType === 'udhar_taken') && (
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">व्यक्ति का नाम (Udhar Person)</label>
                <input
                  type="text"
                  value={editUdharPerson}
                  onChange={(e) => setEditUdharPerson(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-bold"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-ink-muted block mb-1">नोट्स / विवरण (Note)</label>
              <input
                type="text"
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingTx(null)}
                className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gold text-navy font-bold hover:bg-gold-light shadow-sm"
              >
                ✓ बदलाव सेव करें
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([dateLabel, items]) => (
        <div key={dateLabel}>
          <p className="px-1 text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
            {dateLabel}
          </p>
          <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim">
            {items.map(renderTxRow)}
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {renderEditModal()}
    </div>
  );
}
