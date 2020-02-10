// yarn
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const common = {
  input: 'src/index.ts',
  external: ['two.js']
}
export default [
  // browser-friendly UMD build
  {
    ...common,
    output: {
      name: pkg.name,
      file: pkg.browser,
      format: 'umd',
      globals: {
        'two.js': 'Two'
      }
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      terser({ output: { comments: /Copyright/i } })
    ]
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
