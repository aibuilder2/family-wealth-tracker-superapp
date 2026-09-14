const http = require('http');

setTimeout(() => {
  // Test search query 'tata'
  http.get('http://localhost:3000/api/search-assets?q=tata', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Search API Status:', res.statusCode);
      const json = JSON.parse(data);
      console.log(`Found ${json.results.length} results for 'tata':`);
      json.results.forEach(r => console.log(` - ${r.name} (${r.symbol}) -> ₹${r.price}`));
    });
  }).on('error', (err) => {
    console.log('Search test error:', err.message);
  });
}, 3000);
