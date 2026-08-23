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

class Component extends DCLogic {
  state = { pct: 0, y: 0, navOpen: false, scrolled: false, loaded: false, filter: 'all', filterNonce: 0 };
  revealEls = [];
  toggleNav = () => this.setState((st) => ({ navOpen: !st.navOpen }));
  addReveal = (el) => {
    if (el && !this.revealEls.includes(el)) {
      this.revealEls.push(el);
      // nodes mounted after the initial pass (filtered lists) still get observed
      if (this._io) this._io.observe(el);
    }
  };
  showReveal = (el) => {
    if (el.hasAttribute && el.hasAttribute('data-rule')) {
      el.style.transform = 'scaleX(1)';
      return;
    }
    el.style.opacity = '1';
    el.style.transform = 'none';
  };
  _revealAssets = () => {
    const urls = [];
    const logo = document.querySelector('[data-preload-logo]');
    if (logo && (logo.currentSrc || logo.src)) urls.push(logo.currentSrc || logo.src);
    if (this.heroSlides && this.heroSlides.length) urls.push(this.heroSlides[0].src);
    return urls;
  };
  _startReveal = () => {
    const MIN_MS = 1300;
    const MAX_MS = 2800;
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
    transition: 'fill 0.34s ease 0.42s',
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
      transition: done
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
    this._markTimer = setTimeout(() => this.setState({ markFlip: this.measureMarkFlip(), markOut: true }), 380);
    this._startReveal();
    this._io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.showReveal(entry.target);
          this._io.unobserve(entry.target);
        }
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
  componentWillUnmount() {
    window.removeEventListener('scroll', this._onScroll);
    clearTimeout(this._timer);
    clearTimeout(this._minTimer);
    clearTimeout(this._maxTimer);
    clearTimeout(this._revealTimer);
    clearTimeout(this._markTimer);
    clearTimeout(this._fallback);
    if (this._io) this._io.disconnect();
  }
  renderVals() {
    const active = this.state.filter;
    const nonce = this.state.filterNonce;
    return {
      addReveal: this.addReveal,
      mainStyle: {
        opacity: this.state.contentReady ? 1 : 0,
        transform: this.state.contentReady ? 'none' : 'translateY(16px)',
        transition: 'opacity 0.45s ease-out, transform 0.55s cubic-bezier(.2,.8,.2,1)',
      },
      heroCopyStyle: Object.assign({
        width: 'min(calc(100% - 3rem),1440px)', margin: 'auto', position: 'relative', zIndex: 1,
      }, this.heroCopyParallax(500)),
      mobileNavStyle: {
        position: 'fixed', inset: 0, background: '#050505', zIndex: 895,
        flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center',
        padding: '2rem', gap: '1.1rem',
        transform: this.state.navOpen ? 'none' : 'translateY(-105%)',
        transition: '0.5s cubic-bezier(.77,0,.18,1)',
      },
      menuIcon: this.state.navOpen ? '✕' : '☰',
      toggleNav: this.toggleNav,

      progressStyle: {
        position: 'fixed', left: 0, top: 0, height: '3px', background: '#ef2329',
        width: (this.state.pct * 100).toFixed(2) + '%', zIndex: 1000, transition: 'width 0.1s linear',
      },
      filters: FILTERS.map((f) => ({
        label: f.label,
        select: () => this.setState((st) => ({ filter: f.key, filterNonce: st.filterNonce + 1 })),
        style: {
          border: '1px solid ' + (f.key === active ? '#ef2329' : 'rgba(255,255,255,0.14)'),
          background: f.key === active ? '#ef2329' : 'transparent',
          color: '#f2eee5', borderRadius: '999px', padding: '0.75rem 1rem',
          textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem',
          fontWeight: 900, cursor: 'pointer',
        },
      })),
      visibleProjects: PROJECTS.filter((p) => active === 'all' || p.category === active).map((p, i) => ({
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
      })),
      preloaderStyle: {
        position: 'fixed', inset: 0, background: '#ef2329', zIndex: 9998,
        display: 'grid', placeItems: 'center',
        opacity: this.state.loaded ? 0 : 1,
        transition: 'opacity 0.95s cubic-bezier(.4,0,.2,1)',
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
}
