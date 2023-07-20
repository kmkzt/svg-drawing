/** For babel-jest */
module.exports = (api) => {
  api.cache(false)
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: { node: 'current' },
        },
      ],
      '@babel/preset-typescript',
      '@babel/preset-react',
    ],
  }
}
