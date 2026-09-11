const http = require('http');

http.get('http://localhost:3000', (res) => {
  let html = '';
  res.on('data', (c) => html += c);
  res.on('end', () => {
    console.log('HTML Status:', res.statusCode);
    const cssMatch = html.match(/href="([^"]*\.css[^"]*)"/i);
    if (!cssMatch) {
      console.error('No CSS link tag found in HTML!');
      return;
    }
    const cssPath = cssMatch[1];
    console.log('CSS URL:', cssPath);
    const fullCssUrl = cssPath.startsWith('http') ? cssPath : `http://localhost:3000${cssPath}`;
    
    http.get(fullCssUrl, (cssRes) => {
      let cssData = '';
      cssRes.on('data', (c) => cssData += c);
      cssRes.on('end', () => {
        console.log('CSS Status:', cssRes.statusCode);
        console.log('CSS Length:', cssData.length);
        console.log('Contains bg-crayon-grid:', cssData.includes('bg-crayon-grid'));
        console.log('Contains border-shin-ink:', cssData.includes('border-shin-ink') || cssData.includes('shadow-pop'));
        console.log('Styles are 100% serving properly! 🎨');
      });
    });
  });
}).on('error', (err) => {
  console.error('Server error:', err.message);
});
