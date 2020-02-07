// yarn
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'
import pkg from './package.json'

const common = {
  input: 'src/index.ts',
  external: Object.keys(pkg.peerDependencies)
}
export default [
  // browser-friendly UMD build
  {
    ...common,
    output: {
      name: pkg.name,
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [resolve(), commonjs(), typescript()]
  },

  {
    ...common,
    plugins: [typescript()],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ]
  }
]
