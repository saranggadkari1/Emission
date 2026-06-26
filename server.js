const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const PORT = 49152;
const DATA_FILE = path.join(__dirname, 'fmvsstrac-data.json');
const HTML_FILE = path.join(__dirname, 'index.html');

function openBrowser(url) {
  const platform = os.platform();
  if (platform === 'win32') exec(`start "" "${url}"`);
  else if (platform === 'darwin') exec(`open "${url}"`);
  else exec(`xdg-open "${url}"`);
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (url === '/api/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true }));
  }

  if (url === '/api/datapath') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ path: DATA_FILE }));
  }

  if (url === '/api/load') {
    if (!fs.existsSync(DATA_FILE)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({}));
    }
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (url === '/api/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        JSON.parse(body); // validate
        fs.writeFileSync(DATA_FILE, body, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Serve index.html
  if (url === '/' || url === '/index.html') {
    try {
      const html = fs.readFileSync(HTML_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    } catch (e) {
      res.writeHead(500);
      return res.end('Error loading index.html: ' + e.message);
    }
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${PORT}`;
  console.log(`FMVSSTrac running at ${url}`);
  console.log(`Data file: ${DATA_FILE}`);
  setTimeout(() => openBrowser(url), 500);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} already in use — opening existing instance.`);
    openBrowser(`http://127.0.0.1:${PORT}`);
  } else {
    console.error(e);
  }
});
