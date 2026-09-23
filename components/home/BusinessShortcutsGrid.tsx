'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, ChevronRight, Plus, Sparkles
} from 'lucide-react';
import { ALL_APP_MODULES, STORAGE_KEY_PINNED_MODULES } from '@/lib/constants/modulesRegistry';

export function BusinessShortcutsGrid() {
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_PINNED_MODULES);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return ALL_APP_MODULES.filter(m => m.defaultPinned).map(m => m.id);
  });

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem(STORAGE_KEY_PINNED_MODULES);
      if (saved) {
        try { setPinnedIds(JSON.parse(saved)); } catch (e) {}
      }
    };
    window.addEventListener('fwa_modules_updated', handleUpdate);
    return () => window.removeEventListener('fwa_modules_updated', handleUpdate);
  }, []);

  const activeModules = ALL_APP_MODULES.filter(m => pinnedIds.includes(m.id));

  return (
    <div className="rounded-2xl p-4 bg-paper border border-paper-dim shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Briefcase size={16} className="text-gold" />
          <h3 className="font-serif font-bold text-xs text-ink">सक्रिय बिज़नेस व सेवाएँ (Active Hub)</h3>
          <span className="px-1.5 py-0.2 bg-gold/15 text-gold-dark text-[10px] font-bold rounded">
            {activeModules.length}
          </span>
        </div>
        <Link 
          href="/business" 
          className="text-[11px] text-gold font-bold hover:underline flex items-center gap-0.5"
        >
          सब खोलें <ChevronRight size={13} />
        </Link>
      </div>

      {activeModules.length === 0 ? (
        <div className="p-4 bg-paper-dim/40 rounded-xl text-center space-y-2">
          <p className="text-xs text-ink-muted">कोई मॉड्यूल होम पर पिन नहीं है।</p>
          <Link
            href="/business"
            className="inline-flex items-center gap-1 text-xs font-bold text-gold-dark"
          >
            <Plus size={14} /> More मेनू से सेवाएँ जोड़ें
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 pt-0.5">
          {activeModules.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={`/business?tab=${item.id}`}
                className="flex flex-col items-center text-center p-2 rounded-xl hover:bg-paper-dim/50 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 group-hover:scale-105 transition-transform bg-gradient-to-br ${item.color} text-white shadow-sm`}>
                  <Icon size={18} />
                </div>
                <span className="text-[10px] font-bold text-ink leading-tight line-clamp-1">
                  {item.title}
                </span>
              </Link>
            );
          })}

          {/* Add more button tile */}
          <Link
            href="/business"
            className="flex flex-col items-center text-center p-2 rounded-xl border border-dashed border-paper-dim hover:bg-paper-dim/40 transition-all group justify-center"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1 bg-paper-dim text-ink-muted group-hover:text-gold group-hover:scale-105 transition-all">
              <Plus size={18} />
            </div>
            <span className="text-[10px] font-semibold text-ink-muted leading-tight">
              + और जोड़ें
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
