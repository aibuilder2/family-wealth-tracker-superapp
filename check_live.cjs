const http = require('http');

http.get('http://localhost:3000/home', (res) => {
  console.log('App Status Code:', res.statusCode);
}).on('error', (err) => {
  console.log('App check error:', err.message);
});
