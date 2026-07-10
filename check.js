const http = require('http');
http.get('http://localhost:3000', r => {
  console.log('Frontend:', r.statusCode);
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    // Look for localtunnel or ngrok URL
    const match = d.match(/https?:\/\/[^"'\s<>]+/g) || [];
    const tunnels = match.filter(u => u.includes('loca.lt') || u.includes('ngrok'));
    if (tunnels.length > 0) {
      console.log('Tunnel URL:', tunnels[0]);
    } else {
      console.log('No tunnel URL found in page');
      console.log('Page size:', d.length, 'bytes');
    }
  });
}).on('error', e => console.log('ERR:', e.message));
