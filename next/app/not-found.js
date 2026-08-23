import SiteShell from './_chrome/SiteShell';

// An addition, not a port: the bundled site had no 404 page and Netlify served
// its own. Next emits 404.html either way, and its default is an unstyled white
// page — which would read as broken against this site. This keeps the same
// chrome and type as every other route. No page-specific CSS, and no nav item
// is marked active because none of them is where you are.
// Next emits the noindex robots tag for this route itself, so only the title
// is set here.
export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <SiteShell page={null}>
      <section style={{ padding: '12rem 0 10rem' }}>
        <div style={{ width: 'min(calc(100% - 3rem),1440px)', margin: 'auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              fontWeight: 800,
              fontSize: '0.76rem',
              color: '#ef2329',
              marginBottom: '1.5rem',
            }}
          >
            <span style={{ width: '38px', height: '2px', background: '#ef2329' }} />
            Error 404
          </div>
          <h1
            style={{
              fontFamily: "Oswald,'Arial Narrow',sans-serif",
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '-0.055em',
              lineHeight: 0.95,
              margin: 0,
              fontSize: 'clamp(2.9rem,6.5vw,6.5rem)',
              maxWidth: '1200px',
            }}
          >
            This page
            <br />
            <span style={{ color: '#ef2329' }}>went quiet.</span>
          </h1>
          <p
            style={{
              fontSize: 'clamp(1.02rem,1.35vw,1.22rem)',
              color: '#d2d2d2',
              maxWidth: '670px',
              margin: '1.5rem 0 2.5rem',
            }}
          >
            The link is broken or the page has moved. Everything else is still where you left it.
          </p>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.7rem',
              border: '1px solid #ef2329',
              background: '#ef2329',
              borderRadius: '999px',
              padding: '1rem 1.3rem',
              textTransform: 'uppercase',
              fontSize: '0.76rem',
              fontWeight: 900,
              letterSpacing: '0.1em',
              color: '#fff',
              transition: '0.25s ease',
            }}
          >
            Back to home <span data-arrow="">↗</span>
          </a>
        </div>
      </section>
    </SiteShell>
  );
}
