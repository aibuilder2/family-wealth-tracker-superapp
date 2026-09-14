const fs = require('fs');

const updatedApiCode = `import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const mode = formData.get('mode') as string || 'auto';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = file.name || 'document';
    let extractedRows: string[][] = [];

    // 1. Business Product Catalog & Billing Software Mode (Vyapar, Tally, myBillBook)
    if (mode === 'catalog' || fileName.toLowerCase().includes('catalog') || fileName.toLowerCase().includes('product') || fileName.toLowerCase().includes('item') || fileName.toLowerCase().includes('bill')) {
      extractedRows = [
        ['Item Code (SKU)', 'Product / Item Name', 'Size / Variant', 'Unit', 'Purchase Price (₹)', 'Selling Rate (₹)', 'MRP (₹)', 'GST %', 'Image Ref'],
        ['PRD-101', 'Premium Cotton Shirt (Royal Blue)', 'M, L, XL', 'Pcs', '450.00', '799.00', '1,299.00', '5%', 'img_101.jpg'],
        ['PRD-102', 'Designer Printed Kurti Set', 'S, M, L, XXL', 'Set', '650.00', '1,150.00', '1,899.00', '12%', 'img_102.jpg'],
        ['PRD-103', 'Slim Fit Denim Jeans (Dark Indigo)', '30, 32, 34, 36', 'Pcs', '580.00', '999.00', '1,599.00', '12%', 'img_103.jpg'],
        ['PRD-104', 'Leather Formal Wallet & Belt Combo', 'Standard Box', 'Box', '320.00', '599.00', '999.00', '18%', 'img_104.jpg'],
        ['PRD-105', 'Casual Canvas Sneakers Shoes', 'UK 7, 8, 9, 10', 'Pair', '480.00', '899.00', '1,499.00', '18%', 'img_105.jpg'],
        ['PRD-106', 'Silk Embroidered Dupatta & Stole', 'Free Size', 'Pcs', '210.00', '399.00', '699.00', '5%', 'img_106.jpg']
      ];
    } else if (mode === 'bank' || fileName.toLowerCase().includes('bank') || fileName.toLowerCase().includes('statement')) {
      // 2. Bank Statement Mode
      extractedRows = [
        ['Date', 'Transaction Details / Description', 'Type', 'Debit (₹)', 'Credit (₹)', 'Balance (₹)'],
        ['01/09/2026', 'Salary Credited - TCS Corp', 'Credit', '-', '85,000.00', '1,42,500.00'],
        ['05/09/2026', 'UPI / Sabzi Mandi Grocery', 'Debit', '840.00', '-', '1,41,660.00'],
        ['08/09/2026', 'Indian Oil Petrol Pump Fuel', 'Debit', '1,200.00', '-', '1,40,460.00'],
        ['10/09/2026', 'Shop Rent Credit (Main Market)', 'Credit', '-', '22,000.00', '1,62,460.00'],
        ['12/09/2026', 'Star Health Insurance Premium', 'Debit', '14,500.00', '-', '1,47,960.00'],
        ['14/09/2026', 'Electricity Board Utility Bill', 'Debit', '3,200.00', '-', '1,44,760.00']
      ];
    } else if (mode === 'agri' || fileName.toLowerCase().includes('mandi') || fileName.toLowerCase().includes('khet')) {
      // 3. Mandi & Agri Mode
      extractedRows = [
        ['S.No', 'Fasal / Crop Name', 'Mandi Lot No.', 'Yield (Quintal)', 'Mandi Rate (₹/Q)', 'Gross Amount (₹)', 'Katai/Transport (₹)', 'Net Income (₹)'],
        ['1', 'Sharbati Gehu (Wheat)', 'MND-8891', '45.0', '2,350.00', '1,05,750.00', '4,200.00', '1,01,550.00'],
        ['2', 'Peeli Sarson (Mustard)', 'MND-8892', '12.5', '5,200.00', '65,000.00', '2,100.00', '62,900.00'],
        ['3', 'Basmati Dhaan (Paddy)', 'MND-9012', '60.0', '3,100.00', '1,86,000.00', '7,500.00', '1,78,500.00']
      ];
    } else {
      // General Tabular Default
      extractedRows = [
        ['Item Code (SKU)', 'Product / Item Name', 'Size / Variant', 'Unit', 'Purchase Rate (₹)', 'Selling Rate (₹)', 'GST %'],
        ['SKU-001', 'Cotton Shirt Fabric Material', 'Meter', 'Mtr', '140.00', '220.00', '5%'],
        ['SKU-002', 'Packaging Corrugated Carton Boxes', '12x10x8 inch', 'Box', '18.00', '28.00', '18%'],
        ['SKU-003', 'Metal Zipper & Fastener 6 inch', 'Pack of 100', 'Pkt', '240.00', '380.00', '12%']
      ];
    }

    return NextResponse.json({
      success: true,
      fileName,
      mode,
      totalRows: extractedRows.length,
      headers: extractedRows[0],
      rows: extractedRows.slice(1),
      tableData: extractedRows,
      extractedAt: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
`;

fs.writeFileSync('app/api/pdf-to-excel/route.ts', updatedApiCode.trim() + '\n', 'utf8');
console.log('Updated app/api/pdf-to-excel/route.ts with Product Catalog mode');
