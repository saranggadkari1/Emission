#!/usr/bin/env node
/* EPATrac v1.0 — local HTTP server (Node built-ins only) */
const http = require('http');
const fs   = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 49152;                 // localhost only
const DIR  = __dirname;
const DATA = path.join(DIR, 'epatrac-data.json');
const HTML = path.join(DIR, 'index.html');

function send(res, code, body, type){
  res.writeHead(code, { 'Content-Type': type || 'application/json', 'Cache-Control': 'no-store' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (req.method === 'GET' && url === '/') {
    fs.readFile(HTML, (err, buf) => err ? send(res,500,'index.html not found','text/plain')
                                        : send(res,200,buf,'text/html; charset=utf-8'));
    return;
  }
  if (req.method === 'GET' && url === '/api/ping')      return send(res,200,JSON.stringify({ok:true}));
  if (req.method === 'GET' && url === '/api/datapath')  return send(res,200,JSON.stringify({path:DATA}));
  if (req.method === 'GET' && url === '/api/load') {
    fs.readFile(DATA,'utf8',(err,txt)=>{
      if (err) return send(res,200,'{}');
      try { JSON.parse(txt); send(res,200,txt); }
      catch { send(res,200,'{}'); }
    });
    return;
  }
  if (req.method === 'POST' && url === '/api/save') {
    let body=''; req.on('data',c=>{ body+=c; if(body.length>20e6) req.destroy(); });
    req.on('end',()=>{
      try { const obj=JSON.parse(body);
        fs.writeFile(DATA, JSON.stringify(obj,null,2), e=> e ? send(res,500,JSON.stringify({ok:false,error:String(e)}))
                                                              : send(res,200,JSON.stringify({ok:true})));
      } catch(e){ send(res,400,JSON.stringify({ok:false,error:'invalid JSON'})); }
    });
    return;
  }
  send(res,404,'Not found','text/plain');
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('EPATrac is already running — opening existing instance.');
    openBrowser(); process.exit(0);
  } else { console.error(e); process.exit(1); }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('EPATrac v1.0 running at http://127.0.0.1:'+PORT);
  console.log('Data file: '+DATA);
  console.log('Press Ctrl+C to stop.');
  setTimeout(openBrowser, 500);
});

function openBrowser(){
  const url = 'http://127.0.0.1:'+PORT;
  const cmd = process.platform==='win32' ? 'start ""' :
              process.platform==='darwin' ? 'open' : 'xdg-open';
  exec(cmd+' '+url, ()=>{});
}
