import SiteShell from './_chrome/SiteShell';
import PageStyles from './page-styles';
import HomeBody from './HomeBody';
import { HERO_SLIDES } from './hero-slides';

export default function HomePage() {
  return (
    <>
      <PageStyles page="home" />
      {/* the preloader holds its reveal until the first hero slide has loaded */}
      <SiteShell page="home" heroSlides={HERO_SLIDES}>
        <HomeBody />
      </SiteShell>
    </>
  );
}
