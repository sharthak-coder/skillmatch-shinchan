const fs = require('fs');
const html = fs.readFileSync('dom.html', 'utf8');

const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
if (h1Match) {
  console.log('H1 tag:', h1Match[0].substring(0, 200));
} else {
  console.log('No H1 found!');
}

const errorOverlay = html.includes('nextjs-portal') || html.includes('next-error') || html.includes('Unhandled Runtime Error');
console.log('Error overlay present:', errorOverlay);

if (html.includes('Unhandled Runtime Error')) {
  const errIdx = html.indexOf('Unhandled Runtime Error');
  console.log('Error details:', html.substring(errIdx, errIdx + 500));
}

// Check console error scripts or text
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (bodyMatch) {
  console.log('Body length:', bodyMatch[1].length);
}
