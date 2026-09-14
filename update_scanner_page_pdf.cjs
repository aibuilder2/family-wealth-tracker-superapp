const fs = require('fs');

let scanner = fs.readFileSync('app/(dashboard)/scanner/page.tsx', 'utf8');

if (!scanner.includes('PdfToExcelModal')) {
  scanner = `import PdfToExcelModal from '@/components/scanner/PdfToExcelModal';\nimport { FileSpreadsheet } from 'lucide-react';\n` + scanner;

  scanner = scanner.replace(
    "const [isScannerOpen, setIsScannerOpen] = useState(false);",
    "const [isScannerOpen, setIsScannerOpen] = useState(false);\n  const [isPdfExcelOpen, setIsPdfExcelOpen] = useState(false);"
  );

  const pdfExcelButton = `      {/* PDF to Excel Converter Card */}
      <div className="px-4">
        <button
          type="button"
          onClick={() => setIsPdfExcelOpen(true)}
          className="w-full p-4 bg-green/10 hover:bg-green/15 border border-green/30 rounded-3xl flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-green text-white flex items-center justify-center font-bold shadow-md">
              <FileSpreadsheet size={20} />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-ink block">📊 PDF to Excel Sheet Converter</span>
              <span className="text-[10px] text-ink-muted">Bank Statement, Mandi Parchi ya Bill PDF se Excel sheet banayein</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-green bg-paper px-2.5 py-1.5 rounded-xl border border-paper-dim shadow-sm">Convert Now</span>
        </button>
      </div>\n`;

  scanner = scanner.replace('<div className="px-4 grid grid-cols-3', pdfExcelButton + '<div className="px-4 grid grid-cols-3');

  // Add modal before last closing div
  scanner = scanner.replace(
    '<KaagazScannerModal',
    `<PdfToExcelModal isOpen={isPdfExcelOpen} onClose={() => setIsPdfExcelOpen(false)} />\n      <KaagazScannerModal`
  );

  fs.writeFileSync('app/(dashboard)/scanner/page.tsx', scanner, 'utf8');
  console.log('Added PDF to Excel Converter to Scanner Page');
}
