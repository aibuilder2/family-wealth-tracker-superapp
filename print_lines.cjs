const fs = require('fs');

let lines = fs.readFileSync('lib/store/familyStore.tsx', 'utf8').split('\n');
for (let i = 650; i < 710 && i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
