'use client';

import React from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Sparkles, TrendingUp, ShieldCheck, Lightbulb } from 'lucide-react';

export default function AdvisorPage() {
  const insights = [
    {
      title: "Priya ki Education Goal",
      desc: "Aapka education goal 62% pura ho gaya hai. Agle 6 mahine me ₹31,000/month save karke aap target date se pehle reach kar lenge.",
      tag: "Goal Strategy",
      color: "gold",
    },
    {
      title: "Bank FD vs Equity Split",
      desc: "Aapka 55% fixed wealth aur 45% liquid wealth me hai, jo ek balanced family portfolio ke liye ideal hai.",
      tag: "Asset Allocation",
      color: "green",
    },
    {
      title: "Car Insurance Renewal",
      desc: "Car insurance 12 din me due hai. Pehle se renew karne par NCB (No Claim Bonus) protect rahega.",
      tag: "Reminder Alert",
      color: "coral",
    }
  ];

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="AI Financial Advisor"
        subtitle="Aapke parivar ke data par based smart insights"
      />

      <div className="px-4 space-y-3">
        {insights.map((item, i) => (
          <div key={i} className="p-4 rounded-xl bg-paper border border-paper-dim shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold px-2 py-0.5 bg-gold/10 rounded-md">
                {item.tag}
              </span>
              <Sparkles size={14} className="text-gold" />
            </div>
            <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
            <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
