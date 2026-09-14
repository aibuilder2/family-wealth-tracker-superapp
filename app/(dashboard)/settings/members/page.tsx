'use client';

import React from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Avatar } from '@/components/ui/Avatar';

export default function MemberPermissionsPage() {
  const { members, updateMemberPermissions, currentUserId, setCurrentUserId } = useFamilyStore();

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Member Permissions"
        subtitle="Family Head har sadasya ke module rights control kar sakta hai"
      />

      <div className="px-4">
        <div className="p-3 bg-paper rounded-xl border border-paper-dim">
          <span className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Simulate Login As:</span>
          <div className="flex gap-2">
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() => setCurrentUserId(m.id)}
                className={'text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ' + (currentUserId === m.id ? 'bg-navy text-paper border-navy' : 'bg-paper text-ink-muted border-paper-dim')}
              >
                {m.name} ({m.role})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3">
        {members.map((m) => (
          <div key={m.id} className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <Avatar m={m} size={32} />
              <div>
                <h3 className="text-sm font-bold text-ink">{m.name}</h3>
                <p className="text-[10px] text-ink-muted capitalize">{m.relationship || m.role}</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-paper-dim">
              {[
                { key: 'can_view_investments', label: 'Investments & Shares' },
                { key: 'can_view_bills', label: 'Utility & Card Bills' },
                { key: 'can_view_vault', label: 'Documents Vault' },
                { key: 'can_view_staff', label: 'Household Staff' },
                { key: 'can_view_cases', label: 'Court Cases' },
              ].map((p) => {
                const isAllowed = (m.permissions as any)?.[p.key] !== false;
                return (
                  <div key={p.key} className="flex items-center justify-between text-xs">
                    <span className="text-ink font-medium">{p.label}</span>
                    <button
                      type="button"
                      onClick={() => updateMemberPermissions(m.id, { [p.key]: !isAllowed })}
                      className={'px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ' + (isAllowed ? 'bg-green/10 text-green' : 'bg-paper-dim text-ink-muted')}
                    >
                      {isAllowed ? 'ON' : 'OFF'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
