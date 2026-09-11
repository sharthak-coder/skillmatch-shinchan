const http = require('http');

http.get('http://localhost:3001', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    let idx = 0;
    while ((idx = data.toLowerCase().indexOf('error', idx)) !== -1) {
      console.log('--- Found "error" at', idx, '---');
      console.log(data.substring(Math.max(0, idx - 80), Math.min(data.length, idx + 120)));
      idx += 5;
    }
  });
});
