'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Target, Plus, CheckCircle2, TrendingUp, Sparkles, Calendar, DollarSign, ArrowUpRight, Flame, Shield, Award, Trash2, Edit3, X, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function GoalsHubPage() {
  const { goals, addGoal, contributeToGoal, deleteGoal } = useFamilyStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('10000');
  const [depositNote, setDepositNote] = useState<string>('');

  // Form State
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('education');

  // Calculations
  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount || 0), 0);
  const totalSaved = goals.reduce((sum, g) => sum + Number(g.saved_amount || 0), 0);
  const overallPercent = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;
  const completedGoalsCount = goals.filter(g => (g.saved_amount || 0) >= g.target_amount).length;

  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(g => (g.category || 'other').toLowerCase() === selectedCategory.toLowerCase());

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || !depositAmount || Number(depositAmount) <= 0) return;
    
    contributeToGoal(selectedGoalId, Number(depositAmount), depositNote);
    
    // Check if goal reached 100%
    const g = goals.find(x => x.id === selectedGoalId);
    if (g && ((g.saved_amount || 0) + Number(depositAmount)) >= g.target_amount) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    setIsDepositModalOpen(false);
    setSelectedGoalId(null);
    setDepositAmount('10000');
    setDepositNote('');
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    addGoal({
      title,
      target_amount: Number(targetAmount),
      saved_amount: Number(savedAmount || 0),
      target_date: targetDate || undefined,
      category: category
    });

    setIsAddModalOpen(false);
    setTitle('');
    setTargetAmount('');
    setSavedAmount('');
    setTargetDate('');
  };

  const getCategoryIcon = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'education': return '🎓';
      case 'marriage': return '💍';
      case 'gold': return '🪙';
      case 'property':
      case 'house': return '🏡';
      case 'vehicle':
      case 'car': return '🚗';
      case 'emergency': return '🛡️';
      case 'retirement': return '🌴';
      default: return '🎯';
    }
  };

  return (
    <div className="space-y-4 pt-4 pb-12">
      {/* 1. Header */}
      <div className="px-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-serif text-ink flex items-center gap-2">
            <Target className="text-gold" size={22} /> Family Financial Goals
          </h1>
          <p className="text-xs text-ink-muted">Pariwar ke bhavishya ke saare lakshya ek jagah</p>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3 py-2 bg-gold hover:bg-gold-soft text-navy font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all hover:scale-105"
        >
          <Plus size={15} strokeWidth={2.5} /> Naya Goal
        </button>
      </div>

      {/* 2. Portfolio Level Metric Cards */}
      <div className="px-4">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-navy via-[#162738] to-navy border border-gold/30 shadow-lg text-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-soft uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} /> Total Goals Target
            </span>
            <span className="text-xs px-2 py-0.5 bg-gold/20 text-gold-soft font-bold rounded-full">
              {completedGoalsCount}/{goals.length} Poore Huye
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[11px] text-slate-300">Kul Lakshya Rashi</p>
              <Mono className="text-2xl font-bold text-white">₹{totalTarget.toLocaleString('en-IN')}</Mono>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-300">Kul Jama (Savings)</p>
              <Mono className="text-xl font-bold text-emerald-400">₹{totalSaved.toLocaleString('en-IN')}</Mono>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] font-semibold">
              <span className="text-slate-300">Overall Portfolio Progress</span>
              <span className="text-gold-soft">{overallPercent}% Completed</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="px-4 flex gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { key: 'all', label: 'Sabhi Goals', icon: '🎯' },
          { key: 'education', label: 'Education', icon: '🎓' },
          { key: 'gold', label: 'Gold & SGB', icon: '🪙' },
          { key: 'property', label: 'Property / Home', icon: '🏡' },
          { key: 'marriage', label: 'Shadi / Event', icon: '💍' },
          { key: 'emergency', label: 'Emergency Fund', icon: '🛡️' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedCategory(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === tab.key
                ? 'bg-navy text-gold-soft border border-gold/40 shadow-sm'
                : 'bg-paper border border-paper-dim text-ink-muted hover:text-ink'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 4. Goal Cards Grid */}
      <div className="px-4 space-y-3">
        {filteredGoals.map((g) => {
          const percent = Math.min(100, Math.round(((g.saved_amount || 0) / g.target_amount) * 100));
          const remaining = Math.max(0, g.target_amount - (g.saved_amount || 0));
          const isDone = percent >= 100;

          return (
            <div 
              key={g.id}
              className="rounded-2xl p-4 bg-paper border border-paper-dim shadow-sm hover:border-gold/50 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-xl shrink-0">
                    {getCategoryIcon(g.category)}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-ink text-sm flex items-center gap-1.5">
                      {g.title}
                      {isDone && <CheckCircle2 size={16} className="text-emerald-500" />}
                    </h3>
                    <p className="text-[11px] text-ink-muted flex items-center gap-1">
                      <Calendar size={12} /> Target: {g.target_date || 'Ongoing SIP'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${isDone ? 'bg-emerald-500/15 text-emerald-600' : 'bg-gold/15 text-gold'}`}>
                    {percent}%
                  </span>
                  <p className="text-[10px] text-ink-muted mt-0.5">
                    {isDone ? 'Goal Achieved!' : `₹${remaining.toLocaleString('en-IN')} baaki`}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-paper-dim rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-gold to-amber-500'}`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Numbers Strip & Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-paper-dim text-xs">
                <div>
                  <span className="text-ink-muted text-[11px]">Jama: </span>
                  <Mono className="font-bold text-ink">₹{(g.saved_amount || 0).toLocaleString('en-IN')}</Mono>
                  <span className="text-ink-muted text-[11px]"> / ₹{g.target_amount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedGoalId(g.id);
                      setIsDepositModalOpen(true);
                    }}
                    className="px-2.5 py-1 bg-navy text-gold-soft hover:bg-navy-light text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Plus size={12} /> Jama Karein
                  </button>
                  <button
                    onClick={() => deleteGoal(g.id)}
                    className="p-1 text-ink-muted hover:text-coral transition-colors"
                    title="Delete Goal"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Deposit / Contribute Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[380px] bg-paper rounded-3xl p-5 border border-paper-dim shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <h3 className="font-serif font-bold text-ink text-base flex items-center gap-2">
                <DollarSign size={18} className="text-gold" /> Goal Me Paisa Jama Karein
              </h3>
              <button onClick={() => setIsDepositModalOpen(false)} className="text-ink-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-ink-muted block mb-1">Deposit Rashi (₹)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="e.g. 10000"
                  required
                  className="w-full p-2.5 rounded-xl border border-paper-dim bg-white text-ink text-sm font-mono font-bold focus:border-gold outline-none"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {['5000', '10000', '25000', '50000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className="py-1 text-[11px] font-bold rounded-lg bg-paper-dim text-ink hover:bg-gold/20 hover:text-gold transition-all"
                  >
                    +₹{Number(amt) / 1000}k
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold text-ink-muted block mb-1">Note / Source (Optional)</label>
                <input
                  type="text"
                  value={depositNote}
                  onChange={(e) => setDepositNote(e.target.value)}
                  placeholder="e.g. Monthly SIP / Bonus"
                  className="w-full p-2.5 rounded-xl border border-paper-dim bg-white text-ink text-xs focus:border-gold outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-paper-dim text-xs font-bold text-ink-muted hover:bg-paper-dim"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gold hover:bg-gold-soft text-navy font-bold text-xs shadow"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Add New Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[380px] bg-paper rounded-3xl p-5 border border-paper-dim shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <h3 className="font-serif font-bold text-ink text-base flex items-center gap-2">
                <Target size={18} className="text-gold" /> Naya Lakshya (Goal) Banayein
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-ink-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddGoalSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-ink-muted block mb-1">Goal Ka Naam *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Beti ki Higher Studies"
                  required
                  className="w-full p-2.5 rounded-xl border border-paper-dim bg-white text-ink text-xs focus:border-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-ink-muted block mb-1">Target Rashi (₹) *</label>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="e.g. 500000"
                    required
                    className="w-full p-2.5 rounded-xl border border-paper-dim bg-white text-ink text-xs font-mono focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-ink-muted block mb-1">Pehle Se Jama (₹)</label>
                  <input
                    type="number"
                    value={savedAmount}
                    onChange={(e) => setSavedAmount(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full p-2.5 rounded-xl border border-paper-dim bg-white text-ink text-xs font-mono focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-ink-muted block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-paper-dim bg-white text-ink text-xs focus:border-gold outline-none"
                  >
                    <option value="education">🎓 Education</option>
                    <option value="marriage">💍 Marriage</option>
                    <option value="property">🏡 Property / Flat</option>
                    <option value="gold">🪙 Gold / SGB</option>
                    <option value="vehicle">🚗 Car / Vehicle</option>
                    <option value="emergency">🛡️ Emergency Fund</option>
                    <option value="retirement">🌴 Retirement</option>
                    <option value="other">🎯 Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink-muted block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-paper-dim bg-white text-ink text-xs focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-paper-dim text-xs font-bold text-ink-muted hover:bg-paper-dim"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gold hover:bg-gold-soft text-navy font-bold text-xs shadow"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
