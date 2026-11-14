// 命盘分享图：用 canvas 生成竖版 PNG 并触发下载。中文字体回退到系统中文字体。
export interface ShareRow { label: string; value: string; }
export interface ShareOptions {
  title: string;
  subtitle?: string;
  rows: ShareRow[];
  footer?: string;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const chars = Array.from(text);
  let line = '';
  let curY = y;
  for (const ch of chars) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, curY);
      line = ch;
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) { ctx.fillText(line, x, curY); curY += lineHeight; }
  return curY;
}

export function downloadShareImage(opts: ShareOptions, filename: string) {
  const W = 750;
  const H = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const FONT = '"PingFang SC","Microsoft YaHei","Heiti SC",sans-serif';

  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(212,168,83,0.55)';
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, W - 56, H - 56);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#d4a853';
  ctx.font = `bold 46px ${FONT}`;
  ctx.fillText('易算', W / 2, 112);

  ctx.font = `bold 24px ${FONT}`;
  ctx.fillStyle = '#e6d3a3';
  ctx.fillText(opts.title, W / 2, 158);

  if (opts.subtitle) {
    ctx.font = `18px ${FONT}`;
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(opts.subtitle, W / 2, 192);
  }

  let y = 268;
  ctx.textAlign = 'left';
  for (const row of opts.rows) {
    if (y > H - 160) break;
    ctx.fillStyle = '#d4a853';
    ctx.font = `bold 25px ${FONT}`;
    ctx.fillText(row.label, 76, y);
    ctx.fillStyle = '#e5e7eb';
    ctx.font = `25px ${FONT}`;
    y = wrapText(ctx, row.value, 236, y, W - 236 - 76, 34) + 26;
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#9ca3af';
  ctx.font = `18px ${FONT}`;
  ctx.fillText(opts.footer || '易算 · yisuan.com · 仅供参考', W / 2, H - 72);

  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}
