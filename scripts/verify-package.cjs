const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const metadata = require('../package.json');
const required = ['swr.js', 'swr.min.js', 'swr.mjs', 'swr.css', 'swr.min.css', 'swr.d.ts', 'swr.d.mts',
  'swr.js.map', 'swr.min.js.map', 'swr.mjs.map', 'swr.css.map', 'swr.min.css.map'];
for (const file of required) assert(fs.statSync(path.join(root, 'dist', file)).size > 0, file);
assert.equal(fs.readFileSync(path.join(root, 'src/swr.d.ts'), 'utf8'),
  fs.readFileSync(path.join(root, 'dist/swr.d.ts'), 'utf8'));
assert(fs.statSync(path.join(root, 'dist/swr.min.js')).size < fs.statSync(path.join(root, 'dist/swr.js')).size);
assert(fs.statSync(path.join(root, 'dist/swr.min.css')).size < fs.statSync(path.join(root, 'dist/swr.css')).size);
const npmCli = process.env.npm_execpath;
assert(npmCli, 'Run verification through npm run verify:package');
const pack = spawnSync(process.execPath, [npmCli, 'pack', '--dry-run', '--ignore-scripts', '--json'], {
  cwd: root, encoding: 'utf8',
});
assert.equal(pack.status, 0, pack.stderr);
const manifest = JSON.parse(pack.stdout)[0];
for (const file of manifest.files) {
  assert(['README.md', 'LICENSE.md', 'package.json'].includes(file.path) || file.path.startsWith('dist/'),
    'Unexpected published file: ' + file.path);
}
for (const file of required) assert(manifest.files.some(entry => entry.path === 'dist/' + file));
for (const code of [
  "const SWR = require('senangwebs-roll'); if(typeof SWR !== 'function' || SWR.initAll().length !== 0) process.exit(1)",
  "const before = Reflect.ownKeys(globalThis); const {default:SWR, SWR:Named} = await import('senangwebs-roll'); if(SWR !== Named || SWR.initAll().length !== 0 || Reflect.ownKeys(globalThis).length !== before.length) process.exit(1)",
]) {
  const check = spawnSync(process.execPath, ['--input-type=module', '-e',
    code.startsWith('const SWR = require') ? "import {createRequire} from 'node:module';const require=createRequire(import.meta.url);" + code : code],
    { cwd: root, encoding: 'utf8' });
  assert.equal(check.status, 0, check.stderr);
}
console.log('Verified ' + metadata.name + '@' + metadata.version + ': ' + manifest.entryCount +
  ' files; CJS/ESM server imports, declarations, maps, and minification.');
