const fs = require('fs');

let content = fs.readFileSync('lib/store/familyStore.tsx', 'utf8');

[24433, 29237, 40759].forEach((p, i) => {
  console.log(`--- Occurrence ${i + 1} ---`);
  console.log(content.substring(p - 50, p + 150));
});
