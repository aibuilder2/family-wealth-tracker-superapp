import React from 'react';
import { Reminder } from '@/types';
import { Clock } from 'lucide-react';
import { formatDueDays } from '@/lib/utils/dateHelpers';

interface ReminderCardProps {
  reminder: Reminder;
}

export function ReminderCard({ reminder }: ReminderCardProps) {
  const dueInfo = formatDueDays(reminder.due_date);
  const color = dueInfo.isUrgent ? '#C1502E' : dueInfo.isWarning ? '#B98B2A' : '#6B7A80';

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-paper-dim/30 transition-colors">
      <Clock size={16} style={{ color }} className="shrink-0" />
      <p className="text-sm text-ink font-medium flex-1 truncate">{reminder.title}</p>
      <span className="text-[11px] font-medium shrink-0" style={{ color }}>
        {dueInfo.text}
      </span>
    </div>
  );
}
