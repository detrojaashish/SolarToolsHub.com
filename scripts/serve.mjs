// Tiny static server for local preview of dist/ (gzip + clean URLs + 404 page)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', process.env.OUT || 'dist');
const port = Number(process.env.PORT) || 4173;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };

http
  .createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(dist, p);
    if (!file.startsWith(dist)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    else if (!fs.existsSync(file) && fs.existsSync(file + '/index.html')) file = path.join(file, 'index.html');
    let status = 200;
    if (!fs.existsSync(file)) { file = path.join(dist, '404.html'); status = 404; }
    const ext = path.extname(file);
    const body = fs.readFileSync(file);
    const headers = { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': p.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=600' };
    if (/gzip/.test(req.headers['accept-encoding'] || '') && /html|js|css|svg|json|xml|txt/.test(headers['Content-Type'])) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(status, headers).end(zlib.gzipSync(body));
    } else res.writeHead(status, headers).end(body);
  })
  .listen(port, () => console.log(`Preview: http://localhost:${port}`));
