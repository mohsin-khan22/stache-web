// Fails on any console error, page error, hydration warning or failed request
// across every route. Hydration mismatches in particular are silent in
// production builds unless you look for them.
//
//   node .migration/check-console.mjs [baseUrl]
import { chromium } from 'playwright';
import { ROUTES } from './shots.mjs';

const BASE = (process.argv[2] || 'http://localhost:4174').replace(/\/$/, '');
const browser = await chromium.launch({ channel: 'chrome' });
let problems = 0;

// 390px so the menu toggle is on screen — above 820px the stylesheet hides it.
for (const [name, route] of Object.entries(ROUTES)) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const found = [];
  // The bundled site 404s on /favicon.ico too — Phase 5 adds a real one.
  const isFavicon = (url) => (url || '').endsWith('/favicon.ico');

  page.on('console', (m) => {
    if (m.type() !== 'error' && m.type() !== 'warning') return;
    if (isFavicon(m.location().url)) return;
    found.push(`${m.type()}: ${m.text().slice(0, 200)}`);
  });
  page.on('pageerror', (e) => found.push(`pageerror: ${e.message.slice(0, 200)}`));
  page.on('response', (r) => {
    if (r.status() >= 400 && !isFavicon(r.url())) found.push(`${r.status()}: ${r.url()}`);
  });

  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);
  // Exercise the interactive chrome too.
  await page.click('[data-menu-toggle]');
  await page.waitForTimeout(200);
  await page.click('[data-menu-toggle]');
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(300);

  problems += found.length;
  console.log(`${found.length ? 'FAIL' : 'ok  '} ${name}`);
  for (const f of found) console.log(`       ${f}`);
  await ctx.close();
}

await browser.close();
console.log(`\n${problems} console problem(s)`);
process.exit(problems ? 1 : 0);
