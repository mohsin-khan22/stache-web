'use client';

import SiteLink from './SiteLink';
import { NAV } from './nav';

const LINK = {
  fontFamily: "Oswald,'Arial Narrow',sans-serif",
  fontSize: '2.6rem',
  textTransform: 'uppercase',
  color: '#f2eee5',
};

// Hidden by default; the 820px breakpoint flips [data-mobile-nav] to flex. The
// panel is always in the DOM and slides in via transform, so the open state is
// a transition rather than a mount.
export default function MobileNav({ style }) {
  return (
    <div data-mobile-nav="" style={style}>
      {NAV.map((item) => (
        <SiteLink key={item.page} href={item.href} style={LINK}>
          {item.label}
        </SiteLink>
      ))}
    </div>
  );
}
