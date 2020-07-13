const { join, resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const exclude = [/node_modules/, /packages/]
module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'source-map' : false,
  entry: resolve(__dirname, 'app.tsx'),
  output: {
    filename: isDev ? '[name].js' : '[name].[hash].js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              fix: true,
              failOnWarning: false,
            },
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
          {
            loader: 'eslint-loader',
            options: {
              fix: true,
              failOnWarning: true,
            },
          },
        ],
      },
      {
        test: /\.[tj]sx$/,
        exclude,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        exclude,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]',
            },
          },
        ],
      },
      { test: /\.html$/, exclude, use: 'html-loader' },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    modules: ['node_modules', 'web_modules'],
    plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, './index.html'),
    }),
  ],
  optimization: {
    minimize: !isDev,
  },
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    compress: true,
  },
}
