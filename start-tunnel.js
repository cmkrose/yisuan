const lt = require('C:/Users/Administrator/AppData/Roaming/npm/node_modules/localtunnel');
const fs = require('fs');
const path = require('path');

const urlFile = path.join(__dirname, 'TUNNEL_URL.txt');

(async () => {
  try {
    const tunnel = await lt({ port: 3000, local_host: 'localhost' });
    
    const msg = `\n========================================\n外网访问地址:\n${tunnel.url}\n========================================\n\n直接复制上面链接发给任何人即可访问\n\n注意: 不要关闭此窗口\n`;
    
    console.log(msg);
    fs.writeFileSync(urlFile, tunnel.url);
    
    tunnel.on('error', () => {});
    tunnel.on('close', () => {});
    
    setInterval(() => {}, 1000);
  } catch (e) {
    console.error('Tunnel failed:', e.message);
    console.log('正在重试...');
    setTimeout(() => process.exit(1), 2000);
  }
})();
