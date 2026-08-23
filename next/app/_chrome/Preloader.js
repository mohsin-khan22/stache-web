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
        <g transform="translate(600 400) scale(2.1) translate(-1330 -990)">
          <path data-mark-path="" style={markPathStyle} d={MARK_PATH} />
        </g>
      </svg>
    </>
  );
}
