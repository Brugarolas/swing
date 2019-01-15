const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Webpack Config
module.exports = (env, args) => {
  const isProduction = args.mode === 'production';

  const config = {
    entry: './index.js',
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/env', { targets: { browsers: [ 'last 2 versions' ] }, useBuiltIns: 'usage', modules: false }],
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
