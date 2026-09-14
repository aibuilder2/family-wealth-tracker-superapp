const fs = require('fs');

let types = fs.readFileSync('types/index.ts', 'utf8');

types = types.replace(
  "hearings: CourtHearing[];",
  `hearings: CourtHearing[];
  lawyer_total_agreed_fee?: number;
  lawyer_advance_paid?: number;
  lawyer_per_peshi_fee?: number;
  lawyer_total_paid?: number;
  lawyer_balance_due?: number;
  lawyer_payments?: LawyerFeePayment[];`
);

fs.writeFileSync('types/index.ts', types, 'utf8');
console.log('Updated CourtCase interface in types/index.ts');
