'use client';

import { Component } from 'react';
import Preloader from './Preloader';
import Header from './Header';
import MobileNav from './MobileNav';
import Footer from './Footer';
import { ChromeContext } from './chrome-context';

// The preloader's timeline, in one place because the cold load and the
// route-to-route replay share it — a link click has to reach the same first
// frame a hard reload does: full red, moustache already in the middle, no wipe
// and no fade leading into it.
//   SWAP_MS   the beat between painting that frame and committing the new
//             route, so the panel is up before the page underneath changes.
//   MARK_MS   how long the moustache holds in the middle before it flies.
//   MIN_MS    the floor on the whole gate, so a cached page still reads as a
//             load rather than a flicker.
//   MAX_MS    the ceiling, in case an asset never settles.
const SWAP_MS = 60;
const MARK_MS = 380;
const MIN_MS = 1300;
const MAX_MS = 2800;

/**
 * The chrome every page shared in the bundle: preloader, scroll progress,
 * header, mobile nav, footer, and the reveal observer.
 *
 * Ported as a class on purpose. The source was `class Component extends
 * DCLogic` with `state`, `setState`, `componentDidMount` and
 * `componentWillUnmount`, so a class carries the methods across unchanged —
 * every constant, easing and delay below is the original's. Rewriting it as
 * hooks would have meant re-deriving effect boundaries and cleanup order, which
 * is exactly where timing drift creeps in.
 *
 * Two properties make this safe to server-render:
 *   - initial state is deterministic (`loaded: false`, `pct: 0`, `y: 0`), so the
 *     exported HTML matches what the bundle painted on its own first render;
 *   - every DOM measurement happens in componentDidMount or later, never during
 *     render, which a static export would otherwise fail on.
 */
export default class SiteShell extends Component {
  state = {
    pct: 0,
    y: 0,
    navOpen: false,
    scrolled: false,
    loaded: false,
    // Rewind the preloader in this commit with every transition switched off.
    // A document load starts on the red frame; a link click has to arrive at it
    // the same way, rather than fading the panel up or flying the moustache
    // backwards out of the header it just landed in.
    instant: false,
  };
  revealEls = [];

  toggleNav = () => this.setState((st) => ({ navOpen: !st.navOpen }));

  /**
   * A link asked for another route. Put the preloader up on the spot — the same
   * frame a hard reload paints — and push the route a beat later, so the page
   * swaps behind a panel that is already solid.
   *
   * Answers whether the click was taken over. False means the caller should let
   * next/link navigate on its own: no router, or the route is already on
   * screen, in which case replaying a full load for the page the visitor is
   * looking at would be noise.
   */
  beginTransition = (href) => {
    if (typeof this.props.navigate !== 'function') return false;
    if (href === this.props.pathname) return false;

    // A second click before the push retargets it rather than starting over:
    // the preloader is already on screen and its timeline is already running.
    clearTimeout(this._swapTimer);
    clearTimeout(this._navFailsafe);
    this._navPending = true;
    this._swapTimer = setTimeout(() => this.props.navigate(href), SWAP_MS);
    // If the route never arrives, un-stick the panel rather than leaving the
    // visitor on a red screen.
    this._navFailsafe = setTimeout(() => {
      if (this._navPending) this.replayPreloader();
    }, SWAP_MS + 5000);

    // `instant` stays on until the route commits, where replayPreloader takes
    // over — nothing here should animate, it should simply be the first frame.
    this.setState({
      instant: true,
      markOut: false,
      markFlip: null,
      logoFlip: null,
      loaded: false,
      contentReady: false,
      navOpen: false,
    });
    return true;
  };

  /**
   * The route changed and its body is committed. Run the same sequence a cold
   * load runs: hold the moustache, fly it into the wordmark, then lift the
   * panel once the page's own assets have settled.
   */
  replayPreloader = () => {
    this._navPending = false;
    this._revealed = false;
    this._revealOpen = false;
    this._revealQueue = [];
    clearTimeout(this._swapTimer);
    clearTimeout(this._navFailsafe);
    clearTimeout(this._markTimer);
    clearTimeout(this._minTimer);
    clearTimeout(this._maxTimer);
    clearTimeout(this._revealTimer);

    // Rewind with the transitions off either way. After a link click the panel
    // is already red and this changes nothing on screen; after a back/forward
    // press, which arrives with no warning, it is what puts the red frame up
    // rather than fading into it.
    this.setState({
      instant: true,
      markOut: false,
      markFlip: null,
      logoFlip: null,
      loaded: false,
      contentReady: false,
      // The new route starts at the top; the scroll listener only fires once
      // the browser gets there, and until then the header would keep the
      // outgoing page's condensed state.
      pct: 0,
      y: 0,
      scrolled: false,
    });
    // Hand the transitions back on the next frame, in time for the flight at
    // MARK_MS and the panel's fade-out at the end. Nothing moves when it lifts:
    // every value it was holding still is the value the animated styles resolve
    // to at rest.
    requestAnimationFrame(() => {
      if (this.state.instant) this.setState({ instant: false });
    });

    this._markTimer = setTimeout(
      () => this.setState({ markFlip: this.measureMarkFlip(), markOut: true }),
      MARK_MS,
    );
    this._startReveal();
  };

  addReveal = (el) => {
    if (el && !this.revealEls.includes(el)) {
      this.revealEls.push(el);
      // nodes mounted after the initial pass (filtered lists) still get observed
      if (this._io) this._io.observe(el);
    }
  };

  /**
   * Nothing reveals while the preloader still covers the page.
   *
   * The observer fires within a frame of mount, but the panel does not start
   * lifting for another three seconds, so without this gate the whole first
   * screen enters — and finishes — behind the red. Measured on Home before it
   * existed: the hero heading was at full opacity by 1870ms, the panel began
   * clearing at 2996ms. Every one of those animations was paid for and none of
   * them was ever seen.
   *
   * Below-the-fold elements are unaffected: by the time they are scrolled to,
   * the gate is long open and they reveal on arrival as before.
   */
  _revealOpen = false;
  _revealQueue = [];

  openRevealGate = () => {
    if (this._revealOpen) return;
    this._revealOpen = true;
    const queued = this._revealQueue;
    this._revealQueue = [];
    // Flushed in one pass: each element already carries the stagger the mount
    // pass wrote onto it as a transitionDelay, and spacing them again here
    // would apply that delay twice.
    queued.forEach((el) => this.showReveal(el));
  };

  showReveal = (el) => {
    if (!this._revealOpen) {
      if (!this._revealQueue.includes(el)) this._revealQueue.push(el);
      return;
    }
    // motion.css keys every entrance off this — the heading wiping up, the
    // picture settling out of its over-zoom, the badge swinging in. CSS has no
    // way to ask whether the observer has reached an element, so the observer
    // says so.
    if (el.setAttribute) el.setAttribute('data-revealed', '');
    if (el.hasAttribute && el.hasAttribute('data-rule')) {
      el.style.transform = 'scaleX(1)';
      return;
    }
    el.style.opacity = '1';
    el.style.transform = 'none';
    if (el.hasAttribute && el.hasAttribute('data-turn')) this.playTurn(el);
  };

  /**
   * Restart the turn on a [data-turn] panel.
   *
   * Taking the attribute off, reading a layout property, then putting it back
   * is what makes the keyframe run again: without the read in the middle the
   * browser coalesces the two changes, sees no difference, and nothing plays.
   */
  playTurn = (el) => {
    el.removeAttribute('data-turning');
    void el.offsetWidth;
    el.setAttribute('data-turning', '');
  };

  // The preloader waits on the wordmark, plus the first hero slide on pages
  // that have one (Home passes heroSlides in).
  _revealAssets = () => {
    const urls = [];
    const logo = document.querySelector('[data-preload-logo]');
    if (logo && (logo.currentSrc || logo.src)) urls.push(logo.currentSrc || logo.src);
    const heroSlides = this.props.heroSlides;
    if (heroSlides && heroSlides.length) urls.push(heroSlides[0].src);
    return urls;
  };

  _startReveal = () => {
    const urls = this._revealAssets();
    const settled = {};
    let pending = urls.length;
    let minDone = false;
    const go = () => {
      if (this._revealed || !minDone || pending > 0) return;
      this._revealed = true;
      clearTimeout(this._maxTimer);
      // paint the page at full strength while the panel still covers it
      this.setState({ contentReady: true });
      this._revealTimer = setTimeout(() => {
        this.setState({ logoFlip: this.measureLogoFlip(), loaded: true });
        this.openRevealGate();
      }, 260);
    };
    urls.forEach((u, i) => {
      const im = new Image();
      const settle = () => {
        if (settled[i]) return;
        settled[i] = 1;
        pending--;
        go();
      };
      im.onload = settle;
      im.onerror = settle;
      im.src = u;
      if (im.complete) settle();
    });
    this._minTimer = setTimeout(() => { minDone = true; go(); }, MIN_MS);
    this._maxTimer = setTimeout(() => { minDone = true; pending = 0; go(); }, MAX_MS);
  };

  // The wordmark SVG is viewBox "370 845 1265 310" and carries this same
  // moustache path at #0a0e1a, so its on-screen slot can be derived exactly.
  measureMarkFlip = () => {
    try {
      const path = document.querySelector('[data-mark-path]');
      const img = document.querySelector('[data-preload-logo]');
      if (!path || !img || !path.ownerSVGElement) return null;
      const here = path.getBoundingClientRect();
      const box = img.getBoundingClientRect();
      const svg = path.ownerSVGElement.getBoundingClientRect();
      const bb = path.getBBox();
      if (!here.width || !box.width || !bb.width) return null;
      const VB_X = 370, VB_Y = 845, VB_W = 1265;
      const k = box.width / VB_W;
      const tw = bb.width * k;
      const th = bb.height * k;
      const tl = box.left + (bb.x - VB_X) * k;
      const tt = box.top + (bb.y - VB_Y) * k;
      return {
        s: tw / here.width,
        dx: (tl + tw / 2) - (here.left + here.width / 2),
        dy: (tt + th / 2) - (here.top + here.height / 2),
        ox: Math.round(here.left + here.width / 2 - svg.left),
        oy: Math.round(here.top + here.height / 2 - svg.top),
      };
    } catch (err) {
      return null;
    }
  };

  markStyle = () => {
    const f = this.state.markFlip;
    const out = this.state.markOut;
    const base = {
      position: 'fixed', inset: 0, width: '100%', height: '100%',
      zIndex: 10000, pointerEvents: 'none', willChange: 'transform, opacity',
    };
    if (this.state.instant) {
      // Back in the middle at full strength with nothing to watch: without this
      // the moustache would fly backwards out of the header slot it just landed
      // in, over 0.78s, every time a link is clicked.
      base.transform = 'none';
      base.opacity = 1;
      base.transition = 'none';
      return base;
    }
    if (!out) {
      base.transform = 'none';
      base.opacity = 1;
      base.transition = 'transform 0.78s cubic-bezier(.62,0,.2,1), opacity 0.26s ease 0.68s';
      return base;
    }
    if (!f) {
      // fallback: dissolve in place rather than fly to an unknown slot
      base.transform = 'scale(0.94)';
      base.opacity = 0;
      base.transition = 'transform 0.78s cubic-bezier(.4,0,.2,1), opacity 0.5s ease';
      return base;
    }
    base.transformOrigin = f.ox + 'px ' + f.oy + 'px';
    base.transform = 'translate(' + f.dx.toFixed(1) + 'px,' + f.dy.toFixed(1) + 'px) scale(' + f.s.toFixed(4) + ')';
    base.opacity = 0;
    base.transition = 'transform 0.78s cubic-bezier(.62,0,.2,1), opacity 0.26s ease 0.68s';
    return base;
  };

  markPathStyle = () => ({
    fill: this.state.markOut ? '#0a0e1a' : '#f2eee5',
    // Cream again at once on a rewind: the delayed fill transition would
    // otherwise open the next page on a moustache still on its way back from
    // the dark it turns as it flies.
    transition: this.state.instant ? 'none' : 'fill 0.34s ease 0.42s',
  });

  measureLogoFlip = () => {
    try {
      const from = document.querySelector('[data-preload-logo]');
      const to = document.querySelector('[data-header-logo]');
      if (!from || !to) return null;
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      if (!a.width || !b.width) return null;
      return {
        s: b.width / a.width,
        dx: (b.left + b.width / 2) - (a.left + a.width / 2),
        dy: (b.top + b.height / 2) - (a.top + a.height / 2),
      };
    } catch (err) {
      return null;
    }
  };

  logoStyle = () => {
    const f = this.state.logoFlip;
    const done = this.state.loaded;
    const shown = this.state.markOut;
    let t = 'translate(-50%,-50%) scale(1)';
    if (done) {
      t = f
        ? 'translate(-50%,-50%) translate(' + f.dx.toFixed(1) + 'px,' + f.dy.toFixed(1) + 'px) scale(' + f.s.toFixed(4) + ')'
        : 'translate(-50%,-50%) scale(0.82)';
    }
    return {
      position: 'fixed', left: '50%', top: '50%', width: 'min(60vw,720px)',
      zIndex: 9999, pointerEvents: 'none',
      transform: t,
      opacity: done ? 0 : (shown ? 1 : 0),
      // On a rewind the wordmark is back in the middle and invisible, waiting
      // for the moustache to hand over to it — with no trace of the flip into
      // the header that ended the last page.
      transition: this.state.instant
        ? 'none'
        : done
          ? 'transform 1.05s cubic-bezier(.62,0,.2,1), opacity 0.42s ease 0.68s'
          : 'opacity 0.5s cubic-bezier(.4,0,.2,1) 0.22s',
      willChange: 'transform, opacity',
    };
  };

  // Hero parallax: the copy lags the scroll by a fraction of the distance
  // travelled and fades out as the hero clears the viewport. `range` is the
  // scroll distance over which that happens — roughly the hero height.
  heroCopyParallax = (range) => {
    if (this._reduceMotion) return {};
    const t = Math.min(Math.max(this.state.y / range, 0), 1);
    return {
      transform: 'translate3d(0,' + (t * range * 0.14).toFixed(1) + 'px,0)',
      opacity: Number((1 - t * 0.8).toFixed(3)),
      willChange: 'transform, opacity',
    };
  };

  componentDidMount() {
    this._onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      this.setState({ scrolled: window.scrollY > 40, pct: max > 0 ? window.scrollY / max : 0, y: window.scrollY });
    };
    window.addEventListener('scroll', this._onScroll);
    this._reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    this._markTimer = setTimeout(() => this.setState({ markFlip: this.measureMarkFlip(), markOut: true }), MARK_MS);
    this._startReveal();
    this._io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        this.showReveal(entry.target);
        // A turning panel stays observed: its whole point is to come over the
        // top every time the section is scrolled back to, so it must be able
        // to intersect again. Everything else has had its one entrance.
        if (entry.target.hasAttribute && entry.target.hasAttribute('data-turn')) return;
        this._io.unobserve(entry.target);
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -10% 0px' });
    requestAnimationFrame(() => {
      this.revealEls.forEach((el) => {
        const sibs = Array.from(el.parentElement ? el.parentElement.children : []).filter((c) => this.revealEls.includes(c));
        const i = sibs.indexOf(el);
        if (i > 0 && !el.style.transitionDelay) el.style.transitionDelay = Math.min(i * 0.07, 0.35) + 's';
        this._io.observe(el);
      });
    });
    this._fallback = setTimeout(() => {
      if (!('IntersectionObserver' in window)) {
        this.revealEls.forEach((el) => this.showReveal(el));
        return;
      }
      // only settle what the viewport has already reached, so sections
      // further down still animate when they are scrolled into view
      this.revealEls.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) this.showReveal(el);
      });
    }, 1800);
  }

  componentDidUpdate(prev) {
    if (prev.pathname === this.props.pathname) return;

    // The new body is committed and measurable, so the preloader can be replayed
    // against it — the header logo it flies into and the hero image it waits on
    // are both the new page's.
    this.replayPreloader();

    // Client-side navigation replaced the page body while the shell stayed
    // mounted. Drop the elements that left with the old page, then give the new
    // ones their stagger — addReveal has already registered and observed them
    // during commit, but only the mount path applied delays.
    //
    // Synchronous rather than in a requestAnimationFrame, unlike the mount
    // pass: every child has committed by the time this runs, and an
    // IntersectionObserver callback cannot land before it, so the delay is in
    // place before anything can reveal.
    this.revealEls = this.revealEls.filter((el) => el.isConnected);
    this.revealEls.forEach((el) => {
      const sibs = Array.from(el.parentElement ? el.parentElement.children : []).filter((c) => this.revealEls.includes(c));
      const i = sibs.indexOf(el);
      if (i > 0 && !el.style.transitionDelay) el.style.transitionDelay = Math.min(i * 0.07, 0.35) + 's';
      if (this._io) this._io.observe(el);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._onScroll);
    clearTimeout(this._timer);
    clearTimeout(this._minTimer);
    clearTimeout(this._maxTimer);
    clearTimeout(this._revealTimer);
    clearTimeout(this._markTimer);
    clearTimeout(this._swapTimer);
    clearTimeout(this._navFailsafe);
    clearTimeout(this._fallback);
    if (this._io) this._io.disconnect();
  }

  renderVals() {
    // Home's renderVals declared mobileNavStyle twice and the second literal
    // won, so that page alone carries display:flex and a 1.3rem gap. Kept
    // rather than tidied away: with display set inline it beats the stylesheet's
    // [data-mobile-nav]{display:none}, so above 820px Home keeps the panel in
    // the layout (translated off-screen) where the other pages remove it.
    const homeNav = this.props.page === 'home';
    return {
      mainStyle: {
        opacity: this.state.contentReady ? 1 : 0,
        transform: this.state.contentReady ? 'none' : 'translateY(16px)',
        transition: 'opacity 0.45s ease-out, transform 0.55s cubic-bezier(.2,.8,.2,1)',
      },
      mobileNavStyle: {
        position: 'fixed', inset: 0, background: '#050505', zIndex: 895,
        ...(homeNav ? { display: 'flex' } : null),
        flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center',
        padding: '2rem', gap: homeNav ? '1.3rem' : '1.1rem',
        transform: this.state.navOpen ? 'none' : 'translateY(-105%)',
        transition: '0.5s cubic-bezier(.77,0,.18,1)',
      },
      menuIcon: this.state.navOpen ? '✕' : '☰',
      progressStyle: {
        position: 'fixed', left: 0, top: 0, height: '3px', background: '#ef2329',
        width: (this.state.pct * 100).toFixed(2) + '%', zIndex: 1000, transition: 'width 0.1s linear',
      },
      preloaderStyle: {
        position: 'fixed', inset: 0, background: '#ef2329', zIndex: 9998,
        display: 'grid', placeItems: 'center',
        opacity: this.state.loaded ? 0 : 1,
        // The red arrives, it never fades in — a reload has no frame to fade
        // from and neither should a click. Only the lift at the end animates.
        transition: this.state.instant ? 'none' : 'opacity 0.95s cubic-bezier(.4,0,.2,1)',
        // Up on screen, the panel eats clicks — including a second one on the
        // link that started the transition.
        pointerEvents: this.state.loaded ? 'none' : 'auto',
        willChange: 'opacity',
      },
      preloaderLogoStyle: this.logoStyle(),
      preloaderMarkStyle: this.markStyle(),
      preloaderMarkPathStyle: this.markPathStyle(),
      headerStyle: {
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        padding: this.state.scrolled ? '0.9rem 0' : '1.1rem 0',
        background: this.state.scrolled ? 'rgba(5,5,5,0.82)' : 'rgba(5,5,5,0.4)',
        backdropFilter: 'blur(14px)',
        borderBottom: this.state.scrolled ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(255,255,255,0.05)',
        transition: '0.3s ease',
      },
    };
  }

  render() {
    const v = this.renderVals();
    // Rebuilt every render, as in the original where the whole page re-rendered
    // on each scroll event — the hero parallax reads `y` from here.
    const chrome = {
      addReveal: this.addReveal,
      heroCopyParallax: this.heroCopyParallax,
      scrollY: this.state.y,
      beginTransition: this.beginTransition,
    };
    // The provider wraps the whole shell rather than just <main>, because the
    // header, the mobile nav and the footer all render SiteLinks and every one
    // of them has to be able to start the transition.
    return (
      <div id="dc-root">
        <ChromeContext.Provider value={chrome}>
          <div className="sc-host">
            <Preloader
              panelStyle={v.preloaderStyle}
              logoStyle={v.preloaderLogoStyle}
              markStyle={v.preloaderMarkStyle}
              markPathStyle={v.preloaderMarkPathStyle}
            />
            <div style={v.progressStyle} aria-hidden="true" />
            <Header
              page={this.props.page}
              headerStyle={v.headerStyle}
              menuIcon={v.menuIcon}
              onToggleNav={this.toggleNav}
            />
            <MobileNav style={v.mobileNavStyle} />
            <main style={v.mainStyle}>{this.props.children}</main>
            <Footer />
          </div>
        </ChromeContext.Provider>
      </div>
    );
  }
}
