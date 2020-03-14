const { BABEL_ENV, NODE_ENV } = process.env
const modules = BABEL_ENV === 'cjs' || NODE_ENV === 'test' ? 'commonjs' : false

module.exports = api => {
  api.cache(false)
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: NODE_ENV === 'test' ? { node: 'current' } : undefined,
          loose: true,
          modules
        }
      ],
      // react only
      // '@babel/preset-react',
      '@babel/preset-typescript'
    ],
    plugins: [
      // react only
      // [
      //   'babel-plugin-transform-react-remove-prop-types',
      //   { mode: 'unsafe-wrap' }
      // ],
      // ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
      // ['@babel/plugin-proposal-class-properties', { loose: true }]
      // modules === 'commonjs' && 'add-module-exports'
    ]
  }
}
