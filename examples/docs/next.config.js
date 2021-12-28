module.exports = {
  // For gh-pages
  basePath: process.env.BASE_PATH || '',
  assetPrefix: process.env.BASE_PATH || '',
  webpack(config, { dev }) {
    /**
     * @todo Add eslint-webpack-plugin.
     *   https://github.com/webpack-contrib/eslint-webpack-plugin
     */
    return config
  },
}
