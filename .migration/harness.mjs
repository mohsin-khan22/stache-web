// Shared page-wrangling for every comparison script, so all of them settle a
// page the same way. Four scripts had grown their own copies of this.
import { chromium, firefox, webkit } from 'playwright';

export const ENGINES = {
  // The bundled Chromium download failed in this environment, so Chrome runs
  // from the system install.
  chrome: () => chromium.launch({ channel: 'chrome' }),
  firefox: () => firefox.launch(),
  webkit: () => webkit.launch(),
};

// Runs before any page script. Long intervals are the hero slideshow's 6.5s
// autoplay — left alive, the slide showing at capture time is a coin toss.
export const FREEZE_TIMERS = () => {
  const real = window.setInterval.bind(window);
  window.setInterval = (fn, ms, ...rest) => (ms >= 1000 ? 0 : real(fn, ms, ...rest));
};

// Snaps every animation to its end frame and removes transitions, so nothing
// depends on when the shutter opened.
export const FREEZE_CSS = `*,*::before,*::after{
  animation-delay:0s !important;
  animation-duration:0s !important;
  animation-iteration-count:1 !important;
  animation-fill-mode:both !important;
  transition:none !important;
  caret-color:transparent !important;
}`;

/** Waits for the app to mount and the preloader to hand off to the header. */
export async function waitForApp(page, timeout = 25000) {
  // The app must be mounted first: on a document that has not rendered there is
  // no preloader layer to find, and the check below would pass against the bare
  // unpacking screen.
  await page.waitForSelector('header', { state: 'attached', timeout });
  await page.waitForFunction(() => {
    const el = [...document.querySelectorAll('div')].find((d) => {
      const s = getComputedStyle(d);
      return s.position === 'fixed' && s.zIndex === '9998';
    });
    return !el || Number(getComputedStyle(el).opacity) === 0;
  }, null, { timeout });
  await page.evaluate(() => document.fonts.ready);
}

/**
 * Scrolls the page top to bottom so every IntersectionObserver reveal fires,
 * then returns to 0.
 *
 * The wait at the end is not a sleep: it polls the scroll progress bar, whose
 * width is driven by the same state as the header and the hero parallax. On
 * mobile WebKit the final scroll event can land after a fixed timeout would
 * have expired, leaving the app believing it is still scrolled — which showed
 * up as the hero copy stuck at its full parallax offset, on whichever of the
 * two sites happened to lose the race that run.
 */
export async function settleScroll(page, timeout = 10000) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => {
    if (window.scrollY !== 0) return false;
    const bar = [...document.querySelectorAll('div')].find((d) => {
      const s = getComputedStyle(d);
      return s.position === 'fixed' && s.zIndex === '1000' && s.height === '3px';
    });
    return !bar || bar.getBoundingClientRect().width === 0;
  }, null, { timeout });
  // One more frame so the re-render that zeroing the state triggers is painted.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}
