import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
// import json from "@rollup/plugin-json"
import sourceMaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import { packageGlobals } from './globals'
import { createBanner } from './banner'

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json']
const targets = '>1%, not dead, not ie 11, not op_mini all'

export default ({ getBabelOptions, globals: injectGlobal }) => ({
  input,
  pkg,
}) => {
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

  return [
    /** Umd */
    {
      input,
      output: {
        file: pkg.browser,
        format: 'umd',
        name: pkg.name,
        globals,
        exports: 'named',
        sourcemap: false,
        banner,
      },
      external,
      plugins: [
        commonjs(),
        babel(getBabelOptions({ esm: false, extensions })),
        nodeResolve({ extensions }),
        sourceMaps(),
        replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
        terser({ output: { comments: /Copyright/i } }),
        sizeSnapshot(),
      ],
    },
    /** Umd(development) */
    // {
    //   input,
    //   output: {
    //     file: pkg.browser,
    //     format: 'umd',
    //     name: pkg.name,
    //     globals,
    //     exports: 'named',
    //     sourcemap: false
    //   },
    //   external: Object.keys(globals),
    //   plugins: [
    //     babel(getBabelOptions({ useESModules: true })),
    //     nodeResolve({ extensions }),
    //     commonjs(),
    //     replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    //     terser()
    //   ]
    // },
    /** Cjs */
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
        sourceMaps(),
        commonjs(),
        babel(getBabelOptions({ esm: false, extensions })),
        nodeResolve({ extensions }),
        sizeSnapshot(),
      ],
    },
    /** Esm */
    {
      input,
      output: { file: pkg.module, format: 'esm', sourcemap: true, banner },
      external,
      plugins: [
        sourceMaps(),
        commonjs(),
        babel(getBabelOptions({ esm: true, extensions, targets })),
        nodeResolve({ extensions }),
        sizeSnapshot(),
      ],
    },
  ]
}
