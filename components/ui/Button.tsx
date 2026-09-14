'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none font-sans';
  
  const variants = {
    primary: 'bg-navy text-paper hover:bg-navy-light shadow-sm',
    secondary: 'bg-paper-dim text-ink hover:bg-paper-dark',
    outline: 'border border-paper-dim bg-paper text-ink hover:bg-paper-dim',
    ghost: 'text-ink-muted hover:text-ink hover:bg-paper-dim/60',
    danger: 'bg-coral text-white hover:opacity-90',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
