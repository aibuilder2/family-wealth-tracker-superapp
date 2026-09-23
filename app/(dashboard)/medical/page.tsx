'use client';

import React from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { MedicalRecordCard } from '@/components/medical/MedicalRecordCard';
import { ShieldAlert } from 'lucide-react';

export default function MedicalPage() {
  const { medicalRecords } = useFamilyStore();

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Medical Records"
        subtitle="Emergency me dawaiyan aur blood group"
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
          <MedicalRecordCard key={rec.id} record={rec} />
        ))}
      </div>
    </div>
  );
}
