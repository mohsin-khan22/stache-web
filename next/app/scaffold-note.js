// Phase 2 placeholder body. The chrome around it is final; this stands in for
// the page content until Phase 4 ports each page's sections.
'use client';

import { useChrome } from './_chrome/chrome-context';

export default function ScaffoldNote({ page, rules }) {
  const { addReveal } = useChrome();
  return (
    <section style={{ padding: '9rem 0 8rem' }}>
      <div style={{ width: 'min(calc(100% - 3rem),1440px)', margin: 'auto' }}>
        <div
          ref={addReveal}
          style={{
            opacity: 0,
            transform: 'translateY(28px)',
            transition: 'opacity .8s ease,transform .8s cubic-bezier(.2,.8,.2,1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            fontWeight: 800,
            fontSize: '0.76rem',
            color: '#ef2329',
            marginBottom: '1.5rem',
          }}
        >
          <span data-rule="" ref={addReveal} style={{ width: '38px', height: '2px', background: '#ef2329' }} />
          {page}
        </div>
        <h1
          ref={addReveal}
          style={{
            opacity: 0,
            transform: 'translateY(28px)',
            transition: 'opacity .8s ease .1s,transform .8s cubic-bezier(.2,.8,.2,1) .1s',
            fontFamily: "Oswald,'Arial Narrow',sans-serif",
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '-0.055em',
            lineHeight: 0.95,
            margin: 0,
            fontSize: 'clamp(2.9rem,6.5vw,6.5rem)',
          }}
        >
          {page} scaffold
        </h1>
        <p
          ref={addReveal}
          style={{
            opacity: 0,
            transform: 'translateY(28px)',
            transition: 'opacity .8s ease .2s,transform .8s cubic-bezier(.2,.8,.2,1) .2s',
            color: '#d2d2d2',
            maxWidth: '670px',
            marginTop: '1.5rem',
          }}
        >
          Chrome is ported: preloader, progress bar, header, mobile nav, footer and the reveal observer. This route
          carries {rules} page-specific CSS rules. The page body lands in Phase 4.
        </p>
      </div>
    </section>
  );
}
