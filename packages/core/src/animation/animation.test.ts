import { Animation } from './animation'
import { parseSVGString } from '../parser'

const defaultTestData = `<svg width="200" height="200">
  <path fill="#f00" stroke-linecap="round" stroke="#00f" stroke-width="4" d="M1 1 l1 1 c2 2 4 2 6 2 z"></path>
  <path fill="#ff0" stroke-linecap="butt" stroke="#f0f" stroke-width="2" d="M 2 2 l2 2 C4 4 8 4 12 4 Z"></path>
</svg>`

describe('Animation', () => {
  const init = (svgStr = defaultTestData) =>
    new Animation().initialize(parseSVGString(svgStr).paths)
  it('new Animation()', () => {
    expect(init()).toMatchSnapshot()
  })
  it('getFramePaths', () => {
    const anim = init()
    anim.setup({ animation: (paths) => [paths[0]], loops: 1 })

    expect(anim.getFramePaths(0)).toMatchObject([anim.paths[0]])
  })
  // TODO: Improve test pattern
  it('toJson', () => {
    const anim = init()
    anim.setup({
      animation: (paths, key) => {
        const update = []
        let count = key
        for (let i = 0; i < paths.length; i += 1) {
          // Test property
          if (count % 2 === 0) paths[i].updateAttributes({ stroke: '#0ff' })
          // Test Attribute
          if (count % 3 === 0)
            paths[i].updateAttributes({
              strokeLinecap: 'mitter',
            })
          if (count < paths[i].commands.length) {
            paths[i].commands = paths[i].commands.slice(0, count)
            update.push(paths[i])
            break
          }
          count -= paths[i].commands.length
          update.push(paths[i])
        }
        return update
      },
      loops: anim.paths.reduce((acc, p) => acc + p.commands.length, 0),
    })

    expect(anim.toJson()).toMatchSnapshot()
  })
})
