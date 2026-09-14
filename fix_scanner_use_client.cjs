const fs = require('fs');

let scanner = fs.readFileSync('app/(dashboard)/scanner/page.tsx', 'utf8');

// Ensure 'use client'; is on line 1
scanner = scanner.replace("import PdfToExcelModal from '@/components/scanner/PdfToExcelModal';\nimport { FileSpreadsheet } from 'lucide-react';\n'use client';", "'use client';\nimport PdfToExcelModal from '@/components/scanner/PdfToExcelModal';\nimport { FileSpreadsheet } from 'lucide-react';");

fs.writeFileSync('app/(dashboard)/scanner/page.tsx', scanner, 'utf8');
console.log('Fixed use client line 1 in scanner/page.tsx');
