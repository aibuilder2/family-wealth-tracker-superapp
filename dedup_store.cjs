const fs = require('fs');

let store = fs.readFileSync('lib/store/familyStore.tsx', 'utf8');

// Find and remove duplicate addBusinessFirm and recordFirmDrawingToFamily
const firstIndex = store.indexOf('const addBusinessFirm = (fData');
const secondIndex = store.lastIndexOf('const addBusinessFirm = (fData');

if (firstIndex !== -1 && secondIndex !== -1 && firstIndex !== secondIndex) {
  const duplicateChunk = store.substring(secondIndex, store.indexOf('const addFleetVehicle', secondIndex));
  store = store.replace(duplicateChunk, '');
  fs.writeFileSync('lib/store/familyStore.tsx', store, 'utf8');
  console.log('Removed duplicate functions successfully.');
} else {
  console.log('No duplicates found or already cleaned.');
}
