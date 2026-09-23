'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Wallet, PiggyBank, FileText, Menu, X, 
  Check, Plus, Sparkles, ExternalLink, ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ALL_APP_MODULES, STORAGE_KEY_PINNED_MODULES } from '@/lib/constants/modulesRegistry';

export const MAIN_TABS = [
  { key: 'home', href: '/home', label: 'Home', icon: Home },
  { key: 'money', href: '/money', label: 'Money', icon: Wallet },
  { key: 'wealth', href: '/wealth', label: 'Wealth', icon: PiggyBank },
  { key: 'vault', href: '/vault', label: 'Vault', icon: FileText },
];

export function BottomNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [pinnedModules, setPinnedModules] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_PINNED_MODULES);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return ALL_APP_MODULES.filter(m => m.defaultPinned).map(m => m.id);
  });

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem(STORAGE_KEY_PINNED_MODULES);
      if (saved) {
        try { setPinnedModules(JSON.parse(saved)); } catch (e) {}
      }
    };
    window.addEventListener('fwa_modules_updated', handleStorage);
    return () => window.removeEventListener('fwa_modules_updated', handleStorage);
  }, []);

  const togglePin = (moduleId: string) => {
    let updated: string[];
    if (pinnedModules.includes(moduleId)) {
      updated = pinnedModules.filter(id => id !== moduleId);
    } else {
      updated = [...pinnedModules, moduleId];
    }
    setPinnedModules(updated);
    localStorage.setItem(STORAGE_KEY_PINNED_MODULES, JSON.stringify(updated));
    window.dispatchEvent(new Event('fwa_modules_updated'));
  };

  return (
    <>
      <nav className="flex items-center justify-around px-2 py-2 bg-paper border-t border-paper-dim shrink-0 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        {MAIN_TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          const Icon = tab.icon;

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all rounded-lg hover:bg-paper-dim/40"
            >
              <Icon
                size={20}
                className={cn(
                  'transition-colors',
                  isActive ? 'text-gold' : 'text-ink-muted'
                )}
                strokeWidth={isActive ? 2.4 : 2}
              />
              <span
                className={cn(
                  'text-[10px] font-medium font-sans transition-colors',
                  isActive ? 'text-gold font-semibold' : 'text-ink-muted'
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}

        {/* More Button */}
        <button
          type="button"
          onClick={() => setIsMoreOpen(true)}
          className={cn(
            "flex flex-col items-center gap-0.5 px-3 py-1 transition-all rounded-lg hover:bg-paper-dim/40 cursor-pointer",
            isMoreOpen ? "text-gold" : "text-ink-muted"
          )}
        >
          <Menu size={20} strokeWidth={2} />
          <span className="text-[10px] font-medium font-sans">More</span>
        </button>
      </nav>

      {/* More / All Modules Modal */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-paper rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 border border-paper-dim space-y-4 max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-paper-dim pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-gold/20 text-gold rounded-lg">
                    <Sparkles size={16} />
                  </span>
                  <h3 className="text-base font-serif font-bold text-ink">All Family Modules & Services</h3>
                </div>
                <p className="text-xs text-ink-muted mt-0.5">
                  जिस मॉड्यूल को <strong>मुख्य होम स्क्रीन</strong> पर देखना चाहते हैं, उसका स्विच ऑन (✓) करें
                </p>
              </div>
              <button 
                onClick={() => setIsMoreOpen(false)} 
                className="p-1 rounded-full text-ink-muted hover:text-ink hover:bg-paper-dim"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modules List */}
            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
              {ALL_APP_MODULES.map((mod) => {
                const Icon = mod.icon;
                const isPinned = pinnedModules.includes(mod.id);

                return (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-paper border border-paper-dim hover:border-gold/40 transition-all shadow-sm"
                  >
                    <Link
                      href={`/business?tab=${mod.id}`}
                      onClick={() => setIsMoreOpen(false)}
                      className="flex items-center gap-3 flex-1 min-w-0 pr-2"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                        <Icon size={18} />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-ink truncate">{mod.title}</p>
                        <p className="text-[10px] text-ink-muted truncate">{mod.subtitle}</p>
                      </div>
                    </Link>

                    {/* Toggle Pin to Home Switch */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => togglePin(mod.id)}
                        className={cn(
                          "px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                          isPinned
                            ? "bg-green text-paper shadow-sm"
                            : "bg-paper-dim text-ink-muted hover:text-ink hover:bg-paper-dim/80"
                        )}
                        title={isPinned ? "होम से हटाएं" : "होम पर जोड़ें"}
                      >
                        {isPinned ? (
                          <>
                            <Check size={13} strokeWidth={3} />
                            <span>होम पर सक्रिय</span>
                          </>
                        ) : (
                          <>
                            <Plus size={13} />
                            <span>होम पर लाएं</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom info */}
            <div className="pt-2 border-t border-paper-dim flex items-center justify-between text-xs text-ink-muted">
              <span>सक्रिय मॉड्यूल: <strong className="text-ink">{pinnedModules.length}</strong></span>
              <Link
                href="/business"
                onClick={() => setIsMoreOpen(false)}
                className="text-gold-dark font-bold hover:underline flex items-center gap-1"
              >
                पूरा बिज़नेस हब खोलें →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
