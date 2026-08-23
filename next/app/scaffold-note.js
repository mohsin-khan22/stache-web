// Phase 1 placeholder. Each route renders this until Phase 2 lands the shared
// chrome and Phase 4 ports the page bodies. It exists to prove the fonts, the
// shared stylesheet and the per-page stylesheet all reach the browser.
import PageStyles from './page-styles';

export default function ScaffoldNote({ page, rules }) {
  return (
    <>
      <PageStyles page={page} />
      <main style={{ width: 'min(calc(100% - 3rem),1440px)', margin: 'auto', padding: '6rem 0' }}>
        <div
          data-rule=""
          style={{ width: '38px', height: '2px', background: '#ef2329', transform: 'scaleX(1)' }}
        />
        <h1
          style={{
            fontFamily: "Oswald,'Arial Narrow',sans-serif",
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '-0.055em',
            fontSize: 'clamp(2.9rem,6.5vw,6.5rem)',
            lineHeight: 0.95,
            margin: '1.5rem 0 0',
          }}
        >
          {page} scaffold
        </h1>
        <p style={{ color: '#a7a7a7', marginTop: '1.5rem', maxWidth: '670px' }}>
          Inter body copy. This route carries {rules} page-specific CSS rules on top of the shared
          stylesheet. The page body lands in Phase 4.
        </p>
      </main>
    </>
  );
}
