import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function ScreenHeader({ title, subtitle, action, className }: ScreenHeaderProps) {
  return (
    <div className={cn('px-5 pt-5 pb-3 flex items-start justify-between', className)}>
      <div>
        <h1 className="text-xl font-semibold text-ink font-serif tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-ink-muted mt-0.5 font-sans">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
