import { SvgAnimation, FrameAnimation } from './animation'

const testSvgString = `<svg width="200" height="200">
  <path fill="#f00" stroke="#00f" stroke-width="4" d="M 1 1 L 2 2 C 3 3 5 3 7 3 Z"></path>
  <path fill="#ff0" stroke="#f0f" stroke-width="2" d="M 2 2 L 4 4 C 6 6 10 6 14 6 Z"></path>
</svg>`

describe('animation.ts', () => {
  describe('SvgAnimation', () => {
    const generateAniamtion = () => {
      const animation = new SvgAnimation(document.createElement('div'))
      animation.parseSVGString(testSvgString)
      return animation
    }
    it('init', () => {
      expect(generateAniamtion()).toMatchSnapshot()
    })
    it('frame', () => {
      const anim = generateAniamtion()
      anim.setAnimation(paths => {
        return [paths[0]]
      })
      anim.frame()
      expect(anim.paths.length).toBe(1)
    })
  })
})
