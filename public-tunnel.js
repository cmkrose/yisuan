const lt = require('C:/Users/Administrator/AppData/Roaming/npm/node_modules/localtunnel');
const http = require('http');

(async () => {
  let tunnel;
  let url;

  async function connect() {
    try {
      tunnel = await lt({ port: 3000, local_host: 'localhost' });
      url = tunnel.url;
      console.log('TUNNEL_READY:' + url);

      tunnel.on('error', async () => {
        console.log('Tunnel disconnected, reconnecting...');
        setTimeout(connect, 5000);
      });

      tunnel.on('close', async () => {
        console.log('Tunnel closed, reconnecting...');
        setTimeout(connect, 5000);
      });
    } catch (e) {
      console.log('Connect failed:', e.message, 'retrying...');
      setTimeout(connect, 10000);
    }
  }

  await connect();

  // Health check every 30 seconds
  setInterval(() => {
    if (url) {
      http.get(url.replace('https://', 'http://'), (r) => {
        // Connection alive
      }).on('error', () => {});
    }
  }, 30000);

  process.stdin.resume();
})();
