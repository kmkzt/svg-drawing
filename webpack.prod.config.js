const Dotenv = require('dotenv-webpack')
const { resolve } = require('path')

const config = {
  mode: 'production',
  entry: resolve(__dirname, 'src/index.ts'),
  output: {
    filename: 'index.min.js',
    path: resolve('lib'),
    library: 'svg-drawing',
    libraryTarget: 'umd'
  },
  devtool: false,
  // Depencies libraries
  externals: {
    'two.js': 'two.js'
  },
  plugins: [
    new Dotenv({
      path: 'production.env',
      safe: false
    })
  ],
  optimization: {
    minimize: true
  }
}

module.exports = config
