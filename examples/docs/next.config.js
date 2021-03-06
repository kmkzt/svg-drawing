const isProd = process.env.NODE_ENV === 'production'
const isGhPages = process.env.IS_GH_PAGE === 'true'

module.exports = {
  // For gh-pages
  basePath: isGhPages ? '/svg-drawing' : '',
  assetPrefix: isGhPages ? '/svg-drawing' : '',
  webpack(config, { dev }) {
    if (dev) {
      config.module.rules.push({
        enforce: 'pre',
        test: /\.[tj]sx?/,
        exclude: [/node_modules/, /packages/],
        use: [
          {
            loader: 'eslint-loader',
            options: {
              fix: true,
              failOnWarning: false,
            },
          },
        ],
      })
    }
    return config
  },
}
