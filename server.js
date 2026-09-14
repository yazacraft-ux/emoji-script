/* Petit serveur statique — utile pour un aperçu hors GitHub Pages. */
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname);
const port = process.env.PORT || 3000;

const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon'
};

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' blob:",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'"
].join('; ');

function securityHeaders(ext) {
  return {
    'Content-Type': mime[ext] || 'application/octet-stream',
    'Content-Security-Policy': csp,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cache-Control': ext === '.html' ? 'public, max-age=300' : 'public, max-age=86400'
  };
}

function sendFile(req, res, file, status = 200) {
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Server error');
    }
    const headers = securityHeaders(path.extname(file).toLowerCase());
    res.writeHead(status, headers);
    if (req.method === 'HEAD') return res.end();
    res.end(data);
  });
}

function sendNotFound(req, res) {
  sendFile(req, res, path.join(root, '404.html'), 404);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Allow': 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Method not allowed');
  }

  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return sendNotFound(req, res);
  }

  if (urlPath.indexOf('\0') !== -1) return sendNotFound(req, res);

  const file = path.resolve(root, '.' + path.posix.normalize(urlPath));
  if (file !== root && !file.startsWith(root + path.sep)) return sendNotFound(req, res);

  fs.stat(file, (err, stat) => {
    if (!err && stat.isDirectory()) {
      if (!urlPath.endsWith('/')) {
        res.writeHead(301, { Location: urlPath + '/' });
        return res.end();
      }
      const indexFile = path.join(file, 'index.html');
      return fs.stat(indexFile, (indexErr, indexStat) => {
        if (!indexErr && indexStat.isFile()) return sendFile(req, res, indexFile);
        return sendNotFound(req, res);
      });
    }

    if (!err && stat.isFile()) return sendFile(req, res, file);
    return sendNotFound(req, res);
  });
});

server.listen(port, '0.0.0.0', () => console.log(`Emoji Script listening on :${port}`));
