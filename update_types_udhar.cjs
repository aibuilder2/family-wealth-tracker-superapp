const fs = require('fs');

// Append Udhar types to types/index.ts
let types = fs.readFileSync('types/index.ts', 'utf8');

const udharTypes = `
// ==========================================
// ADVANCED UDHAR & SETTLEMENT TYPES
// ==========================================
export type UdharSettlementMode = 'cash_online' | 'samaan_goods' | 'kaam_service';

export interface UdharSettlement {
  id: string;
  contact_id: string;
  date: string;
  amount: number;
  settlement_mode: UdharSettlementMode;
  note: string; // e.g. "Cash diya", "1 bora gehu dekar adjust kiya", "Tractor chalakar kaam kiya"
}

export interface UdharContact {
  id: string;
  family_id: string;
  member_id: string; // which family member is involved
  person_name: string; // External person or relative name
  phone?: string;
  type: 'given' | 'taken'; // Maine diya (Receivable) vs Maine liya (Payable)
  original_amount: number;
  remaining_balance: number;
  due_date?: string;
  notes?: string;
  settlements: UdharSettlement[];
  status: 'active' | 'settled';
  created_at: string;
}
`;

if (!types.includes('UdharContact')) {
  fs.writeFileSync('types/index.ts', types.trim() + '\n' + udharTypes.trim() + '\n', 'utf8');
  console.log('Added UdharContact and UdharSettlement types');
}
