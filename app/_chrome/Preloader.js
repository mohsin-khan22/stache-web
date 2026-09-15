'use client';

import { MARK_PATH } from './mark-path';

/**
 * Red panel → moustache mark → logo FLIP into the header logo.
 *
 * The three layers stack above everything: the panel at z-index 9998, the
 * wordmark at 9999, the mark at 10000. All the timing lives in SiteShell; this
 * only draws what the style factories describe.
 *
 * The data-* hooks are load-bearing — SiteShell measures [data-preload-logo]
 * against [data-header-logo] to compute the FLIP, and [data-mark-path] to work
 * out where the moustache has to fly.
 */
export default function Preloader({ panelStyle, logoStyle, markStyle, markPathStyle }) {
  return (
    <>
      <div style={panelStyle} aria-hidden="true" />
      <img data-preload-logo="" src="/logo.svg" alt="" style={logoStyle} aria-hidden="true" />
      <svg viewBox="0 0 1200 800" style={markStyle} aria-hidden="true">
        {/*
          The inner translate has to be the moustache's own centre, so the outer
          one drops it on the viewBox centre. MARK_PATH's bounding box runs
          x 1114.83→1467.18, y 946.74→1053.24 — centre (1291, 1000). The
          bundle's (1330, 990) was a guess at it, and being 39 units out landed
          the mark 82 viewBox units left and 21 down: around 90px off centre on
          a laptop, more on a wide display. preserveAspectRatio does the rest,
          so it holds at any viewport shape.

          The flight out is unaffected either way — measureMarkFlip reads the
          path's live rect rather than assuming where it sits.
        */}
        <g transform="translate(600 400) scale(2.1) translate(-1291 -1000)">
          <path data-mark-path="" style={markPathStyle} d={MARK_PATH} />
        </g>
      </svg>
    </>
  );
}
