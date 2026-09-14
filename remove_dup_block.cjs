const fs = require('fs');

let lines = fs.readFileSync('lib/store/familyStore.tsx', 'utf8').split('\n');

const dupIndices = [];
lines.forEach((l, i) => {
  if (l.includes('const addBusinessFirm = (fData')) {
    dupIndices.push(i);
  }
});

console.log('addBusinessFirm at lines:', dupIndices.map(i => i + 1));

// If there are 2, remove the second one and its sibling recordFirmDrawingToFamily
if (dupIndices.length > 1) {
  const secondIndex = dupIndices[1];
  // find where this duplicate block ends (before const addFleetVehicle)
  let endIdx = secondIndex;
  while (endIdx < lines.length && !lines[endIdx].includes('const addFleetVehicle')) {
    endIdx++;
  }
  lines.splice(secondIndex, endIdx - secondIndex);
  fs.writeFileSync('lib/store/familyStore.tsx', lines.join('\n'), 'utf8');
  console.log('Removed duplicate block from line ' + (secondIndex + 1) + ' to ' + (endIdx + 1));
}
