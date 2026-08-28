import PageStyles from '../page-styles';
import ContactBody from './ContactBody';

export const metadata = {
  title: 'Contact',
  description: 'Start the conversation — tell us what you are trying to achieve and who it is for.',
};

export default function ContactPage() {
  return (
    <>
      <PageStyles page="contact" />
      <ContactBody />
    </>
  );
}
