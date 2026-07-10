const lt = require('C:/Users/Administrator/AppData/Roaming/npm/node_modules/localtunnel');

(async () => {
  console.log('Starting tunnel...');
  const tunnel = await lt({
    port: 3000,
    local_host: 'localhost',
    subdomain: 'yisuan-' + Math.random().toString(36).slice(2, 8),
  });

  console.log('');
  console.log('========================================');
  console.log('  外网访问地址');
  console.log('  ' + tunnel.url);
  console.log('========================================');
  console.log('');
  console.log('任何人访问此链接即可看到你的网站');
  console.log('');

  tunnel.on('close', () => console.log('Tunnel closed'));

  // Auto-reconnect if tunnel drops
  tunnel.on('error', (err) => {
    console.log('Tunnel error:', err.message);
  });

  // Keep process alive
  process.stdin.resume();
})().catch((e) => console.log('Failed:', e.message));
