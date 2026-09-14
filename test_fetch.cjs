const http = require('http');

setTimeout(() => {
  http.get('http://localhost:3000/home', (res) => {
    console.log('HTTP Status Code:', res.statusCode);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Response length:', data.length);
      console.log('Has Title:', data.includes('Sharma Parivar'));
    });
  }).on('error', (err) => {
    console.log('Error fetching:', err.message);
  });
}, 3000);
