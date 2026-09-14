const fs = require('fs');

let page = fs.readFileSync('app/(dashboard)/wealth/page.tsx', 'utf8');
page = page.replace(/asset\.type === 'mutual_fund'/g, "asset.type === 'mutual_funds'");
page = page.replace(/<option value="mutual_fund">/g, '<option value="mutual_funds">');
page = page.replace(/'mutual_fund'/g, "'mutual_funds'");

fs.writeFileSync('app/(dashboard)/wealth/page.tsx', page, 'utf8');
console.log('Fixed mutual_funds type in wealth/page.tsx');
