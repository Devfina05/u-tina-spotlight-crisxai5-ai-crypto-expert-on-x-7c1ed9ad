// render-graphic.mjs — draws the spotlight graphic for @crisxai5, 1200x675 PNG.
// Node standard library only: a hand-written PNG encoder (zlib deflate + CRC32)
// and a 5x7 bitmap font defined in this file. Nothing is downloaded or copied:
// every pixel is computed here, so the image is an original design.
//
// Usage: node tools/render-graphic.mjs <output-png-path>

import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const W = 1200;
const H = 675;

// ---------------------------------------------------------------- font (5x7)
// Each glyph is 7 rows of 5 cells; '#' is on, '.' is off.
const FONT = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.####', '#....', '#....', '#....', '#....', '#....', '.####'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.####', '#....', '#....', '#.###', '#...#', '#...#', '.###.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  J: ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '##..#', '#.#.#', '#..##', '#..##', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  '0': ['.###.', '#..##', '#.#.#', '##..#', '#...#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  '3': ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
  '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  '6': ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '...#.', '..#..', '..#..', '..#..'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
  '@': ['.###.', '#...#', '#.###', '#.#.#', '#.#.#', '#....', '.###.'],
  '&': ['.##..', '#..#.', '#.#..', '.#...', '#.#.#', '#..#.', '.##.#'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.##..', '.##..'],
  '/': ['....#', '....#', '...#.', '..#..', '.#...', '#....', '#....'],
  ':': ['.....', '.##..', '.##..', '.....', '.##..', '.##..', '.....'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  "'": ['..#..', '..#..', '.....', '.....', '.....', '.....', '.....'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
};

// ------------------------------------------------------------------ canvas
// RGB buffer, 3 bytes per pixel.
const px = Buffer.alloc(W * H * 3);

function setPixel(x, y, r, g, b) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 3;
  px[i] = r; px[i + 1] = g; px[i + 2] = b;
}

// Alpha-blend a colour over the pixel already there (a: 0..1).
function blendPixel(x, y, r, g, b, a) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 3;
  px[i] = Math.round(px[i] * (1 - a) + r * a);
  px[i + 1] = Math.round(px[i + 1] * (1 - a) + g * a);
  px[i + 2] = Math.round(px[i + 2] * (1 - a) + b * a);
}

function fillRect(x, y, w, h, [r, g, b]) {
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) setPixel(xx, yy, r, g, b);
  }
}

function fillCircle(cx, cy, rad, color, alpha = 1) {
  for (let yy = cy - rad; yy <= cy + rad; yy++) {
    for (let xx = cx - rad; xx <= cx + rad; xx++) {
      const dx = xx - cx, dy = yy - cy;
      if (dx * dx + dy * dy <= rad * rad) {
        if (alpha >= 1) setPixel(xx, yy, ...color);
        else blendPixel(xx, yy, ...color, alpha);
      }
    }
  }
}

function ring(cx, cy, rad, thickness, color, alpha = 1) {
  for (let yy = cy - rad - thickness; yy <= cy + rad + thickness; yy++) {
    for (let xx = cx - rad - thickness; xx <= cx + rad + thickness; xx++) {
      const d = Math.sqrt((xx - cx) ** 2 + (yy - cy) ** 2);
      if (Math.abs(d - rad) <= thickness / 2) {
        if (alpha >= 1) setPixel(xx, yy, ...color);
        else blendPixel(xx, yy, ...color, alpha);
      }
    }
  }
}

// Bresenham line.
function line(x0, y0, x1, y1, color, alpha = 1) {
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy, x = x0, y = y0;
  for (;;) {
    if (alpha >= 1) setPixel(x, y, ...color);
    else blendPixel(x, y, ...color, alpha);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x += sx; }
    if (e2 <= dx) { err += dx; y += sy; }
  }
}

function drawText(text, x, y, scale, color) {
  let cx = x;
  for (const ch of text.toUpperCase()) {
    const glyph = FONT[ch] ?? FONT[' '];
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (glyph[row][col] === '#') {
          fillRect(cx + col * scale, y + row * scale, scale, scale, color);
        }
      }
    }
    cx += 6 * scale;
  }
  return cx - scale; // right edge of the last glyph
}

function textWidth(text, scale) {
  return text.length * 6 * scale - scale;
}

// (Kept for layout checks: the headline widths below were measured with it
// while composing the design, so the text never runs past the right edge.)

// ------------------------------------------------------------- palette
const NAVY_TOP = [14, 21, 51];
const NAVY_BOTTOM = [7, 10, 26];
const CYAN = [34, 211, 238];
const GREEN = [52, 211, 153];
const RED = [248, 113, 113];
const WHITE = [245, 247, 255];
const MUTED = [159, 179, 217];
const PURPLE = [168, 85, 247];

// ------------------------------------------------------------ background
// Vertical gradient.
for (let y = 0; y < H; y++) {
  const t = y / (H - 1);
  const r = Math.round(NAVY_TOP[0] + (NAVY_BOTTOM[0] - NAVY_TOP[0]) * t);
  const g = Math.round(NAVY_TOP[1] + (NAVY_BOTTOM[1] - NAVY_TOP[1]) * t);
  const b = Math.round(NAVY_TOP[2] + (NAVY_BOTTOM[2] - NAVY_TOP[2]) * t);
  for (let x = 0; x < W; x++) setPixel(x, y, r, g, b);
}
// Soft glows: cyan top-right, purple bottom-left.
for (let yy = 0; yy < H; yy++) {
  for (let xx = 0; xx < W; xx++) {
    const dCyan = Math.hypot(xx - 1080, yy - 90) / 520;
    if (dCyan < 1) blendPixel(xx, yy, ...CYAN, 0.10 * (1 - dCyan));
    const dPurple = Math.hypot(xx - 120, yy - 640) / 480;
    if (dPurple < 1) blendPixel(xx, yy, ...PURPLE, 0.08 * (1 - dPurple));
  }
}
// Faint dot grid on the right half.
for (let gy = 40; gy < 640; gy += 44) {
  for (let gx = 700; gx < 1180; gx += 44) {
    fillCircle(gx, gy, 2, [120, 140, 190], 0.35);
  }
}

// ------------------------------------------------------- right-side motif
// Concentric orbit rings with satellite dots: an "AI orbit" emblem.
ring(1010, 205, 92, 4, CYAN, 0.9);
ring(1010, 205, 62, 3, PURPLE, 0.8);
fillCircle(1010, 205, 34, CYAN, 0.9);
fillCircle(1010, 205, 27, NAVY_TOP, 1);
drawText('AI', 1010 - 27, 205 - 17, 5, WHITE);
fillCircle(1010 + 65, 205 - 65, 8, GREEN);
fillCircle(1010 - 44, 205 + 44, 6, CYAN);
fillCircle(1095, 260, 5, WHITE);

// Candlestick chart along the bottom-right: green up, red down.
const candles = [
  [860, 560, 26, GREEN], [895, 540, 40, GREEN], [930, 575, 22, RED],
  [965, 520, 46, GREEN], [1000, 555, 28, RED], [1035, 500, 52, GREEN],
  [1070, 530, 34, GREEN], [1105, 560, 24, RED], [1140, 505, 48, GREEN],
];
for (const [cx, top, hgt, col] of candles) {
  line(cx + 7, top - 12, cx + 7, top + hgt + 12, col, 0.9); // wick
  fillRect(cx, top, 14, hgt, col);
}
line(840, 620, 1170, 620, [90, 110, 160], 0.8); // baseline

// ------------------------------------------------------------- headline
// Spotlight pill, top-left.
fillRect(60, 46, 296, 54, CYAN);
drawText('SPOTLIGHT', 84, 62, 4, [7, 10, 26]);

// The handle, huge.
drawText('@CRISXAI5', 60, 140, 13, WHITE);
// The claim, in cyan.
drawText('AI & CRYPTO EXPERT', 60, 268, 7, CYAN);
// The hook.
drawText('MUST-FOLLOW ON X', 60, 348, 5, WHITE);

// Divider.
line(60, 420, 560, 420, CYAN, 0.9);
line(60, 424, 380, 424, PURPLE, 0.7);

// What he covers.
drawText('AI AGENTS - CRYPTO INSIGHTS - WEB3', 60, 448, 3, MUTED);
drawText('SHARP TAKES. ZERO NOISE.', 60, 482, 3, MUTED);

// Link pill, bottom-left.
for (let yy = 540; yy < 604; yy++) {
  for (let xx = 60; xx < 480; xx++) {
    const onEdge = yy === 540 || yy === 603 || xx === 60 || xx === 479;
    if (onEdge) setPixel(xx, yy, ...CYAN);
  }
}
drawText('X.COM/CRISXAI5', 92, 558, 4, CYAN);

// ------------------------------------------------------------------ PNG
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng() {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  // Raw scanlines: one filter byte (0) per row, then RGB bytes.
  const raw = Buffer.alloc(H * (1 + W * 3));
  for (let y = 0; y < H; y++) {
    raw[y * (1 + W * 3)] = 0;
    px.copy(raw, y * (1 + W * 3) + 1, y * W * 3, (y + 1) * W * 3);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const out = process.argv[2];
if (!out) {
  console.error('usage: node tools/render-graphic.mjs <output-png-path>');
  process.exit(1);
}
const png = encodePng();
writeFileSync(out, png);
console.log(`wrote ${out}: ${png.length} bytes, ${W}x${H}`);
