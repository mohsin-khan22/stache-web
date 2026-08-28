// Client-side navigation was introduced deliberately, and it reopens a risk the
// full-page-load design had closed: Next does not remove hoisted stylesheets on
// route change, so per-page CSS can follow you between routes. Contact's
// `*{box-sizing:border-box}` alone moves 30-59% of the pixels on other pages.
//
//   node .migration/verify-navigation.mjs [nextUrl]
//
// Checks, in one session per scenario:
//   1. clicking a nav link does NOT load a new document
//   2. the preloader does not replay on navigation, but does on reload
//   3. page-specific CSS is gone once you leave the page that owns it
//   4. reveal elements on the newly navigated page still animate in, staggered
import { ENGINES, waitForApp } from './harness.mjs';

const NEXT = (process.argv[2] || 'http://localhost:4174').replace(/\/$/, '');
const browser = await ENGINES.chrome();
const problems = [];
const ok = (label, detail = '') => console.log(`ok   ${label}${detail ? ` — ${detail}` : ''}`);
const bad = (label, detail) => {
  problems.push(label);
  console.log(`FAIL ${label} — ${detail}`);
};

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto(NEXT + '/', { waitUntil: 'domcontentloaded' });
await waitForApp(page);

// A marker on window survives client navigation and dies with a document load.
await page.evaluate(() => { window.__documentToken = 'first-load'; });

// ── 1 & 2: navigate Home → Work by clicking the nav link ─────────────────────
await page.click('nav[aria-label="Primary navigation"] a[href="/work"]');
await page.waitForURL('**/work');
await page.waitForTimeout(600);

const afterNav = await page.evaluate(() => {
  const preloader = [...document.querySelectorAll('div')].find((d) => {
    const s = getComputedStyle(d);
    return s.position === 'fixed' && s.zIndex === '9998';
  });
  return {
    token: window.__documentToken,
    url: location.pathname,
    heading: (document.querySelector('h1')?.textContent || '').trim(),
    preloaderOpacity: preloader ? getComputedStyle(preloader).opacity : 'absent',
    activeNav: [...document.querySelectorAll('nav[aria-label="Primary navigation"] a')]
      .filter((a) => getComputedStyle(a).borderBottomWidth !== '0px')
      .map((a) => a.textContent.trim()),
  };
});

if (afterNav.token === 'first-load') ok('no document reload on nav click');
else bad('no document reload on nav click', 'window marker was lost, so the document was replaced');

if (afterNav.url === '/work') ok('URL updated', afterNav.url);
else bad('URL updated', afterNav.url);

if (afterNav.heading.startsWith('Proof over')) ok('page content swapped', `h1 = "${afterNav.heading}"`);
else bad('page content swapped', `h1 = "${afterNav.heading}"`);

if (afterNav.preloaderOpacity === '0') ok('preloader did not replay', 'still at opacity 0');
else bad('preloader did not replay', `preloader opacity is ${afterNav.preloaderOpacity}`);

if (afterNav.activeNav.join() === 'Work') ok('active nav item followed the route', afterNav.activeNav.join());
else bad('active nav item followed the route', `underlined: ${afterNav.activeNav.join() || 'none'}`);

// ── 3: page CSS must not survive leaving its page ────────────────────────────
// Contact is the page that owns `*{box-sizing:border-box}`.
await page.click('nav[aria-label="Primary navigation"] a[href="/contact"]');
await page.waitForURL('**/contact');
await page.waitForTimeout(400);
const onContact = await page.evaluate(() => getComputedStyle(document.querySelector('main')).boxSizing);

await page.click('nav[aria-label="Primary navigation"] a[href="/"]');
await page.waitForURL((u) => new URL(u).pathname === '/');
await page.waitForTimeout(400);
const backOnHome = await page.evaluate(() => ({
  boxSizing: getComputedStyle(document.querySelector('main')).boxSizing,
  token: window.__documentToken,
  styleTags: document.querySelectorAll('style').length,
}));

if (onContact === 'border-box') ok('Contact CSS applies while on Contact', onContact);
else bad('Contact CSS applies while on Contact', onContact);

if (backOnHome.boxSizing === 'content-box') ok('Contact CSS removed after leaving', 'Home is back to content-box');
else bad('Contact CSS removed after leaving', `Home main is ${backOnHome.boxSizing} — the page stylesheet leaked`);

if (backOnHome.token === 'first-load') ok('still the same document after 3 navigations');
else bad('still the same document after 3 navigations', 'a reload happened somewhere');

// ── 4: reveals on a navigated-to page ────────────────────────────────────────
await page.click('nav[aria-label="Primary navigation"] a[href="/about"]');
await page.waitForURL('**/about');
await page.waitForTimeout(1500);
const reveals = await page.evaluate(() => {
  const els = [...document.querySelectorAll('main [style*="opacity"]')];
  const inView = els.filter((el) => {
    const b = el.getBoundingClientRect();
    return b.top < window.innerHeight && b.bottom > 0;
  });
  return {
    inView: inView.length,
    revealed: inView.filter((el) => Number(getComputedStyle(el).opacity) === 1).length,
    staggered: [...document.querySelectorAll('main *')].filter((el) => el.style.transitionDelay).length,
  };
});

if (reveals.inView > 0 && reveals.revealed === reveals.inView) {
  ok('reveals fire on a navigated-to page', `${reveals.revealed}/${reveals.inView} in view are visible`);
} else {
  bad('reveals fire on a navigated-to page', `${reveals.revealed}/${reveals.inView} in view are visible`);
}
if (reveals.staggered > 0) ok('stagger delays applied after navigation', `${reveals.staggered} elements`);
else bad('stagger delays applied after navigation', 'no element carries a transitionDelay');

// ── 5: a reload still replays the preloader ──────────────────────────────────
await page.reload({ waitUntil: 'domcontentloaded' });
const onReload = await page.evaluate(() => {
  const preloader = [...document.querySelectorAll('div')].find((d) => {
    const s = getComputedStyle(d);
    return s.position === 'fixed' && s.zIndex === '9998';
  });
  return { token: window.__documentToken, opacity: preloader ? getComputedStyle(preloader).opacity : 'absent' };
});
if (onReload.token === undefined) ok('reload replaces the document');
else bad('reload replaces the document', 'window marker survived a reload');
if (onReload.opacity === '1') ok('preloader replays on reload', 'opacity 1 immediately after reload');
else bad('preloader replays on reload', `preloader opacity is ${onReload.opacity}`);

await ctx.close();
await browser.close();
console.log(problems.length ? `\n${problems.length} problem(s)` : '\nnavigation behaves as intended');
process.exit(problems.length ? 1 : 0);
