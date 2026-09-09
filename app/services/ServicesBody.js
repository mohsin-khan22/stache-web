'use client';

import { useChrome } from '../_chrome/chrome-context';
import SiteLink from '../_chrome/SiteLink';
import { sx } from '../pseudo';

const CONTAINER = { width: 'min(calc(100% - 3rem),1440px)', margin: 'auto' };

const REVEAL = {
  opacity: 0,
  transform: 'translateY(28px)',
  transition: 'opacity .8s ease,transform .8s cubic-bezier(.2,.8,.2,1)',
};

const EYEBROW = {
  ...REVEAL,
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  fontWeight: 800,
  fontSize: '0.76rem',
  color: '#ef2329',
};

const RULE = { width: '38px', height: '2px', background: '#ef2329' };

const OSWALD = "Oswald,'Arial Narrow',sans-serif";

const PANEL = {
  padding: 'clamp(2rem,5vw,4rem)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const PILL = {
  display: 'inline-flex',
  borderRadius: '999px',
  padding: '0.45rem 0.8rem',
  fontSize: '0.72rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
};

const MEDIA = { position: 'relative', overflow: 'hidden' };
const MEDIA_IMG = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const PILLARS = [
  {
    n: '01',
    title: 'Digital marketing management',
    body: 'Full end-to-end brand management across content, community, campaigns, strategy, and performance.',
    tags: ['Content strategy', 'Social management', 'Community', 'Campaigns', 'Performance marketing'],
    image: '/assets/images/services-digital-marketing.jpg',
    alt: 'Digital marketing campaign visual',
    red: true,
    imageFirst: false,
    icon: (
      <svg viewBox="0 0 48 48" width="24" height="24" fill="none" stroke="#ef2329" strokeWidth="2.5">
        <circle cx="16" cy="24" r="3" fill="#ef2329" stroke="none" />
        <path d="M20 17a11 11 0 0 1 0 14" strokeLinecap="round" />
        <path d="M24 11a19 19 0 0 1 0 26" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Social consultancy',
    body: 'We position brands, not just post content. Voice, audience, messaging, channel role, and goals are aligned into one coherent system.',
    tags: ['Positioning', 'Brand voice', 'Audience strategy', 'Channel planning', 'Governance'],
    image: '/assets/images/services-brand-strategy.jpg',
    alt: 'Dubai brand strategy campaign',
    red: false,
    imageFirst: true,
    icon: (
      <svg viewBox="0 0 48 48" width="24" height="24" fill="none" stroke="#fff" strokeWidth="2.5">
        <rect x="7" y="11" width="34" height="21" rx="10" />
        <path d="M18 32l-2 7 8-7" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Conceptual project execution',
    body: 'We bring big ideas to life through campaigns, activations, video production, event execution, podcast production, and immersive experiences.',
    tags: ['Concept development', 'Activations', 'Events', 'Video production', 'Immersive design'],
    image: '/assets/images/services-nsti-immersive.jpg',
    alt: 'NSTI Festival immersive technology campaign',
    red: false,
    imageFirst: false,
    icon: (
      <svg viewBox="0 0 48 48" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2.5">
        <rect x="14" y="14" width="20" height="20" transform="rotate(45 24 24)" />
      </svg>
    ),
  },
];

export default function ServicesBody() {
  const { addReveal, heroCopyParallax } = useChrome();
  const heroCopyStyle = Object.assign({ ...CONTAINER, position: 'relative', zIndex: 1 }, heroCopyParallax(560));

  return (
    <>
      <section
        style={{
          minHeight: '72svh',
          padding: '10rem 0 5rem',
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
          <div ref={addReveal} style={{ ...EYEBROW, marginBottom: '1.5rem' }}>
            <span data-rule="" ref={addReveal} style={RULE} />
            Capabilities
          </div>
          <h1
            ref={addReveal}
            style={{
              opacity: 0,
              transform: 'translateY(28px)',
              transition: 'opacity .8s ease .1s,transform .8s cubic-bezier(.2,.8,.2,1) .1s',
              fontFamily: OSWALD,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '-0.055em',
              lineHeight: 0.95,
              margin: 0,
              fontSize: 'clamp(2.9rem,6.5vw,6.5rem)',
              maxWidth: '1200px',
            }}
          >
            What we do.
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
              What we are made of.
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
            Three integrated service pillars, one uncompromising standard of execution.
          </p>
        </div>
        <div
          aria-hidden="true"
          data-numeral=""
          style={{
            position: 'absolute',
            right: '2rem',
            bottom: '2rem',
            fontFamily: OSWALD,
            fontSize: 'clamp(7rem,18vw,19rem)',
            color: 'rgba(255,255,255,0.025)',
          }}
        >
          03
        </div>
      </section>

      <section style={{ padding: '8rem 0' }}>
        <div style={CONTAINER}>
          {PILLARS.map((p, i) => {
            const copy = (
              <div
                key="copy"
                style={{
                  ...PANEL,
                  ...(p.red ? { background: '#ef2329', color: '#fff' } : { background: '#111' }),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: p.red ? '#fff' : '#ef2329',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {p.icon}
                  </div>
                  <span
                    style={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      fontSize: '0.76rem',
                      fontWeight: 900,
                      color: p.red ? '#fff' : '#ef2329',
                    }}
                  >
                    {p.n}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: OSWALD,
                    fontSize: '1.8rem',
                    textTransform: 'uppercase',
                    margin: '0.5rem 0 1rem',
                    lineHeight: 1.05,
                    color: p.red ? '#fff' : '#f2eee5',
                  }}
                >
                  {p.title}
                </h3>
                <p style={{ margin: '0 0 1.5rem', color: p.red ? '#fff' : '#d2d2d2' }}>{p.body}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        ...PILL,
                        ...(p.red
                          ? { border: '1px solid #fff', color: '#fff' }
                          : { border: '1px solid rgba(255,255,255,0.14)', color: '#d9d9d9' }),
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
            const media = (
              <div key="media" style={MEDIA}>
                <img src={p.image} alt={p.alt} data-zoom="" style={MEDIA_IMG} />
              </div>
            );
            return (
              <article
                key={p.n}
                ref={addReveal}
                data-media=""
                className={`r-collapse ${sx({ hover: 'border-color:rgba(239,35,41,0.55);box-shadow:0 26px 64px rgba(0,0,0,0.5)' })}`}
                style={{
                  opacity: 0,
                  transform: 'translateY(28px)',
                  transition:
                    'opacity .8s ease,transform .8s cubic-bezier(.2,.8,.2,1),border-color .35s ease,box-shadow .35s ease',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  minHeight: '520px',
                  border: '1px solid rgba(255,255,255,0.14)',
                  ...(i === PILLARS.length - 1 ? null : { marginBottom: '2rem' }),
                }}
              >
                {p.imageFirst ? [media, copy] : [copy, media]}
              </article>
            );
          })}
        </div>
      </section>

      <section style={{ padding: '8rem 0' }}>
        <div style={CONTAINER}>
          <div
            ref={addReveal}
            style={{
              ...REVEAL,
              background: '#ef2329',
              color: '#fff',
              borderRadius: '22px',
              padding: 'clamp(2rem,6vw,6rem)',
            }}
          >
            <h2
              style={{
                fontFamily: OSWALD,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '-0.055em',
                lineHeight: 0.96,
                margin: 0,
                fontSize: 'clamp(2.1rem,3.6vw,3.6rem)',
                color: '#fff',
              }}
            >
              Need a team that can think it and make it?
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
              <p style={{ maxWidth: '530px', fontSize: '1.15rem', margin: 0, color: '#fff' }}>
                Tell us the challenge, the audience, and the ambition. We will shape the route forward.
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
                Brief STACHE <span data-arrow="">↗</span>
              </SiteLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
