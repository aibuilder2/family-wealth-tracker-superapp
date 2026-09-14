const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
  console.log('Wrote:', relPath);
}

// 1. app/globals.css
save('app/globals.css', `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-fraunces: 'Fraunces', serif;
  --font-inter: 'Inter', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
}

body {
  background-color: #E7E1D2;
  color: #1B2A33;
  font-family: var(--font-inter), sans-serif;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
`);

// 2. app/layout.tsx
save('app/layout.tsx', `import type { Metadata } from 'next';
import './globals.css';
import { FamilyProvider } from '@/lib/store/familyStore';

export const metadata: Metadata = {
  title: 'Family Wealth App — Parivar Finance & Vault',
  description: 'Single app to track family wealth, expenses, udhar, documents, and medical history.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body className="min-h-screen bg-[#E7E1D2] antialiased">
        <FamilyProvider>
          {children}
        </FamilyProvider>
      </body>
    </html>
  );
}
`);

// 3. app/page.tsx
save('app/page.tsx', `import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/home');
}
`);

// 4. app/(dashboard)/layout.tsx
save('app/(dashboard)/layout.tsx', `'use client';

import React from 'react';
import { Bell, Shield } from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';
import { AddTransactionModal } from '@/components/money/AddTransactionModal';
import { useFamilyStore } from '@/lib/store/familyStore';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { family, reminders } = useFamilyStore();
  const upcomingCount = reminders.length;

  return (
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-6 bg-[#E7E1D2]">
      {/* Mobile Device Frame Mockup */}
      <div className="w-full sm:max-w-[430px] h-screen sm:h-[840px] bg-navy sm:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col sm:border-[8px] sm:border-[#0B1B28] relative">
        
        {/* Top Family Header */}
        <header className="flex items-center justify-between px-5 pt-4 pb-3 bg-navy text-paper shrink-0 z-10 border-b border-navy-light/40">
          <div>
            <Link href="/home" className="flex items-center gap-1.5">
              <span className="text-base font-semibold font-serif tracking-tight text-paper hover:text-gold-soft transition-colors">
                {family.name}
              </span>
            </Link>
            <p className="text-[10px] text-gold-soft font-mono tracking-wider">
              PARIVAR WEALTH VAULT
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/reminders"
              className="relative w-8 h-8 rounded-full flex items-center justify-center bg-navy-light text-gold-soft hover:bg-navy-light/80 transition-colors"
              title="Reminders"
            >
              <Bell size={15} />
              {upcomingCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-coral text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                  {upcomingCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Dynamic Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-[#EFEAE0] no-scrollbar pb-6">
          {children}
        </main>

        {/* Persistent Bottom Nav */}
        <BottomNav />

        {/* Global Quick Add Popup */}
        <AddTransactionModal />
      </div>
    </div>
  );
}
`);
