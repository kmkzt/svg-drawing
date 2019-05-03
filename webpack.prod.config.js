const { resolve } = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const config = {
  mode: 'production',
  entry: resolve(__dirname, 'src/index.ts'),
  output: {
    filename: 'index.min.js',
    path: resolve('lib'),
    library: 'samplelibrary-es',
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
    minimizer: [
      new UglifyJsPlugin({
        parallel: true
      })
    ]
  }
}

module.exports = config
