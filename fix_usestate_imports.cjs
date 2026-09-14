const fs = require('fs');

['app/(dashboard)/medical/page.tsx', 'app/(dashboard)/vault/page.tsx'].forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace("import React from 'react';", "import React, { useState } from 'react';");
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Added useState import to ${filePath}`);
});
