const fs = require('fs');
const html = fs.readFileSync('dom.html', 'utf8');
console.log('Total HTML length:', html.length);
console.log('First 1000 chars:\n', html.substring(0, 1000));
console.log('\nLast 1000 chars:\n', html.substring(Math.max(0, html.length - 1000)));
