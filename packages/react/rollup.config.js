import tsReactLib from '../../config/rollup/ts-react-lib'
import pkg from './package.json'

const input = './src/index.ts'
const globals = {
  react: 'React',
}
export default tsReactLib({ input, pkg, globals })
