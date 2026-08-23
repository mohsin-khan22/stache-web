import ScaffoldNote from '../scaffold-note';

export const metadata = {
  title: 'About',
  description:
    'Boldness with backbone. We do not follow trends, we set them — the agency, the principles, and the people behind STACHE.',
};

export default function AboutPage() {
  return <ScaffoldNote page="about" rules={5} />;
}
