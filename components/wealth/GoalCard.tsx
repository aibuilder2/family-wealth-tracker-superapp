import React from 'react';
import { Goal } from '@/types';
import { Mono } from '@/components/ui/Mono';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Edit3, Trash2, Link as LinkIcon, PiggyBank, Sparkles, User, Calendar } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const { assets, members } = useFamilyStore();

  // Find linked assets if any
  const linkedAssets = (goal.linked_asset_ids || [])
    .map(id => assets.find(a => a.id === id))
    .filter(Boolean);

  // Sum of linked assets value
  const linkedAssetsValue = linkedAssets.reduce((sum, a) => sum + Number(a?.value || 0), 0);

  // Total effective saved = direct saved + linked assets value
  const effectiveSaved = goal.saved_amount + linkedAssetsValue;
  const pct = Math.min(100, Math.round((effectiveSaved / goal.target_amount) * 100)) || 0;

  const member = members.find(m => m.id === goal.member_id);

  return (
    <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-xs hover:border-gold/40 transition-all space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-sm font-bold text-ink">{goal.title}</h4>
            {member && (
              <span className="text-[10px] font-bold bg-paper-dim px-2 py-0.5 rounded-full text-ink-muted flex items-center gap-1">
                <User size={10} className="text-gold" /> {member.name}
              </span>
            )}
            {goal.funding_source && (
              <span className="text-[9px] font-bold bg-gold/15 text-gold-dark border border-gold/30 px-2 py-0.5 rounded-full">
                {goal.funding_source === 'income' && '🟢 मासिक आय से'}
                {goal.funding_source === 'savings' && '🟡 बैंक बचत से'}
                {goal.funding_source === 'investment' && '📈 निवेश लिंक्ड'}
              </span>
            )}
          </div>

          {goal.target_date && (
            <p className="text-[10px] text-ink-muted flex items-center gap-1 mt-0.5">
              <Calendar size={11} className="text-gold" />
              लक्ष्य तारीख: <span className="font-mono text-ink font-semibold">{goal.target_date}</span>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <Mono className="text-xs text-gold font-black bg-gold/10 px-2 py-0.5 rounded-lg border border-gold/20 mr-1">
            {pct}%
          </Mono>
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(goal)}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-paper-dim transition-colors"
              title="लक्ष्य संपादित करें (Edit Goal)"
            >
              <Edit3 size={14} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(goal.id)}
              className="p-1.5 rounded-lg text-ink-muted hover:text-coral hover:bg-coral/10 transition-colors"
              title="लक्ष्य हटाएं (Delete Goal)"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="h-2 rounded-full bg-paper-dim overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-ink-muted mt-1">
          <span>
            जमा: <Mono className="font-bold text-ink">₹{effectiveSaved.toLocaleString('en-IN')}</Mono>
          </span>
          <span>
            कुल लक्ष्य: <Mono className="font-bold text-ink">₹{goal.target_amount.toLocaleString('en-IN')}</Mono>
          </span>
        </div>
      </div>

      {/* Linked Investments Display */}
      {linkedAssets.length > 0 && (
        <div className="pt-2 border-t border-paper-dim/60 space-y-1">
          <span className="text-[10px] font-bold text-ink-muted uppercase flex items-center gap-1">
            <LinkIcon size={10} className="text-gold" />
            इस लक्ष्य से जुड़े निवेश (Linked Assets):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {linkedAssets.map(a => a && (
              <span key={a.id} className="text-[10px] bg-paper-dim/60 border border-paper-dim px-2 py-0.5 rounded-md font-mono text-ink flex items-center gap-1">
                <Sparkles size={9} className="text-gold" />
                {a.label}: <strong>₹{Number(a.value).toLocaleString('en-IN')}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {goal.notes && (
        <p className="text-[10px] text-ink-muted italic pt-1 border-t border-paper-dim/40">
          {goal.notes}
        </p>
      )}
    </div>
  );
}
