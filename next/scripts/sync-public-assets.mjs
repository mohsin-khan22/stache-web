// Populates public/ from the two places the site's assets actually live, so the
// ~25 MB of imagery is not committed twice while the old site is still in the
// tree. Runs automatically before `dev` and `build`.
//
// Sources:
//   ../assets/images              images already on disk (Home hero, Work cards)
//   ../.migration/src/assets      fonts, logo and the 4 images that were only
//                                 ever embedded inside the bundles
//
// At Phase 7 cutover these move into public/ for real and this script goes away.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.join(APP, '..');
const PUBLIC = path.join(APP, 'public');

const COPIES = [
  [path.join(REPO, 'assets', 'images'), path.join(PUBLIC, 'assets', 'images')],
  [path.join(REPO, '.migration', 'src', 'assets', 'images'), path.join(PUBLIC, 'assets', 'images')],
  [path.join(REPO, '.migration', 'src', 'assets', 'fonts'), path.join(PUBLIC, 'fonts')],
];

let copied = 0;
let skipped = 0;

for (const [from, to] of COPIES) {
  if (!fs.existsSync(from)) throw new Error(`missing asset source: ${from}`);
  fs.mkdirSync(to, { recursive: true });
  for (const name of fs.readdirSync(from)) {
    const src = path.join(from, name);
    const dest = path.join(to, name);
    if (!fs.statSync(src).isFile()) continue;
    // Skip unchanged files so repeated builds stay fast.
    if (fs.existsSync(dest) && fs.statSync(dest).size === fs.statSync(src).size) { skipped++; continue; }
    fs.copyFileSync(src, dest);
    copied++;
  }
}

const logo = path.join(REPO, '.migration', 'src', 'assets', 'logo.svg');
const logoDest = path.join(PUBLIC, 'logo.svg');
if (!fs.existsSync(logoDest) || fs.statSync(logoDest).size !== fs.statSync(logo).size) {
  fs.copyFileSync(logo, logoDest);
  copied++;
} else skipped++;

console.log(`public assets: ${copied} copied, ${skipped} already current`);
