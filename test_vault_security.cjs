const http = require('http');

setTimeout(() => {
  http.get('http://localhost:3000/vault', (res) => {
    console.log('Vault Security Page Status:', res.statusCode);
  }).on('error', (err) => {
    console.log('Error:', err.message);
  });
}, 3000);
