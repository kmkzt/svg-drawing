import { resolve } from 'path'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
// import json from "@rollup/plugin-json"
import sourceMaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'

const IS_DEV = process.env.NODE_ENV === 'development'

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json']

const getBabelOptions = ({ useESModules } = { useESModules: undefined }) => ({
  extensions,
  babelrc: false,
  exclude: '**/node_modules/**',
  runtimeHelpers: true,
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: false,
        targets: useESModules
          ? '>1%, not dead, not ie 11, not op_mini all'
          : undefined,
      },
    ],
    // react
    // ['@babel/preset-react', { useBuiltIns: true }],
    '@babel/preset-typescript',
  ],
  plugins: [
    // react
    // ['transform-react-remove-prop-types', { removeImport: true }],
    // TODO: optimize bundle size
    // 'babel-plugin-annotate-pure-calls',
    ['@babel/plugin-transform-runtime', { regenerator: false, useESModules }],
  ],
})

export default ({ input, pkg }) => {
  const external = Object.keys(pkg.peerDependencies || {})
  // If development, output path base set project root.
  // TODO: Refactor. Consider using LERNA_ROOT_PATH
  const geFilePath = (file) => {
    const filePath = IS_DEV
      ? resolve(__dirname, '../../', 'node_modules', pkg.name, file)
      : file
    console.log(`${pkg.name}/${file} Rollup output: ${filePath}`)
    return filePath
  }
  return [
    /**
     * umd
     */
    {
      input,
      output: {
        file: geFilePath(pkg.browser),
        format: 'umd',
        name: pkg.name,
        // globals,
        exports: 'named',
        sourcemap: false,
      },
      external,
      plugins: [
        commonjs(),
        babel(getBabelOptions()),
        nodeResolve({ extensions }),
        sourceMaps(),
        replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
        terser({ output: { comments: /Copyright/i } }),
        sizeSnapshot(),
      ],
    },
    /**
     * umd(development)
     */
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
    /**
     * cjs
     */
    {
      input,
      output: {
        file: geFilePath(pkg.main),
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
      external,
      plugins: [
        sourceMaps(),
        commonjs(),
        babel(getBabelOptions()),
        nodeResolve({ extensions }),
        sizeSnapshot(),
      ],
    },
    /**
     * esm
     */
    {
      input,
      output: { file: geFilePath(pkg.module), format: 'esm', sourcemap: true },
      external,
      plugins: [
        sourceMaps(),
        babel(
          getBabelOptions({
            useESModules: true,
          })
        ),
        nodeResolve({ extensions }),
        sizeSnapshot(),
      ],
    },
  ]
}
