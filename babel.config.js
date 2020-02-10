module.exports = api => {
  api.cache(process.env.NODE_ENV === 'development')
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current'
          }
        }
      ],
      '@babel/preset-typescript'
    ]
  }
}
