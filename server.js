const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 3000;
const mime = {
  '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8', '.xml':'application/xml; charset=utf-8', '.txt':'text/plain; charset=utf-8',
  '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.ico':'image/x-icon'
};

function sendFile(res, file, status = 200) {
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(500, {'Content-Type':'text/plain; charset=utf-8'});
      return res.end('Server error');
    }
    const ext = path.extname(file).toLowerCase();
    const headers = {
      'Content-Type': mime[ext] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cache-Control': ext === '.html' ? 'public, max-age=300' : 'public, max-age=86400'
    };
    res.writeHead(status, headers);
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  let urlPath;
  try { urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { urlPath = '/'; }

  const clean = path.normalize(urlPath).replace(/^([.][.](\/|\\|$))+/, '');
  let file = path.join(root, clean);
  if (!file.startsWith(root)) return sendFile(res, path.join(root, '404.html'), 404);

  fs.stat(file, (err, stat) => {
    if (!err && stat.isDirectory()) file = path.join(file, 'index.html');
    fs.stat(file, (err2, stat2) => {
      if (!err2 && stat2.isFile()) return sendFile(res, file);
      return sendFile(res, path.join(root, '404.html'), 404);
    });
  });
});

server.listen(port, '0.0.0.0', () => console.log(`Emoji Script listening on :${port}`));
