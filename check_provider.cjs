const fs = require('fs');

let content = fs.readFileSync('lib/store/familyStore.tsx', 'utf8');

// Let us find the duplicate Provider return block
// Provider should start with `export function FamilyProvider`
// and end with `</FamilyContext.Provider>); }`
console.log('Analyzing Provider block structure...');

// Check if there are multiple return (<FamilyContext.Provider
const matches = content.match(/return \(\s*<FamilyContext\.Provider/g);
console.log('Provider return blocks found:', matches ? matches.length : 0);
