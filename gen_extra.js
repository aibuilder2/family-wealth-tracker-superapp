const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
  console.log('Wrote:', relPath);
}

// 1. app/(auth)/login/page.tsx
save('app/(auth)/login/page.tsx', `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#E7E1D2]">
      <div className="w-full max-w-sm bg-paper p-6 rounded-3xl border border-paper-dim shadow-xl text-center space-y-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink">Sharma Parivar</h1>
          <p className="text-xs text-ink-muted mt-1">Family Wealth App me Login karein</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">
              Mobile Number ya Email
            </label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
              required
            />
          </div>

          <Button type="submit" className="w-full py-2.5 bg-navy text-paper font-semibold">
            Login Karein
          </Button>
        </form>

        <p className="text-xs text-ink-muted">
          Naya parivar banayein?{' '}
          <Link href="/signup" className="text-gold font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
`);

// 2. app/(auth)/signup/page.tsx
save('app/(auth)/signup/page.tsx', `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function SignupPage() {
  const [familyName, setFamilyName] = useState('');
  const [adminName, setAdminName] = useState('');
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#E7E1D2]">
      <div className="w-full max-w-sm bg-paper p-6 rounded-3xl border border-paper-dim shadow-xl text-center space-y-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink">Naya Parivar Shuru Karein</h1>
          <p className="text-xs text-ink-muted mt-1">Apne parivar ka wealth vault banayein</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">
              Parivar Ka Naam (Family Name)
            </label>
            <input
              type="text"
              placeholder="e.g. Sharma Parivar, Verma Family"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">
              Aapka Naam (Admin/Head)
            </label>
            <input
              type="text"
              placeholder="e.g. Rajesh Sharma"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
              required
            />
          </div>

          <Button type="submit" className="w-full py-2.5 bg-navy text-paper font-semibold">
            Parivar Banayein
          </Button>
        </form>

        <p className="text-xs text-ink-muted">
          Pehle se account hai?{' '}
          <Link href="/login" className="text-gold font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
`);

// 3. app/(auth)/invite/[code]/page.tsx
save('app/(auth)/invite/[code]/page.tsx', `'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#E7E1D2]">
      <div className="w-full max-w-sm bg-paper p-6 rounded-3xl border border-paper-dim shadow-xl text-center space-y-5">
        <div>
          <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">Family Invite</span>
          <h1 className="text-2xl font-serif font-bold text-ink mt-1">Sharma Parivar</h1>
          <p className="text-xs text-ink-muted mt-1">Aapko is parivar me judne ka nyota mila hai</p>
        </div>

        <div className="p-3 bg-paper-dim rounded-xl font-mono text-sm font-bold text-ink">
          Code: {params?.code || 'SHARMA77'}
        </div>

        <Button onClick={() => router.push('/home')} className="w-full py-2.5 bg-navy text-paper font-semibold">
          Parivar Me Judein (Join Family)
        </Button>
      </div>
    </div>
  );
}
`);

// 4. app/(dashboard)/analytics/page.tsx
save('app/(dashboard)/analytics/page.tsx', `'use client';

import React from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Mono } from '@/components/ui/Mono';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AnalyticsPage() {
  const { totalIncomeThisMonth, totalExpenseThisMonth, totalUdharGiven } = useFamilyStore();

  const monthlyComparison = [
    { month: 'Jun', income: 78000, expense: 52000 },
    { month: 'Jul', income: 82000, expense: 61000 },
    { month: 'Aug', income: totalIncomeThisMonth || 85000, expense: totalExpenseThisMonth || 58200 },
  ];

  const categoryBreakdown = [
    { cat: 'Ghar kharch', amt: 22000, color: '#10263A' },
    { cat: 'Bahar kharch', amt: 14200, color: '#B98B2A' },
    { cat: 'Education', amt: 12000, color: '#3E6E8E' },
    { cat: 'Shopping & Fuel', amt: 10000, color: '#C1502E' },
  ];

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Analytics & Trends"
        subtitle="Income vs Expense graph aur kharch analysis"
      />

      {/* Monthly Bar Chart */}
      <div className="px-4">
        <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm">
          <h3 className="text-xs font-semibold text-ink mb-3 font-serif">Income vs Expense (Pichle 3 Mahine)</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#6B7A80" fontSize={11} />
                <YAxis stroke="#6B7A80" fontSize={10} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#FBF8F2', borderRadius: '10px', border: '1px solid #E9E2D0', fontSize: '11px' }}
                />
                <Bar dataKey="income" fill="#4C7A5E" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#C1502E" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2 text-xs">
            <span className="flex items-center gap-1 text-green font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#4C7A5E] inline-block" /> Income
            </span>
            <span className="flex items-center gap-1 text-coral font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#C1502E] inline-block" /> Expense
            </span>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="px-4">
        <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-3">
          <h3 className="text-xs font-semibold text-ink font-serif">Category-wise Kharch</h3>
          {categoryBreakdown.map((c) => (
            <div key={c.cat} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-ink">{c.cat}</span>
                <Mono className="text-ink font-semibold">₹{c.amt.toLocaleString('en-IN')}</Mono>
              </div>
              <div className="h-1.5 rounded-full bg-paper-dim overflow-hidden">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${(c.amt / 58200) * 100}%`, backgroundColor: c.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`);

// 5. app/(dashboard)/settings/page.tsx
save('app/(dashboard)/settings/page.tsx', `'use client';

import React from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Database, Shield, Users, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const { family, members } = useFamilyStore();

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Settings"
        subtitle="Parivar profile aur configuration"
      />

      <div className="px-4 space-y-3">
        <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-3">
          <div>
            <span className="text-[10px] font-bold text-ink-muted uppercase">Family Name</span>
            <p className="text-base font-semibold text-ink font-serif">{family.name}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-ink-muted uppercase">Invite Code</span>
            <p className="font-mono text-sm font-bold text-gold">{family.invite_code}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-ink-muted uppercase">Total Members</span>
            <p className="text-sm text-ink">{members.length} members connected</p>
          </div>
        </div>

        {/* Database Status */}
        <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm flex items-start gap-3">
          <Database size={18} className="text-gold shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-ink">Supabase Postgres & RLS</h4>
            <p className="text-[11px] text-ink-muted mt-0.5">
              Live schema with secure Row Level Security enabled for sensitive medical and document data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
`);

// 6. API Route Handlers
save('app/api/transactions/route.ts', `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Transactions API ready' });
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ status: 'success', data: body });
}
`);

save('app/api/assets/route.ts', `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Assets API ready' });
}
`);

save('app/api/goals/route.ts', `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Goals API ready' });
}
`);

save('app/api/documents/route.ts', `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Documents API ready' });
}
`);

save('app/api/reminders/route.ts', `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Reminders API ready' });
}
`);

save('app/api/reminders/cron/route.ts', `import { NextResponse } from 'next/server';

export async function GET() {
  // Vercel Cron trigger for checking due reminders
  return NextResponse.json({ status: 'checked', timestamp: new Date().toISOString() });
}
`);

save('app/api/medical/route.ts', `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Medical Records API ready (RLS protected)' });
}
`);

save('app/api/advisor/route.ts', `import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  return NextResponse.json({
    status: 'success',
    suggestions: [
      { type: 'savings', message: 'Monthly savings can be improved by 8%' },
    ]
  });
}
`);
