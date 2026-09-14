const fs = require('fs');
let code = fs.readFileSync('lib/store/familyStore.tsx', 'utf8');
code = code.replace('HouseholdStaff, CourtCase, CreditCard', 'HouseholdStaff, CourtCase, CourtHearing, CreditCard');
fs.writeFileSync('lib/store/familyStore.tsx', code, 'utf8');
console.log('Fixed CourtHearing import');
