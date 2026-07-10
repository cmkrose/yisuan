const lt = require('C:/Users/Administrator/AppData/Roaming/npm/node_modules/localtunnel');

(async () => {
  console.log('正在连接外网隧道...');
  
  const tunnel = await lt({ port: 3000, local_host: 'localhost' });
  
  console.log('');
  console.log('========================================');
  console.log('  外网访问地址:');
  console.log('  ' + tunnel.url);
  console.log('========================================');
  console.log('');
  console.log('任何人复制此链接即可访问你的网站');
  console.log('Tunnel is alive, DO NOT CLOSE this window.');
  console.log('');

  tunnel.on('error', (e) => { console.log('Tunnel error:', e.message); });
  tunnel.on('close', () => { console.log('Tunnel closed'); });
  tunnel.on('request', (info) => { /* request passing through */ });

  setInterval(() => {}, 10000);
})();
