'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 49152;
const DATA_FILE = path.join(__dirname, 'epatrac-data.json');
const HTML_FILE = path.join(__dirname, 'index.html');

function openBrowser(url) {
  const p = process.platform;
  if (p === 'win32') exec(`start "" "${url}"`);
  else if (p === 'darwin') exec(`open "${url}"`);
  else exec(`xdg-open "${url}"`);
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (req.method === 'GET' && url === '/') {
    fs.readFile(HTML_FILE, (err, data) => {
      if (err) { res.writeHead(404); res.end('index.html not found'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
    return;
  }

  if (req.method === 'GET' && url === '/api/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method === 'GET' && url === '/api/datapath') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ path: DATA_FILE }));
    return;
  }

  if (req.method === 'GET' && url === '/api/load') {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      if (err) { res.end('{}'); return; }
      try { JSON.parse(data); res.end(data); }
      catch (e) { res.end('{}'); }
    });
    return;
  }

  if (req.method === 'POST' && url === '/api/save') {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 50 * 1024 * 1024) { res.writeHead(413); res.end(); } });
    req.on('end', () => {
      try {
        JSON.parse(body);
        fs.writeFile(DATA_FILE, body, 'utf8', err => {
          if (err) { res.writeHead(500); res.end(JSON.stringify({ error: 'Write failed' })); return; }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
        });
      } catch (e) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  res.writeHead(404); res.end('Not found');
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} in use — opening existing instance.`);
    openBrowser(`http://127.0.0.1:${PORT}`);
  } else {
    console.error(err);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`EPATrac running at http://127.0.0.1:${PORT}`);
  setTimeout(() => openBrowser(`http://127.0.0.1:${PORT}`), 500);
});
