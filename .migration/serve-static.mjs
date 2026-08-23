// Serves a directory the way Netlify serves a static publish: /work resolves to
// work.html, /  resolves to index.html. Used to shoot the exported Next build.
//
//   node .migration/serve-static.mjs ../out 4174
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, process.argv[2] || '../out');
const PORT = Number(process.argv[3] || 4174);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};

const firstExisting = (...candidates) =>
  candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile());

http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const base = path.join(ROOT, url === '/' ? 'index.html' : url.replace(/\/$/, ''));
  const file = firstExisting(base, base + '.html', path.join(base, 'index.html'));

  if (!file || !file.startsWith(ROOT)) {
    // Netlify serves the published 404.html for an unmatched path; match that
    // so the error page is exercised the same way here.
    const notFound = path.join(ROOT, '404.html');
    if (fs.existsSync(notFound)) {
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
      return fs.createReadStream(notFound).pipe(res);
    }
    res.writeHead(404, { 'content-type': 'text/plain' });
    return res.end('not found: ' + url);
  }
  res.writeHead(200, {
    'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'cache-control': 'no-store',
  });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`${path.relative(HERE, ROOT)} on http://localhost:${PORT}`));
