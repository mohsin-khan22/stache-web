import SiteShell from '../_chrome/SiteShell';
import PageStyles from '../page-styles';
import ScaffoldNote from '../scaffold-note';

export const metadata = {
  title: 'Contact',
  description: 'Start the conversation — tell us what you are trying to achieve and who it is for.',
};

export default function ContactPage() {
  return (
    <>
      <PageStyles page="contact" />
      <SiteShell page="contact">
        <ScaffoldNote page="contact" rules={4} />
      </SiteShell>
    </>
  );
}
