import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'paper' | 'navy' | 'gold';
}

export function Card({ children, className, variant = 'paper', ...props }: CardProps) {
  const variantStyles = {
    paper: 'bg-paper border border-paper-dim text-ink shadow-sm',
    navy: 'bg-navy text-paper shadow-md',
    gold: 'bg-gold-soft/10 border border-gold/30 text-ink shadow-sm',
  };

  return (
    <div
      className={cn('rounded-xl p-4 transition-all', variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
