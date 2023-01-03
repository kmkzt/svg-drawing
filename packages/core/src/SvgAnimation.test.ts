import { parseSVGString } from './parser'
import { SvgAnimation } from './SvgAnimation'
import type { PathClass } from './types'

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
      expect(generateAnimation()).toMatchInlineSnapshot(`
        SvgAnimation {
          "animation": Animation {
            "_frame": null,
            "ms": 60,
            "paths": Array [],
          },
          "svg": Svg {
            "background": undefined,
            "elements": Array [
              Path {
                "attrs": Object {
                  "fill": "#f00",
                  "stroke": "#00f",
                  "strokeLinecap": "round",
                  "strokeWidth": "4",
                },
                "commands": Array [
                  Move {
                    "points": Array [
                      Point {
                        "_x": 1,
                        "_y": 1,
                      },
                    ],
                    "type": "M",
                  },
                  RelativeLine {
                    "points": Array [
                      Point {
                        "_x": 1,
                        "_y": 1,
                      },
                    ],
                    "type": "l",
                  },
                  RelativeCurve {
                    "points": Array [
                      Point {
                        "_x": 1,
                        "_y": 1,
                      },
                      Point {
                        "_x": 3,
                        "_y": 1,
                      },
                      Point {
                        "_x": 5,
                        "_y": 1,
                      },
                    ],
                    "type": "c",
                  },
                  Close {
                    "type": "z",
                  },
                ],
                "key": "p1",
              },
              Path {
                "attrs": Object {
                  "fill": "#ff0",
                  "stroke": "#f0f",
                  "strokeLinecap": "butt",
                  "strokeWidth": "2",
                },
                "commands": Array [
                  Move {
                    "points": Array [
                      Point {
                        "_x": 2,
                        "_y": 2,
                      },
                    ],
                    "type": "M",
                  },
                  RelativeLine {
                    "points": Array [
                      Point {
                        "_x": 2,
                        "_y": 2,
                      },
                    ],
                    "type": "l",
                  },
                  RelativeCurve {
                    "points": Array [
                      Point {
                        "_x": 2,
                        "_y": 2,
                      },
                      Point {
                        "_x": 6,
                        "_y": 2,
                      },
                      Point {
                        "_x": 10,
                        "_y": 2,
                      },
                    ],
                    "type": "c",
                  },
                  Close {
                    "type": "z",
                  },
                ],
                "key": "p2",
              },
            ],
            "height": 0,
            "width": 0,
          },
          "update": [Function],
        }
      `)
    })
    // TODO: Improve test pattern
    it('toElement', () => {
      const svg = generateAnimation()

      svg.animation.setup({
        animation: (paths, key) => {
          let count = key
          const update: PathClass[] = []
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
        loops: svg.animation.paths.reduce(
          (acc, p) => acc + p.absoluteCommands.length,
          0
        ),
      })
      svg.start()

      expect(svg.toElement()).toMatchInlineSnapshot(`
        <svg
          data-edit-type="frame"
          height="0"
          version="1.1"
          width="0"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <path
            d="M1 1 l1 1 c1 1 3 1 5 1 z"
            data-edit-type="path"
            data-element-key="p3"
            fill="#f00"
            stroke="#00f"
            stroke-linecap="round"
            stroke-width="4"
          />
          <path
            d="M2 2 l2 2 c2 2 6 2 10 2 z"
            data-edit-type="path"
            data-element-key="p4"
            fill="#ff0"
            stroke="#f0f"
            stroke-linecap="butt"
            stroke-width="2"
          />
        </svg>
      `)
    })

    it('setup, start, stop', async () => {
      const svg = generateAnimation()
      let loop = 0

      svg.animation.setup(
        {
          animation: (_paths, fid) => {
            loop += 1
            return []
          },
          loops: 3,
        },
        {
          ms: 300,
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
