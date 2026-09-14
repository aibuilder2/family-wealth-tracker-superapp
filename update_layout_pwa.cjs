const fs = require('fs');
let layout = fs.readFileSync('app/layout.tsx', 'utf8');

if (!layout.includes('manifest.json')) {
  layout = layout.replace(
    'export const metadata = {',
    `export const metadata = {
  manifest: '/manifest.json',
  themeColor: '#10263A',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FamilyWealth'
  },`
  );
  fs.writeFileSync('app/layout.tsx', layout, 'utf8');
  console.log('Added PWA metadata to app/layout.tsx');
}
