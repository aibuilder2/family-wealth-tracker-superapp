'use client';
import VaultLockModal from '@/components/security/VaultLockModal';
import KaagazScannerModal from '@/components/scanner/KaagazScannerModal';
import { Camera } from 'lucide-react';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { DocumentCard } from '@/components/vault/DocumentCard';
import { ReminderCard } from '@/components/reminders/ReminderCard';
import { Upload, Plus } from 'lucide-react';

export default function VaultPage() {
  const [isLocked, setIsLocked] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { documents, reminders } = useFamilyStore();

  return (
    <>
      <VaultLockModal isOpen={isLocked} onUnlocked={() => setIsLocked(false)} title="Documents Vault Locked" description="Zameen registry, Insurance aur personal kagaz dekhne ke liye 6-Digit PIN ya Fingerprint use karein." />
    <div className="space-y-4">
      <ScreenHeader
        title="Vault"
        subtitle="Documents aur reminders"
      />

      {/* Stored Documents */}
            {/* Kaagaz Scanner Quick Action */}
      <div className="px-4">
        <button
          type="button"
          onClick={() => setIsScannerOpen(true)}
          className="w-full p-3 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-2xl flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gold text-navy flex items-center justify-center font-bold">
              <Camera size={16} />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-ink block">📄 Kaagaz Scanner (Camera Se Scan)</span>
              <span className="text-[10px] text-ink-muted">Registry, Insurance ya Prescriptions ke multiple pages scan karein</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-navy bg-paper px-2 py-1 rounded-lg border border-paper-dim">Scan Now</span>
        </button>
      </div>
<div className="px-4">
        <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim shadow-sm">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      </div>

      {/* Upcoming Reminders Section */}
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif font-semibold text-ink text-sm">
            Upcoming Reminders
          </h2>
        </div>

        <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim shadow-sm">
          {reminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </div>
      </div>
    </div>
    <KaagazScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} defaultCategory="property" />
    </>
  );
}
