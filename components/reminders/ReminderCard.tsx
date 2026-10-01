import React from 'react';
import { Reminder } from '@/types';
import { Clock, CreditCard, Shield, Sprout, Wrench, Calendar, User } from 'lucide-react';
import { formatDueDays } from '@/lib/utils/dateHelpers';
import { useFamilyStore } from '@/lib/store/familyStore';

interface ReminderCardProps {
  reminder: Reminder;
}

export function ReminderCard({ reminder }: ReminderCardProps) {
  const { members } = useFamilyStore();
  const dueInfo = formatDueDays(reminder.due_date);
  const color = dueInfo.isUrgent ? '#C1502E' : dueInfo.isWarning ? '#B98B2A' : '#6B7A80';

  const member = reminder.member_name 
    ? { name: reminder.member_name }
    : members.find(m => m.id === reminder.member_id);

  const getCategoryBadge = () => {
    switch (reminder.category) {
      case 'emi':
        return { label: 'EMI किश्त', bg: 'bg-coral/15 text-coral border-coral/30', icon: CreditCard };
      case 'sip_rd':
        return { label: 'SIP/RD', bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30', icon: Sprout };
      case 'insurance':
        return { label: 'बीमा (Insurance)', bg: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30', icon: Shield };
      case 'service':
        return { label: 'सर्विसिंग', bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30', icon: Wrench };
      default:
        return { label: 'रिमाइंडर', bg: 'bg-paper-dim text-ink-muted border-paper-dim', icon: Clock };
    }
  };

  const badge = getCategoryBadge();
  const Icon = badge.icon;

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-paper-dim/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
          style={{ backgroundColor: color + '20' }}
        >
          <Icon size={15} style={{ color }} />
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${badge.bg}`}>
              {badge.label}
            </span>
            {member && (
              <span className="text-[10px] font-bold bg-paper-dim px-2 py-0.5 rounded-full text-ink-muted flex items-center gap-1">
                <User size={10} className="text-gold" /> {member.name}
              </span>
            )}
          </div>
          <p className="text-xs text-ink font-bold truncate">{reminder.title}</p>
          <p className="text-[10px] text-ink-muted">
            तारीख: <strong className="font-mono text-ink">{reminder.due_date}</strong>
            {reminder.amount && reminder.amount > 0 && (
              <span> • राशि: <strong className="font-mono text-ink font-bold">₹{Number(reminder.amount).toLocaleString('en-IN')}</strong></span>
            )}
          </p>
        </div>
      </div>

      <div className="text-right shrink-0">
        <span
          className="text-xs font-bold px-2 py-1 rounded-lg block font-mono"
          style={{ color, backgroundColor: color + '15' }}
        >
          {dueInfo.text}
        </span>
      </div>
    </div>
  );
}
