import { parseSVGString } from '@svg-drawing/core'
import { SvgAnimation } from './SvgAnimation'
import { FrameAnimation } from './types'

const defaultTestData = `<svg width="200" height="200">
  <path fill="#f00" stroke-linecap="round" stroke="#00f" stroke-width="4" d="M 1 1 L 2 2 C 3 3 5 3 7 3 Z"></path>
  <path fill="#ff0" stroke-linecap="butt" stroke="#f0f" stroke-width="2" d="M 2 2 L 4 4 C 6 6 10 6 14 6 Z"></path>
</svg>`

describe('SvgAnimation.ts', () => {
  describe('SvgAnimation', () => {
    const generateAnimation = (svgStr = defaultTestData) => {
      const anim = SvgAnimation.init(document.createElement('div'))
      anim.svg.copy(parseSVGString(svgStr))
      return anim
    }
    it('init', () => {
      expect(generateAnimation()).toMatchSnapshot()
    })
    it('generateFrame', () => {
      const svg = generateAnimation()
      svg.animation.setAnimation((paths) => {
        return [paths[0]]
      })
      expect(svg.animation.generateFrame().length).toBe(1)
    })
    // TODO: Improve test pattern
    it('toAnimationElement', () => {
      const svg = generateAnimation()
      const testAnimation: FrameAnimation = (paths, count) => {
        const update = []
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
      }
      svg.animation.setAnimation(testAnimation)
      svg.start()
      expect(svg.animation.toElement()).toMatchSnapshot()
    })

    it('setAnimation, start, stop', async () => {
      const svg = generateAnimation()
      let loop = 0
      svg.animation.setAnimation(
        (_paths, fid) => {
          loop += 1
          return []
        },
        {
          ms: 300,
          frames: 3,
        }
      )
      svg.start()
      setTimeout(() => {
        svg.stop()
        expect(loop).toBe(3)
      }, 1000)
    })
  })
})
