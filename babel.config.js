/**
 * For babel-jest
 */
module.exports = (api) => {
  api.cache(false)
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: { node: 'current' },
          loose: true,
          modules: 'commonjs',
        },
      ],
      '@babel/preset-typescript',
    ],
  }
}
