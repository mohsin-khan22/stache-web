// The preloader's motion is driven by two measurements taken at runtime:
// markFlip (where the moustache has to fly, from getBBox + getBoundingClientRect)
// and logoFlip (the wordmark's scale/offset into the header logo). Both are
// baked into inline transform strings, so comparing those strings compares the
// arithmetic exactly — without depending on catching a frame at the right moment.
//
//   node .migration/compare-preloader.mjs [legacyUrl] [nextUrl]
import { chromium } from 'playwright';

const LEGACY = process.argv[2] || 'http://localhost:4173';
const NEXT = process.argv[3] || 'http://localhost:4174';
const ROUTES = ['/', '/work', '/services', '/about', '/contact'];
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'phone', width: 390, height: 844 },
];

async function capture(browser, base, route, viewport) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(base + route, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-preload-logo]', { state: 'attached', timeout: 20000 });

  // Sample until both layers stop changing: the last values are the ones the
  // measurements produced.
  const frames = await page.evaluate(async () => {
    const logo = () => document.querySelector('[data-preload-logo]');
    const mark = () => document.querySelector('svg[aria-hidden="true"]');
    const path = () => document.querySelector('[data-mark-path]');
    const seen = [];
    const push = () => {
      const l = logo();
      const m = mark();
      const p = path();
      const snap = [
        l ? l.style.transform + ' | op:' + l.style.opacity + ' | ' + l.style.transition : 'none',
        m ? m.style.transform + ' | op:' + m.style.opacity + ' | origin:' + m.style.transformOrigin : 'none',
        p ? p.style.fill : 'none',
      ].join('\n');
      if (seen[seen.length - 1] !== snap) seen.push(snap);
    };
    const started = Date.now();
    while (Date.now() - started < 5000) {
      push();
      await new Promise((r) => setTimeout(r, 25));
    }
    return seen;
  });

  await ctx.close();
  return frames;
}

const browser = await chromium.launch({ channel: 'chrome' });
let bad = 0;
for (const route of ROUTES) {
  for (const viewport of VIEWPORTS) {
    const [a, b] = await Promise.all([
      capture(browser, LEGACY, route, { width: viewport.width, height: viewport.height }),
      capture(browser, NEXT, route, { width: viewport.width, height: viewport.height }),
    ]);
    const label = `${route} @${viewport.name}`;
    if (a.length !== b.length) {
      bad++;
      console.log(`DIFF ${label}: ${a.length} distinct states on legacy, ${b.length} on next`);
      console.log('  legacy:\n    ' + a.join('\n    ').replace(/\n/g, '\n    '));
      console.log('  next:\n    ' + b.join('\n    ').replace(/\n/g, '\n    '));
      continue;
    }
    const diffs = a.map((s, i) => [i, s, b[i]]).filter(([, s, t]) => s !== t);
    if (diffs.length) {
      bad++;
      console.log(`DIFF ${label}`);
      for (const [i, s, t] of diffs) {
        console.log(`  state ${i}\n    legacy ${s.replace(/\n/g, '\n           ')}\n    next   ${t.replace(/\n/g, '\n           ')}`);
      }
    } else {
      console.log(`ok   ${label} — ${a.length} states, identical`);
    }
  }
}
await browser.close();
console.log(bad ? `\n${bad} route/viewport pair(s) differ` : '\npreloader measurements identical everywhere');
process.exit(bad ? 1 : 0);
