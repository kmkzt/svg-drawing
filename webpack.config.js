const { join, resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'source-map' : false,
  entry: resolve(__dirname, 'src/example/app.tsx'),
  output: {
    filename: isDev ? '[name].js' : '[name].[hash].js',
    path: resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              fix: true,
              failOnWarning: true
            }
          }
        ]
      },
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              fix: true,
              failOnWarning: true
            }
          }
        ]
      },
      {
        test: /\.[tj]sx$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]'
            }
          }
        ]
      },
      { test: /\.html$/, exclude: /node_modules/, use: 'html-loader' }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    modules: ['node_modules', 'web_modules'],
    plugins: [new TsconfigPathsPlugin()]
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new ForkTsCheckerWebpackPlugin({
      reportFiles: ['src/**/*.{ts,tsx}']
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'src/example/index.html')
    })
  ],
  optimization: {
    minimize: !isDev
  },
  devServer: {
    contentBase: join(__dirname, 'docs'),
    compress: true,
    port: 8888
  }
}
