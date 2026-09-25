'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { setActiveUser, getActiveUser, getKnownUsers, removeKnownUser } from '@/lib/storage/userScopedStorage';
import { User, LogIn, ArrowRight, X } from 'lucide-react';

export default function LoginPage() {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [knownUsers, setKnownUsers] = useState<string[]>([]);

  useEffect(() => {
    setKnownUsers(getKnownUsers());
  }, []);

  const handleLoginSubmit = (identifier: string) => {
    const clean = identifier.trim().toLowerCase();
    if (!clean) return;
    setActiveUser(clean);
    // Hard navigate to ensure entire state refreshes with the user's isolated data
    window.location.href = '/home';
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginSubmit(phoneOrEmail);
  };

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) return;
    let email = googleEmail.trim().toLowerCase();
    if (!email.includes('@')) {
      email = email + '@gmail.com';
    }
    handleLoginSubmit(email);
  };

  const handleRemoveKnown = (e: React.MouseEvent, user: string) => {
    e.stopPropagation();
    removeKnownUser(user);
    setKnownUsers((prev) => prev.filter((u) => u !== user));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#E7E1D2]">
      <div className="w-full max-w-sm bg-paper p-6 rounded-3xl border border-paper-dim shadow-xl text-center space-y-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink">Family Wealth & Business</h1>
          <p className="text-xs text-ink-muted mt-1">उधार बही-खाता, पारिवारिक संपत्ति व बिज़नेस हब</p>
        </div>

        {/* Google / Gmail Quick Login Button */}
        <button
          type="button"
          onClick={() => setShowGoogleModal(true)}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2.5 border border-slate-300 shadow-sm transition-all active:scale-[0.98]"
        >
          {/* Google "G" SVG Icon */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.41 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.59 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Google / Gmail से लॉगिन करें</span>
        </button>

        {/* Known Accounts Switcher (if any exists on this device) */}
        {knownUsers.length > 0 && (
          <div className="pt-1 text-left space-y-1.5">
            <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block">
              इस डिवाइस पर पहले के अकाउंट्स:
            </span>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {knownUsers.map((u) => (
                <div
                  key={u}
                  onClick={() => handleLoginSubmit(u)}
                  className="flex items-center justify-between p-2 rounded-xl bg-paper-dim/40 hover:bg-gold/15 border border-paper-dim cursor-pointer transition-colors text-xs group"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-5 h-5 rounded-full bg-gold/30 text-gold-dark font-bold text-[10px] flex items-center justify-center shrink-0">
                      {u.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-ink truncate">{u}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gold font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      खोलें →
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveKnown(e, u)}
                      className="p-1 hover:text-coral text-ink-muted/50 rounded"
                      title="इस लिस्ट से हटाएं"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-paper-dim"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-paper px-2 text-ink-muted">या ईमेल / मोबाइल डालें</span>
          </div>
        </div>

        {/* Standard Form Login */}
        <form onSubmit={handleFormLogin} className="space-y-3 text-left">
          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">
              Gmail, Email या Mobile Number
            </label>
            <input
              type="text"
              placeholder="e.g. yourname@gmail.com ya 9876543210"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
              required
            />
          </div>

          <Button type="submit" className="w-full py-2.5 bg-navy text-paper font-semibold">
            लॉगिन करें (Fresh App)
          </Button>
        </form>

        {/* Instant Guest Mode Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              setActiveUser('guest');
              window.location.href = '/business?tab=udhar-ledger';
            }}
            className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            ⚡ गेस्ट मोड (सीधे टेस्ट करें)
          </button>
        </div>

        <p className="text-xs text-ink-muted pt-1">
          नया परिवार रजिस्टर करना है?{' '}
          <Link href="/signup" className="text-gold font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Google Login Dialog */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <User size={16} className="text-gold" />
                Google / Gmail ID डालें
              </h3>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-ink-muted hover:text-ink p-1"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-[11px] text-ink-muted">
              अपनी Gmail ID दर्ज करें। आपका सारा डेटा इस ईमेल से 100% अलग और सुरक्षित रहेगा।
            </p>

            <form onSubmit={handleGoogleLogin} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="e.g. aibuilder.in@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
                  autoFocus
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-ink-muted bg-paper-dim rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-navy bg-gold hover:bg-gold-light rounded-xl flex items-center justify-center gap-1 shadow-sm"
                >
                  लॉगिन करें <ArrowRight size={13} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
