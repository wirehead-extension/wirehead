const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    dashboard: ['@babel/polyfill', './client/dashboard'],
    popup: ['@babel/polyfill', './client/popup/popup.js'],
    eventPage: ['@babel/polyfill', './client/background']
  },
  output: {
    path: __dirname,
    filename: './public/[name].bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        exclude: '/client/semantic/',
        use: {
          loader: 'file-loader',
          options: {
            limit: 100000,
            name: '[name].[ext]',
            outputPath: 'client/semantic/dist/fonts/'
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ['style-loader', 'css-loader']
      }
    ]
  }
}
