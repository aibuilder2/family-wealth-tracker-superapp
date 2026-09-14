const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
  console.log('Wrote:', relPath);
}

// 1. app/(dashboard)/home/page.tsx
save('app/(dashboard)/home/page.tsx', `'use client';

import React from 'react';
import Link from 'next/link';
import { useFamilyStore } from '@/lib/store/familyStore';
import { NetWealthCard } from '@/components/wealth/NetWealthCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Mono } from '@/components/ui/Mono';
import { TransactionList } from '@/components/money/TransactionList';
import { ArrowUpRight, ArrowDownRight, ChevronRight, HandCoins } from 'lucide-react';

export default function HomePage() {
  const {
    transactions,
    members,
    goals,
    totalIncomeThisMonth,
    totalExpenseThisMonth,
    totalUdharGiven,
    openQuickAdd,
  } = useFamilyStore();

  const recentTransactions = transactions.slice(0, 4);
  const primaryGoal = goals[0] || {
    title: 'Priya ki Education',
    target_amount: 500000,
    saved_amount: 310000,
  };
  const goalPercent = Math.min(
    100,
    Math.round((primaryGoal.saved_amount / primaryGoal.target_amount) * 100)
  );

  return (
    <div className="space-y-4 pt-4">
      {/* 1. Net Wealth Card */}
      <div className="px-4">
        <NetWealthCard />
      </div>

      {/* 2. Quick Monthly Metrics Grid */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {/* Income Card */}
        <div className="rounded-xl p-4 bg-paper border border-paper-dim shadow-sm">
          <div className="flex items-center gap-1 text-green text-[11px] font-semibold">
            <ArrowUpRight size={14} />
            <span>INCOME</span>
          </div>
          <Mono className="text-[18px] font-semibold text-ink block mt-0.5">
            ₹{totalIncomeThisMonth.toLocaleString('en-IN')}
          </Mono>
          <p className="text-ink-muted text-[11px] mt-0.5">is mahine</p>
        </div>

        {/* Expense Card */}
        <div className="rounded-xl p-4 bg-paper border border-paper-dim shadow-sm">
          <div className="flex items-center gap-1 text-coral text-[11px] font-semibold">
            <ArrowDownRight size={14} />
            <span>EXPENSE</span>
          </div>
          <Mono className="text-[18px] font-semibold text-ink block mt-0.5">
            ₹{totalExpenseThisMonth.toLocaleString('en-IN')}
          </Mono>
          <p className="text-ink-muted text-[11px] mt-0.5">pichle mahine se 6% kam</p>
        </div>
      </div>

      {/* 3. Featured Goal Widget */}
      {primaryGoal && (
        <div className="px-4">
          <div className="rounded-xl p-4 bg-paper border border-paper-dim flex items-center gap-4 shadow-sm">
            <ProgressRing percent={goalPercent} size={80} />
            <div className="flex-1 min-w-0">
              <p className="font-serif font-semibold text-ink text-sm truncate">
                {primaryGoal.title}
              </p>
              <p className="text-xs text-ink-muted mt-0.5">
                Goal: <Mono>₹{primaryGoal.target_amount.toLocaleString('en-IN')}</Mono>
              </p>
              <p className="text-xs text-ink-muted">
                Jama: <Mono className="text-gold font-semibold">₹{primaryGoal.saved_amount.toLocaleString('en-IN')}</Mono>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Udhar Summary Bar if exists */}
      {totalUdharGiven > 0 && (
        <div className="px-4">
          <div className="rounded-xl px-4 py-3 bg-gold/10 border border-gold/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HandCoins size={16} className="text-gold" />
              <div>
                <p className="text-xs font-semibold text-ink">Bahar Udhar Diya Hua Hai</p>
                <p className="text-[11px] text-ink-muted">Wapas lena baaki hai</p>
              </div>
            </div>
            <Mono className="text-xs font-bold text-gold">
              ₹{totalUdharGiven.toLocaleString('en-IN')}
            </Mono>
          </div>
        </div>
      )}

      {/* 5. Recent Activity Feed */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif font-semibold text-ink text-sm">
            Recent Activity
          </h2>
          <Link href="/money" className="text-xs text-gold font-medium hover:underline flex items-center gap-0.5">
            Sab dekho <ChevronRight size={14} />
          </Link>
        </div>

        <TransactionList
          transactions={recentTransactions}
          members={members}
          groupByDate={false}
        />
      </div>
    </div>
  );
}
`);

// 2. app/(dashboard)/money/page.tsx
save('app/(dashboard)/money/page.tsx', `'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Chip } from '@/components/ui/Chip';
import { MemberFilter } from '@/components/money/MemberFilter';
import { TransactionList } from '@/components/money/TransactionList';
import { Plus } from 'lucide-react';

export default function MoneyPage() {
  const { transactions, members, activeMemberId, openQuickAdd } = useFamilyStore();
  const [filterType, setFilterType] = useState<string>('all');

  const filterChips = [
    { key: 'all', label: 'Sab' },
    { key: 'online', label: 'Online' },
    { key: 'offline', label: 'Offline' },
    { key: 'udhar', label: 'Udhar' },
    { key: 'income', label: 'Income' },
  ];

  // Apply filters
  const filtered = transactions.filter((tx) => {
    // 1. Member filter
    if (activeMemberId && tx.member_id !== activeMemberId) {
      return false;
    }

    // 2. Type/Mode filter
    if (filterType === 'all') return true;
    if (filterType === 'online') return tx.mode === 'online';
    if (filterType === 'offline') return tx.mode === 'offline';
    if (filterType === 'udhar') return tx.type === 'udhar_given' || tx.type === 'udhar_taken';
    if (filterType === 'income') return tx.type === 'income';
    return true;
  });

  return (
    <div className="space-y-3">
      <ScreenHeader
        title="Money"
        subtitle="Sab kharch, income aur udhar"
        action={
          <button
            type="button"
            onClick={() => openQuickAdd('expense')}
            className="w-8 h-8 rounded-full bg-navy text-paper flex items-center justify-center shadow hover:bg-navy-light transition-all"
            title="Add Transaction"
          >
            <Plus size={16} />
          </button>
        }
      />

      {/* Filter Chips */}
      <div className="px-4 flex overflow-x-auto pb-1 no-scrollbar">
        {filterChips.map((chip) => (
          <Chip
            key={chip.key}
            active={filterType === chip.key}
            onClick={() => setFilterType(chip.key)}
          >
            {chip.label}
          </Chip>
        ))}
      </div>

      {/* Member Filter Bar */}
      <div className="px-4">
        <MemberFilter />
      </div>

      {/* Grouped Transaction List */}
      <div className="px-4 pt-1">
        <TransactionList
          transactions={filtered}
          members={members}
          groupByDate={true}
          showDelete={true}
        />
      </div>
    </div>
  );
}
`);

// 3. app/(dashboard)/money/add/page.tsx
save('app/(dashboard)/money/add/page.tsx', `'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TransactionForm } from '@/components/money/TransactionForm';

export default function AddTransactionPage() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Naya Entry"
        subtitle="Kharch, income ya udhar enter karein"
      />
      <div className="px-4">
        <div className="bg-paper p-5 rounded-2xl border border-paper-dim shadow-sm">
          <TransactionForm
            onSuccess={() => {
              router.push('/money');
            }}
          />
        </div>
      </div>
    </div>
  );
}
`);

// 4. app/(dashboard)/wealth/page.tsx
save('app/(dashboard)/wealth/page.tsx', `'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { AssetCard } from '@/components/wealth/AssetCard';
import { GoalCard } from '@/components/wealth/GoalCard';
import { Mono } from '@/components/ui/Mono';
import { Plus, PiggyBank, Building2 } from 'lucide-react';

export default function WealthPage() {
  const { assets, goals, totalWealth, liquidWealth, fixedWealth, addGoal, addAsset } = useFamilyStore();
  const [viewTab, setViewTab] = useState<'all' | 'liquid' | 'fixed'>('all');

  const filteredAssets = assets.filter(a => {
    if (viewTab === 'all') return true;
    return a.category === viewTab;
  });

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Wealth"
        subtitle="Saari savings aur assets ek jagah"
      />

      {/* Net Wealth Card */}
      <div className="px-4">
        <div className="rounded-2xl p-5 text-center bg-navy shadow-md text-paper">
          <p className="text-xs text-gold-soft tracking-wider font-mono">NET WEALTH</p>
          <Mono className="text-3xl font-semibold text-paper block mt-0.5">
            ₹{totalWealth.toLocaleString('en-IN')}
          </Mono>
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-navy-light/60">
            <div className="text-center">
              <span className="text-[10px] text-gold-soft uppercase tracking-wider block">Liquid (Cash/Bank)</span>
              <Mono className="text-sm font-semibold text-paper">
                ₹{liquidWealth.toLocaleString('en-IN')}
              </Mono>
            </div>
            <div className="text-center border-l border-navy-light/60">
              <span className="text-[10px] text-gold-soft uppercase tracking-wider block">Fixed (Land/Gold)</span>
              <Mono className="text-sm font-semibold text-paper">
                ₹{fixedWealth.toLocaleString('en-IN')}
              </Mono>
            </div>
          </div>
        </div>
      </div>

      {/* Asset category tabs */}
      <div className="px-4 flex gap-2">
        <button
          onClick={() => setViewTab('all')}
          className={\`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all \${
            viewTab === 'all' ? 'bg-navy text-paper' : 'bg-paper-dim text-ink-muted'
          }\`}
        >
          Sab Assets
        </button>
        <button
          onClick={() => setViewTab('liquid')}
          className={\`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all \${
            viewTab === 'liquid' ? 'bg-navy text-paper' : 'bg-paper-dim text-ink-muted'
          }\`}
        >
          Liquid (₹{(liquidWealth/100000).toFixed(1)}L)
        </button>
        <button
          onClick={() => setViewTab('fixed')}
          className={\`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all \${
            viewTab === 'fixed' ? 'bg-navy text-paper' : 'bg-paper-dim text-ink-muted'
          }\`}
        >
          Fixed (₹{(fixedWealth/100000).toFixed(1)}L)
        </button>
      </div>

      {/* Assets Grid */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {filteredAssets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>

      {/* Goals Section */}
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif font-semibold text-ink text-sm">
            Family Financial Goals
          </h2>
        </div>

        <div className="rounded-xl bg-paper border border-paper-dim divide-y divide-paper-dim overflow-hidden shadow-sm">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>
    </div>
  );
}
`);

// 5. app/(dashboard)/vault/page.tsx
save('app/(dashboard)/vault/page.tsx', `'use client';

import React from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { DocumentCard } from '@/components/vault/DocumentCard';
import { ReminderCard } from '@/components/reminders/ReminderCard';
import { Upload, Plus } from 'lucide-react';

export default function VaultPage() {
  const { documents, reminders } = useFamilyStore();

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Vault"
        subtitle="Documents aur reminders"
      />

      {/* Stored Documents */}
      <div className="px-4">
        <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim shadow-sm">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      </div>

      {/* Upcoming Reminders Section */}
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif font-semibold text-ink text-sm">
            Upcoming Reminders
          </h2>
        </div>

        <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim shadow-sm">
          {reminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </div>
      </div>
    </div>
  );
}
`);

// 6. app/(dashboard)/family/page.tsx
save('app/(dashboard)/family/page.tsx', `'use client';

import React from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { MemberCard } from '@/components/family/MemberCard';
import { FamilyTreeView } from '@/components/family/FamilyTreeView';
import Link from 'next/link';
import { HeartPulse, Key, Sparkles, Plus } from 'lucide-react';

export default function FamilyPage() {
  const { family, members } = useFamilyStore();

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Family"
        subtitle="Parivar ke sabhi members"
      />

      {/* Member List */}
      <div className="px-4">
        <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim shadow-sm">
          {members.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </div>

      {/* Family Tree Link */}
      <div className="px-4">
        <FamilyTreeView />
      </div>

      {/* Quick Links to Medical & AI Advisor */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <Link
          href="/medical"
          className="p-4 rounded-xl bg-paper border border-paper-dim hover:border-coral/40 transition-all shadow-sm block"
        >
          <HeartPulse size={20} className="text-coral mb-1.5" />
          <h3 className="text-sm font-semibold text-ink">Medical Records</h3>
          <p className="text-[11px] text-ink-muted mt-0.5">Dawaiyan aur blood group</p>
        </Link>

        <Link
          href="/advisor"
          className="p-4 rounded-xl bg-paper border border-paper-dim hover:border-gold/40 transition-all shadow-sm block"
        >
          <Sparkles size={20} className="text-gold mb-1.5" />
          <h3 className="text-sm font-semibold text-ink">AI Advisor</h3>
          <p className="text-[11px] text-ink-muted mt-0.5">Bachat & investment advice</p>
        </Link>
      </div>

      {/* Invite Code Box */}
      <div className="px-4">
        <div className="p-4 rounded-xl bg-paper-dim/80 border border-paper-dim flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">Family Invite Code</span>
            <p className="font-mono font-bold text-sm text-ink">{family.invite_code}</p>
          </div>
          <span className="text-xs text-gold font-medium bg-gold/10 px-2.5 py-1 rounded-lg">
            Share Code
          </span>
        </div>
      </div>
    </div>
  );
}
`);

// 7. app/(dashboard)/family/tree/page.tsx
save('app/(dashboard)/family/tree/page.tsx', `'use client';

import React from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Avatar } from '@/components/ui/Avatar';
import { useFamilyStore } from '@/lib/store/familyStore';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function FamilyTreePage() {
  const { members } = useFamilyStore();

  return (
    <div className="space-y-4">
      <div className="px-4 pt-4">
        <Link href="/family" className="text-xs text-ink-muted hover:text-ink flex items-center gap-1 font-medium">
          <ChevronLeft size={16} /> Family par wapas jayein
        </Link>
      </div>

      <ScreenHeader
        title="Family Tree (Vansh)"
        subtitle="Puri peedhi ka record aur photos"
      />

      <div className="px-4">
        <div className="p-6 bg-paper rounded-2xl border border-paper-dim shadow-sm flex flex-col items-center space-y-6 text-center">
          
          {/* Generation 1: Parents */}
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center">
              <Avatar m={members[0]} size={48} />
              <span className="text-xs font-semibold text-ink mt-1.5">{members[0]?.name}</span>
              <span className="text-[10px] text-ink-muted">Pita (Head)</span>
            </div>

            <div className="text-ink-muted font-bold">♥</div>

            <div className="flex flex-col items-center">
              <Avatar m={members[1]} size={48} />
              <span className="text-xs font-semibold text-ink mt-1.5">{members[1]?.name}</span>
              <span className="text-[10px] text-ink-muted">Mata</span>
            </div>
          </div>

          {/* Tree Line Connector */}
          <div className="w-0.5 h-6 bg-gold/40" />

          {/* Generation 2: Children */}
          <div className="flex items-center gap-10">
            <div className="flex flex-col items-center">
              <Avatar m={members[2]} size={44} />
              <span className="text-xs font-semibold text-ink mt-1.5">{members[2]?.name}</span>
              <span className="text-[10px] text-ink-muted">Beta</span>
            </div>

            <div className="flex flex-col items-center">
              <Avatar m={members[3]} size={44} />
              <span className="text-xs font-semibold text-ink mt-1.5">{members[3]?.name}</span>
              <span className="text-[10px] text-ink-muted">Beti</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
`);

// 8. app/(dashboard)/medical/page.tsx
save('app/(dashboard)/medical/page.tsx', `'use client';

import React from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { MedicalRecordCard } from '@/components/medical/MedicalRecordCard';
import { ShieldAlert } from 'lucide-react';

export default function MedicalPage() {
  const { medicalRecords } = useFamilyStore();

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Medical Records"
        subtitle="Emergency me dawaiyan aur blood group"
      />

      <div className="px-4">
        <div className="p-3 bg-coral/10 border border-coral/20 rounded-xl flex items-start gap-2 text-xs text-coral">
          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
          <span>
            Emergency data: Parivar ka koi bhi sadasya kisi ki bhi zaroori dawai aur blood group yahan se dekh sakta hai.
          </span>
        </div>
      </div>

      <div className="px-4 space-y-3">
        {medicalRecords.map((rec) => (
          <MedicalRecordCard key={rec.id} record={rec} />
        ))}
      </div>
    </div>
  );
}
`);

// 9. app/(dashboard)/advisor/page.tsx
save('app/(dashboard)/advisor/page.tsx', `'use client';

import React from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Sparkles, TrendingUp, ShieldCheck, Lightbulb } from 'lucide-react';

export default function AdvisorPage() {
  const insights = [
    {
      title: "Priya ki Education Goal",
      desc: "Aapka education goal 62% pura ho gaya hai. Agle 6 mahine me ₹31,000/month save karke aap target date se pehle reach kar lenge.",
      tag: "Goal Strategy",
      color: "gold",
    },
    {
      title: "Bank FD vs Equity Split",
      desc: "Aapka 55% fixed wealth aur 45% liquid wealth me hai, jo ek balanced family portfolio ke liye ideal hai.",
      tag: "Asset Allocation",
      color: "green",
    },
    {
      title: "Car Insurance Renewal",
      desc: "Car insurance 12 din me due hai. Pehle se renew karne par NCB (No Claim Bonus) protect rahega.",
      tag: "Reminder Alert",
      color: "coral",
    }
  ];

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="AI Financial Advisor"
        subtitle="Aapke parivar ke data par based smart insights"
      />

      <div className="px-4 space-y-3">
        {insights.map((item, i) => (
          <div key={i} className="p-4 rounded-xl bg-paper border border-paper-dim shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold px-2 py-0.5 bg-gold/10 rounded-md">
                {item.tag}
              </span>
              <Sparkles size={14} className="text-gold" />
            </div>
            <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
            <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
`);

// 10. app/(dashboard)/reminders/page.tsx
save('app/(dashboard)/reminders/page.tsx', `'use client';

import React from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ReminderCard } from '@/components/reminders/ReminderCard';

export default function RemindersPage() {
  const { reminders } = useFamilyStore();

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Reminders"
        subtitle="Insurance, service aur appointments"
      />

      <div className="px-4">
        <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim shadow-sm">
          {reminders.map((r) => (
            <ReminderCard key={r.id} reminder={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
`);
