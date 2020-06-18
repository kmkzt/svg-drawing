import { SvgAnimation, FrameAnimation } from './animation'

const defaultTestData = `<svg width="200" height="200">
  <path fill="#f00" stroke="#00f" stroke-width="4" d="M 1 1 L 2 2 C 3 3 5 3 7 3 Z"></path>
  <path fill="#ff0" stroke="#f0f" stroke-width="2" d="M 2 2 L 4 4 C 6 6 10 6 14 6 Z"></path>
</svg>`

describe('animation.ts', () => {
  describe('SvgAnimation', () => {
    const generateAniamtion = (svgStr = defaultTestData) => {
      const animation = new SvgAnimation(document.createElement('div'))
      animation.parseSVGString(svgStr)
      return animation
    }
    it('init', () => {
      expect(generateAniamtion()).toMatchSnapshot()
    })
    it('generateFrame', () => {
      const anim = generateAniamtion()
      anim.setAnimation(paths => {
        return [paths[0]]
      })
      expect(anim.generateFrame().length).toBe(1)
    })
    it('totalCommandsLength', () => {
      const animation = generateAniamtion(`<svg width="200" height="200">
        <path fill="#f00" stroke="#00f" stroke-width="4" d="M 1 1 L 2 2 C 3 3 5 3 7 3 Z"></path>
        <path fill="#ff0" stroke="#f0f" stroke-width="2" d="M 2 2 L 4 4 C 6 6 10 6 14 6 Z"></path>
      </svg>`)
      expect(animation.totalCommandsLength).toBe(8)
    })
  })
})
