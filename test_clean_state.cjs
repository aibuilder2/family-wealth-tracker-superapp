const http = require('http');

setTimeout(() => {
  http.get('http://localhost:3000/home', (res) => {
    console.log('Clean Home Page Status:', res.statusCode);
  }).on('error', (err) => {
    console.log('Error:', err.message);
  });
}, 3000);
