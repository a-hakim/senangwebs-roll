// Local examples preview and webpack watch, without a proxy/dev-server dependency tree.
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const webpack = require('webpack');
const makeConfig = require('../webpack.config');
const root = path.resolve(__dirname, '..');
const port = Number(process.env.SWR_PORT || 8080);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid SWR_PORT');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript',
  '.mjs': 'application/javascript', '.css': 'text/css', '.map': 'application/json', '.png': 'image/png' };
const server = http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400).end(); return; }
  const isDist = pathname.startsWith('/dist/');
  const base = path.join(root, isDist ? 'dist' : 'examples');
  const relative = isDist ? pathname.slice('/dist/'.length) : pathname.slice(1);
  const file = path.resolve(base, relative || 'index.html');
  if (!file.startsWith(base + path.sep) || !types[path.extname(file)]) { response.writeHead(403).end(); return; }
  fs.readFile(file, (error, bytes) => {
    if (error) { response.writeHead(404).end(); return; }
    response.writeHead(200, { 'Content-Type': types[path.extname(file)], 'Cache-Control': 'no-store' });
    response.end(bytes);
  });
});
let listening = false;
const compiler = webpack(makeConfig({}, { mode: 'development' }));
const watcher = compiler.watch({}, (error, stats) => {
  if (error || stats.hasErrors()) { console.error(error || stats.toString({ colors: true, all: false, errors: true })); return; }
  console.log(stats.toString({ colors: true, all: false, timings: true, warnings: true }));
  if (!listening) {
    listening = true;
    server.listen(port, '127.0.0.1', () => console.log('SWR preview: http://127.0.0.1:' + port + ' (refresh after changes)'));
  }
});
let stopping = false;
function stop() {
  if (stopping) return;
  stopping = true;
  server.close();
  watcher.close(() => compiler.close(() => process.exit()));
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
server.on('error', error => { console.error(error); stop(); });
