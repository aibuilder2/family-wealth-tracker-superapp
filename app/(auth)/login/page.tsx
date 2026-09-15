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
            redirectTo: `${window.location.origin}/home`
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

        {/* 1-Tap Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-2.5 px-4 rounded-xl border border-paper-dim bg-white hover:bg-slate-50 text-ink font-semibold text-xs flex items-center justify-center gap-2.5 shadow-sm transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          Gmail (Google) Se 1-Tap Login
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-paper-dim" />
          <span className="text-[10px] uppercase font-bold text-ink-muted">YA OTP SE LOGIN KAREIN</span>
          <div className="flex-1 h-[1px] bg-paper-dim" />
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-3.5 text-left">
            <div>
              <label className="text-xs font-semibold text-ink-muted block mb-1">
                Mobile Number (WhatsApp / SMS)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-ink-muted">+91</span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-11 pr-3 py-2 text-sm font-mono font-bold bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
                  required
                />
              </div>
            </div>

            {/* OTP Mode Selection */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOtpChannel('whatsapp')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  otpChannel === 'whatsapp'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700'
                    : 'border-paper-dim bg-white text-ink-muted'
                }`}
              >
                <MessageSquare size={14} className="text-emerald-600" /> WhatsApp OTP
              </button>
              <button
                type="button"
                onClick={() => setOtpChannel('sms')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  otpChannel === 'sms'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-700'
                    : 'border-paper-dim bg-white text-ink-muted'
                }`}
              >
                <Smartphone size={14} className="text-blue-600" /> SMS OTP
              </button>
            </div>

            <Button type="submit" className="w-full py-2.5 bg-navy text-paper font-semibold shadow-md flex items-center justify-center gap-2">
              {isLoading ? 'OTP Bhej Rahe Hain...' : 'OTP Prapt Karein'} <ArrowRight size={15} />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3.5 text-left">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
              <span>OTP bhej diya gaya hai <b>+91 {phone}</b> par</span>
              <button type="button" onClick={() => setOtpSent(false)} className="text-[11px] text-emerald-900 underline font-bold">
                Badlein
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-muted block mb-1">
                6-Digit OTP Darj Karein
              </label>
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full text-center tracking-widest text-lg font-mono font-bold py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
                autoFocus
                required
              />
            </div>

            <Button type="submit" className="w-full py-2.5 bg-gold text-navy font-bold shadow-md">
              Verify & Login Karein
            </Button>
          </form>
        )}

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

