import tsLib from '../../config/rollup/ts-lib'
import pkg from './package.json'

export default tsLib({ input: './src/index.ts', pkg })
