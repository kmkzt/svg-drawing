import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import babel from 'rollup-plugin-babel'
import sourceMaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser'
import { createBanner } from './banner'
import { packageGlobals } from './globals'

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json']
const targets = '>1%, not dead, not ie 11, not op_mini all'

export default ({ getBabelOptions, globals: injectGlobal }) =>
  ({ input, pkg }) => {
    const globals = {
      ...(injectGlobal || {}),
      ...packageGlobals,
    }
    const external = Object.keys({
      ...globals,
      ...(pkg.peerDependencies || {}),
      ...(pkg.optionalDependencies || {}),
    })

    const banner = createBanner({
      name: pkg.name,
      version: pkg.version,
      license: pkg.license,
      author: pkg.author.name,
    })

    const buildPlugins = (opts) => [
      commonjs(),
      babel(
        getBabelOptions({
          esm: opts.esm,
          extensions,
          ...(opts.esm ? { targets } : undefined),
        })
      ),
      nodeResolve({ extensions }),
      sourceMaps(),
    ]

    const optimizePlugin = (opts) => [
      replace({
        'process.env.NODE_ENV': JSON.stringify(opts.mode),
        preventAssignment: true,
      }),
      terser({ output: { comments: /Copyright/i } }),
    ]

    return [
      // umd
      {
        input,
        output: {
          file: pkg.browser,
          format: 'umd',
          name: pkg.name,
          globals,
          exports: 'named',
          sourcemap: true,
          banner,
        },
        external,
        plugins: [
          ...buildPlugins({ esm: false }),
          ...optimizePlugin({ mode: 'production' }),
        ],
      },
      // umd(development)
      {
        input,
        output: {
          file: pkg.browser,
          format: 'umd',
          name: pkg.name,
          globals,
          exports: 'named',
          sourcemap: true,
        },
        external: Object.keys(globals),
        plugins: [
          ...buildPlugins({ esm: false }),
          ...optimizePlugin({ mode: 'production' }),
        ],
      },
      // cjs
      {
        input,
        output: {
          file: pkg.main,
          format: 'cjs',
          exports: 'named',
          sourcemap: true,
          banner,
        },
        external,
        plugins: [
          ...buildPlugins({ esm: false }),
          ...optimizePlugin('production'),
        ],
      },
      // esm
      {
        input,
        output: { file: pkg.module, format: 'esm', sourcemap: true, banner },
        external,
        plugins: [
          ...buildPlugins({ esm: true }),
          ...optimizePlugin('production'),
        ],
      },
    ]
  }
