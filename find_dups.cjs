const fs = require('fs');

let lines = fs.readFileSync('lib/store/familyStore.tsx', 'utf8').split('\n');
lines.forEach((l, idx) => {
  if (l.includes('const addBusinessFirm') || l.includes('const recordFirmDrawingToFamily')) {
    console.log(`Line ${idx + 1}: ${l}`);
  }
});
