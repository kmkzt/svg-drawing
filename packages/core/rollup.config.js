import tsLib from '../../config/rollup/ts-lib'
import pkg from './package.json'

const input = './src/index.ts'

export default tsLib({ input, pkg })
