const fs = require('fs');
const html = fs.readFileSync('dom.html', 'utf8');

const portalIdx = html.indexOf('nextjs-portal');
if (portalIdx !== -1) {
  console.log('--- NEXTJS-PORTAL FOUND ---');
  console.log(html.substring(portalIdx, portalIdx + 3000));
} else {
  console.log('No nextjs-portal found, checking next-error:');
  const errIdx = html.indexOf('next-error');
  console.log(html.substring(errIdx, errIdx + 1500));
}
