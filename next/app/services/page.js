import SiteShell from '../_chrome/SiteShell';
import PageStyles from '../page-styles';
import ScaffoldNote from '../scaffold-note';

export const metadata = {
  title: 'Services',
  description:
    'Digital marketing management, social consultancy, and conceptual project execution — from always-on social to fully realised campaign ecosystems.',
};

export default function ServicesPage() {
  return (
    <>
      <PageStyles page="services" />
      <SiteShell page="services">
        <ScaffoldNote page="services" rules={5} />
      </SiteShell>
    </>
  );
}
