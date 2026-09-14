const fs = require('fs');

let content = fs.readFileSync('lib/store/familyStore.tsx', 'utf8');

// Find all occurrences of recordFirmDrawingToFamily
let count = 0;
let pos = content.indexOf('recordFirmDrawingToFamily');
while (pos !== -1) {
  count++;
  console.log(`Found occurrence ${count} at pos ${pos}`);
  pos = content.indexOf('recordFirmDrawingToFamily', pos + 1);
}
