import ScaffoldNote from '../scaffold-note';

export const metadata = {
  title: 'Contact',
  description: 'Start the conversation — tell us what you are trying to achieve and who it is for.',
};

export default function ContactPage() {
  return <ScaffoldNote page="contact" rules={4} />;
}
