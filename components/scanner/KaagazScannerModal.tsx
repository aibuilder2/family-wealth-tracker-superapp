'use client';

import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Sparkles, FileText, Check, Trash2, RotateCw, Share2, Download, Plus, X, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useFamilyStore } from '@/lib/store/familyStore';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

interface ScannedPage {
  id: string;
  originalSrc: string;
  enhancedSrc: string;
  filter: 'magic' | 'bw' | 'gray' | 'original';
  rotation: number;
}

interface KaagazScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'property' | 'insurance' | 'medical' | 'case' | 'bill';
  onSaved?: (docTitle: string, pageCount: number) => void;
}

export default function KaagazScannerModal({
  isOpen,
  onClose,
  defaultCategory = 'property',
  onSaved
}: KaagazScannerModalProps) {
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [docTitle, setDocTitle] = useState('');
  const [targetCategory, setTargetCategory] = useState<'property' | 'insurance' | 'medical' | 'case' | 'bill'>(defaultCategory);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process image with HTML5 Canvas Filters
  const applyFilterToImage = (src: string, filterType: 'magic' | 'bw' | 'gray' | 'original', rotation: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        // Set dimensions considering rotation
        if (rotation === 90 || rotation === 270) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        if (filterType === 'original') {
          resolve(canvas.toDataURL('image/jpeg', 0.9));
          return;
        }

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;

        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          const avg = 0.299 * r + 0.587 * g + 0.114 * b;

          if (filterType === 'gray') {
            d[i] = avg;
            d[i + 1] = avg;
            d[i + 2] = avg;
          } else if (filterType === 'bw') {
            // High contrast B&W Photocopy
            const v = avg > 128 ? 255 : 0;
            d[i] = v;
            d[i + 1] = v;
            d[i + 2] = v;
          } else if (filterType === 'magic') {
            // Magic Color / Document Enhance (Whiten background, sharpen dark ink)
            let enhanced = avg;
            if (avg > 150) {
              enhanced = Math.min(255, avg * 1.25); // Whiter background
            } else {
              enhanced = Math.max(0, avg * 0.75); // Darker crisp text
            }
            d[i] = Math.min(255, (r * 0.7) + (enhanced * 0.3));
            d[i + 1] = Math.min(255, (g * 0.7) + (enhanced * 0.3));
            d[i + 2] = Math.min(255, (b * 0.7) + (enhanced * 0.3));
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = src;
    });
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    const newPages: ScannedPage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const base64: string = await new Promise((res) => {
        reader.onload = () => res(reader.result as string);
        reader.readAsDataURL(file);
      });

      const enhanced = await applyFilterToImage(base64, 'magic', 0);
      newPages.push({
        id: 'p-' + Date.now() + '-' + i,
        originalSrc: base64,
        enhancedSrc: enhanced,
        filter: 'magic',
        rotation: 0
      });
    }

    setPages((prev) => [...prev, ...newPages]);
    if (!docTitle) {
      setDocTitle(targetCategory === 'property' ? 'Zameen Registry Kagaz' : targetCategory === 'medical' ? 'Doctor Prescription Report' : 'Kagaz Document');
    }
    setIsProcessing(false);
  };

  const handleChangeFilter = async (filter: 'magic' | 'bw' | 'gray' | 'original') => {
    if (pages.length === 0) return;
    const cur = pages[currentPageIdx];
    const newEnhanced = await applyFilterToImage(cur.originalSrc, filter, cur.rotation);

    setPages((prev) =>
      prev.map((p, idx) => (idx === currentPageIdx ? { ...p, filter, enhancedSrc: newEnhanced } : p))
    );
  };

  const handleRotate = async () => {
    if (pages.length === 0) return;
    const cur = pages[currentPageIdx];
    const newRot = (cur.rotation + 90) % 360;
    const newEnhanced = await applyFilterToImage(cur.originalSrc, cur.filter, newRot);

    setPages((prev) =>
      prev.map((p, idx) => (idx === currentPageIdx ? { ...p, rotation: newRot, enhancedSrc: newEnhanced } : p))
    );
  };

  const handleDeleteCurrentPage = () => {
    if (pages.length <= 1) {
      setPages([]);
      setCurrentPageIdx(0);
    } else {
      const updated = pages.filter((_, idx) => idx !== currentPageIdx);
      setPages(updated);
      setCurrentPageIdx(Math.max(0, currentPageIdx - 1));
    }
  };

  // Generate & Download PDF
  const handleDownloadPDF = () => {
    if (pages.length === 0) return;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pages.forEach((p, idx) => {
      if (idx > 0) pdf.addPage();
      pdf.addImage(p.enhancedSrc, 'JPEG', 5, 5, width - 10, height - 10);
    });

    pdf.save((docTitle || 'Kagaz_Scan') + '.pdf');
    try { confetti({ particleCount: 35, spread: 45 }); } catch (e) {}
  };

  // Web Share PDF / Images
  const handleShare = async () => {
    if (navigator.share && pages.length > 0) {
      try {
        await navigator.share({
          title: docTitle || 'Scanned Kagaz Document',
          text: 'Family Wealth App se scanned document (' + pages.length + ' Pages)'
        });
      } catch (e) {}
    } else {
      handleDownloadPDF();
    }
  };

  const handleSaveToApp = () => {
    setIsSavedSuccess(true);
    try { confetti({ particleCount: 50, spread: 60 }); } catch (e) {}
    if (onSaved) onSaved(docTitle || 'Scanned Document', pages.length);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onClose();
      setPages([]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 bg-navy-dark/90 backdrop-blur-md">
      <div className="w-full max-w-md bg-paper rounded-3xl border border-gold/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-navy text-paper flex items-center justify-between border-b border-navy-light shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gold/20 text-gold flex items-center justify-center border border-gold/40">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-paper">Kaagaz Scanner (In-App)</h3>
              <span className="text-[10px] text-gold-soft">Crop, Enhance & Multi-Page PDF</span>
            </div>
          </div>
          <button onClick={onClose} className="text-paper/70 hover:text-paper p-1">
            <X size={20} />
          </button>
        </div>

        {/* Hidden Inputs */}
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFilesSelected}
          className="hidden"
        />
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          onChange={handleFilesSelected}
          className="hidden"
        />

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {pages.length === 0 ? (
            /* 1. Empty State - Pick / Capture Photos */
            <div className="text-center py-10 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gold/10 border-2 border-dashed border-gold flex items-center justify-center text-gold">
                <Camera size={36} />
              </div>
              <div>
                <h4 className="text-base font-bold text-ink font-serif">Kagaz Scan Karein</h4>
                <p className="text-xs text-ink-muted mt-1 max-w-xs mx-auto">
                  Zameen Registry, Insurance Policy, Doctor Prescription ya Bill ke ek sath multiple pages scan karein.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-3.5 bg-navy text-paper rounded-2xl flex flex-col items-center gap-1.5 shadow hover:bg-navy-light transition-all text-xs font-bold"
                >
                  <Camera size={20} className="text-gold" />
                  <span>Camera Se Scan</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 bg-paper-dim text-ink rounded-2xl flex flex-col items-center gap-1.5 border border-paper-dim hover:border-gold transition-all text-xs font-bold"
                >
                  <ImageIcon size={20} className="text-navy" />
                  <span>Gallery Se Chunein</span>
                </button>
              </div>
            </div>
          ) : (
            /* 2. Active Multi-Page Editor & Filter View */
            <div className="space-y-3">
              {/* Document Title & Category Bar */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[9px] font-bold uppercase text-ink-muted block mb-1">Document Ka Naam</label>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-paper-dim border border-paper-dim rounded-xl font-bold text-xs"
                    placeholder="e.g. Khet Registry 2026"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-ink-muted block mb-1">Kahan Save Karein?</label>
                  <select
                    value={targetCategory}
                    onChange={(e) => setTargetCategory(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-paper-dim border border-paper-dim rounded-xl font-bold text-xs"
                  >
                    <option value="property">📜 Zameen & Property Vault</option>
                    <option value="insurance">🛡️ Insurance Documents</option>
                    <option value="medical">🩺 Medical Health Records</option>
                    <option value="case">⚖️ Court Case Papers</option>
                    <option value="bill">🧾 Ghar Kharch Receipt</option>
                  </select>
                </div>
              </div>

              {/* Main Scanned Image Preview */}
              <div className="relative aspect-[3/4] max-h-[38vh] mx-auto bg-black rounded-2xl overflow-hidden border border-paper-dim flex items-center justify-center shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pages[currentPageIdx]?.enhancedSrc}
                  alt="Scanned page"
                  className="max-h-full max-w-full object-contain"
                />

                {/* Top Overlay Badge */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-navy/80 backdrop-blur-md rounded-lg text-paper text-[10px] font-mono font-bold border border-navy-light">
                  Page {currentPageIdx + 1} of {pages.length}
                </div>

                {/* Edit Controls On Image */}
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <button
                    onClick={handleRotate}
                    className="p-2 bg-navy/80 backdrop-blur-md text-paper rounded-xl hover:bg-navy border border-navy-light transition-all"
                    title="Rotate 90°"
                  >
                    <RotateCw size={14} />
                  </button>
                  <button
                    onClick={handleDeleteCurrentPage}
                    className="p-2 bg-coral/80 backdrop-blur-md text-paper rounded-xl hover:bg-coral transition-all"
                    title="Delete Page"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Previous / Next Page Nav */}
                {pages.length > 1 && (
                  <>
                    <button
                      disabled={currentPageIdx === 0}
                      onClick={() => setCurrentPageIdx((p) => Math.max(0, p - 1))}
                      className="absolute left-2 p-1.5 bg-navy/70 text-paper rounded-full disabled:opacity-30"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      disabled={currentPageIdx === pages.length - 1}
                      onClick={() => setCurrentPageIdx((p) => Math.min(pages.length - 1, p + 1))}
                      className="absolute right-2 p-1.5 bg-navy/70 text-paper rounded-full disabled:opacity-30"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </>
                )}
              </div>

              {/* Kaagaz Smart Enhancement Filters */}
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1.5">
                  ✨ Enhancement Filter (Kaagaz Clean)
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {[
                    { key: 'magic', label: 'Magic Color' },
                    { key: 'bw', label: 'B&W Xeroc' },
                    { key: 'gray', label: 'Grayscale' },
                    { key: 'original', label: 'Original' }
                  ].map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => handleChangeFilter(f.key as any)}
                      className={
                        'py-1.5 rounded-xl font-bold text-[11px] border transition-all ' +
                        (pages[currentPageIdx]?.filter === f.key
                          ? 'bg-navy text-paper border-navy shadow-sm'
                          : 'bg-paper-dim text-ink-muted border-paper-dim hover:text-ink')
                      }
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multi-Page Carousel Thumbnails */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold uppercase text-ink-muted">
                    📑 Saare Pages ({pages.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="text-[10px] font-bold text-navy flex items-center gap-0.5 hover:text-gold"
                  >
                    <Plus size={12} /> Naya Page Add Karein
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                  {pages.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setCurrentPageIdx(idx)}
                      className={
                        'w-12 h-16 rounded-lg overflow-hidden border-2 shrink-0 relative ' +
                        (currentPageIdx === idx ? 'border-gold shadow-md' : 'border-paper-dim opacity-70')
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.enhancedSrc} alt="thumbnail" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 right-0 bg-navy text-paper text-[8px] px-1 font-mono">
                        {idx + 1}
                      </span>
                    </button>
                  ))}

                  {/* Add Page Button */}
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-12 h-16 rounded-lg border-2 border-dashed border-paper-dim hover:border-gold flex items-center justify-center text-ink-muted shrink-0"
                    title="Add Page"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        {pages.length > 0 && (
          <div className="p-3 bg-paper-dim border-t border-paper-dim flex gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold border-navy text-navy"
            >
              <Download size={14} /> PDF Download
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleSaveToApp}
              className="flex-1 bg-navy text-paper flex items-center justify-center gap-1.5 text-xs font-bold shadow"
            >
              {isSavedSuccess ? <Check size={14} className="text-green" /> : <ShieldCheck size={14} />}
              {isSavedSuccess ? 'Saved in Vault!' : 'Vault Me Save Karein'}
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
