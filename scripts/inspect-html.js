const http = require('http');

http.get('http://localhost:3001', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Length:', data.length);
    const hasHeadline = data.includes('Find Your');
    console.log('Has "Find Your":', hasHeadline);
    const hasProject = data.includes('Action Kamen Vision');
    console.log('Has "Action Kamen Vision":', hasProject);
    const hasError = data.toLowerCase().includes('error');
    console.log('Has "error":', hasError);
    if (!hasHeadline) {
      console.log('Snippet around hero:');
      const idx = data.indexOf('animate-float-slow');
      console.log(data.substring(idx - 100, idx + 800));
    }
  });
}).on('error', (err) => {
  console.error('Fetch error:', err.message);
});
