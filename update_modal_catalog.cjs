const fs = require('fs');

const updatedModal = `'use client';

import React, { useState, useRef } from 'react';
import { FileSpreadsheet, Upload, Download, Sparkles, Check, Table, X, RefreshCw, ShoppingBag, Landmark, Sprout, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import * as XLSX from 'xlsx';
import confetti from 'canvas-confetti';

interface PdfToExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PdfToExcelModal({ isOpen, onClose }: PdfToExcelModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractMode, setExtractMode] = useState<'catalog' | 'bank' | 'agri'>('catalog');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [fileName, setFileName] = useState('');
  const [isExtracted, setIsExtracted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadedFile = files[0];
    setFile(uploadedFile);
    setFileName(uploadedFile.name.replace(/\\.[^/.]+$/, ''));
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('mode', extractMode);
      formData.append('isImage', uploadedFile.type.startsWith('image/') ? 'true' : 'false');

      const res = await fetch('/api/pdf-to-excel', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setHeaders(data.headers);
        setRows(data.rows);
        setIsExtracted(true);
        try { confetti({ particleCount: 45, spread: 55 }); } catch (e) {}
      }
    } catch (err) {
      console.error('Extraction error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCellEdit = (rowIdx: number, colIdx: number, val: string) => {
    const updated = [...rows];
    updated[rowIdx][colIdx] = val;
    setRows(updated);
  };

  const handleHeaderEdit = (colIdx: number, val: string) => {
    const updated = [...headers];
    updated[colIdx] = val;
    setHeaders(updated);
  };

  // Download real .XLSX Excel File using SheetJS
  const handleDownloadExcel = () => {
    if (headers.length === 0) return;

    const fullTable = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(fullTable);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory_Billing');

    XLSX.writeFile(wb, (fileName || 'Business_Catalog_Billing') + '.xlsx');
    try { confetti({ particleCount: 35, spread: 45 }); } catch (e) {}
  };

  // Download .CSV File (Ideal for Tally & Vyapar import)
  const handleDownloadCSV = () => {
    if (headers.length === 0) return;

    const fullTable = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(fullTable);
    const csvOutput = XLSX.utils.sheet_to_csv(ws);

    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', (fileName || 'Billing_Items_Import') + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 bg-navy-dark/90 backdrop-blur-md">
      <div className="w-full max-w-lg bg-paper rounded-3xl border border-gold/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-navy text-paper flex items-center justify-between border-b border-navy-light shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-green/20 text-green flex items-center justify-center border border-green/40">
              <FileSpreadsheet size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-paper">Business PDF to Excel Converter</h3>
              <span className="text-[10px] text-gold-soft">Billing Apps, Product Catalogs & Bank Statements</span>
            </div>
          </div>
          <button onClick={onClose} className="text-paper/70 hover:text-paper p-1">
            <X size={20} />
          </button>
        </div>

        <input
          type="file"
          accept=".pdf,image/*,.csv"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {!isExtracted ? (
            /* Upload State */
            <div className="space-y-4">
              {/* Document Mode Selector */}
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1.5">
                  Aap Kis Type Ka Document Convert Kar Rahe Hain?
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setExtractMode('catalog')}
                    className={'p-2 rounded-2xl border text-center transition-all ' + (extractMode === 'catalog' ? 'bg-navy text-paper border-navy shadow' : 'bg-paper-dim text-ink-muted border-paper-dim hover:text-ink')}
                  >
                    <ShoppingBag size={16} className="mx-auto mb-1 text-gold" />
                    <span className="font-bold block text-[11px]">Product Catalog</span>
                    <span className="text-[9px] opacity-70">Item, Code, Rate, Size</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExtractMode('bank')}
                    className={'p-2 rounded-2xl border text-center transition-all ' + (extractMode === 'bank' ? 'bg-navy text-paper border-navy shadow' : 'bg-paper-dim text-ink-muted border-paper-dim hover:text-ink')}
                  >
                    <Landmark size={16} className="mx-auto mb-1 text-green" />
                    <span className="font-bold block text-[11px]">Bank Statement</span>
                    <span className="text-[9px] opacity-70">Debit, Credit, Date</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExtractMode('agri')}
                    className={'p-2 rounded-2xl border text-center transition-all ' + (extractMode === 'agri' ? 'bg-navy text-paper border-navy shadow' : 'bg-paper-dim text-ink-muted border-paper-dim hover:text-ink')}
                  >
                    <Sprout size={16} className="mx-auto mb-1 text-gold" />
                    <span className="font-bold block text-[11px]">Mandi / Kheti Slip</span>
                    <span className="text-[9px] opacity-70">Crop, Quintal, Rate</span>
                  </button>
                </div>
              </div>

              <div className="text-center py-6 space-y-3 bg-paper-dim/60 rounded-3xl border border-paper-dim p-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-green/10 border-2 border-dashed border-green flex items-center justify-center text-green">
                  <FileSpreadsheet size={32} />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-ink font-serif">PDF Catalog ya Rate List Upload Karein</h4>
                  <p className="text-[11px] text-ink-muted mt-1 max-w-xs mx-auto">
                    {extractMode === 'catalog'
                      ? 'Product photo ke bagal me likhe Item Code, Name, Size aur Rates ko automatic billing Excel sheet me badal deta hai.'
                      : 'Bank Statement PDF dalein — clean rows & columns ban jayengi.'}
                  </p>
                </div>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="bg-navy text-paper font-bold px-6 py-2.5 rounded-xl shadow inline-flex items-center gap-2 text-xs"
                >
                  {isProcessing ? <RefreshCw size={16} className="animate-spin text-gold" /> : <Upload size={16} />}
                  <span>{isProcessing ? 'AI Vision Extracting...' : 'Upload Business PDF / Photo'}</span>
                </Button>
              </div>

              {/* Ready for Billing Software Badge */}
              <div className="p-3 bg-gold/10 border border-gold/30 rounded-2xl text-[11px] text-ink flex items-start gap-2">
                <Sparkles size={16} className="text-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-navy font-bold">Billing Apps Ready (.XLSX / .CSV):</strong>
                  <span className="text-ink-muted text-[10px]">
                    Vyapar App, myBillBook, Marg ERP, Busy, Zoho Books aur Tally me direct import karne ke liye standard columns format.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Extracted Table Spreadsheet Grid View */
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-ink block">{fileName || 'Business_Catalog'}</span>
                  <span className="text-[10px] text-green font-bold flex items-center gap-1">
                    <Check size={12} /> {rows.length} Products / Rows Extracted Ready for Billing Software
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setIsExtracted(false); setFile(null); }}
                  className="text-[10px] py-1 h-7 border-paper-dim"
                >
                  Nayi File Dalein
                </Button>
              </div>

              {/* Editable Spreadsheet Grid */}
              <div className="border border-paper-dim rounded-2xl overflow-x-auto max-h-[45vh] shadow-inner bg-paper">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="bg-navy text-paper divide-x divide-navy-light font-bold">
                      {headers.map((h, colIdx) => (
                        <th key={colIdx} className="p-2 min-w-[130px]">
                          <input
                            type="text"
                            value={h}
                            onChange={(e) => handleHeaderEdit(colIdx, e.target.value)}
                            className="bg-transparent font-bold text-paper w-full focus:outline-none focus:bg-navy-light px-1 rounded"
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-paper-dim font-mono text-xs">
                    {rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-gold/5 divide-x divide-paper-dim">
                        {row.map((cell, colIdx) => (
                          <td key={colIdx} className="p-1.5 min-w-[130px]">
                            <input
                              type="text"
                              value={cell}
                              onChange={(e) => handleCellEdit(rowIdx, colIdx, e.target.value)}
                              className="bg-transparent text-ink w-full focus:outline-none focus:bg-gold/10 px-1 rounded font-mono text-[11px]"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <span className="text-[10px] text-ink-muted block text-center">
                💡 Tip: Download karne se pehle aap screen par kisi bhi rate ya size ko click karke edit kar sakte hain!
              </span>
            </div>
          )}
        </div>

        {/* Bottom Download Bar */}
        {isExtracted && (
          <div className="p-3 bg-paper-dim border-t border-paper-dim flex gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadCSV}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold border-paper-dim text-ink"
            >
              <Download size={14} /> Download .CSV (Tally/Vyapar)
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleDownloadExcel}
              className="flex-1 bg-green hover:bg-green/90 text-white flex items-center justify-center gap-1.5 text-xs font-bold shadow"
            >
              <FileSpreadsheet size={14} /> Download .XLSX (Excel)
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
`;

fs.writeFileSync('components/scanner/PdfToExcelModal.tsx', updatedModal.trim() + '\n', 'utf8');
console.log('Saved enhanced Product Catalog & Billing PDF to Excel Modal');
