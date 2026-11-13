const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, '..', '..', 'backend', 'src', 'modules', 'fengshui', 'fengshui.service.ts');
const out = path.join(__dirname, '..', 'src', 'lib', 'engines', 'fengshui', 'service.ts');

const text = fs.readFileSync(src, 'utf8');
const kept = text
  .split(/\r?\n/)
  .filter((line) => {
    const t = line.trim();
    if (t.startsWith("import { Injectable, Logger } from '@nestjs/common';")) return false;
    if (t === '@Injectable()') return false;
    if (t.startsWith('private readonly logger = new Logger(')) return false;
    if (t.startsWith('this.logger.log')) return false;
    return true;
  })
  .map((line) => line.replace("from './core'", "from './index'"))
  .join('\n');

fs.writeFileSync(out, kept + '\n\nexport const fengshuiEngine = new FengshuiService();\n', 'utf8');
console.log('wrote', out);

const leftover = kept.split('\n').filter((l) => l.trim().startsWith('this.logger'));
console.log('leftover logger lines:', leftover.length);
