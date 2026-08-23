// Which elements do the `[style*="…"]` responsive rules actually hit?
//
// Those selectors match the browser's normalised serialisation of an inline
// style, which only exists when React sets styles on the client. Server-rendered
// HTML writes `grid-template-columns:1.5fr 1fr 1fr` (no space) and never matches,
// so every hit below needs an explicit class in the port. Run against the legacy
// site (node serve-legacy.mjs) to enumerate them.
//
//   node .migration/audit-responsive.mjs [baseUrl]
import { chromium } from 'playwright';
import { ROUTES } from './shots.mjs';

const BASE = (process.argv[2] || 'http://localhost:4173').replace(/\/$/, '');

// Keyed by the class the port will use in place of the style-substring match.
export const GROUPS = {
  'r-collapse': [
    '[style*="grid-template-columns: 1.2fr 0.8fr"]',
    '[style*="grid-template-columns: 0.75fr 1.25fr"]',
    '[style*="grid-template-columns: 0.9fr 1.1fr"]',
    '[style*="grid-template-columns: 0.8fr 1.2fr"]',
    '[style*="grid-template-columns: 1fr 1fr"]',
    '[style*="grid-template-columns: 1.5fr 1fr 1fr"]',
  ],
  'r-5up': ['[style*="repeat(5, minmax(0px, 1fr))"]'],
  'r-12col': ['[style*="repeat(12, 1fr)"]'],
  'r-labelled': [
    '[style*="grid-template-columns: 100px 1fr 1fr"]',
    '[style*="grid-template-columns: 120px 1fr 1fr"]',
  ],
  'r-3up': ['[style*="repeat(3, minmax(0px, 1fr))"]'],
  'r-tall': ['[style*="min-height: 440px"]', '[style*="min-height: 480px"]'],
};

const describe = () => {
  const path = (el) => {
    const bits = [];
    for (let n = el; n && n.tagName !== 'BODY'; n = n.parentElement) {
      const i = n.parentElement ? [...n.parentElement.children].indexOf(n) : 0;
      bits.unshift(n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + `:${i}`);
    }
    return bits.slice(-4).join('>');
  };
  return path;
};

const browser = await chromium.launch({ channel: 'chrome' });
let total = 0;
for (const [route, url] of Object.entries(ROUTES)) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  // The app must be mounted first — otherwise the preloader check below passes
  // against the bare unpacking screen and every page reports zero matches.
  await page.waitForSelector('header', { state: 'attached', timeout: 20000 });
  await page.waitForFunction(() => {
    const el = [...document.querySelectorAll('div')].find((d) => {
      const s = getComputedStyle(d);
      return s.position === 'fixed' && s.zIndex === '9998';
    });
    return !el || Number(getComputedStyle(el).opacity) === 0;
  }, null, { timeout: 15000 });

  const hits = await page.evaluate(([groups, describeSrc]) => {
    const path = eval(`(${describeSrc})`)();
    const out = {};
    for (const [cls, sels] of Object.entries(groups)) {
      const els = [...document.querySelectorAll(sels.join(','))];
      if (els.length) out[cls] = els.map((e) => `${path(e)}  «${(e.getAttribute('style') || '').slice(0, 70)}»`);
    }
    return out;
  }, [GROUPS, describe.toString()]);

  const n = Object.values(hits).flat().length;
  total += n;
  console.log(`\n${route} — ${n} element(s)`);
  for (const [cls, list] of Object.entries(hits)) {
    for (const item of list) console.log(`  ${cls.padEnd(11)} ${item}`);
  }
  await page.close();
}
await browser.close();
console.log(`\nTOTAL: ${total} elements need an explicit class in the port`);
