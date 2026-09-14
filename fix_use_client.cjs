const fs = require('fs');

['app/(dashboard)/medical/page.tsx', 'app/(dashboard)/vault/page.tsx'].forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace("import VaultLockModal from '@/components/security/VaultLockModal';\n'use client';", "'use client';\nimport VaultLockModal from '@/components/security/VaultLockModal';");
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed use client on top of ${filePath}`);
});
