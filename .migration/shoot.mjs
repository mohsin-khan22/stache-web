// Captures the shot matrix against a running site.
//
//   node .migration/shoot.mjs --base http://localhost:4173 --out baseline
//   node .migration/shoot.mjs --base http://localhost:3000 --out candidate --only work
//   node .migration/shoot.mjs --base ... --out ff-legacy --browser firefox
//   node .migration/shoot.mjs --base ... --out baseline-rm --reduced
//
// Determinism is the whole point: the same freezing rules are applied to the
// legacy bundle and to the Next build, so a non-zero diff always means a real
// change rather than a different animation frame.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { VIEWPORTS, ROUTES, buildMatrix } from './shots.mjs';
import { ENGINES, FREEZE_TIMERS, FREEZE_CSS, waitForApp, settleScroll } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

const arg = (flag, fallback) => {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const BASE = arg('--base', 'http://localhost:4173').replace(/\/$/, '');
const OUT = path.join(HERE, 'shots', arg('--out', 'baseline'));
const ONLY = arg('--only', null);
// --reduced emulates prefers-reduced-motion: reduce. The stylesheet collapses
// every animation and transition to 0.01ms and the hero autoplay never starts,
// so that is a different render path and needs its own pair of runs.
const REDUCED = process.argv.includes('--reduced');
// Engines render type and effects differently, so a cross-browser run compares
// legacy against next *within* one engine — never one engine against another.
const ENGINE = arg('--browser', 'chrome');

if (!ENGINES[ENGINE]) throw new Error(`unknown --browser ${ENGINE}; use chrome, firefox or webkit`);
const browser = await ENGINES[ENGINE]();
const shots = buildMatrix().filter((s) => !ONLY || s.name.includes(ONLY));
fs.mkdirSync(OUT, { recursive: true });

let failures = 0;
for (const shot of shots) {
  const context = await browser.newContext({
    viewport: VIEWPORTS[shot.viewport],
    deviceScaleFactor: 1,
    reducedMotion: REDUCED ? 'reduce' : 'no-preference',
    colorScheme: 'dark',
  });
  await context.addInitScript(FREEZE_TIMERS);
  const page = await context.newPage();
  try {
    await page.goto(BASE + ROUTES[shot.route], { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');
    await waitForApp(page);
    await page.addStyleTag({ content: FREEZE_CSS });
    // Reveals fire on the way down; scroll-derived state is back at zero after.
    await settleScroll(page);
    if (shot.act) {
      await shot.act(page);
      await page.waitForTimeout(200);
    }
    await page.screenshot({ path: path.join(OUT, shot.name + '.png'), fullPage: !!shot.fullPage });
    console.log(`  ok   ${shot.name}`);
  } catch (err) {
    failures++;
    console.log(`  FAIL ${shot.name} — ${err.message.split('\n')[0]}`);
  }
  await context.close();
}
await browser.close();

// The PNGs themselves are gitignored (~34 MB); this fingerprint is committed so
// a regenerated baseline can be proven identical to the one signed off on.
const fingerprint = {};
for (const f of fs.readdirSync(OUT).filter((f) => f.endsWith('.png')).sort()) {
  const buf = fs.readFileSync(path.join(OUT, f));
  const { width, height } = PNG.sync.read(buf);
  fingerprint[f] = { sha256: crypto.createHash('sha256').update(buf).digest('hex'), width, height };
}
fs.writeFileSync(path.join(OUT, 'fingerprint.json'), JSON.stringify(fingerprint, null, 2));

console.log(`\n${shots.length - failures}/${shots.length} shots written to ${path.relative(HERE, OUT)}`);
process.exit(failures ? 1 : 0);
