'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

export function Chip({ active, children, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'text-xs px-3 py-1.5 rounded-full mr-2 whitespace-nowrap transition-all duration-200 font-sans font-medium',
        active
          ? 'bg-navy text-paper shadow-sm'
          : 'bg-paper-dim text-ink-muted hover:bg-paper-dark hover:text-ink',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
