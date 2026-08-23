import ScaffoldNote from '../scaffold-note';

export const metadata = {
  title: 'Work',
  description:
    'A closer look at work across government, automotive, lifestyle, food and beverage, education, and sustainability.',
};

export default function WorkPage() {
  return <ScaffoldNote page="work" rules={9} />;
}
