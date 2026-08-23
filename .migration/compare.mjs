// Pixel-diffs two shot directories.
//
//   node .migration/compare.mjs baseline candidate [--threshold 0.1]
//
// Exits non-zero if any shot exceeds the threshold (percentage of differing
// pixels) or if a shot is missing on either side. Diff images land in
// .migration/shots/diff-<candidate>/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = path.join(HERE, 'shots');

const [, , aName = 'baseline', bName = 'candidate'] = process.argv;
const ti = process.argv.indexOf('--threshold');
const THRESHOLD = ti > -1 ? Number(process.argv[ti + 1]) : 0.1;

const dirA = path.join(SHOTS, aName);
const dirB = path.join(SHOTS, bName);
const diffDir = path.join(SHOTS, `diff-${bName}`);
fs.mkdirSync(diffDir, { recursive: true });

const list = (d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith('.png')) : []);
const names = [...new Set([...list(dirA), ...list(dirB)])].sort();
if (!names.length) {
  console.error(`no shots found in ${dirA} or ${dirB}`);
  process.exit(1);
}

let worst = 0;
let failed = 0;
const rows = [];

for (const name of names) {
  const fa = path.join(dirA, name);
  const fb = path.join(dirB, name);
  if (!fs.existsSync(fa) || !fs.existsSync(fb)) {
    failed++;
    rows.push([name, 'MISSING', fs.existsSync(fa) ? `absent in ${bName}` : `absent in ${aName}`]);
    continue;
  }
  const a = PNG.sync.read(fs.readFileSync(fa));
  const b = PNG.sync.read(fs.readFileSync(fb));
  if (a.width !== b.width || a.height !== b.height) {
    failed++;
    rows.push([name, 'SIZE', `${a.width}x${a.height} vs ${b.width}x${b.height}`]);
    continue;
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const changed = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
  const pct = (changed / (a.width * a.height)) * 100;
  worst = Math.max(worst, pct);
  const over = pct > THRESHOLD;
  if (over) {
    failed++;
    fs.writeFileSync(path.join(diffDir, name), PNG.sync.write(diff));
  }
  rows.push([name, over ? 'DIFF' : 'ok', `${pct.toFixed(4)}%  (${changed} px)`]);
}

const w = Math.max(...rows.map((r) => r[0].length));
for (const [name, status, detail] of rows) {
  console.log(`  ${status === 'ok' ? 'ok  ' : status.padEnd(4)} ${name.padEnd(w)}  ${detail}`);
}
console.log(`\n${names.length - failed}/${names.length} within ${THRESHOLD}% · worst ${worst.toFixed(4)}%`);
if (failed) console.log(`diff images: ${path.relative(HERE, diffDir)}`);
process.exit(failed ? 1 : 0);
