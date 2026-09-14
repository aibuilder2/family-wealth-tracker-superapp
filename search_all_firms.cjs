const fs = require('fs');

let lines = fs.readFileSync('lib/store/familyStore.tsx', 'utf8').split('\n');

lines.forEach((l, i) => {
  if (l.includes('addBusinessFirm')) {
    console.log(`Line ${i + 1}: ${l}`);
  }
});
