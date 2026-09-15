'use client';

import React from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Database } from 'lucide-react';

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

        {/* ChatGPT Plugin & Actions Hub */}
        <div className="p-5 bg-gradient-to-br from-[#121B2B] to-[#1E293B] text-white rounded-3xl border border-blue-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
                🤖
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  ChatGPT Plugin & Actions
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono uppercase">
                    Zero-Cost AI
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300">Apne ChatGPT ko is parivar ke account se link karein</p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 bg-black/30 p-3.5 rounded-2xl border border-white/10">
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>OpenAPI Schema URL (ChatGPT Actions me daalne ke liye):</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://family-wealth-tracker-tawny.vercel.app/api/gpt-action/openapi.json');
                    alert('OpenAPI URL Copied to clipboard!');
                  }}
                  className="text-gold hover:text-amber-300 font-bold text-[10px] underline"
                >
                  Copy URL
                </button>
              </div>
              <p className="font-mono text-[11px] text-emerald-400 bg-black/40 p-2 rounded-lg break-all border border-emerald-500/20">
                https://family-wealth-tracker-tawny.vercel.app/api/gpt-action/openapi.json
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Aapka Family Secret Token (Auth Key):</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(family.invite_code || 'FAM-SEC-9988');
                    alert('Family Secret Token Copied!');
                  }}
                  className="text-gold hover:text-amber-300 font-bold text-[10px] underline"
                >
                  Copy Key
                </button>
              </div>
              <p className="font-mono text-[11px] text-yellow-400 bg-black/40 p-2 rounded-lg border border-yellow-500/20">
                {family.invite_code || 'FAM-SEC-9988'}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
            <p className="font-bold text-gold text-xs">🚀 3-Step Setup Guide:</p>
            <p>1. ChatGPT me jayein $\rightarrow$ <b>Explore GPTs</b> $\rightarrow$ <b>+ Create</b> par click karein.</p>
            <p>2. <b>Configure $\rightarrow$ Actions</b> me jakar upar wala <b>OpenAPI URL</b> paste karein.</p>
            <p>3. Save karein! Ab ChatGPT seedhe aapke parivar ke hisab-kitab ka jawab dega.</p>
          </div>
        </div>

        <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm flex items-start gap-3">
          <Database size={18} className="text-gold shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-ink">Supabase Postgres and RLS</h4>
            <p className="text-[11px] text-ink-muted mt-0.5">
              Live schema with secure Row Level Security enabled for sensitive medical and document data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
