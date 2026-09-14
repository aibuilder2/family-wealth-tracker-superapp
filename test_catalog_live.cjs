const http = require('http');

setTimeout(() => {
  http.get('http://localhost:3000/scanner', (res) => {
    console.log('Scanner & Catalog Mode Status:', res.statusCode);
  }).on('error', (err) => {
    console.log('Error:', err.message);
  });
}, 3000);
