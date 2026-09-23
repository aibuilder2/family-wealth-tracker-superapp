'use client';

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
              placeholder="e.g. Sharma Parivar"
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
