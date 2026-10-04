const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

class TypeDeclarationsPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('TypeDeclarationsPlugin', compilation => {
      compilation.hooks.processAssets.tap({
        name: 'TypeDeclarationsPlugin', stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
      }, () => {
        const source = fs.readFileSync(path.resolve(__dirname, 'src/swr.d.ts'), 'utf8');
        compilation.emitAsset('swr.d.ts', new webpack.sources.RawSource(source));
        compilation.emitAsset('swr.d.mts', new webpack.sources.RawSource(
          source.replace('export as namespace SWR;', '').replace('export = SWR;', 'export default SWR;\nexport { SWR };')
        ));
      });
    });
  }
}

module.exports = (env = {}, argv = {}) => {
  const development = argv.mode === 'development';
  function configuration(name, filename, { minified = false, esm = false, declarations = false } = {}) {
    return {
      name, mode: development ? 'development' : 'production',
      entry: esm ? './src/swr.esm.js' : './src/swr.js',
      output: {
        path: path.resolve(__dirname, 'dist'), filename,
        library: esm ? { type: 'module' } : { name: 'SWR', type: 'umd', export: 'default' },
        globalObject: 'globalThis', sourceMapFilename: '[file].map',
        ...(esm ? { module: true } : {}),
      },
      experiments: esm ? { outputModule: true } : {},
      devtool: 'source-map',
      module: { rules: [
        { test: /\.js$/, exclude: /node_modules/, use: { loader: 'babel-loader',
          options: { presets: [['@babel/preset-env', { targets: { chrome: '100', firefox: '100', safari: '15.5' }, modules: false }]] } } },
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      ] },
      plugins: [
        ...(!esm ? [new MiniCssExtractPlugin({ filename: minified ? 'swr.min.css' : 'swr.css' })] : []),
        ...(declarations ? [new TypeDeclarationsPlugin()] : []),
      ],
      optimization: {
        minimize: minified || esm,
        minimizer: [
          new TerserPlugin({ terserOptions: { compress: { drop_console: false },
            format: { comments: false } }, extractComments: false }),
          new CssMinimizerPlugin(),
        ],
      },
    };
  }
  return [
    configuration('umd', 'swr.js', { declarations: true }),
    configuration('umd-min', 'swr.min.js', { minified: true }),
    configuration('esm', 'swr.mjs', { esm: true }),
  ];
};
