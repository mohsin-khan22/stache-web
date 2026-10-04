'use client';

import { usePathname, useRouter } from 'next/navigation';
import SiteShell from './SiteShell';
import { HERO_SLIDES } from '../hero-slides';

// Maps a URL to the page identity the chrome needs: which nav item is current,
// and whether the preloader should wait on the hero slideshow's first image.
const PAGES = {
  '/': 'home',
  '/work': 'work',
  '/services': 'services',
  '/about': 'about',
  '/contact': 'contact',
};

/**
 * Sits in the root layout so the chrome survives client-side navigation.
 *
 * That placement is still the point: SiteShell mounts once per document, so the
 * preloader's timers, the reveal observer and the scroll listener are set up a
 * single time. The preloader itself no longer runs only on first load — the
 * shell replays it whenever `pathname` changes, so a link click looks like the
 * full page load it used to be, without paying for one.
 *
 * A class component cannot call hooks, so the pathname and the router are read
 * here and handed down as props.
 */
export default function RouteShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  // case studies live under /work and keep Work marked in the nav
  const page = PAGES[pathname] ?? (pathname.startsWith('/work/') ? 'work' : null);
  return (
    <SiteShell
      page={page}
      pathname={pathname}
      navigate={router.push}
      heroSlides={page === 'home' ? HERO_SLIDES : null}
    >
      {children}
    </SiteShell>
  );
}
