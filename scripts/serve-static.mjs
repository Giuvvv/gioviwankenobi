/**
 * Minimal static server for a built app, used by capture-app-screenshots.mjs.
 *
 *   node scripts/serve-static.mjs <dir> [port]
 *
 * Sends the cross-origin isolation headers Expo's SQLite worker needs; without
 * them the app boots with an empty database and every screenshot is a blank
 * first-launch state.
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, normalize } from 'node:path';

const root = resolve(process.argv[2] ?? 'dist');
const port = Number(process.argv[3] ?? 8085);

const TYPES = {
  '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.wasm': 'application/wasm', '.woff2': 'font/woff2',
  '.ico': 'image/x-icon', '.ttf': 'font/ttf',
};

if (!existsSync(root)) {
  console.error(`Missing ${root}. Export the app first.`);
  process.exit(1);
}

createServer((req, res) => {
  const path = new URL(req.url ?? '/', 'http://x').pathname.replace(/^\/+/, '');
  const rel = path === '' ? 'index.html' : extname(path) ? path : `${path}.html`;
  const file = resolve(root, normalize(rel));
  if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404).end('Not found');
    return;
  }
  res.writeHead(200, {
    'Content-Type': `${TYPES[extname(file)] ?? 'application/octet-stream'}; charset=utf-8`,
    'Cross-Origin-Embedder-Policy': 'credentialless',
    'Cross-Origin-Opener-Policy': 'same-origin',
  });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Serving ${root} on http://localhost:${port}`));
