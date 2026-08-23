import { PAGE_CSS } from './page-css';

/**
 * Emits the rules that belong to one page only. React hoists a <style> with a
 * precedence into <head>, so the result lands where the bundle's per-page
 * <style> block sat — and, because navigation is a full page load, it can
 * never bleed onto another route.
 */
export default function PageStyles({ page }) {
  const css = PAGE_CSS[page];
  if (!css) throw new Error(`no page CSS registered for "${page}"`);
  return (
    <style href={`page-${page}`} precedence="page">
      {css}
    </style>
  );
}
