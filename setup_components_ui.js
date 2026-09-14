const fs = require('fs');
const path = require('path');

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  ensureDirSync(dir);
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log('Created:', filePath);
}

// 1. components/ui/Mono.tsx
writeFile('components/ui/Mono.tsx', `import React from 'react';
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
`);

// 2. components/ui/ProgressRing.tsx
writeFile('components/ui/ProgressRing.tsx', `import React from 'react';

interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  textColor?: string;
}

export function ProgressRing({
  percent = 0,
  size = 88,
  strokeWidth = 7,
  color = '#B98B2A',
  bgColor = '#E9E2D0',
  textColor = '#1B2A33',
}: ProgressRingProps) {
  const boundedPercent = Math.min(100, Math.max(0, percent));
  const r = (size - strokeWidth * 2) / 2;
  const c = 2 * Math.PI * r;
  const strokeDashoffset = c - (boundedPercent / 100) * c;
  const center = size / 2;

  return (
    <svg width={size} height={size} viewBox={\`0 0 \${size} \${size}\`} className="shrink-0 transition-all duration-500">
      {/* Background track */}
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={bgColor}
        strokeWidth={strokeWidth}
      />
      {/* Progress fill */}
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={c}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={\`rotate(-90 \${center} \${center})\`}
        className="transition-all duration-700 ease-out"
      />
      <text
        x={center}
        y={center + size * 0.08}
        textAnchor="middle"
        fontFamily="'IBM Plex Mono', monospace"
        fontSize={size * 0.2}
        fontWeight="600"
        fill={textColor}
      >
        {boundedPercent}%
      </text>
    </svg>
  );
}
`);

// 3. components/ui/Avatar.tsx
writeFile('components/ui/Avatar.tsx', `'use client';

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
`);

// 4. components/ui/Chip.tsx
writeFile('components/ui/Chip.tsx', `'use client';

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
`);

// 5. components/ui/ScreenHeader.tsx
writeFile('components/ui/ScreenHeader.tsx', `import React from 'react';
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
`);

// 6. components/ui/Card.tsx
writeFile('components/ui/Card.tsx', `import React from 'react';
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
`);

// 7. components/ui/Button.tsx
writeFile('components/ui/Button.tsx', `'use client';

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
`);

// 8. components/ui/BottomNav.tsx
writeFile('components/ui/BottomNav.tsx', `'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, PiggyBank, FileText, Users } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export const TABS = [
  { key: 'home', href: '/home', label: 'Home', icon: Home },
  { key: 'money', href: '/money', label: 'Money', icon: Wallet },
  { key: 'wealth', href: '/wealth', label: 'Wealth', icon: PiggyBank },
  { key: 'vault', href: '/vault', label: 'Vault', icon: FileText },
  { key: 'family', href: '/family', label: 'Family', icon: Users },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-around px-2 py-2.5 bg-paper border-t border-paper-dim shrink-0 z-20">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
        const Icon = tab.icon;

        return (
          <Link
            key={tab.key}
            href={tab.href}
            className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all rounded-lg hover:bg-paper-dim/40"
          >
            <Icon
              size={20}
              className={cn(
                'transition-colors',
                isActive ? 'text-gold' : 'text-ink-muted'
              )}
              strokeWidth={isActive ? 2.4 : 2}
            />
            <span
              className={cn(
                'text-[10px] font-medium font-sans transition-colors',
                isActive ? 'text-gold font-semibold' : 'text-ink-muted'
              )}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
`);

console.log('UI Components generated.');
