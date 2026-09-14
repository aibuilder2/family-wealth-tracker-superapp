const fs = require('fs');

const scannerPageCode = `'use client';

import React, { useState } from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Camera, FileText, Sparkles, Plus, Share2, Download, Check, ShieldCheck, Folder } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import KaagazScannerModal from '@/components/scanner/KaagazScannerModal';

export default function ScannerPage() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [recentScans, setRecentScans] = useState<Array<{ id: string; title: string; pages: number; category: string; date: string }>>([
    { id: 'sc-1', title: 'Plot 42 Land Registry Copy', pages: 6, category: 'Zameen Registry', date: 'Aaj 10:30 AM' },
    { id: 'sc-2', title: 'HDFC Ergo Car Insurance Policy', pages: 2, category: 'Insurance', date: 'Kal 04:15 PM' },
    { id: 'sc-3', title: 'Doctor Prescription & Blood Test', pages: 3, category: 'Medical Report', date: '12 Sep 2026' }
  ]);

  const handleDocumentSaved = (docTitle: string, pageCount: number) => {
    const newDoc = {
      id: 'sc-' + Date.now(),
      title: docTitle,
      pages: pageCount,
      category: 'Saved Document',
      date: 'Just now'
    };
    setRecentScans([newDoc, ...recentScans]);
  };

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Kaagaz Document Scanner"
        subtitle="Zameen, Insurance, Medical reports & bills scan aur multi-page PDF banayein"
        action={
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="w-8 h-8 rounded-full bg-navy text-paper flex items-center justify-center shadow hover:bg-navy-light transition-all"
            title="Scan New Document"
          >
            <Plus size={16} />
          </button>
        }
      />

      {/* Main Scan Banner */}
      <div className="px-4">
        <div className="p-5 rounded-3xl bg-navy text-paper shadow-xl border border-navy-light/60 space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gold/20 text-gold flex items-center justify-center border border-gold/40 shrink-0 shadow-lg">
              <Camera size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-paper">Naya Kagaz Scan Karein</h3>
              <p className="text-xs text-paper/70 mt-0.5">
                Camera se direct photo lein, Magic Color filter lagayein aur 1-click me PDF banayein.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsScannerOpen(true)}
            className="w-full bg-gold text-navy font-bold py-2.5 rounded-xl shadow flex items-center justify-center gap-2 text-xs"
          >
            <Camera size={16} />
            <span>Start Scanning Now</span>
          </Button>
        </div>
      </div>

      {/* Features Overview */}
      <div className="px-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-3 bg-paper rounded-2xl border border-paper-dim space-y-1">
          <Sparkles size={18} className="mx-auto text-gold" />
          <span className="font-bold text-ink block text-[11px]">Magic Color</span>
          <span className="text-[9px] text-ink-muted">Crisp White Text</span>
        </div>
        <div className="p-3 bg-paper rounded-2xl border border-paper-dim space-y-1">
          <FileText size={18} className="mx-auto text-navy" />
          <span className="font-bold text-ink block text-[11px]">Multi-Page PDF</span>
          <span className="text-[9px] text-ink-muted">10+ Pages Merge</span>
        </div>
        <div className="p-3 bg-paper rounded-2xl border border-paper-dim space-y-1">
          <ShieldCheck size={18} className="mx-auto text-green" />
          <span className="font-bold text-ink block text-[11px]">Auto Vault Sync</span>
          <span className="text-[9px] text-ink-muted">Direct Save</span>
        </div>
      </div>

      {/* Recent Scanned Documents */}
      <div className="px-4 space-y-2">
        <h4 className="text-xs font-bold uppercase text-ink-muted flex items-center gap-1.5">
          <Folder size={14} /> Scanned Documents List
        </h4>

        <div className="space-y-2">
          {recentScans.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-paper rounded-2xl border border-paper-dim shadow-sm flex items-center justify-between hover:border-gold/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy/10 text-navy flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-ink">{item.title}</h5>
                  <p className="text-[10px] text-ink-muted mt-0.5">
                    {item.pages} Pages · {item.category} · {item.date}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-navy text-paper text-[10px] font-bold shadow hover:bg-navy-light"
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Scanner */}
      <KaagazScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSaved={handleDocumentSaved}
      />
    </div>
  );
}
`;

fs.mkdirSync('app/(dashboard)/scanner', { recursive: true });
fs.writeFileSync('app/(dashboard)/scanner/page.tsx', scannerPageCode.trim() + '\n', 'utf8');
console.log('Created app/(dashboard)/scanner/page.tsx');
