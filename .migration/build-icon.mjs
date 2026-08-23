// Builds the favicon from the site's own moustache mark rather than drawing a
// new one: same path the preloader flies into the header, on the brand red the
// preloader panel uses. Chromium measures the path's bounding box so the mark
// sits centred in the icon's viewBox.
//
//   node .migration/build-icon.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP = path.join(HERE, '..', 'app');

// Read rather than import: mark-path.js is ESM inside a package with no
// "type": "module", so Node would parse it as CommonJS.
const source = fs.readFileSync(path.join(APP, '_chrome', 'mark-path.js'), 'utf8');
const MARK_PATH = JSON.parse(source.match(/export const MARK_PATH =\s*("(?:[^"\\]|\\.)*")/)[1]);

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.setContent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3000 2000"><path id="m" d="${MARK_PATH}"/></svg>`,
);
const bb = await page.evaluate(() => {
  const b = document.getElementById('m').getBBox();
  return { x: b.x, y: b.y, w: b.width, h: b.height };
});
await browser.close();

// Square viewBox around the mark. The moustache is wide and shallow, so the
// padding stays tight — at 16px any more turns it into a smudge.
const PAD = 0.11;
const side = Math.max(bb.w, bb.h) * (1 + PAD * 2);
const vbX = bb.x + bb.w / 2 - side / 2;
const vbY = bb.y + bb.h / 2 - side / 2;
const r = Math.round(side * 0.18);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX.toFixed(2)} ${vbY.toFixed(2)} ${side.toFixed(2)} ${side.toFixed(2)}">
  <rect x="${vbX.toFixed(2)}" y="${vbY.toFixed(2)}" width="${side.toFixed(2)}" height="${side.toFixed(2)}" rx="${r}" fill="#ef2329"/>
  <path d="${MARK_PATH}" fill="#f2eee5"/>
</svg>
`;

fs.writeFileSync(path.join(APP, 'icon.svg'), svg);
console.log(`mark bbox ${bb.w.toFixed(1)}x${bb.h.toFixed(1)} at (${bb.x.toFixed(1)}, ${bb.y.toFixed(1)})`);
console.log(`icon.svg written — ${side.toFixed(1)}square viewBox, corner radius ${r}`);
