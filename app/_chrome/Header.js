'use client';

import { sx } from '../pseudo';
import { NAV, CONTAINER } from './nav';

const LINK = {
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontWeight: 800,
  color: '#cfcfcf',
  transition: '0.2s ease',
  boxShadow: 'inset 0 -2px 0 rgba(239,35,41,0)',
};

const LINK_ACTIVE = {
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontWeight: 800,
  color: '#f2eee5',
  borderBottom: '2px solid #ef2329',
  paddingBottom: '6px',
};

const CTA = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.7rem',
  border: '1px solid #ef2329',
  background: '#ef2329',
  borderRadius: '999px',
  padding: '1rem 1.3rem',
  textTransform: 'uppercase',
  fontSize: '0.76rem',
  fontWeight: 900,
  letterSpacing: '0.1em',
  color: '#fff',
  whiteSpace: 'nowrap',
  transition: '0.25s ease',
};

const TOGGLE = {
  position: 'relative',
  zIndex: 902,
  width: '46px',
  height: '46px',
  placeItems: 'center',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '50%',
  background: 'rgba(0,0,0,0.35)',
  color: '#f2eee5',
  fontSize: '1.1rem',
  cursor: 'pointer',
};

// The 820px breakpoint hides the nav and `header a:nth-of-type(2)` — the CTA,
// second <a> among its siblings — so the element order here is load-bearing.
export default function Header({ page, headerStyle, menuIcon, onToggleNav }) {
  return (
    <header style={headerStyle}>
      <div style={{ ...CONTAINER, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" aria-label="STACHE home" style={{ width: '154px', position: 'relative', zIndex: 902 }}>
          <img data-header-logo="" src="/logo.svg" alt="STACHE" style={{ display: 'block', width: '100%' }} />
        </a>
        <nav aria-label="Primary navigation" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {NAV.map((item) =>
            item.page === page ? (
              <a key={item.page} href={item.href} style={LINK_ACTIVE}>
                {item.label}
              </a>
            ) : (
              <a
                key={item.page}
                href={item.href}
                style={LINK}
                className={sx({ hover: 'color:#f2eee5;box-shadow:inset 0 -2px 0 #ef2329' })}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>
        <a
          href="/contact"
          style={CTA}
          className={sx({
            hover: 'background:#fff;border-color:#fff;color:#ef2329;transform:translateY(-2px);box-shadow:0 12px 30px rgba(239,35,41,0.35)',
            active: 'transform:translateY(0) scale(0.98)',
          })}
        >
          Get in touch <span data-arrow="">↗</span>
        </a>
        <button data-menu-toggle="" onClick={onToggleNav} aria-label="Toggle navigation" style={TOGGLE}>
          {menuIcon}
        </button>
      </div>
    </header>
  );
}
