'use client';

import { usePathname } from 'next/navigation';
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
 * That placement is the whole point: SiteShell mounts once per document, so the
 * preloader runs on first load and on refresh, but not when moving between
 * routes. If the shell were rendered per page instead, every navigation would
 * remount it and replay the 1.3s preloader gate — which is what a full page
 * load used to do.
 *
 * A class component cannot call hooks, so the pathname is read here and handed
 * down as a prop.
 */
export default function RouteShell({ children }) {
  const pathname = usePathname();
  const page = PAGES[pathname] ?? null;
  return (
    <SiteShell page={page} heroSlides={page === 'home' ? HERO_SLIDES : null}>
      {children}
    </SiteShell>
  );
}
