import React from 'react';
import { Member } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { ChevronRight, Phone, Edit2, Trash2 } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onClick?: () => void;
  onEdit?: (m: Member) => void;
  onDelete?: (m: Member) => void;
}

export function MemberCard({ member, onClick, onEdit, onDelete }: MemberCardProps) {
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

      {/* Action Buttons: Edit & Delete */}
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(member)}
            className="w-8 h-8 rounded-lg bg-paper-dim hover:bg-gold/20 hover:text-gold text-ink-muted flex items-center justify-center transition-all"
            title="Edit Sadasya"
          >
            <Edit2 size={14} />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(member)}
            className="w-8 h-8 rounded-lg bg-paper-dim hover:bg-rose-100 hover:text-rose-600 text-ink-muted flex items-center justify-center transition-all"
            title="Sadasya Hatayein"
          >
            <Trash2 size={14} />
          </button>
        )}
        <ChevronRight size={16} className="text-ink-muted group-hover:text-gold transition-colors ml-0.5" />
      </div>
    </div>
  );
}
