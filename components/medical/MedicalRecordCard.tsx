import React from 'react';
import { MedicalRecord } from '@/types';
import { HeartPulse, Clock } from 'lucide-react';

interface MedicalRecordCardProps {
  record: MedicalRecord;
}

export function MedicalRecordCard({ record }: MedicalRecordCardProps) {
  return (
    <div className="rounded-xl p-4 bg-paper border border-paper-dim shadow-sm space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartPulse size={16} className="text-coral" />
          <h3 className="text-sm font-semibold text-ink">{record.member_name}</h3>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-coral/15 text-coral">
          {record.blood_group}
        </span>
      </div>

      <div className="text-xs space-y-1">
        <p className="text-ink-muted">
          <span className="font-medium text-ink">Condition: </span>
          {record.condition}
        </p>
        <p className="text-ink-muted flex items-start gap-1">
          <Clock size={13} className="text-gold mt-0.5 shrink-0" />
          <span>
            <strong className="text-ink">{record.medicine_name}</strong> — {record.medicine_time}
          </span>
        </p>
        {record.notes && (
          <p className="text-ink-muted text-[11px] bg-paper-dim/50 p-2 rounded-lg mt-1">
            {record.notes}
          </p>
        )}
      </div>
    </div>
  );
}
