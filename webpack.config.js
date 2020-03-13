const { join, resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'source-map' : false,
  entry: resolve(__dirname, 'src/example/index.tsx'),
  output: {
    filename: isDev ? '[name].js' : '[name].[hash].js',
    path: resolve('docs')
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              failOnWarning: true
            }
          }
        ]
      },
      {
        test: /\.js|.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.ts|.tsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
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
    alias: {
      '@': resolve(__dirname, 'src')
    },
    modules: ['node_modules', 'web_modules'],
    plugins: [new TsconfigPathsPlugin()]
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new ForkTsCheckerWebpackPlugin({
      reportFiles: ['src/**/*.{ts,tsx}']
    }),
    new HtmlWebpackPlugin({
      template: resolve('template.html')
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
