'use client';

import React, { useState, useEffect } from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useFamilyStore } from '@/lib/store/familyStore';
import { getActiveUser, getKnownUsers, logoutUser, setActiveUser } from '@/lib/storage/userScopedStorage';
import { Database, UserCheck, LogOut, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { family, members } = useFamilyStore();
  const [currentUser, setCurrentUser] = useState('guest');
  const [knownUsers, setKnownUsers] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    setCurrentUser(getActiveUser());
    setKnownUsers(getKnownUsers());
  }, []);

  const handleLogout = () => {
    logoutUser();
    window.location.href = '/login';
  };

  const handleSwitch = (user: string) => {
    setActiveUser(user);
    window.location.href = '/home';
  };

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Settings"
        subtitle="Parivar profile aur account configuration"
      />

      <div className="px-4 space-y-3">
        {/* Active Account / User Isolation Card */}
        <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-xs">
                <UserCheck size={16} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-ink-muted uppercase">सक्रिय खाता (Active Account)</span>
                <p className="text-sm font-bold text-ink">{currentUser}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green/15 text-green flex items-center gap-1">
              <ShieldCheck size={11} /> आइसोलेटेड (Safe)
            </span>
          </div>

          <p className="text-[11px] text-ink-muted">
            आपका सारा पारिवारिक व बिज़नेस डेटा इस खाते से प्राइवेटली लॉक है। किसी अन्य यूजर को यह डेटा नहीं दिखता।
          </p>

          <div className="flex gap-2 pt-1 border-t border-paper-dim">
            <button
              onClick={() => {
                window.location.href = '/login';
              }}
              className="flex-1 py-2 px-3 bg-paper-dim hover:bg-gold/20 text-ink text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowRightLeft size={13} /> दूसरा खाता बदलें
            </button>
            <button
              onClick={handleLogout}
              className="py-2 px-3 bg-coral/10 hover:bg-coral/20 text-coral text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut size={13} /> लॉगआउट
            </button>
          </div>
        </div>

        {/* Family Vault Details */}
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

        {/* Database Architecture Info */}
        <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm flex items-start gap-3">
          <Database size={18} className="text-gold shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-ink">User Data Isolation Active</h4>
            <p className="text-[11px] text-ink-muted mt-0.5">
              प्रत्येक Gmail / User ID का डेटा अलग-अलग सुरक्षित सैंडबॉक्स में रहता है। नए यूजर के आने पर पूरा ऐप 100% खाली और फ्रेश खुलता है।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
