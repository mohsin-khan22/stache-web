'use client';

import { createContext, useContext } from 'react';

/**
 * What the shell hands down to a page body. In the bundle every page was one
 * component, so the reveal collector, the scroll position and the parallax
 * helper were simply in scope; this is the same values, passed explicitly.
 *
 * The value object is rebuilt on every scroll frame — deliberately. The
 * original re-rendered the whole page on each scroll event too, and the hero
 * parallax depends on it.
 */
export const ChromeContext = createContext(null);

export function useChrome() {
  const ctx = useContext(ChromeContext);
  if (!ctx) throw new Error('useChrome must be called inside <SiteShell>');
  return ctx;
}
