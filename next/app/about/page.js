import SiteShell from '../_chrome/SiteShell';
import PageStyles from '../page-styles';
import ScaffoldNote from '../scaffold-note';

export const metadata = {
  title: 'About',
  description:
    'Boldness with backbone. We do not follow trends, we set them — the agency, the principles, and the people behind STACHE.',
};

export default function AboutPage() {
  return (
    <>
      <PageStyles page="about" />
      <SiteShell page="about">
        <ScaffoldNote page="about" rules={5} />
      </SiteShell>
    </>
  );
}
