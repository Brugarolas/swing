const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Webpack Config
module.exports = (environment, args) => {
  const isProduction = args.mode === 'production';

  const config = {
    entry: './index.js',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            plugins: [
              [ '@babel/transform-runtime', { corejs: 3 } ]
            ],
            presets: [
              [ '@babel/env', { targets: { browsers: [ 'last 2 versions' ] }, useBuiltIns: 'usage', modules: false, corejs: 3 } ]
            ]
          }
        }
      ]
    },
    output: {
      filename: 'bundle.js',
      path: __dirname + '/dist',
      publicPath: '/'
    }
  };

  if (isProduction) {
    config.plugins = [
      new BundleAnalyzerPlugin()
    ];
  }

  return config;
};
