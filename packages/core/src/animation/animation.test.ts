import { Animation } from './animation'
import { parseSVGString } from '../parser'
import type { AnimateObject, PathClass } from '../types'

const defaultTestData = `<svg width="200" height="200">
  <path fill="#f00" stroke-linecap="round" stroke="#00f" stroke-width="4" d="M1 1 l1 1 c2 2 4 2 6 2 z"></path>
  <path fill="#ff0" stroke-linecap="butt" stroke="#f0f" stroke-width="2" d="M 2 2 l2 2 C4 4 8 4 12 4 Z"></path>
</svg>`

const generateMockPaths = (svgStr = defaultTestData) =>
  parseSVGString(svgStr).elements.map((p, i) => {
    p.key = `p${i}`
    return p
  })

describe('Animation', () => {
  describe('getFramePaths', () => {
    it('Return animation frame of argument frame number', () => {
      const originPaths = generateMockPaths()
      const animation = new Animation().initialize(originPaths)

      animation.setup({
        animation: (paths, index) => [paths[index]],
        loops: originPaths.length,
      })

      expect(animation.getFrame(0)).toMatchObject([originPaths[0]])
      expect(animation.getFrame(1)).toMatchObject([originPaths[1]])
    })

    it('Return originPaths when animation is not set', () => {
      const originPaths = generateMockPaths()
      const animation = new Animation().initialize(originPaths)

      expect(animation.getFrame(0)).toMatchObject(originPaths)
    })
  })
  describe('toJson', () => {
    it('Return array of AnimateObject', () => {
      const animation = new Animation().initialize(generateMockPaths())
      animation.setup({
        animation: (paths, key) => {
          const update: PathClass[] = []
          let count = key
          for (let i = 0; i < paths.length; i += 1) {
            const path = paths[i]
            const vertexLength = path.absoluteCommands.length

            // Test property
            if (count % 2 === 0) {
              path.updateAttributes({ stroke: '#0ff' })
            }

            // Test Attribute
            if (count % 3 === 0) {
              path.updateAttributes({
                strokeLinecap: 'square',
              })
            }

            // Test commands
            path.setCommands(path.absoluteCommands.slice(0, count))

            update.push(path)

            // check to display path
            count -= vertexLength
            if (count < 0) break
          }
          return update
        },
        loops: animation.originPaths.reduce(
          (acc, p) => acc + p.absoluteCommands.length,
          0
        ),
      })

      const expected: AnimateObject[] = [
        {
          key: 'p0',
          animates: [
            {
              attributeName: 'd',
              dur: '480ms',
              keyTimes: '0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1',
              repeatCount: 'indefinite',
              values:
                'M1 1;M1 1;M1 1 l1 1;M1 1 l1 1 c2 2 4 2 6 2;M1 1 l1 1 c2 2 4 2 6 2 z;M1 1 l1 1 c2 2 4 2 6 2 z;M1 1 l1 1 c2 2 4 2 6 2 z;M1 1 l1 1 c2 2 4 2 6 2 z;M1 1 l1 1 c2 2 4 2 6 2 z',
            },
            {
              attributeName: 'stroke',
              dur: '480ms',
              keyTimes: '0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1',
              repeatCount: 'indefinite',
              values: '#0ff;#00f;#0ff;#00f;#0ff;#00f;#0ff;#00f;#00f',
            },
            {
              attributeName: 'stroke-linecap',
              dur: '480ms',
              keyTimes: '0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1',
              repeatCount: 'indefinite',
              values:
                'square;round;round;square;round;round;square;round;round',
            },
          ],
        },
        {
          key: 'p1',
          animates: [
            {
              attributeName: 'd',
              dur: '480ms',
              keyTimes: '0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1',
              repeatCount: 'indefinite',
              values:
                'M2 2;M2 2;M2 2;M2 2;M2 2;M2 2;M2 2 l2 2;M2 2 l2 2 c0 0 4 0 8 0;M2 2 l2 2 c0 0 4 0 8 0 z',
            },
            {
              attributeName: 'stroke',
              dur: '480ms',
              keyTimes: '0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1',
              repeatCount: 'indefinite',
              values: '#f0f;#f0f;#f0f;#f0f;#0ff;#f0f;#0ff;#f0f;#f0f',
            },
            {
              attributeName: 'stroke-linecap',
              dur: '480ms',
              keyTimes: '0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1',
              repeatCount: 'indefinite',
              values: 'butt;butt;butt;butt;square;butt;butt;square;butt',
            },
          ],
        },
      ]

      expect(animation.toJson()).toStrictEqual(expected)
    })

    it('Return empty array when setup methods is not executed', () => {
      const animation = new Animation().initialize(generateMockPaths())

      expect(animation.toJson()).toStrictEqual([])
    })
  })
})
