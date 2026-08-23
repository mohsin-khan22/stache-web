// Phase 0 — decompile the standalone bundles into editable sources.
//
// Each "STACHE <Page> (standalone).html" is a self-unpacking bundle: a JSON
// manifest of gzip+base64 assets keyed by uuid, plus a JSON-encoded <x-dc>
// template whose asset references are those same uuids. This script pulls both
// apart into .migration/src/ so Phases 2-4 have real files to port from.
//
//   node .migration/extract.mjs
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const OUT = path.join(HERE, 'src');

// Bundle file -> route slug. __tmp_audit.html is a stale export, skipped.
const PAGES = {
  home: 'STACHE Home (standalone).html',
  work: 'STACHE Work (standalone).html',
  services: 'STACHE Services (standalone).html',
  about: 'STACHE About (standalone).html',
  contact: 'STACHE Contact (standalone).html',
};

// Images still embedded in a bundle (Home and Work reference assets/images/*
// directly, so only these four remain). Keyed by uuid prefix -> output name.
const IMAGE_NAMES = {
  '5162c462': 'about-founder-ahmed-rezk.jpg',
  'c94e4381': 'services-digital-marketing.jpg',
  'ef68b1b6': 'services-brand-strategy.jpg',
  'a3923ec4': 'services-nsti-immersive.jpg',
};

const EXT = { 'font/woff2': 'woff2', 'image/svg+xml': 'svg', 'image/jpeg': 'jpg', 'image/png': 'png', 'text/javascript': 'js' };

const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const rd = (f) => fs.readFileSync(f, 'utf8');
const mkdir = (d) => fs.mkdirSync(d, { recursive: true });

function grabIsland(html, type) {
  const m = html.match(new RegExp(`<script type="__bundler/${type}">([\\s\\S]*?)</script>`));
  return m ? m[1] : null;
}

function inflate(entry) {
  let buf = Buffer.from(entry.data, 'base64');
  if (!entry.compressed) return buf;
  for (const fn of [zlib.gunzipSync, zlib.inflateSync, zlib.brotliDecompressSync]) {
    try { return fn(buf); } catch { /* next */ }
  }
  throw new Error('cannot decompress entry');
}

// ── font faces ───────────────────────────────────────────────────────────────
// Fonts are byte-identical across bundles but carry a different uuid in each,
// so they are deduped by content hash and named from the @font-face rule that
// references them (family + weight + the unicode-range's subset).
const SUBSETS = [
  [/U\+0460-052F/, 'cyrillic-ext'],
  [/U\+0400-045F/, 'cyrillic'],
  [/U\+0102-0103/, 'vietnamese'],
  [/U\+0100-02BA/, 'latin-ext'],
  [/U\+0000-00FF/, 'latin'],
];

function fontNames(css) {
  // uuid -> "inter-variable-latin" style name, read off the @font-face blocks.
  // One file often backs several weights (Oswald is variable, so Google serves
  // the same subset file for 500/600/700) — those are named by subset alone.
  const seen = new Map();
  for (const m of css.matchAll(/@font-face\s*\{([\s\S]*?)\}/g)) {
    const block = m[1];
    const family = (block.match(/font-family:\s*'([^']+)'/) || [])[1];
    const weight = (block.match(/font-weight:\s*([^;]+);/) || [])[1]?.trim();
    const uuid = (block.match(/src:\s*url\("([^"]+)"\)/) || [])[1];
    const range = block.match(/unicode-range:([^;]+);/)?.[1] || '';
    const subset = SUBSETS.find(([re]) => re.test(range))?.[1] || 'default';
    if (!uuid) continue;
    const rec = seen.get(uuid) || { family, subset, weights: new Set() };
    rec.weights.add(weight);
    seen.set(uuid, rec);
  }
  const names = {};
  for (const [uuid, { family, subset, weights }] of seen) {
    const single = [...weights][0];
    const variable = weights.size > 1 || /\s/.test(single || '');
    names[uuid] = `${family}-${variable ? 'variable' : single}-${subset}`.toLowerCase();
  }
  return names;
}

// ── main ─────────────────────────────────────────────────────────────────────
// Clear previous output. Files only — a directory can be locked by a shell
// sitting in it on Windows, and removing the files is enough for a clean run.
for (const p of fs.existsSync(OUT) ? fs.readdirSync(OUT, { recursive: true, withFileTypes: true }) : []) {
  if (p.isFile()) fs.rmSync(path.join(p.parentPath || p.path, p.name), { force: true });
}
mkdir(path.join(OUT, 'assets', 'fonts'));
mkdir(path.join(OUT, 'assets', 'images'));

const byHash = new Map();   // content hash -> public path, for cross-page dedupe
const report = {};

for (const [slug, file] of Object.entries(PAGES)) {
  const html = rd(path.join(ROOT, file));
  const manifest = JSON.parse(grabIsland(html, 'manifest'));
  const template = JSON.parse(grabIsland(html, 'template'));
  const pageDir = path.join(OUT, 'pages', slug);
  mkdir(pageDir);

  // helmet holds exactly two <style> blocks: @font-face rules, then the global
  // stylesheet (typography + motion system + responsive rules).
  const helmet = template.slice(template.indexOf('<helmet>'), template.indexOf('</helmet>'));
  const styles = [...helmet.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  if (styles.length !== 2) throw new Error(`${slug}: expected 2 <style> blocks, found ${styles.length}`);
  const [fontCss, globalCss] = styles;

  const names = fontNames(fontCss);
  const uuidToPath = {};
  const runtime = [];

  for (const [uuid, entry] of Object.entries(manifest)) {
    const buf = inflate(entry);
    const hash = sha(buf);
    const ext = EXT[entry.mime] || 'bin';

    if (entry.mime === 'text/javascript') { runtime.push({ uuid, bytes: buf.length }); continue; }
    if (byHash.has(hash)) { uuidToPath[uuid] = byHash.get(hash); continue; }

    let rel;
    if (ext === 'woff2') rel = `/fonts/${names[uuid] || uuid.slice(0, 8)}.woff2`;
    else if (ext === 'svg') rel = '/logo.svg';
    else if (IMAGE_NAMES[uuid.slice(0, 8)]) rel = `/assets/images/${IMAGE_NAMES[uuid.slice(0, 8)]}`;
    else rel = null; // stale embedded copy of an on-disk assets/images file

    if (!rel) { uuidToPath[uuid] = `UNUSED:${uuid}`; continue; }

    // rel is the path the Next app will serve from /public; mirror it under
    // src/assets/ (dropping the leading "assets/" so it is not doubled).
    const dest = path.join(OUT, 'assets', rel.replace(/^\/(assets\/)?/, ''));
    mkdir(path.dirname(dest));
    fs.writeFileSync(dest, buf);
    byHash.set(hash, rel);
    uuidToPath[uuid] = rel;
  }

  // Resolved template: uuids swapped for the paths the Next app will serve, and
  // the on-disk asset references made root-relative.
  let resolved = template;
  for (const [uuid, rel] of Object.entries(uuidToPath)) {
    if (rel.startsWith('UNUSED:')) continue;
    resolved = resolved.split(uuid).join(rel);
  }
  resolved = resolved.split('"assets/images/').join('"/assets/images/');
  resolved = resolved.split("'assets/images/").join("'/assets/images/");

  // Taken from the resolved copy so image paths inside the logic (the Home
  // hero slides) are already root-relative.
  const logic = (resolved.match(/<script type="text\/x-dc" data-dc-script="">([\s\S]*?)<\/script>/) || [, ''])[1].trim();

  fs.writeFileSync(path.join(pageDir, 'template.html'), template);
  fs.writeFileSync(path.join(pageDir, 'template.resolved.html'), resolved);
  fs.writeFileSync(path.join(pageDir, 'logic.js'), logic + '\n');
  fs.writeFileSync(path.join(pageDir, 'fonts.css'), fontCss.trim() + '\n');
  fs.writeFileSync(path.join(pageDir, 'global.css'), globalCss.trim() + '\n');

  report[slug] = {
    templateChars: template.length,
    logicLines: logic.split('\n').length,
    globalCssHash: sha(Buffer.from(globalCss)).slice(0, 12),
    fontCssHash: sha(Buffer.from(fontCss)).slice(0, 12),
    assets: Object.fromEntries(Object.entries(uuidToPath).filter(([, v]) => !v.startsWith('UNUSED:'))),
    staleEmbedded: Object.values(uuidToPath).filter((v) => v.startsWith('UNUSED:')).length,
    runtimeScripts: runtime,
  };
  console.log(`${slug.padEnd(9)} template ${template.length} · logic ${report[slug].logicLines} lines · ` +
    `${Object.keys(report[slug].assets).length} assets · ${report[slug].staleEmbedded} stale`);
}

fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));

// Cross-page invariants worth knowing before Phase 2.
const uniq = (k) => new Set(Object.values(report).map((r) => r[k])).size;
console.log(`\nglobal.css variants across pages: ${uniq('globalCssHash')}`);
console.log(`fonts.css variants across pages:  ${uniq('fontCssHash')}`);
console.log(`shared asset files written:       ${byHash.size}`);
