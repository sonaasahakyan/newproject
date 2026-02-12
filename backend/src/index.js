const http = require('http');
const fs = require('fs');
const path = require('path');
const { calculateTripCost } = require('./planner');

const port = Number(process.env.PORT) || 3000;
const frontendDir = path.resolve(__dirname, '../../frontend');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(payload));
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/plan/calculate') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const payload = body ? JSON.parse(body) : {};
        const result = calculateTripCost(payload);
        sendJson(res, 200, result);
      } catch (_error) {
        sendJson(res, 400, { error: 'Invalid JSON payload.' });
      }
    });

    return;
  }

  const normalizedUrl = req.url === '/' ? '/index.html' : req.url;
  const safePath = path.normalize(normalizedUrl).replace(/^\.\.(\/|\\|$)/, '');
  const filePath = path.join(frontendDir, safePath);

  if (!filePath.startsWith(frontendDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      serveFile(res, filePath);
      return;
    }

    serveFile(res, path.join(frontendDir, 'index.html'));
  });
});

server.listen(port, () => {
  console.log(`Trip planner server is running on http://localhost:${port}`);
});
