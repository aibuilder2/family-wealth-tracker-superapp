import React from 'react';
import { Member } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { ChevronRight, Phone } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onClick?: () => void;
}

export function MemberCard({ member, onClick }: MemberCardProps) {
  const isMukhiya = member.role === 'owner' || (member.relationship && member.relationship.toLowerCase().includes('mukhiya'));

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-paper-dim/40 transition-all cursor-pointer group"
    >
      <div className="relative">
        <Avatar m={member} size={42} />
        {isMukhiya && (
          <span className="absolute -top-1 -right-1 text-[11px] bg-amber-400 text-ink-dark rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
            👑
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-ink truncate">{member.name}</p>
          {isMukhiya && (
            <span className="text-[10px] font-semibold bg-gold/15 text-gold-dark px-1.5 py-0.2 rounded border border-gold/30">
              Mukhiya
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-medium text-ink-muted">
            {member.relationship || (member.role === 'owner' ? 'Mukhiya (Self)' : 'Family Member')}
          </span>
          {member.phone && (
            <span className="text-[11px] text-ink-muted/80 flex items-center gap-0.5">
              • <Phone size={10} className="inline ml-0.5" /> {member.phone}
            </span>
          )}
        </div>
      </div>

      <ChevronRight size={16} className="text-ink-muted group-hover:text-gold transition-colors" />
    </div>
  );
}
