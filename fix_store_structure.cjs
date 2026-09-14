const fs = require('fs');

let content = fs.readFileSync('lib/store/familyStore.tsx', 'utf8');

content = content.replace(
  "recordFirmDrawingToFamily, setFleetVehicles] = useState<CommercialFleetVehicle[]>(INITIAL_FLEET);",
  "setFleetVehicles] = useState<CommercialFleetVehicle[]>(INITIAL_FLEET);"
);

fs.writeFileSync('lib/store/familyStore.tsx', content, 'utf8');
console.log('Fixed malformed state line in familyStore.tsx');
