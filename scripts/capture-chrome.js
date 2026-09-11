const { execSync } = require('child_process');
try {
  const output = execSync('"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless --disable-gpu --dump-dom http://localhost:3001', {
    maxBuffer: 10 * 1024 * 1024,
    encoding: 'utf8'
  });
  console.log('Output length:', output.length);
  const fs = require('fs');
  fs.writeFileSync('dom.html', output, 'utf8');
  console.log('Saved to dom.html');
} catch (e) {
  console.error('Exec error:', e.message);
}
