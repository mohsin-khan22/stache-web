// Phase 2 check: does the ported chrome land in exactly the same place as the
// bundled one? Compares geometry and computed styles of the header, mobile nav,
// footer and preloader layers between the two sites, element by element.
//
//   node .migration/compare-chrome.mjs [legacyUrl] [nextUrl]
//
// Since Phase 4 every probe is absolute, <main> and <footer> included, so this
// also asserts the two documents are the same height. Elements inside the footer
// stay measured relative to it — that was needed while the page bodies were
// placeholders, and it localises a failure to the footer when one happens.
import { chromium } from 'playwright';

const LEGACY = process.argv[2] || 'http://localhost:4173';
const NEXT = process.argv[3] || 'http://localhost:4174';
const ROUTES = ['/', '/work', '/services', '/about', '/contact'];
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 820, height: 1000 },
  { name: 'phone', width: 390, height: 844 },
];

// mode: 'abs' compare the viewport box · 'rel' compare relative to <footer>
//       'span' compare x and width only
const PROBES = {
  header: ['header', 'abs'],
  headerInner: ['header > div', 'abs'],
  logoLink: ['header a[aria-label="STACHE home"]', 'abs'],
  logoImg: ['[data-header-logo]', 'abs'],
  nav: ['nav[aria-label="Primary navigation"]', 'abs'],
  navFirst: ['nav[aria-label="Primary navigation"] a:nth-child(1)', 'abs'],
  navLast: ['nav[aria-label="Primary navigation"] a:nth-child(5)', 'abs'],
  cta: ['header > div > a:nth-of-type(2)', 'abs'],
  toggle: ['[data-menu-toggle]', 'abs'],
  mobileNav: ['[data-mobile-nav]', 'abs'],
  mobileNavFirst: ['[data-mobile-nav] a:nth-child(1)', 'abs'],
  progress: ['#dc-root > .sc-host > div[aria-hidden="true"]', 'abs'],
  main: ['main', 'abs'],
  footer: ['footer', 'abs'],
  footerGrid: ['footer > div > div:nth-child(1)', 'rel'],
  footerLogo: ['footer img', 'rel'],
  footerBlurb: ['footer p', 'rel'],
  footerHeading: ['footer h4', 'rel'],
  footerLink: ['footer a:nth-of-type(1)', 'rel'],
  footerBottom: ['footer > div > div:nth-child(2)', 'rel'],
};

const STYLE_KEYS = [
  'position', 'display', 'zIndex', 'color', 'backgroundColor', 'fontFamily', 'fontSize',
  'fontWeight', 'letterSpacing', 'textTransform', 'padding', 'margin', 'borderBottom',
  'borderRadius', 'gap', 'gridTemplateColumns', 'transform', 'opacity', 'boxShadow',
  'backdropFilter', 'whiteSpace', 'alignItems', 'justifyContent', 'flexDirection',
  'width', 'height', 'inset', 'pointerEvents', 'cursor', 'border', 'placeItems',
];

async function probe(browser, base, route, viewport, openNav) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => {
    const real = window.setInterval.bind(window);
    window.setInterval = (fn, ms, ...rest) => (ms >= 1000 ? 0 : real(fn, ms, ...rest));
  });
  const page = await ctx.newPage();
  await page.goto(base + route, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('header', { state: 'attached', timeout: 20000 });
  await page.waitForFunction(() => {
    const el = [...document.querySelectorAll('div')].find((d) => {
      const s = getComputedStyle(d);
      return s.position === 'fixed' && s.zIndex === '9998';
    });
    return !el || Number(getComputedStyle(el).opacity) === 0;
  }, null, { timeout: 20000 });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: '*,*::before,*::after{animation-duration:0s !important;animation-delay:0s !important;transition:none !important}',
  });
  if (openNav) await page.click('[data-menu-toggle]');
  await page.waitForTimeout(120);

  const result = await page.evaluate(([probes, keys]) => {
    const r = (n) => Math.round(n * 100) / 100;
    const footer = document.querySelector('footer');
    const fy = footer ? footer.getBoundingClientRect().y : 0;
    const out = {};
    for (const [name, [sel, mode]] of Object.entries(probes)) {
      const el = document.querySelector(sel);
      if (!el) { out[name] = null; continue; }
      const b = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const style = {};
      for (const k of keys) style[k] = cs[k];
      const box =
        mode === 'span' ? [r(b.x), r(b.width)]
        : mode === 'rel' ? [r(b.x), r(b.y - fy), r(b.width), r(b.height)]
        : [r(b.x), r(b.y), r(b.width), r(b.height)];
      out[name] = {
        box,
        // Whitespace is stripped, not collapsed: the bundled HTML is indented so
        // it carries text nodes between elements that the JSX does not. Those
        // nodes are inert here (flex and block contexts both discard them) and
        // the box comparison above is what would catch it if they were not.
        // What this check is for is missing or altered copy.
        text: (el.textContent || '').replace(/\s+/g, ''),
        style,
      };
    }
    return out;
  }, [PROBES, STYLE_KEYS]);

  await ctx.close();
  return result;
}

const browser = await chromium.launch({ channel: 'chrome' });
let mismatches = 0;
let checks = 0;

for (const route of ROUTES) {
  for (const viewport of VIEWPORTS) {
    const openNav = viewport.name === 'phone';
    const [a, b] = await Promise.all([
      probe(browser, LEGACY, route, { width: viewport.width, height: viewport.height }, openNav),
      probe(browser, NEXT, route, { width: viewport.width, height: viewport.height }, openNav),
    ]);
    const problems = [];
    for (const name of Object.keys(PROBES)) {
      checks++;
      const x = a[name];
      const y = b[name];
      if (!x && !y) continue;
      if (!x || !y) { problems.push(`${name}: present on ${x ? 'legacy' : 'next'} only`); continue; }
      if (JSON.stringify(x.box) !== JSON.stringify(y.box)) {
        problems.push(`${name} box  legacy ${JSON.stringify(x.box)}  next ${JSON.stringify(y.box)}`);
      }
      if (x.text !== y.text) {
        problems.push(`${name} text\n         legacy «${x.text.slice(0, 120)}»\n         next   «${y.text.slice(0, 120)}»`);
      }
      for (const k of STYLE_KEYS) {
        if (x.style[k] !== y.style[k]) problems.push(`${name}.${k}  «${x.style[k]}» vs «${y.style[k]}»`);
      }
    }
    mismatches += problems.length;
    console.log(`${problems.length ? 'DIFF' : 'ok  '} ${route} @${viewport.name}${openNav ? ' nav-open' : ''}`);
    for (const p of problems) console.log(`       ${p}`);
  }
}

await browser.close();
console.log(`\n${checks} element probes · ${mismatches} mismatch(es)`);
process.exit(mismatches ? 1 : 0);
