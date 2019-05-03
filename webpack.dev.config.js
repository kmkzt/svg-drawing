const { join, resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const config = {
  mode: 'development',
  entry: resolve(__dirname, 'src/example/index.ts'),
  output: {
    filename: '[name].bundle.js',
    path: resolve('docs')
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('template.html')
    }),
    new Dotenv({
      path: 'development.env',
      safe: false
    })
  ],
  devServer: {
    contentBase: join(__dirname, 'docs'),
    compress: true,
    port: 8888
  }
}

module.exports = config
