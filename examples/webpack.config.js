module.exports = {
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
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  }
};
