const fs = require('fs');

let content = fs.readFileSync('lib/store/familyStore.tsx', 'utf8');

content = content.replace(
  "addFleetTrip,",
  "addFleetTrip,\n        businessFirms,\n        addBusinessFirm,\n        recordFirmDrawingToFamily,"
);

fs.writeFileSync('lib/store/familyStore.tsx', content, 'utf8');
console.log('Added businessFirms to Provider value block.');
