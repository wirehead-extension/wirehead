const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    popup: ['@babel/polyfill', './client/popup.js'],
    tinyPopup: ['@babel/polyfill', './client/tiny-popup.js'],
    dashboard: ['@babel/polyfill', './client/dashboard.js'],
    eventPage: ['@babel/polyfill', './public/eventPage.js']
  },
  output: {
    path: __dirname,
    filename: './public/[name].bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
