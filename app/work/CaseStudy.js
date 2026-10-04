'use client';

import { useEffect, useRef } from 'react';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import { useChrome } from '../_chrome/chrome-context';
import SiteLink from '../_chrome/SiteLink';
import './case-study.css';

// The exports pulled these from Google Fonts at runtime; next/font fetches them
// at build time and self-hosts them, like the rest of the site's type.
const barlow = Barlow({ subsets: ['latin'], weight: ['300', '400', '600', '700'], variable: '--font-barlow' });
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '700', '800', '900'],
  variable: '--font-barlow-condensed',
});

const pad = (n) => String(n).padStart(2, '0');

// The exports wrap a drifting picture in a .par box carrying its factor;
// pictures without one render bare.
function Parallax({ factor, children }) {
  if (!factor) return children;
  return (
    <div className="par" data-par={factor}>
      {children}
    </div>
  );
}

/**
 * One case study (/work/<slug>, data in case-studies.js). The layout and motion are the
 * standalone exports', with the site's own header, footer and scroll bar
 * around them instead of the copies each export carried.
 *
 * The hero is handed to the shell's reveal system, so its entrance plays as the
 * preloader lifts rather than behind it. Everything below keeps the export's
 * own observer — its threshold and stagger classes — and only starts once the
 * hero has been revealed, for the same reason.
 */
export default function CaseStudy({ study }) {
  const { addReveal } = useChrome();
  const rootRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const hero = heroRef.current;
    const targets = root.querySelectorAll('.rv,.wipe,.band,.loud,.cards');
    const steps = root.querySelector('.steps');
    const items = steps.querySelectorAll('li');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // [data-par] pictures drift against the scroll, each by its own factor,
    // over-scaled so the drift never shows an edge.
    let frame = 0;
    const pars = reduce ? [] : Array.from(root.querySelectorAll('[data-par]'));
    const drift = () => {
      frame = 0;
      const vh = window.innerHeight;
      pars.forEach((p) => {
        const r = p.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const c = (r.top + r.height / 2 - vh / 2) * -parseFloat(p.dataset.par);
        p.style.transform = `translateY(${c.toFixed(1)}px) scale(1.14)`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(drift);
    };
    if (pars.length) {
      pars.forEach((p) => (p.style.transform = 'scale(1.14)'));
      window.addEventListener('scroll', onScroll, { passive: true });
      drift();
    }
    const stopDrift = () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };

    if (!('IntersectionObserver' in window) || reduce) {
      targets.forEach((t) => t.classList.add('in'));
      items.forEach((l) => l.classList.add('on'));
      steps.classList.add('run');
      return stopDrift;
    }

    const timers = [];
    let io;
    let so;
    const start = () => {
      io = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add('in');
            io.unobserve(e.target);
          });
        },
        { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
      );
      targets.forEach((t) => io.observe(t));

      so = new IntersectionObserver(
        (es) => {
          if (!es.some((e) => e.isIntersecting)) return;
          steps.classList.add('run');
          items.forEach((l, i) => timers.push(setTimeout(() => l.classList.add('on'), 250 + i * 300)));
          so.disconnect();
        },
        { threshold: 0.3 },
      );
      so.observe(steps);
    };

    let mo;
    if (hero.hasAttribute('data-revealed')) start();
    else {
      mo = new MutationObserver(() => {
        if (!hero.hasAttribute('data-revealed')) return;
        mo.disconnect();
        start();
      });
      mo.observe(hero, { attributes: true, attributeFilter: ['data-revealed'] });
    }

    return () => {
      stopDrift();
      if (mo) mo.disconnect();
      if (io) io.disconnect();
      if (so) so.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [study.slug]);

  const { facts, ticker, strip, spread, flow, story, crew, pillars, band } = study;
  const bandWords = band.line.split(' ');

  return (
    <div
      ref={rootRef}
      className={`cs cs--${study.slug} ${barlow.variable} ${barlowCondensed.variable}`}
    >
      <section
        className="hero"
        ref={(el) => {
          heroRef.current = el;
          addReveal(el);
        }}
      >
        <div className="wrap grid">
          <div>
            <p className="sector">{study.sector}</p>
            <h1>
              <span className="sr">{study.heading}</span>
              {study.lines.map((line, li) => (
                <span key={line} className={`l${li + 1}`} aria-hidden="true">
                  {line.split('').map((c, i) => (
                    <span key={i} className="ch" style={{ transitionDelay: `${li * 0.25 + i * 0.06}s` }}>
                      {c}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <div className="facts">
              <p className="full">
                <b>CLIENT:</b> {facts.client}
              </p>
              <p>
                <b>SCOPE:</b> {facts.scope}
              </p>
              <p>
                <b>DELIVERED:</b> {facts.delivered}
              </p>
            </div>
          </div>
          <figure className="poster">
            <Parallax factor={study.poster.parallax}>
              <img src={study.poster.src} alt={study.poster.alt} />
            </Parallax>
          </figure>
        </div>
      </section>

      {ticker && (
        <div className="ticker" aria-label={ticker.label}>
          <div className="track">
            {[false, true].map((dup) => (
              <ul key={String(dup)} aria-hidden={dup || undefined}>
                {ticker.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      )}

      <div className={`strip${strip.variant ? ` ${strip.variant}` : ''}`}>
        {strip.items.map((s, i) => (
          <figure key={s.src} className={`wipe${i ? ` d${i}` : ''}`}>
            <img src={s.src} alt={s.alt} loading="lazy" />
            {s.tagline && <span className="tagline">{s.tagline}</span>}
          </figure>
        ))}
      </div>
      <section className="spread">
        <div className="red">
          <h2 className={`rv${spread.compact ? ' compact' : ''}`}>
            {typeof spread.name === 'string'
              ? spread.name
              : spread.name.map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    <span style={i > 0 ? { whiteSpace: 'nowrap' } : undefined}>{line}</span>
                  </span>
                ))}
          </h2>
          <p className="sub rv d1">{study.sector}</p>
          <p className="client rv d2">
            <b>CLIENT:</b> {spread.client}
          </p>
        </div>
        <div className="cream">
          {spread.body.map((p, i) => (
            <p key={i} className={`rv${i ? ` d${i}` : ''}`}>
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="flow" aria-labelledby="flow-h">
        <div className="wrap">
          <h2 id="flow-h" className="rv">
            {flow.heading}
          </h2>
          <p className="intro rv d1">{flow.intro}</p>
          <ol className="steps">
            {flow.steps.map(([title, body], i) => (
              <li key={title}>
                <span className="n">{pad(i + 1)}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="story" aria-labelledby="story-h">
        <div className="left">
          <div className="tagbox">
            <div className="tag rv" aria-hidden="true">
              <span className="n">{story.tag.n}</span>
              <span className="v" />
              <span className="w">
                {story.tag.w.map((w, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {w}
                  </span>
                ))}
              </span>
            </div>
            {story.formats && (
              <ul className="formats rv">
                {story.formats.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            )}
          </div>
          {story.bigword ? (
            <p
              className={`bigword rv${story.bigword.compact ? ' compact' : ''}${story.bigword.dash ? ' dash' : ''}`}
              aria-hidden="true"
            >
              {story.bigword.words.map((w, i) => (
                <span key={i} className={`slx${i === 1 ? ' r' : ''}`}>
                  {w}
                </span>
              ))}
            </p>
          ) : (
            <div className="figbox">
              <figure className="wipe">
                <img src={story.image.src} alt={story.image.alt} loading="lazy" />
              </figure>
            </div>
          )}
        </div>
        <div className="right">
          <h2 id="story-h" className="rv">
            Client:
            <br />
            {story.client}
          </h2>
          <div className="block rv">
            <h3>The challenge:</h3>
            <p>{story.challenge}</p>
          </div>
          <div className="block rv d1">
            <h3>What we did:</h3>
            <ul>
              {story.did.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <div className="block rv d2">
            <h3>The result:</h3>
            <p>{story.result}</p>
          </div>
        </div>
      </section>

      {crew && (
        <section className="crew" aria-labelledby="crew-h">
          <div className="wrap">
            <div className="head">
              <h2 id="crew-h" className="rv">
                {crew.heading[0]}
                <br />
                {crew.heading[1]}
              </h2>
              <p className="rv d1">{crew.intro}</p>
            </div>
            <div className={`photos${crew.layout ? ` ${crew.layout}` : ''}`}>
              {crew.photos.map((ph, i) => (
                <figure key={ph.src} className={`wipe${i ? ` d${i}` : ''}${ph.shape ? ` ${ph.shape}` : ''}`}>
                  <Parallax factor={ph.parallax}>
                    <img src={ph.src} alt={ph.alt} loading="lazy" />
                  </Parallax>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {pillars && (
        <section className="pillars" aria-labelledby="pil-h">
          <div className="wrap">
            <div className="head">
              <h2 id="pil-h" className="rv">
                {pillars.heading[0]}
                <br />
                {pillars.heading[1]}
              </h2>
              <p className="rv d1">{pillars.intro}</p>
            </div>
            <ul className="cards">
              {pillars.cards.map(([title, body], i) => (
                <li key={title}>
                  <span className="n">{pad(i + 1)}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="band" aria-label="Outcome">
        <div className="wrap">
          <p>
            {bandWords.map((w, i) => (
              <span key={i}>
                <span className="w" style={{ transitionDelay: `${i * 0.08}s` }}>
                  {w}
                </span>{' '}
              </span>
            ))}
          </p>
          <small>{band.small}</small>
        </div>
      </section>

      <section className="closer" aria-labelledby="cta">
        <div className="wrap">
          <p className="loud" aria-hidden="true">
            Loud<span className="lb">Let’s build</span>
          </p>
          <h2 id="cta" className="ask">
            Ready to make your brand impossible to ignore?
          </h2>
          <SiteLink className="talk" href="/contact">
            Let’s talk.
          </SiteLink>
          <div className="contacts">
            <div>
              <h3>EMAIL:</h3>
              <a href="mailto:adam@stachedxb.com">adam@stachedxb.com</a>
            </div>
            <div>
              <h3>PHONE:</h3>
              <a href="tel:+971559549447">+971 55 954 9447</a>
            </div>
            <div>
              <h3>SOCIAL:</h3>
              <a href="https://www.instagram.com/stachedxb/" target="_blank" rel="noopener">
                instagram.com/stachedxb
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
