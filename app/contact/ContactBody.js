'use client';

import { useState } from 'react';
import { useChrome } from '../_chrome/chrome-context';
import { sx } from '../pseudo';

const CARD = {
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '22px',
  padding: '2rem',
  background: '#111',
};

const ROW = {
  opacity: 0,
  transform: 'translateY(18px)',
  transition: 'opacity .7s ease,transform .7s cubic-bezier(.2,.8,.2,1)',
  padding: '1.3rem 0',
  borderTop: '1px solid rgba(255,255,255,0.14)',
};

const ROW_LABEL = {
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: '#ef2329',
  marginBottom: '0.4rem',
};

const FIELD_ROW = {
  opacity: 0,
  transform: 'translateY(18px)',
  transition: 'opacity .6s ease,transform .6s cubic-bezier(.2,.8,.2,1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const LABEL = {
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontSize: '0.7rem',
  fontWeight: 900,
  color: '#bbb',
};

const FIELD = {
  width: '100%',
  background: '#0a0a0a',
  border: '1px solid rgba(255,255,255,0.14)',
  color: '#f2eee5',
  padding: '1rem 1.1rem',
  borderRadius: '14px',
  transition: 'border-color 0.2s ease,box-shadow 0.25s ease,transform 0.25s ease',
};

// The textarea drops `transform` from its transition list and adds its own size
// rules — a difference in the original, kept.
const AREA = {
  ...FIELD,
  minHeight: '180px',
  resize: 'vertical',
  transition: 'border-color 0.2s ease,box-shadow 0.25s ease',
};

const FOCUS = 'transform:translateY(-1px);border-color:#ef2329;box-shadow:0 0 0 3px rgba(239,35,41,0.16)';

const SERVICES = [
  'Digital marketing management',
  'Social consultancy',
  'Conceptual project execution',
  'Integrated campaign',
  'Not sure yet',
];

// PRE-EXISTING BUG, reproduced deliberately: the three starred fields are not
// actually required on the live site. The template wrote `required=""`, which
// React treats as a falsy boolean prop and drops, so no `required` attribute
// ever reaches the DOM (verified against the running site: `#name.required` is
// false and `form.checkValidity()` is true on an empty form). An empty form
// therefore submits and shows the thank-you, and the "Please complete the
// required fields" branch below is unreachable.
//
// Adding `required` here would change behaviour, so it stays out. Flagged for
// the client — it is a one-word fix whenever they want it.
export default function ContactBody() {
  const { addReveal } = useChrome();
  const [status, setStatus] = useState('');

  // No backend, exactly as before: validate, acknowledge, reset.
  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      setStatus('Please complete the required fields.');
      return;
    }
    setStatus('Thank you — your brief has been sent. We will reply within two working days.');
    form.reset();
  };

  const statusStyle = {
    gridColumn: '1/-1',
    color: '#bbb',
    minHeight: '1.5rem',
    opacity: status ? 1 : 0,
    transform: status ? 'none' : 'translateY(6px)',
    transition: 'opacity .4s ease, transform .4s cubic-bezier(.2,.8,.2,1)',
  };

  const field = (id, label, input) => (
    <div ref={addReveal} style={FIELD_ROW}>
      <label htmlFor={id} style={LABEL}>
        {label}
      </label>
      {input}
    </div>
  );

  return (
    <section style={{ padding: '9rem 0 8rem' }} data-comment-anchor="6dfec2a67d-section">
      <div
        className="r-collapse"
        style={{
          width: 'min(calc(100% - 3rem),1440px)',
          margin: 'auto',
          display: 'grid',
          gridTemplateColumns: '0.8fr 1.2fr',
          gap: '3rem',
          alignItems: 'start',
        }}
      >
        <aside
          ref={addReveal}
          style={{
            opacity: 0,
            transform: 'translateY(28px)',
            transition: 'opacity .8s ease,transform .8s cubic-bezier(.2,.8,.2,1)',
            ...CARD,
          }}
        >
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
            }}
          >
            <span data-rule="" ref={addReveal} style={{ width: '38px', height: '2px', background: '#ef2329' }} />
            Contact
          </div>
          <h3
            style={{
              fontFamily: "Oswald,'Arial Narrow',sans-serif",
              fontSize: '1.8rem',
              textTransform: 'uppercase',
              margin: '0.9rem 0 1rem',
              lineHeight: 1.05,
            }}
          >
            Start the conversation.
          </h3>
          <p style={{ color: '#a7a7a7', margin: '0 0 1rem' }}>
            The source profile did not contain final public contact details, so the email, phone, website, and social
            links remain launch placeholders.
          </p>
          <div ref={addReveal} style={ROW}>
            <small style={ROW_LABEL}>Email</small>
            <a href="mailto:hello@stache.example">hello@stache.example</a>
          </div>
          <div ref={addReveal} style={ROW}>
            <small style={ROW_LABEL}>Phone</small>
            <span>+971 XX XXX XXXX</span>
          </div>
          <div ref={addReveal} style={ROW}>
            <small style={ROW_LABEL}>Location</small>
            <span>United Arab Emirates</span>
          </div>
          <div ref={addReveal} style={{ ...ROW, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <small style={{ textTransform: 'uppercase', letterSpacing: '0.12em', color: '#ef2329' }}>Social</small>
            <a href="#" style={{ transition: 'color 0.2s ease' }}>
              Instagram <span data-arrow="">↗</span>
            </a>
            <a href="#" style={{ transition: 'color 0.2s ease' }}>
              LinkedIn <span data-arrow="">↗</span>
            </a>
          </div>
        </aside>

        <div
          ref={addReveal}
          style={{
            opacity: 0,
            transform: 'translateY(28px)',
            transition: 'opacity .8s ease .1s,transform .8s cubic-bezier(.2,.8,.2,1) .1s',
            ...CARD,
          }}
        >
          <form
            onSubmit={onSubmit}
            className="r-collapse"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
          >
            {field(
              'name',
              'Name *',
              <input
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                style={FIELD}
                className={sx({ focus: FOCUS })}
              />,
            )}
            {field(
              'email',
              'Email *',
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                style={FIELD}
                className={sx({ focus: FOCUS })}
              />,
            )}
            {field(
              'company',
              'Company',
              <input
                id="company"
                name="company"
                autoComplete="organization"
                placeholder="Company / brand"
                style={FIELD}
                className={sx({ focus: FOCUS })}
              />,
            )}
            {field(
              'service',
              'What do you need?',
              <select id="service" name="service" style={FIELD} className={sx({ focus: FOCUS })}>
                {SERVICES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>,
            )}
            {field(
              'timeline',
              'Ideal timeline',
              <input
                id="timeline"
                name="timeline"
                placeholder="Launch date or timeframe"
                style={FIELD}
                className={sx({ focus: FOCUS })}
              />,
            )}
            <div ref={addReveal} style={{ ...FIELD_ROW, gridColumn: '1/-1' }}>
              <label htmlFor="brief" style={LABEL}>
                Project brief *
              </label>
              <textarea
                id="brief"
                name="brief"
                placeholder="What are you trying to achieve? Who is the audience? What needs to change?"
                style={AREA}
                className={sx({ focus: FOCUS })}
              />
            </div>
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
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
              className={sx({
                hover: 'background:#fff;border-color:#fff;color:#ef2329;transform:translateY(-2px);cursor:pointer',
              })}
            >
              Send project brief <span data-arrow="">↗</span>
            </button>
            <div role="status" aria-live="polite" style={statusStyle}>
              {status}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
