const { resolve } = require('path')

const isDev = process.env.NODE_ENV !== 'production'
const tsReactBase = require('../../config/webpack/ts-react')

module.exports = tsReactBase({
  isDev,
  entry: resolve(__dirname, './app.tsx'),
  outputPath: resolve(__dirname, 'dist'),
  template: resolve(__dirname, './index.html'),
  port: 8080,
})
