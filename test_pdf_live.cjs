const http = require('http');

setTimeout(() => {
  http.get('http://localhost:3000/scanner', (res) => {
    console.log('Scanner & PDF-to-Excel Page Status:', res.statusCode);
  }).on('error', (err) => {
    console.log('Error:', err.message);
  });
}, 3000);
