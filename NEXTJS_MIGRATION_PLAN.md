# STACHE → Next.js Migration Plan

**Goal:** move the site onto Next.js with **zero visual or content change**. Every pixel,
font metric, animation timing, hover state and string of copy stays exactly as it is today.
Next.js gives us real routing, a source tree we can edit, and normal deploys — nothing else
changes.

---

## 1. What the site actually is today (findings)

This is not a hand-written HTML site. Each `STACHE <Page> (standalone).html` is a
**self-unpacking bundle** produced by Claude's design-canvas exporter:

| Layer | Detail |
| --- | --- |
| Loader | ~380 lines of inline JS that reads three `<script type="__bundler/*">` blocks (manifest / ext_resources / template), gunzips base64 assets into blob URLs, rewrites UUID references, then boots the page |
| Runtime | `dc-runtime` — a 69 KB generated JS bundle, rendered by **React 18 UMD** pulled from unpkg (also embedded) |
| Source | One `<x-dc>` template (HTML + `{{ binding }}` interpolation) plus one `class Component extends DCLogic` script per page |
| Assets | Fonts, logo SVG and some images embedded as gzip+base64 inside the manifest |

So the site is already a **client-rendered React app** — it is just compiled into an opaque
single file. Migration is therefore a *decompile and re-express*, not a rewrite.

### Per-page inventory

| Page | Template | Logic | Sections | Notable behaviour |
| --- | --- | --- | --- | --- |
| Home | 70,358 chars | 338 lines | 6 | 3-slide hero slideshow (6.5 s autoplay, drift/grade per slide, progress-bar tabs), hero copy parallax |
| Work | 37,307 chars | 324 lines | 3 | `PROJECTS` (6) + `FILTERS` (4) data, `<sc-for>` loops, category filter state, `contain`/`cover` media variants |
| Services | 45,139 chars | 265 lines | 4 | 3 embedded JPEGs |
| About | 44,632 chars | 265 lines | 5 | 1 embedded JPEG |
| Contact | 37,331 chars | 267 lines | 1 | Form with client-side validation + status live region (no backend — it only resets and shows a thank-you) |

### Shared across all five pages (identical code)

- Preloader: red panel → moustache mark morph → logo FLIP into the header logo (measured with
  `getBoundingClientRect`, ~380 ms mark, 1300 ms min / 2800 ms max asset gate, 260 ms handoff)
- Fixed scroll-progress bar, scrolled-state header, mobile nav overlay
- `IntersectionObserver` reveal system (threshold 0.01, `rootMargin 0px 0px -10% 0px`, sibling
  stagger `min(i*0.07, 0.35)s`, 1800 ms fallback, `[data-rule]` scaleX special case)
- The same global `<style>` block (typography, motion system, responsive rules)
- Header / footer markup

### Assets to lift out of the bundles

- **Fonts (6 × woff2):** Inter variable 400–900 latin (48 KB) + Oswald 500/600/700 across 5
  subsets (cyrillic-ext, cyrillic, vietnamese, latin-ext, latin)
- **Logo:** one 3,131-byte SVG (identical in all five bundles)
- **Images:** Services 3 JPEGs, About 1 JPEG. Home and Work already reference
  `assets/images/*.jpg` on disk — their embedded copies are stale leftovers and get dropped.

### Two things that will break if we migrate naively

1. **`[style*="…"]` responsive selectors.** The mobile layout is driven by rules like
   `[style*="grid-template-columns: 1.2fr 0.8fr"]{grid-template-columns:1fr !important}`.
   These match the *browser-normalised* serialisation of inline styles (note the space after
   the colon), which only exists because React sets styles on the client. **Server-rendered
   React emits `grid-template-columns:1.2fr 0.8fr` with no space**, and hydration does not
   rewrite the attribute — so with SSR/SSG the entire mobile layout silently dies. Phase 3
   replaces these with explicit classes on exactly the elements that match today.
2. **`style-hover` / `style-focus` / `style-active` attributes** (109 across the site). The
   runtime turns each into a generated class `.scpN:hover{ …each declaration !important }`.
   We reproduce that transform at build time, `!important` included, or hovers change.

---

## 2. Target architecture

```
app/
  layout.jsx            fonts, global CSS, <html lang>, metadata
  page.jsx              /            → Home
  work/page.jsx         /work
  services/page.jsx     /services
  about/page.jsx        /about
  contact/page.jsx      /contact
components/
  SiteShell.jsx         'use client' — preloader + progress + header + mobile nav + footer + reveal
  useSiteChrome.js      the shared DCLogic port (state, measurements, style factories)
  Reveal.js             ref collector + IntersectionObserver
styles/
  globals.css           verbatim port of the bundle's global <style>
  pseudo.css            generated .h-*:hover / :focus / :active rules
  responsive.css        the ex-[style*=…] media queries, now class-based
public/
  assets/images/…       existing images + the 4 extracted from About/Services
  fonts/…               6 extracted woff2
  logo.svg
```

- **Next.js 15, App Router, no Tailwind, no CSS framework.** Styling stays inline exactly as
  authored; we only add the two generated stylesheets above.
- **`output: 'export'`** (static HTML). The site has no server logic, so a static export is
  the closest possible match to today's behaviour and keeps Netlify deploys trivial.
- **Fonts via `next/font/local`** using the extracted woff2 files with the same weights,
  `unicode-range`s and `font-display: swap` — identical metrics, no Google Fonts round-trip,
  no FOUT change.
- Page bodies stay **client components** (`'use client'`) because the preloader and reveal
  system measure the DOM. They are still statically pre-rendered, so HTML ships in the box.

---

## 3. Execution phases

### Phase 0 — Baseline + safety net (½ day)
The whole "must look identical" promise rests on this phase.

1. Serve the current site locally and capture full-page screenshots of all 5 pages at
   **1440 / 1100 / 820 / 560 / 390 px**, plus state captures: nav open, work filter per
   category, hero slides 0/1/2, preloader mid-flight, form status message, key hover states.
2. Save to `.migration/baseline/`.
3. Extract from the bundles into `.migration/src/`: `template.html` + `logic.js` per page,
   6 woff2, logo SVG, 4 JPEGs.
4. Write `.migration/compare.mjs` (Playwright + pixelmatch) that re-shoots the same matrix
   against any URL and reports a per-shot diff percentage.

**Exit:** baseline images committed, compare script runs green against the *old* site.

### Phase 1 — Scaffold (½ day)
Build the app in a `next/` subfolder so the live site stays untouched until cutover.

1. `create-next-app` (App Router, JS, no Tailwind, no src dir), pin React 18 to match today.
2. `next.config.mjs`: `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true`.
3. Copy `assets/images/` → `public/assets/images/` (paths keep working, now root-relative);
   add extracted fonts, logo, 4 JPEGs.
4. `app/layout.jsx`: `next/font/local` declarations, `globals.css` import, `<html lang="en">`,
   viewport meta.
5. `styles/globals.css` = verbatim copy of the bundle's global `<style>` **minus** the
   `[style*=…]` blocks (Phase 3 handles those).

**Exit:** blank routed shell builds and exports; fonts render in a test page.

### Phase 2 — Shared chrome (1 day)
Port the code that is identical on all five pages, once.

1. `useSiteChrome()` — a line-by-line port of the shared `DCLogic` members: `state`,
   `_startReveal`, `measureMarkFlip`, `markStyle`, `markPathStyle`, `measureLogoFlip`,
   `logoStyle`, `heroCopyParallax`, `toggleNav`, scroll listener, all timers and their
   cleanup. **Same constants, same easings, same delays** — no "improvements".
2. `Reveal` — `addReveal` ref callback + the IntersectionObserver, including the stagger and
   the 1800 ms fallback that only settles above-the-fold elements.
3. `SiteShell` — preloader panel, moustache SVG, progress bar, header, mobile nav, footer,
   with the exact same markup, inline styles, `data-*` hooks and ARIA labels.
4. Nav/footer links → plain `<a href>` to `/`, `/work`, `/services`, `/about`, `/contact`
   (see decision D2 — not `next/link`).

**Exit:** a scaffold page shows the identical preloader → header → footer sequence; diff of
the chrome region against baseline is clean.

### Phase 3 — Style-fidelity layer (½ day)
Mechanical, scripted, verifiable.

1. **Pseudo states.** For each of the 109 `style-hover|focus|active` attributes, emit
   `.h-<hash>:hover{ decl !important; … }` into `pseudo.css` and put `h-<hash>` in the
   element's `className`. Identical declarations dedupe to one class, exactly as the runtime
   does. `::before`/`::after` variants keep their non-`!important` form.
2. **Responsive rules.** For each `[style*="…"]` selector in the global CSS, find the elements
   whose inline style contains that substring, give them a semantic class
   (`.grid-08-12`, `.grid-5up`, `.media-tall`, …), and rewrite the media query to use it.
   Same breakpoints (1100 / 900 / 820 / 560), same `!important`s, same declarations.
3. Keep `[data-rule]`, `[data-arrow]`, `[data-zoom]`, `[data-card]`, `[data-menu-toggle]`,
   `[data-mobile-nav]` selectors as-is — those match real attributes and are SSR-safe.

**Exit:** hover/focus/active and every breakpoint match baseline on the chrome.

### Phase 4 — Page ports (2–3 days, one page at a time)
For each page: template → JSX, `renderVals()` → component values, then run the diff before
moving on.

- **4a Home** — 6 sections, hero slideshow (`heroSlides` data, `startHeroTimer` 6.5 s,
  `goSlide`, `heroSlideStyle/TrackStyle/FillStyle`, `heroFill1-3` keyframes), copy parallax
  at `range 720`.
- **4b Work** — lift `PROJECTS` (6) and `FILTERS` (4) into a data module unchanged;
  `<sc-for list as>` → `.map()`; filter state + `filterNonce` remount behaviour; the
  `fit: 'contain'` vs `'cover'` media-style branch; parallax `range 500`.
- **4c Services** — 4 sections, 3 extracted JPEGs.
- **4d About** — 5 sections, 1 extracted JPEG.
- **4e Contact** — form grid, `<sc-raw-select>` → `<select>`, `checkValidity()` behaviour and
  both status strings byte-for-byte, `aria-live` region, focus ring styles.

**Exit per page:** diff ≤ 0.1 % (antialiasing only) at all 5 viewports and all interaction
states.

### Phase 5 — Head, routing and metadata (½ day)
1. Per-route `metadata` (title/description). *Decision needed:* today every page's `<title>`
   is literally **"Bundled Page"** — a bundler artifact, not a design choice. Recommend real
   titles ("STACHE — Creative disruption meets calculated strategy", etc.). Say the word if
   you want them left untouched.
2. Add favicon + `theme-color: #050505` (currently absent).
3. `netlify.toml`: 301 the five legacy `/STACHE%20…%20(standalone).html` URLs to the new
   clean routes so any shared link keeps working.

### Phase 6 — Verification (½ day)
1. Full `compare.mjs` run: 5 pages × 5 viewports × interaction states, new build vs Phase-0
   baseline. Anything over threshold gets fixed, not waived.
2. Manual timing checklist (screen-recorded side by side): preloader flip, sheen animation,
   reveal stagger, hero autoplay cadence, filter transitions.
3. Cross-browser smoke: Chrome, Safari, Firefox, iOS Safari, Android Chrome.
4. `prefers-reduced-motion` path still disables autoplay and transitions.

### Phase 7 — Cutover (½ day)
1. Promote `next/` to repo root; `netlify.toml` → `command = "next build"`,
   `publish = "out"`.
2. Deploy to a Netlify **preview** URL first; re-run Phase 6 against it.
3. After sign-off, delete the five standalone HTML files and `__tmp_audit.html` in a
   **separate commit** so the whole cutover is one `git revert` away.

### Phase 8 — Optional, only on your say-so (not part of "no change")
Each of these is a *deliberate* change and stays off by default:
`next/image` for the project cards; compressing the hero PNGs (`Stache4.png` is 6.3 MB, the
four hero/gallery PNGs total ~13 MB); a real backend for the contact form; filling in the
placeholder contact details (`hello@stache.example`, `+971 XX XXX XXXX`, `#` social links);
SEO/OG tags; accessibility fixes.

---

## 4. Schedule

| Phase | Effort |
| --- | --- |
| 0 Baseline + extraction | 0.5 d |
| 1 Scaffold | 0.5 d |
| 2 Shared chrome | 1.0 d |
| 3 Style fidelity | 0.5 d |
| 4 Five page ports | 2.5 d |
| 5 Head/routing | 0.5 d |
| 6 Verification | 0.5 d |
| 7 Cutover | 0.5 d |
| **Total** | **~6.5 working days** |

---

## 5. Risks

| Risk | Mitigation |
| --- | --- |
| SSR style serialisation kills the `[style*=…]` mobile rules | Phase 3 converts them to classes; Phase 6 checks every breakpoint |
| Hover/focus `!important` ordering differs from the runtime sheet | Reproduce `importantify` exactly; dedupe identical declarations the same way |
| Font rendering shifts | Ship the *same* woff2 files via `next/font/local`, same weights and unicode-ranges — no Google Fonts fetch |
| Preloader FLIP measures a different layout under hydration | Keep the measurement code and its 380/260/1300/2800 ms timings verbatim; run the flip in `useEffect` after mount, as today |
| Hydration mismatch warnings from time/measurement-dependent styles | Initial state is deterministic (`loaded:false`, `slide:0`, `pct:0`), so first paint matches; all measurement happens post-mount |
| Silent copy drift while retyping markup | Port by transforming the extracted `template.html`, never by re-typing; diff text content page-by-page |

## 6. Decisions log (updated as phases land)

Settled up front: real page titles · build in `next/` then promote · JavaScript ·
static export.

**D1 — Hand-written `@font-face`, not `next/font/local`.** *(Phase 1)*
`next/font` mangles the family name and exposes it as a class or CSS variable,
but several hundred inline styles reference `Inter` and `Oswald` literally. The
bundle's own `@font-face` rules were ported verbatim, pointing at the extracted
woff2 files. Verified: text measured in Inter 400/800/900 and Oswald 500/600/700
is identical to four decimal places between the old site and the new one.

**D2 — No client-side routing; plain `<a href>`.** *(Phase 1)*
Today every nav link is a plain anchor to another HTML file, so each navigation
is a full load and **the preloader replays every time**. `next/link` would keep
the shell mounted and show it only once — a real behavioural change. Plain
anchors keep the current experience and, as a bonus, make per-route CSS
leak-proof. Can be revisited in Phase 8.

**D3 — Page-specific CSS stays page-scoped.** *(Phase 1)*
Measured, not assumed: injecting Contact's `*{box-sizing:border-box}` into the
other four pages moves **30–59 % of their pixels** (Home 0.04 %, Work 59 %,
Services 40 %, About 34 % at desktop). `.migration/build-css.mjs` splits the five
stylesheets into 20 shared rules plus a per-page tail (Home +10, Work +9,
Services +5, About +5, Contact +4) and asserts the split is lossless. The tail is
rendered into a hoisted `<style>` on its own route only — confirmed absent from
the other exported pages.

**D4 — Next 16.3.2 / React 19.**
The plan said "pin React 18 to match today". Unnecessary: the ported code is our
own, and both versions serialise inline styles identically. Taking the current
release avoids starting on an outdated base.

**D5 — Also ported: the runtime's full-page rules.** *(Phase 1)*
`dc-runtime` injected `html,body{height:100%;margin:0}` and `#dc-root{height:100%}`
at boot. Not part of any stylesheet in the bundle, easy to miss, so it now lives
at the top of `globals.css` with the root element keeping the `dc-root` id.

**D6 — Phase 3's two mechanisms landed early, with Phase 2.** *(Phase 2)*
The chrome itself needs both, so they were built rather than stubbed:
`build-pseudo.mjs` turns the 109 `style-<pseudo>` attributes into 15 generated
classes (heavy dedupe, exactly as the runtime's cache did), and `build-css.mjs`
rewrites the `[style*=…]` selectors to `.r-*` classes. Confirmed necessary:
a server-rendered `style="grid-template-columns:1.5fr 1fr 1fr"` does **not**
match `[style*="grid-template-columns: 1.5fr 1fr 1fr"]`, while the same style
assigned from JS does. `audit-responsive.mjs` lists the 41 elements needing a
class (Home 12, Work 8, Services 9, About 9, Contact 3).

**D7 — The shell is a class component.** *(Phase 2)*
The source was `class Component extends DCLogic` with `state`, `setState`,
`componentDidMount` and `componentWillUnmount`. A class carries those across
unchanged; hooks would have meant re-deriving effect boundaries and cleanup
order, which is where timing drift starts. Two properties make it safe to
pre-render: initial state is deterministic, and every DOM measurement happens
after mount.

**D8 — Home's duplicated `mobileNavStyle` is reproduced, not tidied.** *(Phase 2)*
Home's `renderVals` declared it twice; the second literal wins, so that page
alone gets `display:flex` and a 1.3rem gap. The inline `display` beats the
stylesheet's `[data-mobile-nav]{display:none}`, so above 820px Home keeps the
panel in the layout (translated off-screen) where the other four remove it.
Found by the chrome comparison, not by reading — it was the only mismatch in 300
probes.

**D9 — The contact form's required fields are a pre-existing bug, reproduced.** *(Phase 4)*
The template wrote `required=""`, which React treats as a falsy boolean prop and
drops, so no `required` attribute ever reaches the live DOM — verified directly
against the running site: `#name.required` is false and `form.checkValidity()`
returns true on an empty form. An empty submission therefore succeeds and shows
the thank-you, and the "Please complete the required fields" branch is
unreachable. Adding `required` in the port would change behaviour, so it stays
out and the bug is flagged instead. One word to fix whenever the client wants
it — a good Phase 8 candidate.

**D10 — Two authoring artifacts kept.** *(Phase 4)*
Contact's section carries `data-comment-anchor="6dfec2a67d-section"` from the
design tool, and three cards repeat `transition` twice in one style attribute
(the later value wins). Both are inert, both are reproduced — the DOM comparison
would otherwise flag them, and neither is worth a behaviour risk to tidy.

## 7. Progress

| Phase | Status |
| --- | --- |
| 0 Baseline + extraction | done — 35-shot baseline, 0-pixel repeatability |
| 1 Scaffold | done — builds and exports; fonts metrically identical |
| 2 Shared chrome | done — 300 chrome probes and the preloader FLIP identical |
| 3 Style fidelity | done — pseudo classes and responsive classes generated (see D6) |
| 4 Page ports | done — **all 35 baseline shots reproduce at 0 pixels** |
| 5 Head/routing | next |
| 6–7 | not started |
