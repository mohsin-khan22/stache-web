'use client';

import SiteLink from './SiteLink';
import { sx } from '../pseudo';
import { CONTAINER } from './nav';

const HEADING = {
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontSize: '0.72rem',
  color: '#ef2329',
  margin: '0 0 1rem',
};

const LINK = { display: 'block', color: '#bdbdbd', margin: '0.6rem 0', transition: '0.2s ease' };
const LINK_HOVER = 'color:#f2eee5;transform:translateX(3px)';

const NAVIGATE = [
  ['/about', 'About'],
  ['/services', 'Services'],
  ['/work', 'Work'],
  ['/contact', 'Contact'],
];

const CONVERSATION = [
  ['/contact', 'Project enquiry'],
  ['mailto:hello@stache.example', 'hello@stache.example'],
  ['#', 'Instagram ↗'],
  ['#', 'LinkedIn ↗'],
];

// Byte-identical across all five bundled pages, so it is built once here.
// r-collapse replaces the `[style*="grid-template-columns: 1.5fr 1fr 1fr"]`
// selector, which cannot match server-rendered markup.
export default function Footer() {
  return (
    <footer style={{ padding: '5rem 0 2rem', borderTop: '1px solid rgba(255,255,255,0.14)' }}>
      <div style={CONTAINER}>
        <div className="r-collapse" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '3rem' }}>
          <div>
            <img src="/logo.svg" alt="STACHE" style={{ width: '220px', marginBottom: '1.5rem' }} />
            <p style={{ color: '#a7a7a7' }}>
              Creative disruption meets calculated strategy. Built for brands that crave distinction — not just
              visibility.
            </p>
          </div>
          <div>
            <h4 style={HEADING}>Navigate</h4>
            {NAVIGATE.map(([href, label]) => (
              <SiteLink key={label} href={href} style={LINK} className={sx({ hover: LINK_HOVER })}>
                {label}
              </SiteLink>
            ))}
          </div>
          <div>
            <h4 style={HEADING}>Start a conversation</h4>
            {CONVERSATION.map(([href, label]) => (
              <SiteLink key={label} href={href} style={LINK} className={sx({ hover: LINK_HOVER })}>
                {label}
              </SiteLink>
            ))}
          </div>
        </div>
        <div
          style={{
            marginTop: '4rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.14)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.78rem',
            color: '#777',
            flexWrap: 'wrap',
          }}
        >
          <span>© 2026 STACHE. All rights reserved.</span>
          <span>Built to build. Designed to be impossible to ignore.</span>
        </div>
      </div>
    </footer>
  );
}
