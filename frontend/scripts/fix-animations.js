const fs = require('fs');
const path = require('path');

const roots = [
  path.join(__dirname, '..', 'src', 'app'),
  path.join(__dirname, '..', 'src', 'components'),
];

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, cb);
    else if (p.endsWith('.tsx')) cb(p);
  }
}

let files = 0;
for (const root of roots) {
  walk(root, (p) => {
    let s = fs.readFileSync(p, 'utf8');
    const before = s;
    s = s.replace(/initial=\{\{\s*opacity:\s*0,\s*y:\s*-?\d+(?:\.\d+)?\s*\}\}/g, 'initial={{ opacity: 1, y: 0 }}');
    s = s.replace(/initial="hidden"/g, 'initial="visible"');
    if (s !== before) {
      fs.writeFileSync(p, s, 'utf8');
      files++;
      console.log('updated', p.replace(path.join(__dirname, '..', 'src') + path.sep, ''));
    }
  });
}
console.log('files updated:', files);
