import tsReactLib from '../../config/rollup/ts-react-lib'
import pkg from './package.json'

export default tsReactLib({ input: './src/index.ts', pkg })
