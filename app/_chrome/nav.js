// Every navigation on the bundled site was a full document load, which is what
// replayed the preloader on each page. These hrefs go through SiteLink, which
// keeps that experience — clicking one lands on the preloader's first frame and
// runs it out in full — without re-downloading the document.
export const NAV = [
  { page: 'home', href: '/', label: 'Home' },
  { page: 'work', href: '/work', label: 'Work' },
  { page: 'services', href: '/services', label: 'Services' },
  { page: 'about', href: '/about', label: 'About' },
  { page: 'contact', href: '/contact', label: 'Contact' },
];

export const CONTAINER = { width: 'min(calc(100% - 3rem),1440px)', margin: 'auto' };
