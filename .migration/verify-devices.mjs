// Real device profiles rather than a bare viewport: touch input, device pixel
// ratio and mobile user agent all change what the browser does. WebKit on an
// iPhone profile is the closest automatable stand-in for iOS Safari.
//
//   node .migration/verify-devices.mjs [legacyUrl] [nextUrl]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit, devices } from 'playwright';
import { FREEZE_TIMERS, FREEZE_CSS, waitForApp, settleScroll } from './harness.mjs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { ROUTES } from './shots.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LEGACY = process.argv[2] || 'http://localhost:4173';
const NEXT = process.argv[3] || 'http://localhost:4174';
const THRESHOLD = 0.05;

// Chromium runs as the system Chrome install — the bundled headless shell was
// never downloaded here, the same reason the rest of the harness uses channel.
const PROFILES = [
  { name: 'iPhone 15 (WebKit)', launch: () => webkit.launch(), device: devices['iPhone 15'] },
  { name: 'iPhone 15 landscape', launch: () => webkit.launch(), device: devices['iPhone 15 landscape'] },
  { name: 'Pixel 7 (Chrome)', launch: () => chromium.launch({ channel: 'chrome' }), device: devices['Pixel 7'] },
  { name: 'iPad Pro 11 (WebKit)', launch: () => webkit.launch(), device: devices['iPad Pro 11'] },
];

async function shoot(launch, device, base, route) {
  const browser = await launch();
  const ctx = await browser.newContext({ ...device, colorScheme: 'dark' });
  await ctx.addInitScript(FREEZE_TIMERS);
  const page = await ctx.newPage();
  await page.goto(base + route, { waitUntil: 'domcontentloaded' });
  await waitForApp(page);
  await page.addStyleTag({ content: FREEZE_CSS });
  await settleScroll(page);
  const buf = await page.screenshot({ fullPage: true });
  await browser.close();
  return buf;
}

const outDir = path.join(HERE, 'shots', 'diff-devices');
fs.mkdirSync(outDir, { recursive: true });
let bad = 0;
let worst = 0;

for (const profile of PROFILES) {
  for (const [name, route] of Object.entries(ROUTES)) {
    const [a, b] = await Promise.all([
      shoot(profile.launch, profile.device, LEGACY, route),
      shoot(profile.launch, profile.device, NEXT, route),
    ]);
    const pa = PNG.sync.read(a);
    const pb = PNG.sync.read(b);
    const label = `${profile.name} · ${name}`;
    if (pa.width !== pb.width || pa.height !== pb.height) {
      bad++;
      console.log(`SIZE ${label}: ${pa.width}x${pa.height} vs ${pb.width}x${pb.height}`);
      continue;
    }
    const diff = new PNG({ width: pa.width, height: pa.height });
    const changed = pixelmatch(pa.data, pb.data, diff.data, pa.width, pa.height, { threshold: 0.1 });
    const pct = (changed / (pa.width * pa.height)) * 100;
    worst = Math.max(worst, pct);
    if (pct > THRESHOLD) {
      bad++;
      fs.writeFileSync(path.join(outDir, `${profile.name.replace(/\W+/g, '-')}-${name}.png`), PNG.sync.write(diff));
    }
    console.log(`${pct > THRESHOLD ? 'DIFF' : 'ok  '} ${label.padEnd(34)} ${pct.toFixed(4)}%  (${changed} px)`);
  }
}

console.log(`\n${bad ? `${bad} profile/page pair(s) over ${THRESHOLD}%` : 'every device profile identical'} · worst ${worst.toFixed(4)}%`);
process.exit(bad ? 1 : 0);
