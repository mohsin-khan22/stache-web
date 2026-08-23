// Phase 6: walks the whole rendered tree on both sites and compares every
// element in document order.
//
//   node .migration/compare-dom.mjs [legacyUrl] [nextUrl]
//
// The pixel diff proves the two sites look the same at rest. This proves the
// structure and the motion behind it match too: element for element, the tag,
// box, copy, accessibility attributes, and the animation and transition
// declarations that only reveal themselves mid-flight.
//
// Each page is sampled twice, because the two questions need opposite setups:
//
//   1. Declared motion — animation and transition properties — read while the
//      page is live. Freezing first would flatten every duration to 0s and make
//      the comparison vacuous.
//   2. Layout and appearance — boxes, colours, the settled transform/opacity —
//      read after every animation is snapped to its end frame. Sampled live,
//      these differ by whatever fraction of a second separates the two runs.
import { ENGINES, FREEZE_TIMERS, FREEZE_CSS, waitForApp, settleScroll } from './harness.mjs';
import { ROUTES } from './shots.mjs';

const LEGACY = process.argv[2] || 'http://localhost:4173';
const NEXT = process.argv[3] || 'http://localhost:4174';
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'phone', width: 390, height: 844 },
];
const MAX_REPORTED = 12;

// Read live: stable no matter where playback happens to be.
const MOTION_KEYS = [
  'animationName', 'animationDuration', 'animationDelay', 'animationIterationCount',
  'animationTimingFunction', 'animationFillMode', 'animationDirection', 'animationPlayState',
  'transitionProperty', 'transitionDuration', 'transitionDelay', 'transitionTimingFunction',
  'willChange',
];

// Read frozen: these are where the element ends up.
const STATIC_KEYS = [
  'transform', 'transformOrigin', 'opacity', 'filter', 'backdropFilter',
  'display', 'position', 'zIndex', 'color', 'backgroundColor', 'backgroundImage',
  'fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'lineHeight', 'textTransform',
  'gridTemplateColumns', 'gridColumn', 'gap', 'padding', 'margin', 'border', 'borderRadius',
  'boxShadow', 'overflow', 'minHeight', 'maxWidth', 'flexDirection', 'alignItems',
  'justifyContent', 'objectFit', 'objectPosition', 'mixBlendMode', 'containerType',
];

const ATTRS = ['role', 'aria-label', 'aria-hidden', 'aria-live', 'alt', 'href', 'src', 'type', 'id', 'name', 'placeholder', 'loading', 'viewBox', 'd'];

const EMBEDDED_IN_BUNDLE = [
  '/logo.svg',
  '/assets/images/about-founder-ahmed-rezk.jpg',
  '/assets/images/services-digital-marketing.jpg',
  '/assets/images/services-brand-strategy.jpg',
  '/assets/images/services-nsti-immersive.jpg',
];

// Differences that are the point of the migration, not regressions. Both sides
// are normalised to the same shape so anything left over is a real finding.
const NORMALISE = {
  // Routing: the bundle linked to sibling .html files, the port uses clean URLs.
  href: (v) => {
    const m = /^STACHE (\w+) \(standalone\)\.html$/.exec(v);
    if (!m) return v;
    return m[1].toLowerCase() === 'home' ? '/' : '/' + m[1].toLowerCase();
  },
  // Assets: the bundle mints a blob: URL for anything it had embedded, so those
  // URLs carry no comparable identity. The four images that were embedded — plus
  // the logo — are collapsed to a token on both sides; every <img> is separately
  // compared on its decoded pixel dimensions, which is the check that matters.
  // Everything else was already an on-disk path, just relative rather than root.
  src: (v) => {
    if (v.startsWith('blob:')) return '<embedded>';
    const abs = '/' + v.replace(/^\//, '');
    return EMBEDDED_IN_BUNDLE.includes(abs) ? '<embedded>' : abs;
  },
};


// Runs inside the page for both passes; `keys` decides which half is collected.
const COLLECT = function collect(keys, attrs, normaliseSrc, withBoxes) {
  const normalise = eval(`(${normaliseSrc})`);
  const r = (n) => Math.round(n * 100) / 100;
  const out = [];
  const walk = (el, path) => {
    const tag = el.tagName.toLowerCase();
    // Not rendered content, and each bundler emits its own.
    if (['script', 'style', 'link', 'meta', 'title'].includes(tag)) return;
    // dc-runtime wraps every {{ }} text interpolation in a <span class=
    // "sc-interp">; the port emits the text directly. Resolved, the span is
    // inline and unstyled, so it is skipped here and its text still counts
    // toward the parent's textContent.
    if (typeof el.className === 'string' && el.className.split(/\s+/).includes('sc-interp')) {
      [...el.children].forEach((c, i) => walk(c, `${path}>${c.tagName.toLowerCase()}:${i}`));
      return;
    }
    const cs = getComputedStyle(el);
    const style = {};
    for (const k of keys) {
      // Computed url() values are absolute, so they carry the dev server's
      // origin, and a blob URL carries nothing comparable at all.
      style[k] = String(cs[k])
        .replace(/https?:\/\/localhost:\d+/g, '')
        .replace(/blob:[^"')]+/g, '<embedded>');
    }
    const record = { path, tag, style };
    if (withBoxes) {
      // The decoded size proves the same image actually loaded, whatever the
      // URL looked like.
      if (tag === 'img') record.pixels = `${el.naturalWidth}x${el.naturalHeight}`;
      const b = el.getBoundingClientRect();
      record.box = [r(b.x), r(b.y), r(b.width), r(b.height)];
      record.attributes = {};
      for (const a of attrs) {
        const v = el.getAttribute(a);
        if (v === null) continue;
        record.attributes[a] = normalise[a] ? normalise[a](v) : v;
      }
      // Whole textContent, not direct text: the skipped interpolation spans
      // would otherwise move copy onto a child that does not exist on the other
      // side. Whitespace is stripped — the bundled HTML is indented, JSX is not.
      record.text = (el.textContent || '').replace(/\s+/g, '');
    }
    out.push(record);
    [...el.children].forEach((c, i) => walk(c, `${path}>${c.tagName.toLowerCase()}:${i}`));
  };
  // Anchored at #dc-root, the app root on both sides. Outside it each stack
  // keeps its own plumbing: the bundle leaves its <script type="text/x-dc"> in
  // the body, Next adds a hidden Suspense marker div and an empty
  // <next-route-announcer>. All of it is display:none or zero-box, which the
  // pixel diff independently confirms.
  walk(document.getElementById('dc-root'), '#dc-root');
  return out;
}.toString();

// The normalisers cross into the page as source text — functions are not
// serialisable across the evaluate boundary — so the list they close over has
// to travel with them.
const NORMALISE_SRC =
  `(()=>{const EMBEDDED_IN_BUNDLE=${JSON.stringify(EMBEDDED_IN_BUNDLE)};` +
  `return {${Object.entries(NORMALISE).map(([k, fn]) => `${k}:${fn}`).join(',')}}})()`;

async function snapshot(browser, base, route, viewport) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  // Freeze the hero autoplay so both sides sit on the same slide; its cadence is
  // checked separately, by verify-cadence.mjs.
  await ctx.addInitScript(FREEZE_TIMERS);
  const page = await ctx.newPage();
  await page.goto(base + route, { waitUntil: 'domcontentloaded' });
  await waitForApp(page);

  await settleScroll(page);

  const run = (keys, withBoxes) =>
    page.evaluate(
      ([k, a, n, w, src]) => eval(`(${src})`)(k, a, n, w),
      [keys, ATTRS, NORMALISE_SRC, withBoxes, COLLECT],
    );

  const motion = await run(MOTION_KEYS, false);
  await page.addStyleTag({ content: FREEZE_CSS });
  await page.waitForTimeout(150);
  const layout = await run(STATIC_KEYS, true);

  await ctx.close();
  return layout.map((el, i) => ({ ...el, style: { ...el.style, ...(motion[i] ? motion[i].style : {}) } }));
}

const browser = await ENGINES.chrome();
const ALL_KEYS = [...MOTION_KEYS, ...STATIC_KEYS];
let totalMismatches = 0;
let totalElements = 0;

for (const [name, route] of Object.entries(ROUTES)) {
  for (const viewport of VIEWPORTS) {
    const [a, b] = await Promise.all([
      snapshot(browser, LEGACY, route, { width: viewport.width, height: viewport.height }),
      snapshot(browser, NEXT, route, { width: viewport.width, height: viewport.height }),
    ]);
    const problems = [];

    if (a.length !== b.length) {
      problems.push(`element count: legacy ${a.length}, next ${b.length}`);
      const n = Math.min(a.length, b.length);
      for (let i = 0; i < n; i++) {
        if (a[i].tag !== b[i].tag) {
          problems.push(`  first divergence at #${i}: legacy <${a[i].tag}> ${a[i].path} vs next <${b[i].tag}> ${b[i].path}`);
          break;
        }
      }
    }

    const n = Math.min(a.length, b.length);
    for (let i = 0; i < n; i++) {
      const x = a[i];
      const y = b[i];
      const where = `#${i} <${x.tag}> ${x.path}`;
      if (x.tag !== y.tag) { problems.push(`${where}: tag ${x.tag} vs ${y.tag}`); continue; }
      if (JSON.stringify(x.box) !== JSON.stringify(y.box)) {
        problems.push(`${where}: box ${JSON.stringify(x.box)} vs ${JSON.stringify(y.box)}`);
      }
      if (x.text !== y.text) problems.push(`${where}: text «${x.text.slice(0, 80)}» vs «${y.text.slice(0, 80)}»`);
      if (x.pixels !== y.pixels) problems.push(`${where}: decoded image ${x.pixels} vs ${y.pixels}`);
      for (const k of new Set([...Object.keys(x.attributes), ...Object.keys(y.attributes)])) {
        if (x.attributes[k] !== y.attributes[k]) {
          problems.push(`${where}: [${k}] «${String(x.attributes[k]).slice(0, 60)}» vs «${String(y.attributes[k]).slice(0, 60)}»`);
        }
      }
      for (const k of ALL_KEYS) {
        if (x.style[k] !== y.style[k]) problems.push(`${where}: ${k} «${x.style[k]}» vs «${y.style[k]}»`);
      }
    }

    totalElements += n;
    totalMismatches += problems.length;
    console.log(`${problems.length ? 'DIFF' : 'ok  '} ${name} @${viewport.name} — ${n} elements${problems.length ? `, ${problems.length} mismatch(es)` : ''}`);
    for (const p of problems.slice(0, MAX_REPORTED)) console.log(`       ${p}`);
    if (problems.length > MAX_REPORTED) console.log(`       … and ${problems.length - MAX_REPORTED} more`);
  }
}

await browser.close();
console.log(`\n${totalElements} elements compared · ${totalMismatches} mismatch(es)`);
process.exit(totalMismatches ? 1 : 0);
