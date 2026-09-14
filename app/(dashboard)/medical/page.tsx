'use client';
import VaultLockModal from '@/components/security/VaultLockModal';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { HeartPulse, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function MedicalPage() {
  const [isLocked, setIsLocked] = useState(true);
  const { medicalRecords, toggleMedicalVerification } = useFamilyStore();

  return (
    <>
      <VaultLockModal isOpen={isLocked} onUnlocked={() => setIsLocked(false)} title="Medical Health Vault Locked" description="Parivar ke blood groups aur confidential bimariyo ka data dekhne ke liye Vault PIN ya Fingerprint use karein." />
    <div className="space-y-4">
      <ScreenHeader
        title="Medical & Health Vault"
        subtitle="Blood group, daily dawaiyan aur verification status"
      />

      <div className="px-4">
        <div className="p-3 bg-coral/10 border border-coral/20 rounded-xl flex items-start gap-2 text-xs text-coral">
          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
          <span>
            Emergency data: Parivar ka koi bhi sadasya kisi ki bhi zaroori dawai aur blood group yahan se dekh sakta hai.
          </span>
        </div>
      </div>

      <div className="px-4 space-y-3">
        {medicalRecords.map((rec) => (
          <div key={rec.id} className="rounded-xl p-4 bg-paper border border-paper-dim shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse size={16} className="text-coral" />
                <h3 className="text-sm font-semibold text-ink">{rec.member_name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-coral/15 text-coral">
                  {rec.blood_group}
                </span>

                <button
                  type="button"
                  onClick={() => toggleMedicalVerification(rec.id)}
                  className={'text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ' + (rec.is_verified ? 'bg-green/10 text-green' : 'bg-gray-200 text-gray-600')}
                  title="Tap to verify/unverify"
                >
                  {rec.is_verified ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                  {rec.is_verified ? 'Verified' : 'Unverified'}
                </button>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <p className="text-ink-muted">
                <span className="font-medium text-ink">Condition: </span>
                {rec.condition}
              </p>
              <p className="text-ink-muted flex items-start gap-1">
                <Clock size={13} className="text-gold mt-0.5 shrink-0" />
                <span>
                  <strong className="text-ink">{rec.medicine_name}</strong> — {rec.medicine_time}
                </span>
              </p>
              {rec.notes && (
                <p className="text-ink-muted text-[11px] bg-paper-dim/50 p-2 rounded-lg mt-1">
                  {rec.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
