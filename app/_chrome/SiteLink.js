'use client';

import Link from 'next/link';

const INTERNAL = /^\/(?:work|services|about|contact)?$/;

/**
 * One link component for the whole site, because several places render internal
 * routes and outbound links from the same list — the footer's "Start a
 * conversation" column mixes /contact with a mailto: and two placeholder
 * anchors.
 *
 * Internal routes get next/link, so clicking one swaps the page without a
 * document load and the chrome (preloader included) stays as it is. Anything
 * else — mailto:, #, an external URL — stays a plain <a>, which is what
 * next/link would degrade to anyway, without the prefetch machinery.
 */
export default function SiteLink({ href, children, ...rest }) {
  if (INTERNAL.test(href)) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
