// The one piece of motion the other checks deliberately freeze: the hero
// slideshow's autoplay. Everything else stubs intervals ≥1s so captures are
// deterministic, which means nothing so far has proved the slides actually
// advance at the same rate.
//
//   node .migration/verify-cadence.mjs [legacyUrl] [nextUrl]
//
// Watches the real timer on both sites and compares the measured interval
// against the 6500ms the source declares.
import { chromium } from 'playwright';

const LEGACY = process.argv[2] || 'http://localhost:4173';
const NEXT = process.argv[3] || 'http://localhost:4174';
const EXPECTED_MS = 6500;
const WATCH_MS = 21000;
// Timer callbacks queue behind rendering, so a slide can land a little late.
const TOLERANCE_MS = 400;

async function watch(browser, base) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[aria-label="Show slide 1"]', { state: 'attached', timeout: 20000 });

  // The active slide is the one whose track button is wide (68px vs 34px).
  return page.evaluate(async (watchMs) => {
    const active = () =>
      [1, 2, 3].findIndex((n) => {
        const b = document.querySelector(`[aria-label="Show slide ${n}"]`);
        return b && Math.round(b.getBoundingClientRect().width) > 50;
      });
    const changes = [];
    let last = active();
    const started = performance.now();
    let previous = started;
    while (performance.now() - started < watchMs) {
      await new Promise((r) => setTimeout(r, 50));
      const now = active();
      if (now !== last) {
        const t = performance.now();
        changes.push({ to: now, sinceLast: Math.round(t - previous) });
        previous = t;
        last = now;
      }
    }
    return changes;
  }, WATCH_MS);
}

const browser = await chromium.launch({ channel: 'chrome' });
const [legacy, next] = await Promise.all([watch(browser, LEGACY), watch(browser, NEXT)]);
await browser.close();

// The first interval is measured from page load rather than from a slide
// change, so it is reported but not judged.
const report = (name, changes) => {
  console.log(`${name}: ${changes.length} slide change(s) in ${WATCH_MS / 1000}s`);
  console.log(`  order    ${changes.map((c) => c.to).join(' → ')}`);
  console.log(`  gaps     ${changes.map((c) => c.sinceLast + 'ms').join('  ')}`);
  return changes.slice(1).map((c) => c.sinceLast);
};

const a = report('legacy', legacy);
const b = report('next  ', next);

let bad = 0;
const check = (name, gaps) => {
  for (const g of gaps) {
    if (Math.abs(g - EXPECTED_MS) > TOLERANCE_MS) {
      bad++;
      console.log(`  ${name}: ${g}ms is more than ${TOLERANCE_MS}ms off the declared ${EXPECTED_MS}ms`);
    }
  }
};
check('legacy', a);
check('next', b);

// Both must also cycle the same number of times over the same window.
if (legacy.length !== next.length) {
  bad++;
  console.log(`\nslide count differs: legacy ${legacy.length}, next ${next.length}`);
}
// And in the same order.
if (legacy.map((c) => c.to).join() !== next.map((c) => c.to).join()) {
  bad++;
  console.log('\nslide order differs');
}

console.log(bad ? `\n${bad} cadence problem(s)` : `\nautoplay matches: same count, same order, every gap within ${TOLERANCE_MS}ms of ${EXPECTED_MS}ms`);
process.exit(bad ? 1 : 0);
