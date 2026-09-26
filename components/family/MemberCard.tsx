import React from 'react';
import { Member } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { ChevronRight } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onClick?: () => void;
}

export function MemberCard({ member, onClick }: MemberCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 hover:bg-paper-dim/30 transition-colors cursor-pointer group"
    >
      <Avatar m={member} size={36} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink truncate">{member.name}</p>
        <p className="text-[11px] text-ink-muted">
          {member.relationship ? `${member.relationship} • ${member.role === 'owner' ? 'Mukhiya' : 'Sadasya'}` : (member.role === 'owner' ? 'Owner / Admin' : 'Family Member')}
        </p>
      </div>
      <ChevronRight size={16} className="text-ink-muted group-hover:text-ink transition-colors" />
    </div>
  );
}
