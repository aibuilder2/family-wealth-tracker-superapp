'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Users, Smartphone, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [familyName, setFamilyName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpChannel, setOtpChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/home');
    }, 600);
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    if (supabase) {
      try {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        });
        return;
      } catch (err) {
        console.error('Google auth error:', err);
      }
    }
    setTimeout(() => {
      router.push('/home');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#E7E1D2]">
      <div className="w-full max-w-sm bg-paper p-6 rounded-3xl border border-paper-dim shadow-xl text-center space-y-4">
        <div>
          <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gold/15 text-gold flex items-center justify-center font-bold text-xl border border-gold/30">
            👑
          </div>
          <h1 className="text-2xl font-serif font-bold text-ink">Naya Parivar Banayein</h1>
          <p className="text-xs text-ink-muted mt-0.5">Apne parivar ka private wealth vault shuru karein</p>
        </div>

        {/* Primary 1-Tap Google Sign Up */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full py-3 px-4 rounded-2xl border-2 border-gold/40 bg-white hover:bg-gold/5 text-ink font-bold text-sm flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoading ? 'Google Se Connect Ho Raha Hai...' : 'Gmail (Google) Se Parivar Banayein'}</span>
          </button>
          
          <p className="text-[11px] text-ink-muted">
            ✨ Instant vault creation bina kisi password ke
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-paper-dim" />
          <span className="text-[10px] uppercase font-bold text-ink-muted">YA DETAILS BHAREIN</span>
          <div className="flex-1 h-[1px] bg-paper-dim" />
        </div>

        <form onSubmit={handleSignup} className="space-y-3 text-left">
          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">
              Parivar Ka Naam (Family Name)
            </label>
            <input
              type="text"
              placeholder="e.g. Verma Family / Gupta Parivar"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">
              Aapka Naam (Family Head / Admin)
            </label>
            <input
              type="text"
              placeholder="e.g. Rajesh Verma"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
              required
            />
          </div>

          <Button type="submit" className="w-full py-2.5 bg-navy text-paper font-semibold shadow-md flex items-center justify-center gap-2 mt-2">
            {isLoading ? 'Parivar Banaya Ja Raha Hai...' : 'Parivar Banayein'} <ArrowRight size={15} />
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

