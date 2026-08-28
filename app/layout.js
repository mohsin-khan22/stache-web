import './globals.css';
import './pseudo.css';
import RouteShell from './_chrome/RouteShell';

export const metadata = {
  title: {
    default: 'STACHE — Creative disruption meets calculated strategy',
    template: '%s — STACHE',
  },
  description:
    'STACHE is a marketing and advertising agency where creative disruption meets calculated strategy — for brands that crave distinction, not just visibility.',
};

export const viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* The chrome lives here, not in the pages, so it survives client-side
            navigation and the preloader runs once per document rather than on
            every link click. */}
        <RouteShell>{children}</RouteShell>
      </body>
    </html>
  );
}
