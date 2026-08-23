// Shared between the page and the shell: the preloader holds the reveal until
// the first slide has loaded, so SiteShell needs the same list HomeBody renders.
export const HERO_DURATION = 6500;

export const HERO_SLIDES = [
  { src: '/assets/images/Stache2.png', pos: '50% 46%', drift: -1.4, grade: 'saturate(0.96) contrast(1.06) brightness(0.94)', label: 'Golden hour, Dubai — culture-first storytelling' },
  { src: '/assets/images/Stache3.png', pos: '50% 32%', drift: 1.4, grade: 'saturate(0.96) contrast(1.05) brightness(1.02)', label: 'Team UAE — campaigns built for movement' },
  { src: '/assets/images/Stache4.png', pos: '54% 52%', drift: -1.1, grade: 'saturate(1.02) contrast(0.98) brightness(1.78)', label: 'The STACHE signature — built for distinction' },
];
