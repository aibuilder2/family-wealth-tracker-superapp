import React from 'react';
import { cn } from '@/lib/utils/cn';

interface MonoProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function Mono({ children, className, style, ...props }: MonoProps) {
  return (
    <span
      className={cn('font-mono tabular-nums', className)}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontVariantNumeric: 'tabular-nums',
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
