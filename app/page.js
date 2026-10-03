import PageStyles from './page-styles';
import HomeBody from './HomeBody';

export const metadata = {
  title: { absolute: 'STACHE | Marketing & Advertising Agency in Dubai' },
  description:
    "STACHE is a Dubai-based marketing and advertising agency specializing in digital marketing management, social media consultancy, and conceptual project execution. We don't follow trends — we set them.",
};

export default function HomePage() {
  return (
    <>
      <PageStyles page="home" />
      <HomeBody />
    </>
  );
}
