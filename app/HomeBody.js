'use client';

import { useEffect, useRef, useState } from 'react';
import { useChrome } from './_chrome/chrome-context';
import SiteLink from './_chrome/SiteLink';
import { sx } from './pseudo';
import { HERO_DURATION, HERO_SLIDES } from './hero-slides';

const CONTAINER = { width: 'min(calc(100% - 3rem),1440px)', margin: 'auto' };
const OSWALD = "Oswald,'Arial Narrow',sans-serif";

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
  fontFamily: OSWALD,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '-0.055em',
  lineHeight: 0.95,
  margin: 0,
  fontSize: 'clamp(2.3rem,4.4vw,4.4rem)',
};

const SHEEN = {
  background: 'linear-gradient(100deg,#ef2329 0%,#ff6b6f 35%,#ef2329 70%)',
  backgroundSize: '200% 100%',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  animation: 'sheen 7s linear infinite',
};

const CARD_HOVER =
  'background:#ef2329;color:#fff;--ic:#fff;transform:translateY(-4px) scale(1.01);box-shadow:0 20px 48px rgba(0,0,0,0.45)';

const PRINCIPLES = [
  {
    title: 'Intentional impact',
    body: 'Every idea, post, campaign and pixel begins with a business objective. We map the audience, the message and the moment before we make anything, then measure what moved so creative earns its budget.',
    dark: true,
    icon: (
      <>
        <circle cx="20" cy="20" r="14" />
        <circle cx="20" cy="20" r="7" />
        <circle cx="20" cy="20" r="2" fill="var(--ic)" stroke="none" />
      </>
    ),
  },
  {
    title: 'Authenticity always',
    body: 'We build brands that sound like themselves. Rather than chase whatever is trending this week, we sharpen the story you already own and repeat it with the discipline that makes an audience recognise you.',
    dark: false,
    icon: (
      <>
        <circle cx="20" cy="20" r="14" />
        <path d="M13 20.5l5 5 9-10" />
      </>
    ),
  },
  {
    title: 'Fearless creativity',
    body: 'Safe work gets scrolled past. We push concepts further than expected, pressure-test them against the brief and ship the version that makes people stop, feel something and remember who said it.',
    dark: true,
    icon: <path d="M20 6v28M6 20h28M10.5 10.5l19 19M29.5 10.5l-19 19" />,
  },
  {
    title: 'Momentum over comfort',
    body: 'Markets here move weekly, so we do too. We publish, read the data and adjust while the campaign is still live, keeping your brand a step ahead of its category instead of politely in line with it.',
    dark: false,
    icon: (
      <>
        <path d="M5 26h30" />
        <path d="M25 8l10 9-10 9" />
      </>
    ),
  },
  {
    title: 'Together, louder',
    body: 'The strongest work comes from teams that argue well. We embed with your marketing, sales and leadership, keep the thinking in the open and treat every result as something we own together.',
    dark: true,
    icon: (
      <>
        <circle cx="15" cy="20" r="9" />
        <circle cx="25" cy="20" r="9" />
      </>
    ),
  },
];

const SERVICES = [
  {
    n: '01',
    title: 'Digital marketing management',
    tags: ['Content', 'Community', 'Campaigns', 'Strategy'],
    delay: '',
    icon: (
      <svg viewBox="0 0 48 48" width="26" height="26" fill="none" stroke="#fff" strokeWidth="2.5">
        <circle cx="16" cy="24" r="3" fill="#fff" stroke="none" />
        <path d="M20 17a11 11 0 0 1 0 14" strokeLinecap="round" />
        <path d="M24 11a19 19 0 0 1 0 26" strokeLinecap="round" opacity="0.55" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Social consultancy',
    tags: ['Positioning', 'Voice', 'Audience', 'Growth'],
    delay: ' .1s',
    icon: (
      <svg viewBox="0 0 48 48" width="26" height="26" fill="none" stroke="#fff" strokeWidth="2.5">
        <rect x="7" y="11" width="34" height="21" rx="10" />
        <path d="M18 32l-2 7 8-7" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Conceptual project execution',
    tags: ['Campaigns', 'Activations', 'Experiences', 'Production'],
    delay: ' .2s',
    icon: (
      <svg viewBox="0 0 48 48" width="24" height="24" fill="none" stroke="#fff" strokeWidth="2.5">
        <rect x="14" y="14" width="20" height="20" transform="rotate(45 24 24)" />
      </svg>
    ),
  },
];

const PROJECTS = [
  {
    span: 4,
    delay: '',
    src: '/assets/images/01_DHA_brain.jpg',
    alt: 'Dubai Health Authority campaign visual',
    imgStyle: { objectPosition: '50% 44%', filter: 'saturate(1.0) contrast(1.02)' },
    sector: 'Government & public sector',
    title: 'Dubai Health Authority',
  },
  {
    span: 8,
    delay: ' .1s',
    src: '/assets/images/02_DET_dubai_dinner.jpg',
    alt: 'Dubai Economy and Tourism dinner event',
    imgStyle: { objectPosition: '50% 45%', filter: 'saturate(0.9) contrast(1.04) brightness(0.94)' },
    sector: 'Brand transition',
    title: 'DET',
  },
  {
    span: 4,
    delay: '',
    src: '/assets/images/03_MercedesBenz_red.jpg',
    alt: 'Mercedes-Benz campaign visual',
    imgStyle: {
      objectFit: 'contain',
      objectPosition: 'center bottom',
      top: '22px',
      bottom: '78px',
      height: 'auto',
      background: 'radial-gradient(circle at 50% 42%,rgba(239,35,41,0.22),transparent 62%)',
      filter: 'saturate(1.02) contrast(1.02)',
    },
    sector: 'Automotive',
    title: 'Mercedes-Benz',
  },
  {
    span: 8,
    delay: ' .1s',
    src: '/assets/images/04_Talabat_Ronaldo.jpg',
    alt: 'Talabat campaign featuring Cristiano Ronaldo',
    imgStyle: { objectPosition: '50% 40%', filter: 'saturate(0.9) contrast(1.04) brightness(0.94)' },
    sector: 'Lifestyle & F&B',
    title: 'Talabat',
  },
];

const PILL = {
  display: 'inline-flex',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '999px',
  padding: '0.45rem 0.8rem',
  fontSize: '0.72rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#d9d9d9',
};

const GHOST_BUTTON = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.7rem',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '999px',
  padding: '1rem 1.3rem',
  textTransform: 'uppercase',
  fontSize: '0.76rem',
  fontWeight: 900,
  letterSpacing: '0.1em',
  color: '#f2eee5',
  transition: '0.25s ease',
};

const GHOST_HOVER = {
  hover: 'background:#f2eee5;color:#050505;transform:translateY(-2px);box-shadow:0 12px 30px rgba(0,0,0,0.45)',
  active: 'transform:translateY(0) scale(0.98)',
};

const CARD_SHELL = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg,transparent 30%,rgba(0,0,0,0.88))',
};

const CARD_FOOT = {
  position: 'absolute',
  zIndex: 2,
  left: '1.6rem',
  right: '1.6rem',
  bottom: '1.6rem',
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'space-between',
  gap: '1rem',
};

const BADGE = {
  width: '54px',
  height: '54px',
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.45)',
  display: 'grid',
  placeItems: 'center',
  background: 'rgba(0,0,0,0.3)',
  backdropFilter: 'blur(10px)',
  flexShrink: 0,
};

export default function HomeBody() {
  const { addReveal, heroCopyParallax } = useChrome();
  const [slide, setSlide] = useState(0);
  const [videoOn, setVideoOn] = useState(false);
  const timer = useRef(null);
  const heroVideo = useRef(null);
  const reduceMotion = useRef(false);

  // Same as the original: the autoplay never starts under reduced motion, and
  // any manual pick restarts the interval from zero.
  const startHeroTimer = () => {
    clearInterval(timer.current);
    if (reduceMotion.current) return;
    timer.current = setInterval(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, HERO_DURATION);
  };

  useEffect(() => {
    reduceMotion.current = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduceMotion.current && heroVideo.current) heroVideo.current.pause();
    startHeroTimer();
    return () => clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goSlide = (i) => () => {
    setSlide((i + HERO_SLIDES.length) % HERO_SLIDES.length);
    startHeroTimer();
  };

  const heroSlideStyle = (i) => {
    const s = HERO_SLIDES[i];
    const on = slide === i;
    return {
      position: 'absolute', inset: '-2px',
      backgroundImage: 'url("' + s.src + '")',
      backgroundSize: 'cover', backgroundPosition: s.pos, backgroundRepeat: 'no-repeat',
      filter: s.grade,
      opacity: on ? 1 : 0,
      transform: on ? 'scale(1.13) translate3d(' + s.drift + '%,0,0)' : 'scale(1.02) translate3d(0,0,0)',
      transition: 'opacity 1.7s cubic-bezier(.4,0,.2,1), transform ' + ((HERO_DURATION + 2400) / 1000) + 's cubic-bezier(.22,.61,.36,1)',
      willChange: 'opacity, transform',
      pointerEvents: 'none',
    };
  };

  // The showreel sits on top of the slideshow and fades in once it is actually
  // rolling, so a slow connection, a decode failure or a blocked autoplay all
  // just leave the original three-slide hero in place.
  const heroVideoStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: '50% 50%',
    filter: 'saturate(0.98) contrast(1.05) brightness(1.14)',
    opacity: videoOn ? 1 : 0,
    transition: 'opacity 1.4s cubic-bezier(.4,0,.2,1)',
    pointerEvents: 'none',
  };

  const onHeroVideoPlaying = () => {
    if (reduceMotion.current) return;
    clearInterval(timer.current);
    setVideoOn(true);
  };

  const heroTrackStyle = (i) => ({
    width: slide === i ? '68px' : '34px',
    height: '3px', border: 0, padding: 0, borderRadius: '999px',
    background: 'rgba(242,238,229,0.22)', cursor: 'pointer', overflow: 'hidden',
    display: 'block', flex: 'none', transition: 'width .6s cubic-bezier(.2,.8,.2,1)',
  });

  const heroFillStyle = (i) => {
    const on = slide === i;
    return {
      display: 'block', width: '100%', height: '100%', background: '#ef2329',
      transformOrigin: 'left center',
      transform: on ? 'scaleX(1)' : 'scaleX(0)',
      animation: on ? 'heroFill' + (i + 1) + ' ' + (HERO_DURATION / 1000) + 's linear both' : 'none',
    };
  };

  const heroCopyStyle = Object.assign(
    { ...CONTAINER, position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '3rem' },
    heroCopyParallax(720),
  );

  return (
    <>
      <section
        data-hero=""
        style={{
          minHeight: '100svh',
          display: 'grid',
          alignItems: 'end',
          padding: '9rem 0 3.2rem',
          position: 'relative',
          overflow: 'hidden',
          background: '#050505',
        }}
      >
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          <div style={heroSlideStyle(0)} />
          <div style={heroSlideStyle(1)} />
          <div style={heroSlideStyle(2)} />
          <video
            ref={heroVideo}
            style={heroVideoStyle}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/assets/video/hero-showreel-poster.jpg"
            onPlaying={onHeroVideoPlaying}
            tabIndex={-1}
          >
            <source src="/assets/video/hero-showreel.mp4" type="video/mp4" />
          </video>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg,rgba(5,5,5,0.46) 0%,rgba(5,5,5,0.1) 32%,rgba(5,5,5,0.66) 74%,#050505 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg,rgba(5,5,5,0.86) 0%,rgba(5,5,5,0.56) 42%,rgba(5,5,5,0.06) 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(115% 85% at 82% 12%,rgba(239,35,41,0.22),transparent 60%)',
              mixBlendMode: 'screen',
            }}
          />
        </div>

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: '50vw',
            height: '50vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(239,35,41,0.18),transparent 65%)',
            right: '-18vw',
            top: '-18vw',
            filter: 'blur(20px)',
            zIndex: 1,
          }}
        />

        <div
          data-hero-badge=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            zIndex: 3,
            right: 'max(1.5rem,calc((100% - 1440px) / 2))',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <div
            style={{
              width: '118px',
              height: '118px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.4)',
              display: 'grid',
              placeItems: 'center',
              textAlign: 'center',
              textTransform: 'uppercase',
              fontSize: '0.66rem',
              letterSpacing: '0.14em',
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(10px)',
              animation: 'float 4s ease-in-out infinite',
            }}
          >
            Strategy
            <br />×<br />
            Creativity
          </div>
        </div>

        <div style={heroCopyStyle}>
          <div data-hero-copy="" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              ref={addReveal}
              style={{
                ...REVEAL,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: '#ef2329',
                fontSize: '0.85rem',
              }}
            >
              Built to build · Dubai · 2026
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
                fontSize: 'clamp(3.2rem,7.5vw,7.5rem)',
                maxWidth: '1050px',
                textShadow: '0 18px 60px rgba(0,0,0,0.55)',
              }}
            >
              Make brands <span style={SHEEN}>loud.</span>
              <br />
              <span style={{ WebkitTextStroke: '1px rgba(242,238,229,0.75)', color: 'transparent' }}>Make impact</span>{' '}
              last.
            </h1>
            <div
              ref={addReveal}
              style={{
                opacity: 0,
                transform: 'translateY(28px)',
                transition: 'opacity .8s ease .2s,transform .8s cubic-bezier(.2,.8,.2,1) .2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '1.9rem',
                marginTop: '0.6rem',
              }}
            >
              <p
                style={{
                  width: '100%',
                  maxWidth: '560px',
                  color: '#dcd8cf',
                  fontSize: '1.08rem',
                  margin: 0,
                  textShadow: '0 2px 18px rgba(0,0,0,0.65)',
                }}
              >
                STACHE is a marketing and advertising agency where creative disruption meets calculated strategy — for
                brands that crave distinction, not just visibility.
              </p>
              <SiteLink
                href="/work"
                style={{
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
                  transition: '0.25s ease',
                  whiteSpace: 'nowrap',
                }}
                className={sx({ hover: 'background:#fff;border-color:#fff;color:#ef2329;transform:translateY(-2px)' })}
              >
                Explore the work <span data-arrow="">↗</span>
              </SiteLink>
            </div>
          </div>

          {!videoOn && (
            <div
              ref={addReveal}
              data-hero-controls=""
              role="group"
              aria-label="Hero background slideshow"
              style={{
                opacity: 0,
                transform: 'translateY(28px)',
                transition: 'opacity .8s ease .3s,transform .8s cubic-bezier(.2,.8,.2,1) .3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '0.4rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={goSlide(i)}
                    aria-label={`Show slide ${i + 1}`}
                    style={heroTrackStyle(i)}
                  >
                    <span style={heroFillStyle(i)} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: '8rem 0' }}>
        <div
          className="r-collapse"
          style={{ ...CONTAINER, display: 'grid', gridTemplateColumns: '0.75fr 1.25fr', gap: '5rem', alignItems: 'start' }}
        >
          <div
            ref={addReveal}
            className="r-tall"
            style={{
              ...REVEAL,
              padding: '2.5rem',
              borderRadius: '22px',
              background: '#ef2329',
              color: '#fff',
              minHeight: '440px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              containerType: 'inline-size',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span data-rule="" ref={addReveal} style={{ width: '38px', height: '2px', background: '#fff' }} />
              <span
                style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 900 }}
              >
                01 · Who are we
              </span>
            </div>
            <h2
              data-boldness=""
              style={{
                fontFamily: OSWALD,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '-0.045em',
                lineHeight: 0.95,
                margin: '0.9rem 0',
                color: '#fff',
                fontSize: 'clamp(2.8rem,5.8vw,5.4rem)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '0.07em',
              }}
            >
              <span style={{ display: 'block' }}>Boldness</span>
              <span style={{ display: 'block' }}>with</span>
              <span style={{ display: 'block' }}>backbone.</span>
            </h2>
            <span
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 900,
                color: '#fff',
              }}
            >
              We do not follow trends. We set them.
            </span>
          </div>
          <div
            ref={addReveal}
            style={{
              opacity: 0,
              transform: 'translateY(28px)',
              transition: 'opacity .8s ease .1s,transform .8s cubic-bezier(.2,.8,.2,1) .1s',
              paddingTop: '2rem',
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
                marginBottom: '1rem',
              }}
            >
              <span data-rule="" ref={addReveal} style={RULE} />
              The STACHE point of view
            </div>
            <h2 style={H2}>
              Creative disruption.
              <br />
              <span style={{ color: '#ef2329' }}>Calculated strategy.</span>
            </h2>
            <p
              style={{
                fontSize: 'clamp(1.02rem,1.35vw,1.22rem)',
                color: '#d2d2d2',
                maxWidth: '760px',
                margin: '1.5rem 0',
              }}
            >
              We specialize in digital marketing management, social consultancy, and conceptual project execution. Every
              idea, post, campaign, and pixel is backed by intent.
            </p>
            <SiteLink
              href="/about"
              style={{
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.75rem',
                display: 'inline-flex',
                gap: '0.55rem',
                alignItems: 'center',
              }}
            >
              Meet the agency <span style={{ color: '#ef2329' }}>↗</span>
            </SiteLink>
          </div>
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
            {/* Eyebrow styles are inline rather than the EYEBROW constant: that
                constant carries REVEAL's opacity:0 and only the parent here is
                registered with addReveal, so a spread child would never fade in. */}
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

      <section style={{ padding: '4rem 0' }}>
        <div style={CONTAINER}>
          <div ref={addReveal} style={{ ...EYEBROW, marginBottom: '1.5rem' }}>
            <span data-rule="" ref={addReveal} style={RULE} />
            Principles &amp; pillars
          </div>
          <div
            ref={addReveal}
            className="r-5up"
            style={{
              opacity: 0,
              transform: 'translateY(28px)',
              transition: 'opacity .8s ease .1s,transform .8s cubic-bezier(.2,.8,.2,1) .1s',
              display: 'grid',
              gridTemplateColumns: 'repeat(5,minmax(0,1fr))',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '22px',
              overflow: 'hidden',
            }}
          >
            {PRINCIPLES.map((c, i) => (
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
                  ...(i === PRINCIPLES.length - 1 ? null : { borderRight: '1px solid rgba(255,255,255,0.14)' }),
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
                      fontFamily: OSWALD,
                      fontSize: '1.35rem',
                      textTransform: 'uppercase',
                      lineHeight: 1.05,
                      letterSpacing: '0.01em',
                      margin: '0 0 0.9rem',
                      minHeight: '2.1em',
                    }}
                  >
                    {c.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0, opacity: 0.72, minHeight: '9em' }}>
                    {c.body}
                  </p>
                </div>
              </article>
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
                What we do
              </div>
              <h2 ref={addReveal} style={{ ...REVEAL, ...H2 }}>
                Built for brands
                <br />
                that <span style={{ color: '#ef2329' }}>move.</span>
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
              From always-on digital management to immersive activations, we align voice, audience, and business goals —
              then execute without compromise.
            </p>
          </div>
          <div className="r-3up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '1.5rem' }}>
            {SERVICES.map((s, i) => (
              <article
                key={s.n}
                ref={addReveal}
                className={sx({
                  hover: 'border-color:rgba(239,35,41,0.8);transform:translateY(-8px) scale(1.012);box-shadow:0 24px 60px rgba(0,0,0,0.55);--is:1.08',
                })}
                style={{
                  opacity: 0,
                  transform: 'translateY(28px)',
                  transition: `opacity .8s ease${s.delay},transform .8s cubic-bezier(.2,.8,.2,1)${s.delay}`,
                  position: 'relative',
                  minHeight: '430px',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: '22px',
                  padding: '2rem',
                  overflow: 'hidden',
                  background: 'linear-gradient(145deg,#151515,#080808)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                  // the original repeats `transition` here; the later value wins
                  ...{ transition: '0.35s ease' },
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    // present in the source markup, inert on a span
                    ...(i === 0 ? { content: "''" } : null),
                    position: 'absolute',
                    right: '1rem',
                    top: '-1.8rem',
                    fontFamily: OSWALD,
                    fontSize: '10rem',
                    color: 'rgba(255,255,255,0.035)',
                  }}
                >
                  {s.n}
                </span>
                <div
                  style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: '50%',
                    background: '#ef2329',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#fff',
                    position: 'relative',
                    zIndex: 1,
                    transform: 'scale(var(--is,1))',
                    transition: 'transform 0.35s cubic-bezier(.2,.8,.2,1)',
                  }}
                >
                  {s.icon}
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3
                    style={{
                      fontFamily: OSWALD,
                      fontSize: '1.75rem',
                      lineHeight: 1.05,
                      textTransform: 'uppercase',
                      margin: '0 0 1.5rem',
                      maxWidth: '300px',
                      minHeight: '3.15em',
                      color: '#f2eee5',
                    }}
                  >
                    {s.title}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                    {s.tags.map((t) => (
                      <span key={t} style={PILL}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div style={{ marginTop: '2rem' }}>
            <SiteLink href="/services" style={GHOST_BUTTON} className={sx(GHOST_HOVER)}>
              See all capabilities <span data-arrow="">↗</span>
            </SiteLink>
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
                Selected work
              </div>
              <h2 ref={addReveal} style={{ ...REVEAL, ...H2 }}>
                Strategy meets
                <br />
                <span style={{ color: '#ef2329' }}>execution.</span>
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
              Across government, automotive, lifestyle, food and beverage, education, and sustainability.
            </p>
          </div>
          <div className="r-12col" style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: '1.4rem' }}>
            {PROJECTS.map((p) => (
              <SiteLink
                key={p.title}
                href="/work"
                ref={addReveal}
                className={`r-tall ${sx({ hover: 'transform:translateY(-6px) scale(1.008);border-color:rgba(239,35,41,0.6);box-shadow:0 26px 64px rgba(0,0,0,0.6)' })}`}
                style={{
                  opacity: 0,
                  transform: 'translateY(28px)',
                  transition: `opacity .8s ease${p.delay},transform .8s cubic-bezier(.2,.8,.2,1)${p.delay}`,
                  gridColumn: `span ${p.span}`,
                  position: 'relative',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  minHeight: '480px',
                  background: '#111',
                  border: '1px solid rgba(255,255,255,0.14)',
                  // the original repeats `transition` here; the later value wins
                  ...{ transition: '0.35s ease' },
                }}
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  data-zoom=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    ...p.imgStyle,
                  }}
                />
                <div style={CARD_SHELL} />
                <div style={CARD_FOOT}>
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
                        fontFamily: OSWALD,
                        fontSize: 'clamp(1.5rem,2.2vw,2.3rem)',
                        lineHeight: 1.1,
                        textTransform: 'uppercase',
                        margin: '0.5rem 0',
                        color: '#f2eee5',
                      }}
                    >
                      {p.title}
                    </h3>
                  </div>
                  <span data-arrow-badge="" style={BADGE}>
                    ↗
                  </span>
                </div>
              </SiteLink>
            ))}
          </div>
          <div style={{ marginTop: '2rem' }}>
            <SiteLink href="/work" style={GHOST_BUTTON} className={sx(GHOST_HOVER)}>
              View all projects <span data-arrow="">↗</span>
            </SiteLink>
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
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                fontWeight: 900,
                fontSize: '0.76rem',
                color: '#fff',
                marginBottom: '1.5rem',
              }}
            >
              <span data-rule="" ref={addReveal} style={{ width: '38px', height: '2px', background: '#fff' }} />
              Let&apos;s build loud
            </div>
            <h2
              style={{
                fontFamily: OSWALD,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '-0.055em',
                lineHeight: 0.96,
                margin: 0,
                fontSize: 'clamp(2.1rem,3.6vw,3.6rem)',
                maxWidth: '1000px',
                color: '#fff',
              }}
            >
              Ready to make your brand impossible to ignore?
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
                Bring us the ambition. We will bring the strategy, creative force, and executional discipline.
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
