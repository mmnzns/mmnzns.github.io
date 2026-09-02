/*
 * A throwaway static file server for the verification scripts.
 *
 * Two things need to be loaded in a real browser to be measured — a design
 * export folder and the built `dist/` — and neither can be opened from
 * `file://`: the export's `support.js` fetches its `<dc-import>` components
 * over HTTP, and `dist/` relies on the host to map `/about/` to
 * `/about/index.html`. This does exactly the latter (the same
 * `auto-trailing-slash` rule wrangler.jsonc gives the live site) and nothing
 * more. Port 0 asks the OS for a free port, so two can run at once.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
};

async function isDir(p) {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Serve `root` on a free port. Resolves to `{ origin, close }`.
 * A directory path serves its index.html; a missing path serves `404.html`
 * from the root with a 404 status when one exists, as the live host does.
 */
export function serve(root) {
  const ROOT = resolve(root);
  return new Promise((ok) => {
    const server = createServer(async (req, res) => {
      try {
        const raw = decodeURIComponent(new URL(req.url, 'http://x').pathname);
        let file = join(ROOT, normalize(raw).replace(/^([/\\])+/, ''));
        if (!file.startsWith(ROOT)) {
          res.writeHead(403).end();
          return;
        }
        if (await isDir(file)) file = join(file, 'index.html');
        let status = 200;
        let body;
        try {
          body = await readFile(file);
        } catch {
          status = 404;
          body = await readFile(join(ROOT, '404.html')).catch(() => Buffer.from('not found'));
          file = '404.html';
        }
        res.writeHead(status, {
          'content-type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
          'cache-control': 'no-store',
        });
        res.end(body);
      } catch {
        res.writeHead(500).end();
      }
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      ok({
        origin: `http://127.0.0.1:${port}`,
        close: () => new Promise((done) => server.close(done)),
      });
    });
  });
}
