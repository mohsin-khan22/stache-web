'use client';

import { useChrome } from '../_chrome/chrome-context';
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

const H2 = {
  fontFamily: "Oswald,'Arial Narrow',sans-serif",
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '-0.055em',
  lineHeight: 0.95,
  margin: 0,
  fontSize: 'clamp(2.3rem,4.4vw,4.4rem)',
};

const PRINCIPLES = [
  ['01', 'Intentional impact', 'Every decision is tied to a purpose. Strategy gives creative work direction, and direction gives it commercial force.'],
  ['02', 'Authenticity always', 'We create brand voices that sound true to the organisation and meaningful to the audience.'],
  ['03', 'Fearless creativity', 'We push boundaries to create work that surprises, stirs, and sticks — without losing strategic focus.'],
  ['04', 'Momentum over comfort', 'We keep brands moving forward through proactive thinking, fast learning, and decisive execution.'],
  ['05', 'Together, louder', 'Strong work is collaborative. We operate as an extension of the client team, aligned around one shared ambition.'],
];

// The soft hyphen in "Resource­fulness" is in the source copy — it lets the
// word break inside the narrow card.
const CAPABILITIES = [
  {
    title: 'Proactivity',
    body: 'We anticipate the next move and bring ideas before they are requested.',
    dark: true,
    icon: (
      <>
        <path d="M10 30L30 10" />
        <path d="M19 10h11v11" />
      </>
    ),
  },
  {
    title: 'Flexibility',
    body: 'We adapt quickly while protecting the strategic core.',
    dark: false,
    icon: <path d="M5 25c5 0 5-10 10-10s5 10 10 10 5-10 10-10" />,
  },
  {
    title: 'Reliability',
    body: 'Clear ownership, disciplined delivery, and no disappearing acts.',
    dark: true,
    icon: (
      <>
        <path d="M20 5l12 5v11c0 8-6 12-12 14-6-2-12-6-12-14V10z" />
        <path d="M14 20l4 4 8-8" />
      </>
    ),
  },
  {
    title: 'Resource­fulness',
    body: 'We find the route from ambitious concept to workable reality.',
    dark: false,
    icon: (
      <>
        <circle cx="20" cy="17" r="8" />
        <path d="M16 28h8M17 32h6" />
      </>
    ),
  },
  {
    title: 'Agility',
    body: 'Fast where speed matters; deliberate where quality demands it.',
    dark: true,
    icon: (
      <>
        <path d="M9 8l10 12L9 32" />
        <path d="M22 8l10 12-10 12" />
      </>
    ),
  },
];

const CARD_HOVER =
  'background:#ef2329;color:#fff;--ic:#fff;transform:translateY(-4px) scale(1.01);box-shadow:0 20px 48px rgba(0,0,0,0.45)';

export default function AboutBody() {
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
            Who we are
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
            Built to build.
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
              Bold by design.
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
            We are an agency for brands that want distinction, momentum, and work that refuses to disappear into the
            feed.
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
          02
        </div>
      </section>

      <section style={{ padding: '8rem 0' }}>
        <div
          className="r-collapse"
          style={{ ...CONTAINER, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '4rem', alignItems: 'center' }}
        >
          <div
            ref={addReveal}
            data-media=""
            style={{ ...REVEAL, height: '600px', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}
          >
            <img
              src="/assets/images/about-founder-ahmed-rezk.jpg"
              alt="Ahmed Rezk, founder of STACHE"
              data-zoom=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(120deg,rgba(239,35,41,0.18),transparent 55%)',
              }}
            />
          </div>
          <div
            ref={addReveal}
            style={{
              opacity: 0,
              transform: 'translateY(28px)',
              transition: 'opacity .8s ease .1s,transform .8s cubic-bezier(.2,.8,.2,1) .1s',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                fontWeight: 800,
                fontSize: '0.76rem',
                color: '#ef2329',
              }}
            >
              <span data-rule="" ref={addReveal} style={RULE} />
              Meet the Founder
            </div>
            <h2 style={{ ...H2, lineHeight: 0.96, fontSize: 'clamp(2.1rem,3.6vw,3.4rem)' }}>Ahmed Rezk</h2>
            <p style={{ fontSize: 'clamp(1rem,1.25vw,1.12rem)', color: '#d2d2d2', maxWidth: '620px', margin: 0 }}>
              Ahmed Rezk is a creative disrupter with 16 years in Dubai and experience spanning almost every industry.
              He tackles business challenges with solutions no one else sees coming — pairing sharp storytelling
              instincts with a real understanding of what different audiences need.
            </p>
            <p style={{ color: '#a7a7a7', maxWidth: '620px', margin: 0 }}>
              His mission is simple: helping businesses tell their stories, memorably.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '8rem 0' }}>
        <div style={CONTAINER}>
          <div ref={addReveal} style={{ ...EYEBROW, marginBottom: '1rem' }}>
            <span data-rule="" ref={addReveal} style={RULE} />
            What we stand for
          </div>
          <h2 ref={addReveal} style={{ ...REVEAL, ...H2, margin: '0 0 3rem' }}>
            Principles with
            <br />
            <span style={{ color: '#ef2329' }}>a pulse.</span>
          </h2>
          <div>
            {PRINCIPLES.map(([n, title, body], i) => (
              <div
                key={n}
                ref={addReveal}
                className="r-labelled"
                style={{
                  ...REVEAL,
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr 1fr',
                  gap: '2rem',
                  padding: '2rem 0',
                  borderTop: '1px solid rgba(255,255,255,0.14)',
                  ...(i === PRINCIPLES.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.14)' } : null),
                  alignItems: 'start',
                }}
              >
                <div
                  style={{
                    fontFamily: "Oswald,'Arial Narrow',sans-serif",
                    fontSize: '1.5rem',
                    lineHeight: 1.1,
                    letterSpacing: '0.03em',
                    color: '#ef2329',
                  }}
                >
                  {n}
                </div>
                <h3
                  style={{
                    fontFamily: "Oswald,'Arial Narrow',sans-serif",
                    fontSize: '1.6rem',
                    textTransform: 'uppercase',
                    lineHeight: 1.1,
                    letterSpacing: '0.005em',
                    margin: 0,
                  }}
                >
                  {title}
                </h3>
                <p style={{ margin: 0, color: '#a7a7a7' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '8rem 0' }}>
        <div style={CONTAINER}>
          <div
            className="r-collapse"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              alignItems: 'end',
              marginBottom: '3rem',
            }}
          >
            <div>
              <div ref={addReveal} style={{ ...EYEBROW, marginBottom: '1rem' }}>
                <span data-rule="" ref={addReveal} style={RULE} />
                Why work with us
              </div>
              <h2 ref={addReveal} style={{ ...REVEAL, ...H2 }}>
                What it takes.
                <br />
                <span style={{ color: '#ef2329' }}>What it requires.</span>
              </h2>
            </div>
            <p
              ref={addReveal}
              style={{
                ...REVEAL,
                fontSize: 'clamp(1.02rem,1.35vw,1.22rem)',
                color: '#d2d2d2',
                maxWidth: '760px',
                margin: 0,
              }}
            >
              Proactivity, flexibility, reliability, resourcefulness, and agility are not extras. They are how ambitious
              work gets delivered.
            </p>
          </div>
          <div
            ref={addReveal}
            className="r-5up"
            style={{
              ...REVEAL,
              display: 'grid',
              gridTemplateColumns: 'repeat(5,minmax(0,1fr))',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '22px',
              overflow: 'hidden',
            }}
          >
            {CAPABILITIES.map((c, i) => (
              <article
                key={c.title}
                className={sx({ hover: CARD_HOVER })}
                style={{
                  minHeight: '300px',
                  padding: '2rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                  alignItems: 'stretch',
                  '--ic': '#ef2329',
                  transition: '0.25s ease',
                  ...(c.dark ? { background: '#111' } : { background: '#f2eee5', color: '#050505' }),
                  ...(i === CAPABILITIES.length - 1
                    ? null
                    : { borderRight: '1px solid rgba(255,255,255,0.14)' }),
                }}
              >
                <div style={{ width: '38px', height: '38px', display: 'grid', placeItems: 'center' }}>
                  <svg
                    viewBox="0 0 40 40"
                    width="34"
                    height="34"
                    fill="none"
                    stroke="var(--ic)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {c.icon}
                  </svg>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "Oswald,'Arial Narrow',sans-serif",
                      fontSize: '1.35rem',
                      textTransform: 'uppercase',
                      lineHeight: 1.1,
                      letterSpacing: '0.01em',
                      margin: '0 0 0.9rem',
                    }}
                  >
                    {c.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', margin: 0, opacity: 0.72 }}>{c.body}</p>
                </div>
              </article>
            ))}
          </div>
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
            <h2 style={{ ...H2, lineHeight: 0.96, fontSize: 'clamp(2.1rem,3.6vw,3.6rem)', color: '#fff' }}>
              Built for brands that refuse to blend in.
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
                See how our strategy, creative, production, and campaign capabilities come together.
              </p>
              <a
                href="/services"
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
                Explore services <span data-arrow="">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
