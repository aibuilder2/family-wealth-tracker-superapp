'use client';

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
