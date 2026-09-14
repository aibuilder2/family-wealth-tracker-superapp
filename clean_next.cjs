const fs = require('fs');
try {
  fs.rmSync('.next', { recursive: true, force: true });
  console.log('Cleaned .next folder.');
} catch (e) {
  console.log('Error cleaning .next:', e.message);
}
