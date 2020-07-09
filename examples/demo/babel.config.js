module.exports = (api) => {
  api.cache(false)
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          modules: 'commonjs',
        },
      ],
      '@babel/preset-typescript',
    ],
  }
}
