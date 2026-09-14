const fs = require('fs');

let medPage = fs.readFileSync('app/(dashboard)/medical/page.tsx', 'utf8');

if (!medPage.includes('VaultLockModal')) {
  medPage = `import VaultLockModal from '@/components/security/VaultLockModal';\n` + medPage;
  const stateInsert = `  const [isLocked, setIsLocked] = useState(true);`;
  medPage = medPage.replace('export default function MedicalPage() {', `export default function MedicalPage() {\n${stateInsert}`);

  medPage = medPage.replace(
    'return (',
    `return (\n    <>\n      <VaultLockModal isOpen={isLocked} onUnlocked={() => setIsLocked(false)} title="Medical Health Vault Locked" description="Parivar ke blood groups aur confidential bimariyo ka data dekhne ke liye Vault PIN ya Fingerprint use karein." />`
  );

  const lastDivIdx = medPage.lastIndexOf('</div>');
  if (lastDivIdx !== -1) {
    medPage = medPage.substring(0, lastDivIdx + 6) + '\n    </>' + medPage.substring(lastDivIdx + 6);
  }

  fs.writeFileSync('app/(dashboard)/medical/page.tsx', medPage, 'utf8');
  console.log('Added VaultLockModal to medical/page.tsx');
}
