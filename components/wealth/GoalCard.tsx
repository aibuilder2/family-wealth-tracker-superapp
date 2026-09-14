import React from 'react';
import { Goal } from '@/types';
import { Mono } from '@/components/ui/Mono';

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const pct = Math.min(100, Math.round((goal.saved_amount / goal.target_amount) * 100)) || 0;

  return (
    <div className="px-4 py-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-ink font-medium">{goal.title}</span>
        <Mono className="text-xs text-gold font-semibold">{pct}%</Mono>
      </div>
      <div className="h-1.5 rounded-full bg-paper-dim overflow-hidden mb-1">
        <div
          className="h-1.5 rounded-full bg-gold transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-ink-muted">
        <span>Jama: <Mono>₹{goal.saved_amount.toLocaleString('en-IN')}</Mono></span>
        <span>Goal: <Mono>₹{goal.target_amount.toLocaleString('en-IN')}</Mono></span>
      </div>
    </div>
  );
}
