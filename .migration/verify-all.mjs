// The Phase 6 gate: every check, in order, with a pass/fail summary.
//
//   node .migration/verify-all.mjs            # assumes :4173 legacy, :4174 next
//   node .migration/verify-all.mjs --quick    # skips the cross-browser matrices
//
// Both servers must already be running:
//   node serve-legacy.mjs 4173
//   node serve-static.mjs ../next/out 4174
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const QUICK = process.argv.includes('--quick');
const LEGACY = 'http://localhost:4173';
const NEXT = 'http://localhost:4174';

const run = (args, label) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, args, { cwd: HERE, stdio: ['ignore', 'pipe', 'pipe'] });
    let tail = '';
    const keep = (chunk) => {
      tail = (tail + chunk).split('\n').slice(-4).join('\n');
    };
    child.stdout.on('data', (d) => keep(d.toString()));
    child.stderr.on('data', (d) => keep(d.toString()));
    child.on('close', (code) => resolve({ label, code, tail: tail.trim() }));
  });

const CHECKS = [
  // Structure, copy, accessibility attributes and declared motion, element by
  // element — the things a screenshot cannot see.
  { label: 'DOM + motion, every element', args: ['compare-dom.mjs', LEGACY, NEXT] },
  { label: 'chrome geometry + styles', args: ['compare-chrome.mjs', LEGACY, NEXT] },
  { label: 'preloader FLIP measurements', args: ['compare-preloader.mjs', LEGACY, NEXT] },
  { label: 'hero autoplay cadence', args: ['verify-cadence.mjs', LEGACY, NEXT] },
  { label: 'console clean (legacy)', args: ['check-console.mjs', LEGACY] },
  { label: 'console clean (next)', args: ['check-console.mjs', NEXT] },
  { label: 'device profiles', args: ['verify-devices.mjs', LEGACY, NEXT] },
];

const PIXELS = [
  { label: 'pixels · Chrome', browser: 'chrome', a: 'v-chrome-legacy', b: 'v-chrome-next', extra: [] },
  { label: 'pixels · Chrome, reduced motion', browser: 'chrome', a: 'v-chrome-rm-legacy', b: 'v-chrome-rm-next', extra: ['--reduced'] },
  { label: 'pixels · Firefox', browser: 'firefox', a: 'v-ff-legacy', b: 'v-ff-next', extra: [] },
  { label: 'pixels · WebKit', browser: 'webkit', a: 'v-wk-legacy', b: 'v-wk-next', extra: [] },
];

const results = [];

for (const check of CHECKS) {
  if (QUICK && check.label === 'device profiles') continue;
  process.stdout.write(`… ${check.label}\n`);
  results.push(await run(check.args, check.label));
}

for (const p of PIXELS) {
  if (QUICK && p.browser !== 'chrome') continue;
  process.stdout.write(`… ${p.label}\n`);
  const shoot = (base, out) =>
    run(['shoot.mjs', '--browser', p.browser, '--base', base, '--out', out, ...p.extra], p.label);
  const legacy = await shoot(LEGACY, p.a);
  const next = await shoot(NEXT, p.b);
  if (legacy.code || next.code) {
    results.push({ label: p.label, code: 1, tail: 'capture failed' });
    continue;
  }
  results.push(await run(['compare.mjs', p.a, p.b, '--threshold', '0.01'], p.label));
}

console.log('\n────────────────────────────────────────────────────────────');
let failed = 0;
for (const r of results) {
  if (r.code) failed++;
  console.log(`${r.code ? 'FAIL' : 'PASS'}  ${r.label}`);
  const summary = r.tail.split('\n').filter(Boolean).pop();
  if (summary) console.log(`      ${summary}`);
}
console.log('────────────────────────────────────────────────────────────');
console.log(`${results.length - failed}/${results.length} checks passed${QUICK ? ' (quick run: cross-browser and devices skipped)' : ''}`);
process.exit(failed ? 1 : 0);
