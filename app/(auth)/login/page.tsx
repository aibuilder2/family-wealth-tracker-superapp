'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Smartphone, Mail, MessageSquare, KeyRound, HelpCircle, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [authMethod, setAuthMethod] = useState<'otp' | 'google'>('otp');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpChannel, setOtpChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [showRecoveryInfo, setShowRecoveryInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert('Kripya sahi 10-digit mobile number daalein.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      alert('Kripya 4 ya 6 digit OTP enter karein.');
      return;
    }
    router.push('/home');
  };

  const handleGoogleLogin = async () => {
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
    // Fallback demo redirect
    setTimeout(() => {
      router.push('/home');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#E7E1D2]">
      <div className="w-full max-w-sm bg-paper p-6 rounded-3xl border border-paper-dim shadow-xl text-center space-y-5">
        <div>
          <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gold/15 text-gold flex items-center justify-center font-bold text-xl border border-gold/30">
            ₹
          </div>
          <h1 className="text-2xl font-serif font-bold text-ink">Family Wealth Vault</h1>
          <p className="text-xs text-ink-muted mt-1">Surakshit Parivar Login</p>
        </div>

        {/* Primary 1-Tap Google Sign In */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
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
            <span>{isLoading ? 'Google Se Connect Ho Raha Hai...' : 'Continue with Google (Gmail)'}</span>
          </button>
          
          <p className="text-[11px] text-ink-muted">
            ⚡ 1-Click login bina kisi password ya OTP ke jhanjhat ke
          </p>
        </div>

        {/* WhatsApp OTP Status (Inactive / Coming Soon) */}
        <div className="p-3.5 rounded-2xl bg-paper-dim/50 border border-paper-dim text-left space-y-1.5 opacity-80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-muted flex items-center gap-1.5">
              <MessageSquare size={14} className="text-emerald-600/70" /> WhatsApp & SMS OTP Login
            </span>
            <span className="text-[9px] uppercase font-bold bg-amber-500/15 text-amber-800 px-2 py-0.5 rounded-full">
              Coming Soon
            </span>
          </div>
          <p className="text-[11px] text-ink-muted">
            Abhi ke liye sabhi members Google (Gmail) se surakshit login karenge. WhatsApp OTP integration jald hi live hoga.
          </p>
        </div>

        {/* Data Recovery & Phone Change Info */}
        <div className="pt-2 border-t border-paper-dim text-left">
          <button
            type="button"
            onClick={() => setShowRecoveryInfo(!showRecoveryInfo)}
            className="text-[11px] text-ink-muted hover:text-ink flex items-center justify-between w-full font-medium"
          >
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-600" /> Mobile number badalne par data ka kya hoga?
            </span>
            <span className="text-xs">{showRecoveryInfo ? '▲' : '▼'}</span>
          </button>

          {showRecoveryInfo && (
            <div className="mt-2.5 p-3 rounded-xl bg-paper-dim/60 border border-paper-dim text-[11px] text-ink-muted space-y-1.5 animate-in fade-in duration-200">
              <p className="font-bold text-ink">🛡️ Data Hamesha 100% Surakshit Hai:</p>
              <p>1. <b>Google ID Backup:</b> Agar aapka SIM/Number badal bhi jaye, toh aap apni <b>Gmail ID</b> se login karke purana data turant wapas paa sakte hain.</p>
              <p>2. <b>Profile Number Update:</b> Settings me jakar aap kabhi bhi naya number OTP verify karke update kar sakte hain.</p>
              <p>3. <b>Family Head Recovery:</b> Parivar ka Admin naye number par re-invite link bhej kar access restore kar sakta hai.</p>
            </div>
          )}
        </div>

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

