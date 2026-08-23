import SiteShell from './_chrome/SiteShell';
import PageStyles from './page-styles';
import ScaffoldNote from './scaffold-note';

export default function HomePage() {
  return (
    <>
      <PageStyles page="home" />
      <SiteShell page="home">
        <ScaffoldNote page="home" rules={10} />
      </SiteShell>
    </>
  );
}
