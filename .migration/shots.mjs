// The capture matrix, shared by shoot.mjs so baseline and candidate runs can
// never drift apart. Selectors are deliberately semantic (aria-label, visible
// text, data-* hooks) because they must resolve on both the bundled site and
// the ported Next app.

export const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1100, height: 800 },
  tablet: { width: 820, height: 1000 },
  mobile: { width: 560, height: 900 },
  phone: { width: 390, height: 844 },
};

export const ROUTES = {
  home: '/',
  work: '/work',
  services: '/services',
  about: '/about',
  contact: '/contact',
};

// Interaction states worth pinning beyond the plain full-page renders.
// `act` runs after the page has settled (preloader done, reveals triggered).
const STATES = [
  {
    name: 'home-slide-2', route: 'home', viewport: 'desktop', fullPage: false,
    act: async (p) => { await p.click('[aria-label="Show slide 2"]'); },
  },
  {
    name: 'home-slide-3', route: 'home', viewport: 'desktop', fullPage: false,
    act: async (p) => { await p.click('[aria-label="Show slide 3"]'); },
  },
  {
    name: 'home-cta-hover', route: 'home', viewport: 'desktop', fullPage: false,
    act: async (p) => { await p.hover('header a:has-text("Get in touch")'); },
  },
  {
    name: 'work-filter-government', route: 'work', viewport: 'desktop', fullPage: true,
    act: async (p) => { await p.click('button:has-text("Government")'); },
  },
  {
    name: 'work-filter-automotive', route: 'work', viewport: 'desktop', fullPage: true,
    act: async (p) => { await p.click('button:has-text("Automotive")'); },
  },
  {
    name: 'work-filter-lifestyle', route: 'work', viewport: 'desktop', fullPage: true,
    act: async (p) => { await p.click('button:has-text("Lifestyle")'); },
  },
  {
    name: 'home-nav-open', route: 'home', viewport: 'phone', fullPage: false,
    act: async (p) => { await p.click('[data-menu-toggle]'); },
  },
  {
    name: 'contact-nav-open', route: 'contact', viewport: 'phone', fullPage: false,
    act: async (p) => { await p.click('[data-menu-toggle]'); },
  },
  {
    name: 'contact-invalid', route: 'contact', viewport: 'desktop', fullPage: true,
    // Submitting an empty form must show the validation copy, not the thanks.
    act: async (p) => { await p.evaluate(() => document.querySelector('form').requestSubmit()); },
  },
  {
    name: 'contact-sent', route: 'contact', viewport: 'desktop', fullPage: true,
    act: async (p) => {
      await p.fill('#name', 'Test Person');
      await p.fill('#email', 'test@example.com');
      await p.fill('#brief', 'Baseline capture brief.');
      await p.evaluate(() => document.querySelector('form').requestSubmit());
    },
  },
];

export function buildMatrix() {
  const shots = [];
  for (const route of Object.keys(ROUTES)) {
    for (const viewport of Object.keys(VIEWPORTS)) {
      shots.push({ name: `${route}-${viewport}`, route, viewport, fullPage: true });
    }
  }
  return shots.concat(STATES);
}
