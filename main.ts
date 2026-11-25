// main.ts — entry program for the make.fun bounty
// "Spotlight @crisxai5: AI & Crypto Expert on X" (program/v1, Node 22, stdlib only).
//
// The entry itself is the X post: this program's only graded job is to hand the
// house the post's address. It reads POST.json from the repository root, checks
// that its url is a real X post address (https://x.com/<handle>/status/<digits>,
// twitter.com and www./mobile. variants accepted), copies it to /output/POST.json,
// and writes /output/spotlight.json, a small manifest naming the graphic this
// entry ships (spotlight-crisxai5.png) with its size and sha256. The house reads
// the post's counts itself and writes /output/post.counts.json after this runs,
// in place of anything written here.
//
// The graphic was drawn in this session by tools/render-graphic.mjs (Node stdlib
// only: hand-written PNG encoder + 5x7 bitmap font) — see that file for how every
// pixel was made. The post text draft lives in post-draft.txt; the user posts it
// on X from a public account with the graphic attached, then POST.json is updated
// with the post's real address before submission.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand
// in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const GRAPHIC = 'spotlight-crisxai5.png';

// An X post address: https://x.com/<handle>/status/<id> (twitter.com, www. or
// mobile. prefixes, and /i/web/status/<id> are the same post). A query string or
// fragment after the id is read past by the house, so it is allowed here too.
const POST_URL =
  /^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/([A-Za-z0-9_]{1,15})\/(status|i\/web\/status)\/([0-9]+)([?#].*)?$/;

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

function sha256Hex(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

mkdirSync(OUTPUT_DIR, { recursive: true });

const postPath = join(BOT_DIR, 'POST.json');
if (!existsSync(postPath)) fail(`POST.json not found in ${BOT_DIR}`);
let post: unknown;
try {
  post = JSON.parse(readFileSync(postPath, 'utf8'));
} catch (err) {
  fail(`POST.json does not parse: ${(err as Error).message}`);
}
if (typeof post !== 'object' || post === null || typeof (post as { url?: unknown }).url !== 'string') {
  fail('POST.json must be a JSON object with a string "url" field');
}
const url = (post as { url: string }).url;
const match = POST_URL.exec(url);
if (!match) {
  fail(
    `POST.json url is not an X post address (expected https://x.com/<handle>/status/<id>): ${url} ` +
      `(replace the placeholder with the real post address after posting on X)`,
  );
}

copyFileSync(postPath, join(OUTPUT_DIR, 'POST.json'));

const graphicPath = join(BOT_DIR, GRAPHIC);
const manifest: Record<string, unknown> = {
  format: 'spotlight-crisxai5/v1',
  handle: match[3],
  post_id: match[5],
  post_url: url,
  graphic: GRAPHIC,
  graphic_present: existsSync(graphicPath),
};
if (existsSync(graphicPath)) {
  manifest.graphic_sha256 = sha256Hex(graphicPath);
  // PNG header: width and height are big-endian uint32 at bytes 16 and 20.
  const header = readFileSync(graphicPath).subarray(0, 26);
  if (header.length >= 24 && header.subarray(12, 16).toString('ascii') === 'IHDR') {
    manifest.graphic_width = header.readUInt32BE(16);
    manifest.graphic_height = header.readUInt32BE(20);
  }
}
writeFileSync(join(OUTPUT_DIR, 'spotlight.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');

console.log(`POST.json copied to ${OUTPUT_DIR}/POST.json for post ${match[5]} by @${match[3]}`);
console.log(`spotlight manifest written: graphic present = ${manifest.graphic_present}`);
