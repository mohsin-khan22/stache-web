'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { ChromeContext } from './chrome-context';

// /work/<slug> is a case study (app/work/[slug])
const INTERNAL = /^\/(?:work(?:\/[a-z0-9-]+)?|services|about|contact)?$/;

// A click the browser would answer with an in-page navigation. Anything else —
// a new tab, a middle click, a modifier held down — has to keep the browser's
// own behaviour, so the preloader must not swallow it.
function isPlainClick(e) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

/**
 * One link component for the whole site, because several places render internal
 * routes and outbound links from the same list — the footer's "Start a
 * conversation" column mixes /contact with mailto:, tel: and Instagram links.
 *
 * Internal routes get next/link, so the route swaps without a document load and
 * the chrome stays mounted. The click is then handed to the shell, which puts
 * the red panel up on the spot, pushes the route behind it and replays the
 * preloader on the other side — frame for frame what a hard reload shows.
 *
 * When the shell declines the click (it answers false for the route already on
 * screen, or when there is no router) the plain next/link behaviour stands.
 * Anything else — mailto:, #, an external URL — stays a plain <a>.
 */
export default function SiteLink({ href, children, onClick, ...rest }) {
  const chrome = useContext(ChromeContext);

  if (INTERNAL.test(href)) {
    const handleClick = (e) => {
      if (onClick) onClick(e);
      if (e.defaultPrevented || !isPlainClick(e)) return;
      if (rest.target && rest.target !== '_self') return;
      if (!chrome || !chrome.beginTransition) return;
      if (chrome.beginTransition(href)) e.preventDefault();
    };
    return (
      <Link href={href} {...rest} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...rest} onClick={onClick}>
      {children}
    </a>
  );
}
