const fs = require('fs');
const path = require('path');

// 1. Create public/manifest.json
const manifest = {
  name: "Family Wealth App — Parivar Tracker",
  short_name: "FamilyWealth",
  description: "Complete family finances, wealth, agriculture, transport fleet, health & document vault tracker",
  start_url: "/home",
  display: "standalone",
  background_color: "#10263A",
  theme_color: "#10263A",
  orientation: "portrait",
  icons: [
    {
      src: "/icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/icons/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable"
    }
  ]
};

fs.mkdirSync('public/icons', { recursive: true });
fs.writeFileSync('public/manifest.json', JSON.stringify(manifest, null, 2), 'utf8');

// Generate SVG app icon and save
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="100" fill="#10263A"/>
  <circle cx="256" cy="256" r="180" fill="#173248" stroke="#B98B2A" stroke-width="12"/>
  <path d="M256 120 L350 200 L320 360 L192 360 L162 200 Z" fill="#B98B2A" opacity="0.9"/>
  <text x="256" y="290" font-family="serif" font-size="120" font-weight="bold" fill="#FBF8F2" text-anchor="middle">₹</text>
  <path d="M256 370 L280 410 L232 410 Z" fill="#E4C77E"/>
</svg>`;

fs.writeFileSync('public/icons/app-icon.svg', svgIcon, 'utf8');
console.log('PWA manifest & icon created.');
