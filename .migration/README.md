# Migration harness (Phase 0)

Tooling that makes "the Next.js site must look identical" a testable claim rather
than a promise. Nothing here ships to production.

```
npm install                 # once, in this folder
npx playwright install chromium   # optional — the scripts use system Chrome
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run extract` | Decompiles the five standalone bundles into `src/` |
| `npm run serve:legacy` | Serves the pre-migration site on `:4173` at the clean URLs netlify.toml rewrites |
| `node serve-static.mjs ../out 4174` | Serves the exported Next build the way Netlify would |
| `node shoot.mjs --base <url> --out <name>` | Captures the 35-shot matrix |
| `node compare.mjs <a> <b> [--threshold 0.1]` | Pixel-diffs two shot sets, writes diffs for anything over threshold |

Generators — each writes into `../app`, none are hand-edited afterwards:

| Command | Output |
| --- | --- |
| `node build-css.mjs` | `globals.css` (fonts + 20 shared rules, `[style*=…]` rewritten to classes) and `page-css.js` (per-page tails) |
| `node build-pseudo.mjs` | `pseudo.css` + `pseudo.js` — the 15 classes behind 109 `style-<pseudo>` attributes |
| `node build-mark-path.mjs` | `_chrome/mark-path.js` — the preloader's moustache outline |

Checks — each compares the ported site against the bundled one:

| Command | What it proves |
| --- | --- |
| **`node verify-all.mjs`** | **Runs everything below plus all four pixel matrices, with a pass/fail summary.** `--quick` skips cross-browser and devices |
| `node compare-dom.mjs` | Every element in document order: tag, box, copy, a11y attributes, decoded image size, 13 motion and 34 layout properties |
| `node compare-chrome.mjs` | 300 probes over the chrome, absolute geometry — so it also asserts both documents are the same height |
| `node compare-preloader.mjs` | The FLIP transform strings — i.e. the measured scale/offset arithmetic — match state for state |
| `node verify-cadence.mjs` | The hero autoplay, the one timer everything else freezes: same count, same order, gaps within 400ms of 6500ms |
| `node verify-devices.mjs` | iPhone 15 portrait and landscape, iPad Pro 11, Pixel 7 — real touch/DPR/UA profiles, not bare viewports |
| `node audit-responsive.mjs` | Enumerates the elements the `[style*=…]` rules hit, so each gets its class in the port |
| `node check-console.mjs [url]` | No console errors, page errors, hydration warnings or failed requests on any route |

`harness.mjs` holds the shared page-wrangling: engine launchers, the timer and
animation freezes, `waitForApp`, and `settleScroll`.

`settleScroll` earned its own function. Scrolling the page to fire every reveal
and then returning to the top used to end in a fixed 250ms wait, and on mobile
WebKit the final scroll event sometimes landed after it — leaving the app
believing it was still scrolled, with the hero copy stuck at full parallax
offset. It surfaced as a 1.29% diff on iPhone Home that **swapped sides between
runs**: legacy stuck once, next stuck the next, neither on the third. It now
polls the scroll progress bar, which is driven by the same state, instead of
guessing at a duration.

Typical loop once the Next app exists:

```bash
node serve-legacy.mjs &                                  # old site  :4173
cd .. && npm run dev &                              # new site  :3000
node shoot.mjs --base http://localhost:3000 --out candidate
node compare.mjs baseline candidate
```

## `src/` — the decompiled site

```
src/pages/<route>/template.html            raw <x-dc> template as shipped
src/pages/<route>/template.resolved.html   same, asset uuids swapped for /public paths
src/pages/<route>/logic.js                 the DCLogic class for that page
src/pages/<route>/fonts.css                @font-face block
src/pages/<route>/global.css               page's global stylesheet
src/assets/fonts/*.woff2                   6 fonts (Inter variable + Oswald ×5 subsets)
src/assets/images/*.jpg                    4 images that were embedded, not on disk
src/assets/logo.svg                        the wordmark
src/report.json                            per-page asset map and hashes
```

`global.css` is a shared core plus a small per-page tail — Home adds the hero
slideshow keyframes, Work adds `[data-lift]` and `pop`, About/Services add the
ambient orb/numeral motion, Contact adds the form rules. Phase 1 splits it that
way rather than shipping five near-copies.

## The capture matrix (`shots.mjs`)

- 5 routes × 5 viewports (1440 / 1100 / 820 / 560 / 390), full page → 25 shots
- 10 interaction states: hero slides 2 and 3, header CTA hover, the three Work
  filters, mobile nav open on Home and Contact, contact form invalid and sent

## Why the captures are reproducible

Two independent runs of all 35 shots differ by **0 pixels**. That holds because
`shoot.mjs` neutralises everything time-dependent, identically on both sides:

- intervals of ≥ 1 s are stubbed before page scripts run, freezing the hero's
  6.5 s autoplay on slide 1
- after load it waits for the preloader layer (fixed, `z-index: 9998`) to reach
  opacity 0, then for `document.fonts.ready`
- a stylesheet snaps every animation to its end frame and removes transitions,
  so no shot depends on when the shutter opened
- the page is scrolled top-to-bottom to fire every `IntersectionObserver`
  reveal, then back to 0 — reveals stay settled while scroll-derived state
  (header, progress bar, hero parallax) returns to its initial values

Any non-zero diff against `baseline` is therefore a real change — with one known
exception. The card arrow badges use `backdrop-filter: blur(10px)`, and GPU blur
is not bit-exact between runs: `work-tablet` can shift by ~74 px (0.0018%) on
those badges alone. Anything under ~0.01% concentrated on blurred elements is
noise; the default 0.1% threshold absorbs it.

## Baseline storage

The 34 MB of PNGs are gitignored. `shots/baseline/fingerprint.json` **is**
committed: sha256 + dimensions per shot. Regenerate the baseline any time with
`serve-legacy` + `shoot` while the standalone bundles are still in the tree (up
to Phase 7 — and in git history after that), then confirm the fingerprints match.
