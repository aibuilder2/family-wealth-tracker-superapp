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
          <h1 className="text-2xl font-serif font-bold text-ink">Family Wealth & Business</h1>
          <p className="text-xs text-ink-muted mt-1">उधार बही-खाता, पारिवारिक संपत्ति व बिज़नेस हब</p>
        </div>

        {/* Instant Guest Mode Button */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1.5 text-center">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.setItem('fwa_auth_mode', 'guest');
              }
              router.push('/business?tab=udhar-ledger');
            }}
            className="w-full py-2.5 bg-gold hover:bg-gold-light text-navy font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            ⚡ गेस्ट मोड (सीधे उधारी सिस्टम टेस्ट करें)
          </button>
          <p className="text-[10px] text-amber-800">
            बिना साइन-अप के तुरंत व्यापारिक उधार व सभी मॉड्यूल्स टेस्ट करें
          </p>
        </div>

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-paper-dim"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-paper px-2 text-ink-muted">या अपने खाते से लॉगिन करें</span>
          </div>
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
