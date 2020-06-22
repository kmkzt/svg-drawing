import { SvgAnimation, FrameAnimation } from './animation'

const defaultTestData = `<svg width="200" height="200">
  <path fill="#f00" stroke="#00f" stroke-width="4" d="M 1 1 L 2 2 C 3 3 5 3 7 3 Z"></path>
  <path fill="#ff0" stroke="#f0f" stroke-width="2" d="M 2 2 L 4 4 C 6 6 10 6 14 6 Z"></path>
</svg>`

describe('animation.ts', () => {
  describe('SvgAnimation', () => {
    const generateAniamtion = (svgStr = defaultTestData) => {
      const svg = new SvgAnimation(document.createElement('div'))
      svg.parseSVGString(svgStr)
      return svg
    }
    it('init', () => {
      expect(generateAniamtion()).toMatchSnapshot()
    })
    it('generateFrame', () => {
      const svg = generateAniamtion()
      svg.setAnimation(paths => {
        return [paths[0]]
      })
      expect(svg.generateFrame().length).toBe(1)
    })
    // TODO: Improve test pattern
    it('toAnimationElement', () => {
      const svg = generateAniamtion()
      const testAnimation: FrameAnimation = (paths, count) => {
        const update = []
        for (let i = 0; i < paths.length; i += 1) {
          // Test property
          if (count % 2 === 0) paths[i].stroke = '#0ff'
          // Test Attribute
          if (count % 3 === 0)
            Object.assign(paths[i].attrs, {
              strokeLinecap: 'mitter'
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
      }
      svg.setAnimation(testAnimation)
      expect(svg.toAnimationElement()).toMatchSnapshot()
    })
  })
})
