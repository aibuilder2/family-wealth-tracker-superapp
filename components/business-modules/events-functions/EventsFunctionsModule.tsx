'use client';

import React, { useState, useEffect } from 'react';
import { PartyPopper, Plus, Gift, Users, IndianRupee } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export interface ShagunRecord {
  id: string;
  relativeName: string;
  relation: string;
  amount: number;
  eventTitle: string; // e.g. Rohan ki Shaadi, Griha Pravesh
  type: 'RECEIVED_SHAGUN' | 'GIVEN_SHAGUN';
}

export default function EventsFunctionsModule() {
  const [records, setRecords] = useState<ShagunRecord[]>([
    { id: 'sh-1', relativeName: 'रमेश जी (फूफाजी)', relation: 'फूफाजी', amount: 5100, eventTitle: 'गृह प्रवेश', type: 'RECEIVED_SHAGUN' },
    { id: 'sh-2', relativeName: 'सुरेश जी (मामाजी)', relation: 'मामाजी', amount: 11000, eventTitle: 'गृह प्रवेश', type: 'RECEIVED_SHAGUN' }
  ]);

  const totalReceived = records.filter(r => r.type === 'RECEIVED_SHAGUN').reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 via-pink-900 to-rose-950 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <PartyPopper className="w-5 h-5 text-pink-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm">शादी, इवेंट्स व शगुन डायरी</h3>
              <p className="text-[11px] text-pink-200">पारिवारिक आयोजन व शगुन लिफ़ाफ़ा रिकॉर्ड</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
          <span className="text-pink-200">कुल प्राप्त शगुन / लिफाफा राशि:</span>
          <Mono className="text-base font-bold text-amber-300">₹{totalReceived.toLocaleString('en-IN')}</Mono>
        </div>
      </div>

      <div className="space-y-2">
        {records.map(r => (
          <div key={r.id} className="p-3 bg-paper rounded-xl border border-paper-dim shadow-xs flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-ink">{r.relativeName} <span className="text-ink-muted text-[10px]">({r.relation})</span></p>
              <p className="text-[11px] text-ink-muted">अवसर: {r.eventTitle}</p>
            </div>
            <div className="text-right">
              <Mono className="font-bold text-emerald-700 text-sm block">₹{r.amount.toLocaleString('en-IN')}</Mono>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-900">
                प्राप्त शगुन
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
