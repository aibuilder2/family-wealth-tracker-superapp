const fs = require('fs');

let vault = fs.readFileSync('app/(dashboard)/vault/page.tsx', 'utf8');

if (!vault.includes('KaagazScannerModal')) {
  vault = vault.replace(
    "import VaultLockModal from '@/components/security/VaultLockModal';",
    "import VaultLockModal from '@/components/security/VaultLockModal';\nimport KaagazScannerModal from '@/components/scanner/KaagazScannerModal';\nimport { Camera } from 'lucide-react';"
  );

  vault = vault.replace(
    "const [isLocked, setIsLocked] = useState(true);",
    "const [isLocked, setIsLocked] = useState(true);\n  const [isScannerOpen, setIsScannerOpen] = useState(false);"
  );

  // Add Scan Button near the top
  const scanButtonSnippet = `      {/* Kaagaz Scanner Quick Action */}
      <div className="px-4">
        <button
          type="button"
          onClick={() => setIsScannerOpen(true)}
          className="w-full p-3 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-2xl flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gold text-navy flex items-center justify-center font-bold">
              <Camera size={16} />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-ink block">📄 Kaagaz Scanner (Camera Se Scan)</span>
              <span className="text-[10px] text-ink-muted">Registry, Insurance ya Prescriptions ke multiple pages scan karein</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-navy bg-paper px-2 py-1 rounded-lg border border-paper-dim">Scan Now</span>
        </button>
      </div>\n`;

  vault = vault.replace('<div className="px-4">', scanButtonSnippet + '<div className="px-4">');

  // Add KaagazScannerModal before closing fragment
  vault = vault.replace('</>', `<KaagazScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} defaultCategory="property" />\n    </>`);

  fs.writeFileSync('app/(dashboard)/vault/page.tsx', vault, 'utf8');
  console.log('Added Kaagaz Scanner to Vault page');
}
