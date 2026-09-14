'use client';

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
