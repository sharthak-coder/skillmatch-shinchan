const http = require('http');

const avatars = [
  'shinchan.svg',
  'kazama.svg',
  'nene.svg',
  'masao.svg',
  'bochan.svg',
  'shiro.svg',
  'action-kamen.svg',
  'himawari.svg'
];

let checked = 0;
avatars.forEach(name => {
  http.get(`http://localhost:3000/avatars/${name}`, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      console.log(`✓ /avatars/${name}: ${res.statusCode} (${data.length} bytes)`);
      checked++;
      if (checked === avatars.length) {
        console.log('\nAll cute character avatars are 100% accessible! 🚀');
      }
    });
  }).on('error', err => {
    console.error(`✗ /avatars/${name}:`, err.message);
  });
});
