'use client';

import React from 'react';
import { GitFork, ChevronRight, Users, Crown } from 'lucide-react';
import Link from 'next/link';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Avatar } from '@/components/ui/Avatar';

export function FamilyTreeView() {
  const { members } = useFamilyStore();
  const mukhiya = members.find(m => m.role === 'owner' || m.relationship?.toLowerCase().includes('mukhiya')) || members[0];

  return (
    <Link
      href="/family/tree"
      className="block rounded-2xl p-4 bg-gradient-to-r from-navy via-navy-light to-navy border border-paper-dim hover:border-gold/50 transition-all shadow-md group relative overflow-hidden text-paper"
    >
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-gold/10 blur-xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center text-gold border border-gold/30">
            <GitFork size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase font-bold text-gold tracking-wider">
                Vansh Rekha
              </span>
              <span className="text-[10px] bg-paper/10 text-paper px-1.5 py-0.5 rounded-full font-medium">
                {members.length} Sadasya
              </span>
            </div>
            <h3 className="text-base font-bold font-serif text-paper group-hover:text-gold transition-colors">
              Family Tree (Vansh Hierarchy)
            </h3>
            <p className="text-xs text-paper/70 mt-0.5">
              Maa-Baap ➔ Mukhiya &amp; Bhai-Behen ➔ Agli Peedhi Bachhe
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 overflow-hidden hidden sm:flex">
            {members.slice(0, 4).map(m => (
              <Avatar key={m.id} m={m} size={28} className="ring-2 ring-navy" />
            ))}
          </div>
          <div className="w-8 h-8 rounded-full bg-paper/10 flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-all">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>

      {mukhiya && (
        <div className="mt-3 pt-3 border-t border-paper/10 flex items-center justify-between text-xs text-paper/80">
          <span className="flex items-center gap-1">
            <Crown size={12} className="text-gold" />
            Mukhiya: <strong className="text-paper">{mukhiya.name}</strong>
          </span>
          <span className="text-gold font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
            Poori Tree Dekhein →
          </span>
        </div>
      )}
    </Link>
  );
}
