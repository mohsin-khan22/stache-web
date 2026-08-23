// Plain <a> hrefs, not next/link: every navigation on the bundled site is a
// full document load, which is what replays the preloader on each page. Client
// transitions would show it once and quietly change the experience.
export const NAV = [
  { page: 'home', href: '/', label: 'Home' },
  { page: 'work', href: '/work', label: 'Work' },
  { page: 'services', href: '/services', label: 'Services' },
  { page: 'about', href: '/about', label: 'About' },
  { page: 'contact', href: '/contact', label: 'Contact' },
];

export const CONTAINER = { width: 'min(calc(100% - 3rem),1440px)', margin: 'auto' };
