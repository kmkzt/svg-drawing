const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const exclude = [/node_modules/, /packages/]
const eslintLoader = {
  loader: 'eslint-loader',
  options: {
    fix: true,
    failOnWarning: false,
  },
}
module.exports = ({ isDev, entry, outputPath, template, port }) => ({
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval-source-map' : false,
  entry,
  output: {
    filename: isDev ? '[name].bundle.js' : '[name].[hash].js',
    path: outputPath,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude,
        use: [eslintLoader],
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
          eslintLoader,
        ],
      },
      {
        test: /\.[jt]sx?$/,
        exclude,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        ],
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
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    modules: ['node_modules'],
    plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template,
    }),
  ],
  optimization: {
    minimize: !isDev,
  },
  devServer: {
    port,
    contentBase: outputPath,
    compress: true,
  },
})
