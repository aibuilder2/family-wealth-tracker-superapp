const fs = require('fs');

let content = fs.readFileSync('lib/store/familyStore.tsx', 'utf8');

const badChunk = `  const [fleetVehicles,
        businessFirms,
        addBusinessFirm,
        setFleetVehicles] = useState<CommercialFleetVehicle[]>(INITIAL_FLEET);
  const [businessFirms, setBusinessFirms] = useState<BusinessFirm[]>(INITIAL_FIRMS);`;

const goodChunk = `  const [fleetVehicles, setFleetVehicles] = useState<CommercialFleetVehicle[]>(INITIAL_FLEET);
  const [businessFirms, setBusinessFirms] = useState<BusinessFirm[]>(INITIAL_FIRMS);`;

content = content.replace(badChunk, goodChunk);
fs.writeFileSync('lib/store/familyStore.tsx', content, 'utf8');
console.log('Fixed useState declaration cleanly!');
