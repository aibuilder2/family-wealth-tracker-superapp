const fs = require('fs');

let sec = fs.readFileSync('lib/crypto/vaultSecurity.ts', 'utf8');

sec = sec.replace(
  "return btoa(String.fromCharCode(...combined));",
  "let binary = ''; for (let i = 0; i < combined.length; i++) binary += String.fromCharCode(combined[i]); return btoa(binary);"
);

fs.writeFileSync('lib/crypto/vaultSecurity.ts', sec, 'utf8');
console.log('Fixed Uint8Array iteration in vaultSecurity.ts');
