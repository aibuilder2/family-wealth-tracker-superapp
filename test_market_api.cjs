const http = require('http');

setTimeout(() => {
  http.get('http://localhost:3000/api/market-prices', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Market API HTTP Status:', res.statusCode);
      const json = JSON.parse(data);
      console.log('Gold Rate per 10g:', json.gold?.rate_per_10g_24k);
      console.log('Reliance Stock:', json.stocks?.RELIANCE?.price);
      console.log('Parag Parikh MF NAV:', json.mutual_funds?.['122639']?.nav);
    });
  }).on('error', (err) => {
    console.log('Error:', err.message);
  });
}, 3000);
