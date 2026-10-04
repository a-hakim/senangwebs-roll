const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const destination = fs.mkdtempSync(path.join(os.tmpdir(), 'swr-bundler-'));
const compiler = webpack({
  mode: 'production',
  entry: path.resolve(__dirname, '../tests/package/consumer.mjs'),
  output: { path: destination, filename: 'consumer.cjs', library: { type: 'commonjs2', export: 'default' } },
  module: { rules: [{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] }] },
  plugins: [new MiniCssExtractPlugin({ filename: 'consumer.css' })],
});
compiler.run((error, stats) => {
  compiler.close(closeError => {
    try {
      assert.ifError(error); assert.ifError(closeError);
      assert(!stats.hasErrors(), stats.toString({ all: false, errors: true }));
      assert(fs.readFileSync(path.join(destination, 'consumer.css'), 'utf8').includes('.swr-viewport'));
      assert.equal(typeof require(path.join(destination, 'consumer.cjs')), 'function');
      console.log('Verified npm bundler import, CSS retention, and browser-independent bundle loading.');
    } catch (failure) { console.error(failure); process.exitCode = 1; }
  });
});
