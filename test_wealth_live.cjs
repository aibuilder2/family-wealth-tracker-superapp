const http = require('http');

setTimeout(() => {
  http.get('http://localhost:3000/wealth', (res) => {
    console.log('Wealth Page HTTP Status:', res.statusCode);
  }).on('error', (err) => {
    console.log('Error:', err.message);
  });
}, 3000);
