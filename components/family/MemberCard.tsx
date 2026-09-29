import React from 'react';
import { Member } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { ChevronRight, Briefcase, Store, Clock, MapPin, DollarSign } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

interface MemberCardProps {
  member: Member;
  onClick?: () => void;
}

export function MemberCard({ member, onClick }: MemberCardProps) {
  const isBusiness = member.profession_type === 'business';
  const isJob = member.profession_type === 'job';
  const hasProfession = Boolean(member.profession_type || member.designation_or_business_name || member.monthly_income);

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 hover:bg-paper-dim/30 transition-colors cursor-pointer group"
    >
      <Avatar m={member} size={40} />
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-ink truncate">{member.name}</p>
          {member.role === 'owner' && (
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-gold/15 text-gold-dark border border-gold/30">
              मुखिया (Owner)
            </span>
          )}
        </div>

        <p className="text-[11px] text-ink-muted">
          {member.relationship ? `${member.relationship} • ${member.phone || 'फ़ोन नंबर उपलब्ध'}` : 'पारिवारिक सदस्य'}
        </p>

        {/* Profession & Work Profile Strip if exists */}
        {hasProfession ? (
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px]">
            <span className={`px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
              isBusiness 
                ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                : isJob
                ? 'bg-blue-500/15 text-blue-800 dark:text-blue-300 border border-blue-500/30'
                : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
            }`}>
              {isBusiness ? <Store size={11} /> : <Briefcase size={11} />}
              <span>{member.designation_or_business_name || (isBusiness ? 'व्यापार' : isJob ? 'नौकरी' : 'पेशेवर')}</span>
            </span>

            {member.monthly_income && member.monthly_income > 0 && (
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                ₹{member.monthly_income.toLocaleString('en-IN')}/माह
              </span>
            )}

            {member.work_timings && (
              <span className="text-ink-muted flex items-center gap-1">
                <Clock size={10} /> {member.work_timings}
              </span>
            )}
          </div>
        ) : (
          <span className="text-[10px] text-gold-dark hover:underline block pt-0.5">
            + पेशा, नौकरी/दुकान समय व आय विवरण जोड़ें →
          </span>
        )}
      </div>

      <ChevronRight size={16} className="text-ink-muted group-hover:text-ink transition-colors shrink-0" />
    </div>
  );
}
