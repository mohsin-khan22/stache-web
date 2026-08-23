// Captures the shot matrix against a running site.
//
//   node .migration/shoot.mjs --base http://localhost:4173 --out baseline
//   node .migration/shoot.mjs --base http://localhost:3000 --out candidate --only work
//
// Determinism is the whole point: the same freezing rules are applied to the
// legacy bundle and to the Next build, so a non-zero diff always means a real
// change rather than a different animation frame.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { VIEWPORTS, ROUTES, buildMatrix } from './shots.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

const arg = (flag, fallback) => {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const BASE = arg('--base', 'http://localhost:4173').replace(/\/$/, '');
const OUT = path.join(HERE, 'shots', arg('--out', 'baseline'));
const ONLY = arg('--only', null);

// Runs before any page script. Long intervals are the hero slideshow's 6.5 s
// autoplay — left alive, the slide showing at capture time is a coin toss.
const FREEZE_TIMERS = () => {
  const real = window.setInterval.bind(window);
  window.setInterval = (fn, ms, ...rest) => (ms >= 1000 ? 0 : real(fn, ms, ...rest));
};

// Injected after load: snaps every animation to its end frame and removes
// transitions, so no capture depends on when the shutter opened.
const FREEZE_CSS = `*,*::before,*::after{
  animation-delay:0s !important;
  animation-duration:0s !important;
  animation-iteration-count:1 !important;
  animation-fill-mode:both !important;
  transition:none !important;
  caret-color:transparent !important;
}`;

// The preloader panel is the fixed z-index:9998 layer; it fades to opacity 0
// once the logo FLIP has handed off to the header.
const preloaderDone = () => {
  const el = [...document.querySelectorAll('div')].find((d) => {
    const s = getComputedStyle(d);
    return s.position === 'fixed' && s.zIndex === '9998';
  });
  return !el || Number(getComputedStyle(el).opacity) === 0;
};

async function settle(page) {
  await page.waitForLoadState('load');
  // Wait for the app to mount before asking whether the preloader is finished:
  // on a document that has not rendered yet there is no preloader layer to find,
  // and preloaderDone() would report "done" against the bare unpacking screen.
  await page.waitForSelector('header', { state: 'attached', timeout: 20000 });
  // Preloader gates on asset loads with a 2.8 s hard cap, then a 260 ms handoff.
  await page.waitForFunction(preloaderDone, null, { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: FREEZE_CSS });

  // Walk the page so every IntersectionObserver reveal fires, then return to
  // the top: scroll-derived state (header, progress bar, hero parallax) is
  // back at its initial values, but the reveals stay settled.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 250));
  });
  await page.waitForTimeout(150);
}

const browser = await chromium.launch({ channel: 'chrome' });
const shots = buildMatrix().filter((s) => !ONLY || s.name.includes(ONLY));
fs.mkdirSync(OUT, { recursive: true });

let failures = 0;
for (const shot of shots) {
  const context = await browser.newContext({
    viewport: VIEWPORTS[shot.viewport],
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
    colorScheme: 'dark',
  });
  await context.addInitScript(FREEZE_TIMERS);
  const page = await context.newPage();
  try {
    await page.goto(BASE + ROUTES[shot.route], { waitUntil: 'domcontentloaded' });
    await settle(page);
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
