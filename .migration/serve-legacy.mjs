// Serves the pre-migration site on http://localhost:4173 with the same clean
// URLs netlify.toml rewrites today, so the baseline is shot against the routes
// the Next app will own.
//
//   node .migration/serve-legacy.mjs [port]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2] || 4173);

const ROUTES = {
  '/': 'STACHE Home (standalone).html',
  '/home': 'STACHE Home (standalone).html',
  '/work': 'STACHE Work (standalone).html',
  '/services': 'STACHE Services (standalone).html',
  '/about': 'STACHE About (standalone).html',
  '/contact': 'STACHE Contact (standalone).html',
};

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2', '.json': 'application/json',
};

http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const rel = ROUTES[url.replace(/\/$/, '') || '/'] ?? url.slice(1);
  const file = path.join(ROOT, rel);

  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    return res.end('not found: ' + url);
  }
  res.writeHead(200, {
    'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'cache-control': 'no-store',
  });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`legacy site on http://localhost:${PORT}`));
