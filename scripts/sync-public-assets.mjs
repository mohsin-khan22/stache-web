// Populates public/ from the two places the site's assets actually live, so the
// ~25 MB of imagery is not committed twice while the old site is still in the
// tree. Runs automatically before `dev` and `build`.
//
// Sources:
//   ../assets/images              images already on disk (Home hero, Work cards)
//   ../assets/video               the encoded Home hero showreel and its poster
//   ../.migration/src/assets      fonts, logo and the 4 images that were only
//                                 ever embedded inside the bundles
//
// At Phase 7 cutover these move into public/ for real and this script goes away.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = APP;
const PUBLIC = path.join(APP, 'public');

const COPIES = [
  [path.join(REPO, 'assets', 'images'), path.join(PUBLIC, 'assets', 'images')],
  [path.join(REPO, 'assets', 'video'), path.join(PUBLIC, 'assets', 'video')],
  [path.join(REPO, '.migration', 'src', 'assets', 'images'), path.join(PUBLIC, 'assets', 'images')],
  [path.join(REPO, '.migration', 'src', 'assets', 'fonts'), path.join(PUBLIC, 'fonts')],
];

let copied = 0;
let skipped = 0;
let removed = 0;

// Same size is not proof of same file (a re-exported picture can land on the
// same byte count), so a size match is confirmed against the contents.
const unchanged = (src, dest) =>
  fs.existsSync(dest) &&
  fs.statSync(dest).size === fs.statSync(src).size &&
  fs.readFileSync(dest).equals(fs.readFileSync(src));

// Several sources feed one destination folder, so what each folder should hold
// is collected across all of them before anything is pruned.
const expected = new Map();

for (const [from, to] of COPIES) {
  if (!fs.existsSync(from)) throw new Error(`missing asset source: ${from}`);
  fs.mkdirSync(to, { recursive: true });
  if (!expected.has(to)) expected.set(to, new Set());
  for (const name of fs.readdirSync(from)) {
    const src = path.join(from, name);
    const dest = path.join(to, name);
    if (!fs.statSync(src).isFile()) continue;
    expected.get(to).add(name);
    // Skip unchanged files so repeated builds stay fast.
    if (unchanged(src, dest)) { skipped++; continue; }
    fs.copyFileSync(src, dest);
    copied++;
  }
}

// These folders are generated (gitignored), so a file whose source was deleted
// is removed here too rather than going on being served locally.
for (const [dir, names] of expected) {
  for (const name of fs.readdirSync(dir)) {
    if (names.has(name) || !fs.statSync(path.join(dir, name)).isFile()) continue;
    fs.rmSync(path.join(dir, name));
    removed++;
  }
}

const logo = path.join(REPO, '.migration', 'src', 'assets', 'logo.svg');
const logoDest = path.join(PUBLIC, 'logo.svg');
if (!unchanged(logo, logoDest)) {
  fs.copyFileSync(logo, logoDest);
  copied++;
} else skipped++;

console.log(`public assets: ${copied} copied, ${skipped} already current, ${removed} removed`);
