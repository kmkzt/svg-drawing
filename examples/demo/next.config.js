module.exports = {
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
