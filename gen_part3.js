const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
  console.log('Wrote:', relPath);
}

// 1. components/wealth/NetWealthCard.tsx
save('components/wealth/NetWealthCard.tsx', `'use client';

import React from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Mono } from '@/components/ui/Mono';
import { ArrowUpRight, Plus } from 'lucide-react';

export function NetWealthCard() {
  const { totalWealth, openQuickAdd } = useFamilyStore();

  return (
    <div className="rounded-2xl p-5 bg-navy shadow-md text-paper">
      <p className="text-xs text-gold-soft font-medium tracking-wide">
        TOTAL FAMILY WEALTH
      </p>
      <Mono className="text-3xl font-semibold text-paper block mt-0.5">
        ₹{totalWealth.toLocaleString('en-IN')}
      </Mono>
      <div className="flex items-center gap-1 mt-1">
        <ArrowUpRight size={14} className="text-gold-soft" />
        <span className="text-xs text-gold-soft">₹18,400 is mahine</span>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => openQuickAdd('expense')}
          className="flex-1 rounded-xl py-2 text-xs flex items-center justify-center gap-1 bg-white/10 text-paper hover:bg-white/15 active:scale-95 transition-all font-sans font-medium"
        >
          <Plus size={12} /> Expense
        </button>

        <button
          type="button"
          onClick={() => openQuickAdd('income')}
          className="flex-1 rounded-xl py-2 text-xs flex items-center justify-center gap-1 bg-white/10 text-paper hover:bg-white/15 active:scale-95 transition-all font-sans font-medium"
        >
          <Plus size={12} /> Income
        </button>

        <button
          type="button"
          onClick={() => openQuickAdd('udhar')}
          className="flex-1 rounded-xl py-2 text-xs flex items-center justify-center gap-1 bg-white/10 text-paper hover:bg-white/15 active:scale-95 transition-all font-sans font-medium"
        >
          <Plus size={12} /> Udhar
        </button>
      </div>
    </div>
  );
}
`);

// 2. components/wealth/AssetCard.tsx
save('components/wealth/AssetCard.tsx', `import React from 'react';
import { Asset } from '@/types';
import { Mono } from '@/components/ui/Mono';
import { Landmark, Coins, Sprout, Home, Car, Shield } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
  const getIcon = () => {
    switch (asset.type) {
      case 'bank_deposit': return Landmark;
      case 'gold':
      case 'silver': return Coins;
      case 'shares':
      case 'mutual_funds': return Sprout;
      case 'land':
      case 'property': return Home;
      case 'vehicle': return Car;
      default: return Shield;
    }
  };

  const Icon = getIcon();
  const color = asset.color || '#B98B2A';

  return (
    <div className="rounded-xl p-4 bg-paper border border-paper-dim shadow-sm">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
        style={{ backgroundColor: color + '22' }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <p className="text-[11px] text-ink-muted">{asset.label}</p>
      <Mono className="text-[15px] font-semibold text-ink block mt-0.5">
        ₹{Number(asset.value).toLocaleString('en-IN')}
      </Mono>
    </div>
  );
}
`);

// 3. components/wealth/GoalCard.tsx
save('components/wealth/GoalCard.tsx', `import React from 'react';
import { Goal } from '@/types';
import { Mono } from '@/components/ui/Mono';

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const pct = Math.min(100, Math.round((goal.saved_amount / goal.target_amount) * 100)) || 0;

  return (
    <div className="px-4 py-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-ink font-medium">{goal.title}</span>
        <Mono className="text-xs text-gold font-semibold">{pct}%</Mono>
      </div>
      <div className="h-1.5 rounded-full bg-paper-dim overflow-hidden mb-1">
        <div
          className="h-1.5 rounded-full bg-gold transition-all duration-700"
          style={{ width: \`\${pct}%\` }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-ink-muted">
        <span>Jama: <Mono>₹{goal.saved_amount.toLocaleString('en-IN')}</Mono></span>
        <span>Goal: <Mono>₹{goal.target_amount.toLocaleString('en-IN')}</Mono></span>
      </div>
    </div>
  );
}
`);

// 4. components/vault/DocumentCard.tsx
save('components/vault/DocumentCard.tsx', `import React from 'react';
import { DocumentItem } from '@/types';
import { Car, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DocumentCardProps {
  doc: DocumentItem;
}

export function DocumentCard({ doc }: DocumentCardProps) {
  const getIcon = () => {
    switch (doc.category) {
      case 'vehicle': return Car;
      case 'insurance': return ShieldCheck;
      default: return FileText;
    }
  };

  const Icon = getIcon();

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-paper-dim/30 transition-colors cursor-pointer group">
      <div
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
          doc.alert ? 'bg-coral/15 text-coral' : 'bg-paper-dim text-navy'
        )}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink font-medium truncate">{doc.title}</p>
        <p
          className={cn(
            'text-[11px]',
            doc.alert ? 'text-coral font-medium' : 'text-ink-muted'
          )}
        >
          {doc.notes || 'Valid'}
        </p>
      </div>
      <ChevronRight size={16} className="text-ink-muted group-hover:text-ink transition-colors" />
    </div>
  );
}
`);

// 5. components/reminders/ReminderCard.tsx
save('components/reminders/ReminderCard.tsx', `import React from 'react';
import { Reminder } from '@/types';
import { Clock } from 'lucide-react';
import { formatDueDays } from '@/lib/utils/dateHelpers';

interface ReminderCardProps {
  reminder: Reminder;
}

export function ReminderCard({ reminder }: ReminderCardProps) {
  const dueInfo = formatDueDays(reminder.due_date);
  const color = dueInfo.isUrgent ? '#C1502E' : dueInfo.isWarning ? '#B98B2A' : '#6B7A80';

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-paper-dim/30 transition-colors">
      <Clock size={16} style={{ color }} className="shrink-0" />
      <p className="text-sm text-ink font-medium flex-1 truncate">{reminder.title}</p>
      <span className="text-[11px] font-medium shrink-0" style={{ color }}>
        {dueInfo.text}
      </span>
    </div>
  );
}
`);

// 6. components/family/MemberCard.tsx
save('components/family/MemberCard.tsx', `import React from 'react';
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
        <p className="text-[11px] text-ink-muted capitalize">
          {member.role === 'owner' ? 'Owner / Admin' : 'Family Member'}
        </p>
      </div>
      <ChevronRight size={16} className="text-ink-muted group-hover:text-ink transition-colors" />
    </div>
  );
}
`);

// 7. components/family/FamilyTreeView.tsx
save('components/family/FamilyTreeView.tsx', `import React from 'react';
import { Users } from 'lucide-react';
import Link from 'next/link';

export function FamilyTreeView() {
  return (
    <Link
      href="/family/tree"
      className="block rounded-xl px-4 py-3.5 bg-navy-light text-paper hover:bg-navy-light/90 transition-all shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
          <Users size={18} className="text-gold-soft" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-paper">Family Tree (Vansh Rekha)</p>
          <p className="text-[11px] text-gold-soft">Coming soon — vansh ka poora record</p>
        </div>
      </div>
    </Link>
  );
}
`);

// 8. components/medical/MedicalRecordCard.tsx
save('components/medical/MedicalRecordCard.tsx', `import React from 'react';
import { MedicalRecord } from '@/types';
import { HeartPulse, Clock } from 'lucide-react';

interface MedicalRecordCardProps {
  record: MedicalRecord;
}

export function MedicalRecordCard({ record }: MedicalRecordCardProps) {
  return (
    <div className="rounded-xl p-4 bg-paper border border-paper-dim shadow-sm space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartPulse size={16} className="text-coral" />
          <h3 className="text-sm font-semibold text-ink">{record.member_name}</h3>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-coral/15 text-coral">
          {record.blood_group}
        </span>
      </div>

      <div className="text-xs space-y-1">
        <p className="text-ink-muted">
          <span className="font-medium text-ink">Condition: </span>
          {record.condition}
        </p>
        <p className="text-ink-muted flex items-start gap-1">
          <Clock size={13} className="text-gold mt-0.5 shrink-0" />
          <span>
            <strong className="text-ink">{record.medicine_name}</strong> — {record.medicine_time}
          </span>
        </p>
        {record.notes && (
          <p className="text-ink-muted text-[11px] bg-paper-dim/50 p-2 rounded-lg mt-1">
            {record.notes}
          </p>
        )}
      </div>
    </div>
  );
}
`);
