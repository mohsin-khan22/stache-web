import SiteShell from '../_chrome/SiteShell';
import PageStyles from '../page-styles';
import WorkBody from './WorkBody';

export const metadata = {
  title: 'Work',
  description:
    'A closer look at work across government, automotive, lifestyle, food and beverage, education, and sustainability.',
};

export default function WorkPage() {
  return (
    <>
      <PageStyles page="work" />
      <SiteShell page="work">
        <WorkBody />
      </SiteShell>
    </>
  );
}
