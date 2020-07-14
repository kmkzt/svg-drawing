import tsReactLib from '../../config/rollup/ts-react-lib'
import pkg from './package.json'

const input = './src/index.ts'
export default tsReactLib({ input, pkg })
