import React from 'react';
import { Users } from 'lucide-react';
import Link from 'next/link';

export function FamilyTreeView() {
  return (
    <Link
      href="/family/tree"
      className="block rounded-xl px-4 py-3.5 bg-navy-light text-paper hover:bg-navy-light/90 transition-all shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
          <Users size={18} className="text-gold-soft" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-paper">Family Tree (Vansh Rekha)</p>
          <p className="text-[11px] text-gold-soft">Coming soon — vansh ka poora record</p>
        </div>
      </div>
    </Link>
  );
}
