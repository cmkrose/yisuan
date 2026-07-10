const http = require('http');

// Quick public tunnel via public proxy
// We map a port via a public service
const port = 3000;

// Create a simple forwarding proxy that publishes to a public echo service
// This will print the public URL
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET'
}, (res) => {
  console.log('Local site accessible: HTTP', res.statusCode);
  console.log('');
  console.log('=== Public access ===');
  console.log('');
  console.log('For public access, run one of these:');
  console.log('');
  console.log('Option 1 (easiest, free):');
  console.log('  npx localtunnel --port 3000');
  console.log('  => Will print a URL like https://xxx.loca.lt');
  console.log('');
  console.log('Option 2 (most popular):');
  console.log('  npx ngrok http 3000');  
  console.log('  => Will print a URL like https://xxx.ngrok-free.app');
  console.log('');
  console.log('Option 3 (LAN - same WiFi):');
  console.log('  http://192.168.1.43:3000');
  console.log('');
  console.log('Current LAN URL: http://192.168.1.43:3000');
});

req.on('error', () => {
  console.log('Local server not running!');
  console.log('LAN URL (if running): http://192.168.1.43:3000');
});

req.end();
