import { PAGE_CSS } from './page-css';

/**
 * Emits the rules that belong to one page only.
 *
 * Deliberately a plain <style> with no `precedence`: that would make React
 * hoist it into <head>, where Next does not remove stylesheets on client-side
 * navigation — so Contact's `*{box-sizing:border-box}` would follow you to
 * Home and move 30-59% of its pixels. Left un-hoisted, the element lives in the
 * page's own subtree and is torn down with it.
 *
 * Position in the document does not affect what the rules do; `<style>` is
 * display:none and the cascade does not care where the tag sits.
 */
export default function PageStyles({ page }) {
  const css = PAGE_CSS[page];
  if (!css) throw new Error(`no page CSS registered for "${page}"`);
  return <style>{css}</style>;
}
