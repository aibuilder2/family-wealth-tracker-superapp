const fs = require('fs');

let vaultPage = fs.readFileSync('app/(dashboard)/vault/page.tsx', 'utf8');

if (!vaultPage.includes('VaultLockModal')) {
  // Add import
  vaultPage = `import VaultLockModal from '@/components/security/VaultLockModal';\n` + vaultPage;

  // Add state inside component
  const stateInsert = `  const [isLocked, setIsLocked] = useState(true);`;
  vaultPage = vaultPage.replace('export default function VaultPage() {', `export default function VaultPage() {\n${stateInsert}`);

  // Add lock modal inside return
  vaultPage = vaultPage.replace(
    'return (',
    `return (\n    <>\n      <VaultLockModal isOpen={isLocked} onUnlocked={() => setIsLocked(false)} title="Documents Vault Locked" description="Zameen registry, Insurance aur personal kagaz dekhne ke liye 6-Digit PIN ya Fingerprint use karein." />`
  );

  // Close fragment at the end
  const lastDivIdx = vaultPage.lastIndexOf('</div>');
  if (lastDivIdx !== -1) {
    vaultPage = vaultPage.substring(0, lastDivIdx + 6) + '\n    </>' + vaultPage.substring(lastDivIdx + 6);
  }

  fs.writeFileSync('app/(dashboard)/vault/page.tsx', vaultPage, 'utf8');
  console.log('Added VaultLockModal to vault/page.tsx');
}
