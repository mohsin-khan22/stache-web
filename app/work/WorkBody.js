'use client';

import { useState } from 'react';
import { useChrome } from '../_chrome/chrome-context';
import SiteLink from '../_chrome/SiteLink';
import { sx } from '../pseudo';

const PROJECTS = [
  { title: 'Dubai Health Authority', sector: 'Social · Events · Podcast', category: 'government', image: '/assets/images/01_DHA_brain.jpg', fit: 'cover', pos: 'center 49%', alt: 'Dubai Health Authority project', size: 'large' },
  { title: 'DET', sector: 'Transition · Social · Campaigns', category: 'government', image: '/assets/images/02_DET_dubai_dinner.jpg', fit: 'cover', pos: 'center 45%', alt: 'Dubai Economy and Tourism project', size: 'small' },
  { title: 'NSTI Festival', sector: 'Launch · Social · Performance', category: 'government', image: '/assets/images/05_NSTI_Festival_VR.jpg', fit: 'contain', alt: 'NSTI Festival project', size: 'small' },
  { title: 'Climate Change & Environment', sector: 'Immersive video · Localisation', category: 'government', image: '/assets/images/06_ClimateChange_Mangroves.jpg', fit: 'cover', pos: 'center 45%', alt: 'Ministry of Climate Change and Environment project', size: 'large' },
  { title: 'Mercedes-Benz', sector: 'Social · Performance · Video', category: 'automotive', image: '/assets/images/03_MercedesBenz_red.jpg', fit: 'cover', pos: 'center 50%', alt: 'Mercedes-Benz project', size: 'small' },
  { title: 'Talabat', sector: 'Video · Social content', category: 'lifestyle', image: '/assets/images/04_Talabat_Ronaldo.jpg', fit: 'cover', pos: 'center 40%', alt: 'Talabat social project', size: 'large' },
];

const FILTERS = [
  { key: 'all', label: 'All work' },
  { key: 'government', label: 'Government' },
  { key: 'automotive', label: 'Automotive' },
  { key: 'lifestyle', label: 'Lifestyle & F&B' },
];

const CONTAINER = { width: 'min(calc(100% - 3rem),1440px)', margin: 'auto' };

const EYEBROW = {
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
};

export default function WorkBody() {
  const { addReveal, heroCopyParallax } = useChrome();
  const [filter, setFilter] = useState('all');
  const [filterNonce, setFilterNonce] = useState(0);

  const active = filter;
  const nonce = filterNonce;

  const heroCopyStyle = Object.assign(
    { ...CONTAINER, position: 'relative', zIndex: 1 },
    heroCopyParallax(500),
  );

  const filters = FILTERS.map((f) => ({
    label: f.label,
    select: () => {
      setFilter(f.key);
      setFilterNonce((n) => n + 1);
    },
    style: {
      border: '1px solid ' + (f.key === active ? '#ef2329' : 'rgba(255,255,255,0.14)'),
      background: f.key === active ? '#ef2329' : 'transparent',
      color: '#f2eee5', borderRadius: '999px', padding: '0.75rem 1rem',
      textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem',
      fontWeight: 900, cursor: 'pointer',
    },
  }));

  const visibleProjects = PROJECTS.filter((p) => active === 'all' || p.category === active).map((p, i) => ({
    title: p.title, sector: p.sector, alt: p.alt,
    mediaStyle: p.fit === 'contain' ? {
      position: 'absolute', inset: '20px 0 74px',
      backgroundImage: 'url(' + p.image + '), radial-gradient(circle at 50% 42%,rgba(239,35,41,0.22),transparent 62%)',
      backgroundSize: 'contain, cover',
      backgroundPosition: 'center bottom, center',
      backgroundRepeat: 'no-repeat, no-repeat',
      filter: 'saturate(1.02) contrast(1.02)',
    } : {
      position: 'absolute', inset: 0,
      backgroundImage: 'url(' + p.image + ')',
      backgroundSize: 'cover', backgroundPosition: p.pos || 'center',
      backgroundRepeat: 'no-repeat',
      filter: 'saturate(0.9) contrast(1.04) brightness(0.94)',
    },
    cardStyle: {
      gridColumn: 'span ' + (p.size === 'large' ? 8 : 4),
      position: 'relative', borderRadius: '22px', overflow: 'hidden',
      minHeight: '440px', background: '#111', border: '1px solid rgba(255,255,255,0.14)',
      // first paint defers to the scroll reveal; a filter switch replays `pop`
      // with `backwards` fill so the hover lift is not pinned afterwards
      opacity: nonce ? 1 : 0,
      transform: nonce ? 'none' : 'translateY(28px)',
      animation: nonce
        ? (nonce % 2 ? 'pop' : 'popAlt') + ' .5s cubic-bezier(.2,.8,.2,1) ' + Math.min(i * 0.045, 0.36).toFixed(3) + 's backwards'
        : 'none',
      transition: 'opacity .8s ease, transform .8s cubic-bezier(.2,.8,.2,1), border-color .35s ease, box-shadow .35s ease',
    },
  }));

  return (
    <>
      <section
        style={{
          minHeight: '64svh',
          padding: '10rem 0 4rem',
          display: 'flex',
          alignItems: 'flex-end',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          data-orb=""
          style={{
            position: 'absolute',
            inset: 'auto -10vw -25vw auto',
            width: '60vw',
            height: '60vw',
            borderRadius: '50%',
            border: '1px solid rgba(239,35,41,0.25)',
          }}
        />
        <div style={heroCopyStyle}>
          <div ref={addReveal} style={EYEBROW}>
            <span data-rule="" ref={addReveal} style={{ width: '38px', height: '2px', background: '#ef2329' }} />
            Our work
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
              maxWidth: '1200px',
            }}
          >
            Proof over
            <br />
            <span
              style={{
                background: 'linear-gradient(100deg,#ef2329 0%,#ff6b6f 35%,#ef2329 70%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                animation: 'sheen 7s linear infinite',
              }}
            >
              promises.
            </span>
          </h1>
          <p
            ref={addReveal}
            style={{
              opacity: 0,
              transform: 'translateY(28px)',
              transition: 'opacity .8s ease .2s,transform .8s cubic-bezier(.2,.8,.2,1) .2s',
              fontSize: 'clamp(1.02rem,1.35vw,1.22rem)',
              color: '#d2d2d2',
              maxWidth: '670px',
              marginTop: '1.5rem',
            }}
          >
            A closer look at work across government, automotive, lifestyle, food and beverage, education, and
            sustainability.
          </p>
        </div>
        <div
          aria-hidden="true"
          data-numeral=""
          style={{
            position: 'absolute',
            right: '2rem',
            bottom: '2rem',
            fontFamily: "Oswald,'Arial Narrow',sans-serif",
            fontSize: 'clamp(7rem,18vw,19rem)',
            color: 'rgba(255,255,255,0.025)',
          }}
        >
          04
        </div>
      </section>

      <section style={{ padding: '2rem 0 8rem' }}>
        <div style={CONTAINER}>
          <div
            ref={addReveal}
            style={{
              opacity: 0,
              transform: 'translateY(28px)',
              transition: 'opacity .8s ease,transform .8s cubic-bezier(.2,.8,.2,1)',
              display: 'flex',
              gap: '0.7rem',
              flexWrap: 'wrap',
              margin: '0 0 3rem',
            }}
          >
            {filters.map((f, i) => (
              <button key={i} data-lift="" onClick={f.select} style={f.style}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="r-12col" style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: '1.4rem' }}>
            {visibleProjects.map((p, i) => (
              <div
                key={i}
                role="img"
                ref={addReveal}
                data-card=""
                aria-label={p.alt}
                className={`r-tall ${sx({ hover: 'transform:translateY(-6px);border-color:rgba(239,35,41,0.6);box-shadow:0 26px 64px rgba(0,0,0,0.6)' })}`}
                style={p.cardStyle}
              >
                <div data-zoom="" style={p.mediaStyle} />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg,transparent 30%,rgba(0,0,0,0.88))',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    zIndex: 2,
                    left: '1.6rem',
                    right: '1.6rem',
                    bottom: '1.6rem',
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        color: '#ddd',
                      }}
                    >
                      {p.sector}
                    </span>
                    <h3
                      style={{
                        fontFamily: "Oswald,'Arial Narrow',sans-serif",
                        fontSize: 'clamp(1.5rem,2.2vw,2.3rem)',
                        lineHeight: 1.1,
                        textTransform: 'uppercase',
                        margin: '0.5rem 0 0',
                        color: '#f2eee5',
                      }}
                    >
                      {p.title}
                    </h3>
                  </div>
                  <span
                    data-arrow-badge=""
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.45)',
                      display: 'grid',
                      placeItems: 'center',
                      background: 'rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(10px)',
                      flexShrink: 0,
                    }}
                  >
                    ↗
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 8rem' }}>
        <div style={CONTAINER}>
          <div
            ref={addReveal}
            style={{
              opacity: 0,
              transform: 'translateY(28px)',
              transition: 'opacity .8s ease,transform .8s cubic-bezier(.2,.8,.2,1)',
              background: '#ef2329',
              color: '#fff',
              borderRadius: '22px',
              padding: 'clamp(2rem,6vw,6rem)',
            }}
          >
            <h2
              style={{
                fontFamily: "Oswald,'Arial Narrow',sans-serif",
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '-0.055em',
                lineHeight: 0.96,
                margin: 0,
                fontSize: 'clamp(2.1rem,3.6vw,3.6rem)',
                color: '#fff',
              }}
            >
              Your brand could be next.
            </h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end',
                gap: '2rem',
                marginTop: '3rem',
                flexWrap: 'wrap',
              }}
            >
              <p style={{ maxWidth: '530px', fontSize: '1.05rem', margin: 0, color: '#fff' }}>
                From a sharper social presence to a fully realised campaign ecosystem, let us build the work that moves
                your audience.
              </p>
              <SiteLink
                href="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  border: '1px solid #fff',
                  borderRadius: '999px',
                  padding: '1rem 1.3rem',
                  textTransform: 'uppercase',
                  fontSize: '0.76rem',
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  color: '#fff',
                  transition: '0.25s ease',
                }}
                className={sx({ hover: 'background:#fff;color:#ef2329;transform:translateY(-2px);white-space:nowrap' })}
              >
                Get in touch <span data-arrow="">↗</span>
              </SiteLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
