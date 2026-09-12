const { spawn } = require('child_process');
const http = require('http');

async function main() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    'http://localhost:3000/login'
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  http.get('http://localhost:9222/json', (res) => {
    let data = '';
    res.on('data', (c) => data += c);
    res.on('end', () => {
      try {
        const pages = JSON.parse(data);
        const targetPage = pages.find(p => p.url.includes('localhost:3000'));
        if (!targetPage) {
          console.log('Target page not found');
          chrome.kill();
          return;
        }

        const ws = new WebSocket(targetPage.webSocketDebuggerUrl);

        ws.addEventListener('open', () => {
          ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
          ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
          ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
          ws.send(JSON.stringify({ id: 4, method: 'Page.reload' }));
        });

        let exceptions = 0;
        ws.addEventListener('message', (event) => {
          const msg = JSON.parse(event.data);
          if (msg.method === 'Runtime.exceptionThrown') {
            exceptions++;
            console.error('💥 EXCEPTION:', JSON.stringify(msg.params.exceptionDetails, null, 2));
          } else if (msg.method === 'Runtime.consoleAPICalled') {
            console.log('CONSOLE [' + msg.params.type + ']:', msg.params.args.map(a => a.value || a.description).join(' '));
          }
        });

        setTimeout(() => {
          console.log(`Finished: ${exceptions} exceptions detected on /login.`);
          ws.close();
          chrome.kill();
          process.exit(0);
        }, 3000);
      } catch (e) {
        console.error('Error:', e.message);
        chrome.kill();
      }
    });
  }).on('error', (err) => {
    console.error('CDP error:', err.message);
    chrome.kill();
  });
}

main();
