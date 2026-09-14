const fs = require('fs');

let types = fs.readFileSync('types/index.ts', 'utf8');

const firmTypes = `
// ==========================================
// REGISTERED BUSINESS FIRM & GST TYPES
// ==========================================
export type EntityType = 'Proprietorship' | 'Partnership_Firm' | 'Pvt_Ltd' | 'LLP' | 'Individual_Unregistered';

export interface FirmDrawing {
  id: string;
  firm_id: string;
  date: string;
  amount: number;
  drawing_type: 'partner_salary' | 'profit_dividend' | 'director_remuneration';
  credited_to_member_id: string;
  note: string;
}

export interface BusinessFirm {
  id: string;
  family_id: string;
  firm_name: string; // e.g. "Sharma Roadways & Logistics"
  entity_type: EntityType;
  gstin?: string; // e.g. "07AAAAA0000A1Z5"
  pan?: string;
  bank_current_acc: string;
  total_revenue: number;
  total_expenses: number;
  total_gst_collected: number;
  total_tds_deducted: number;
  current_firm_balance: number;
  total_drawings_paid: number;
  drawings: FirmDrawing[];
}
`;

if (!types.includes('BusinessFirm')) {
  fs.writeFileSync('types/index.ts', types.trim() + '\n' + firmTypes.trim() + '\n', 'utf8');
  console.log('Appended BusinessFirm and GST types to types/index.ts');
}
