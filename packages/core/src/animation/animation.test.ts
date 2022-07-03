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
    expect(init()).toMatchInlineSnapshot(`
      Animation {
        "_frame": null,
        "generator": Object {},
        "ms": 60,
        "paths": Array [
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
                    "_x": 2,
                    "_y": 2,
                  },
                  Point {
                    "_x": 4,
                    "_y": 2,
                  },
                  Point {
                    "_x": 6,
                    "_y": 2,
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
                    "_x": 0,
                    "_y": 0,
                  },
                  Point {
                    "_x": 4,
                    "_y": 0,
                  },
                  Point {
                    "_x": 8,
                    "_y": 0,
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
      }
    `)
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
          const path = paths[i]
          const vertexLength = path.absoluteCommands.length

          // Test property
          if (count % 2 === 0) {
            path.updateAttributes({ stroke: '#0ff' })
          }

          // Test Attribute
          if (count % 3 === 0) {
            path.updateAttributes({
              strokeLinecap: 'mitter',
            })
          }

          // Test commands
          path.updateCommands(path.absoluteCommands.slice(0, count))

          update.push(path)

          // check to display path
          count -= vertexLength
          if (count < 0) break
        }
        return update
      },
      loops: anim.paths.reduce((acc, p) => acc + p.absoluteCommands.length, 0),
    })

    expect(anim.toJson()).toMatchInlineSnapshot(`
      Object {
        "p5": Array [
          Object {
            "attributes": Object {
              "attributeName": "d",
              "dur": "480ms",
              "keyTimes": "0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1",
              "repeatCount": "indefinite",
              "values": "M1 1;M1 1;M1 1 l1 1;M1 1 l1 1 c2 2 4 2 6 2;M1 1 l1 1 c2 2 4 2 6 2 z;M1 1 l1 1 c2 2 4 2 6 2 z;M1 1 l1 1 c2 2 4 2 6 2 z;M1 1 l1 1 c2 2 4 2 6 2 z;M1 1 l1 1 c2 2 4 2 6 2 z",
            },
            "type": "animate",
          },
          Object {
            "attributes": Object {
              "attributeName": "stroke",
              "dur": "480ms",
              "keyTimes": "0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1",
              "repeatCount": "indefinite",
              "values": "#0ff;#00f;#0ff;#00f;#0ff;#00f;#0ff;#00f;#00f",
            },
            "type": "animate",
          },
          Object {
            "attributes": Object {
              "attributeName": "stroke-linecap",
              "dur": "480ms",
              "keyTimes": "0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1",
              "repeatCount": "indefinite",
              "values": "mitter;round;round;mitter;round;round;mitter;round;round",
            },
            "type": "animate",
          },
        ],
        "p6": Array [
          Object {
            "attributes": Object {
              "attributeName": "d",
              "dur": "480ms",
              "keyTimes": "0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1",
              "repeatCount": "indefinite",
              "values": "M2 2;M2 2;M2 2;M2 2;M2 2;M2 2;M2 2 l2 2;M2 2 l2 2 c0 0 4 0 8 0;M2 2 l2 2 c0 0 4 0 8 0 z",
            },
            "type": "animate",
          },
          Object {
            "attributes": Object {
              "attributeName": "stroke",
              "dur": "480ms",
              "keyTimes": "0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1",
              "repeatCount": "indefinite",
              "values": "#f0f;#f0f;#f0f;#f0f;#0ff;#f0f;#0ff;#f0f;#f0f",
            },
            "type": "animate",
          },
          Object {
            "attributes": Object {
              "attributeName": "stroke-linecap",
              "dur": "480ms",
              "keyTimes": "0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1",
              "repeatCount": "indefinite",
              "values": "butt;butt;butt;butt;mitter;butt;butt;mitter;butt",
            },
            "type": "animate",
          },
        ],
      }
    `)
  })
})