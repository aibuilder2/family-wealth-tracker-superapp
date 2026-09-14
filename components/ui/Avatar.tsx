'use client';

import React from 'react';
import { Member } from '@/types';
import { cn } from '@/lib/utils/cn';

interface AvatarProps {
  m?: Partial<Member> | null;
  name?: string;
  color?: string;
  init?: string;
  size?: number;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Avatar({
  m,
  name,
  color,
  init,
  size = 32,
  isSelected = false,
  onClick,
  className,
}: AvatarProps) {
  const displayName = name || m?.name || 'Member';
  const displayColor = color || m?.color || '#B98B2A';
  const displayInit = init || m?.initials || displayName.slice(0, 2);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 select-none relative',
        isSelected && 'ring-2 ring-gold ring-offset-2 ring-offset-paper-dim',
        onClick && 'cursor-pointer hover:opacity-90',
        className
      )}
      style={{
        width: size,
        height: size,
        background: displayColor,
        color: '#FFFFFF',
        fontSize: Math.round(size * 0.38),
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
      }}
      title={displayName}
    >
      {displayInit}
    </button>
  );
}
