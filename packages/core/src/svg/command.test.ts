import { createCommand } from './command'
import { Point } from './point'

describe('createCommand', () => {
  describe('Move `M`', () => {
    it('create command', () => {
      expect(createCommand({ type: 'M', values: [0, 0] }))
        .toMatchInlineSnapshot(`
        Move {
          "points": Array [
            Point {
              "_x": 0,
              "_y": 0,
            },
          ],
          "type": "M",
        }
      `)
    })
    it('point', () => {
      expect(createCommand({ type: 'M', values: [0, 0] }).point)
        .toMatchInlineSnapshot(`
        Point {
          "_x": 0,
          "_y": 0,
        }
      `)
    })
    it('points', () => {
      expect(createCommand({ type: 'M', values: [0, 0] }).points)
        .toMatchInlineSnapshot(`
        Array [
          Point {
            "_x": 0,
            "_y": 0,
          },
        ]
      `)
    })
    it('values', () => {
      expect(createCommand({ type: 'M', values: [0, 0] }).points)
        .toMatchInlineSnapshot(`
        Array [
          Point {
            "_x": 0,
            "_y": 0,
          },
        ]
      `)
    })
    it('toString', () => {
      expect(
        createCommand({ type: 'M', values: [0, 0] }).toString()
      ).toMatchInlineSnapshot(`"M0 0"`)
    })
    it('clone', () => {
      const cmd = createCommand({ type: 'M', values: [1, 1] })
      const clone = cmd.clone()
      clone.points = [new Point(2, 2)]
      expect(cmd.toString()).toMatchInlineSnapshot(`"M1 1"`)
      expect(clone.toString()).toMatchInlineSnapshot(`"M2 2"`)
    })
    it('scale', () => {
      expect(
        createCommand({ type: 'M', values: [1, 1] })
          .scale(2)
          .toString()
      ).toMatchInlineSnapshot(`"M2 2"`)
    })
    it('scaleX', () => {
      expect(
        createCommand({ type: 'M', values: [1, 1] })
          .scaleX(2)
          .toString()
      ).toMatchInlineSnapshot(`"M2 1"`)
    })
    it('scaleY', () => {
      expect(
        createCommand({ type: 'M', values: [1, 1] })
          .scaleY(2)
          .toString()
      ).toMatchInlineSnapshot(`"M1 2"`)
    })
    it('translate', () => {
      const move = createCommand({ type: 'M', values: [1, 1] }).translate({
        x: 1,
        y: 1,
      })

      expect(move.toString()).toMatchInlineSnapshot(`"M2 2"`)
    })
  })

  describe('Line `L`', () => {
    it('create command', () => {
      expect(createCommand({ type: 'L', values: [0, 0] }))
        .toMatchInlineSnapshot(`
        Line {
          "points": Array [
            Point {
              "_x": 0,
              "_y": 0,
            },
          ],
          "type": "L",
        }
      `)
    })
    it('point', () => {
      expect(createCommand({ type: 'L', values: [0, 0] }).point)
        .toMatchInlineSnapshot(`
        Point {
          "_x": 0,
          "_y": 0,
        }
      `)
    })
    it('points', () => {
      expect(createCommand({ type: 'L', values: [0, 0] }).points)
        .toMatchInlineSnapshot(`
        Array [
          Point {
            "_x": 0,
            "_y": 0,
          },
        ]
      `)
    })
    it('values', () => {
      expect(createCommand({ type: 'L', values: [0, 0] }).values)
        .toMatchInlineSnapshot(`
        Array [
          0,
          0,
        ]
      `)
    })
    it('toString', () => {
      expect(
        createCommand({ type: 'L', values: [0, 0] }).toString()
      ).toMatchInlineSnapshot(`"L0 0"`)
    })
    it('clone', () => {
      const cmd = createCommand({ type: 'L', values: [1, 1] })
      const clone = cmd.clone()
      clone.points[0] = new Point(2, 2)
      expect(cmd.toString()).toMatchInlineSnapshot(`"L1 1"`)
      expect(clone.toString()).toMatchInlineSnapshot(`"L2 2"`)
    })
    it('scale', () => {
      expect(
        createCommand({ type: 'L', values: [1, 1] })
          .scale(2)
          .toString()
      ).toMatchInlineSnapshot(`"L2 2"`)
    })
    it('scaleX', () => {
      expect(
        createCommand({ type: 'L', values: [1, 1] })
          .scaleX(2)
          .toString()
      ).toMatchInlineSnapshot(`"L2 1"`)
    })
    it('scaleY', () => {
      expect(
        createCommand({ type: 'L', values: [1, 1] })
          .scaleY(2)
          .toString()
      ).toMatchInlineSnapshot(`"L1 2"`)
    })
    it('translate', () => {
      const line = createCommand({ type: 'L', values: [1, 1] }).translate({
        x: 1,
        y: 1,
      })
      expect(line.toString()).toMatchInlineSnapshot(`"L2 2"`)
    })
  })

  describe('Curve `C`', () => {
    it('create command', () => {
      expect(
        createCommand({
          type: 'C',
          values: [0.25, 0.25, 0.75, 0.25, 1, 1],
        })
      ).toMatchInlineSnapshot(`
        Curve {
          "points": Array [
            Point {
              "_x": 0.25,
              "_y": 0.25,
            },
            Point {
              "_x": 0.75,
              "_y": 0.25,
            },
            Point {
              "_x": 1,
              "_y": 1,
            },
          ],
          "type": "C",
        }
      `)
    })
    it('point', () => {
      expect(
        createCommand({
          type: 'C',
          values: [0.25, 0.25, 0.75, 0.25, 1, 1],
        }).point
      ).toMatchInlineSnapshot(`
        Point {
          "_x": 1,
          "_y": 1,
        }
      `)
    })
    it('points', () => {
      expect(
        createCommand({
          type: 'C',
          values: [0.25, 0.25, 0.75, 0.25, 1, 1],
        }).points
      ).toMatchInlineSnapshot(`
        Array [
          Point {
            "_x": 0.25,
            "_y": 0.25,
          },
          Point {
            "_x": 0.75,
            "_y": 0.25,
          },
          Point {
            "_x": 1,
            "_y": 1,
          },
        ]
      `)
    })
    it('values', () => {
      expect(
        createCommand({
          type: 'C',
          values: [0.25, 0.25, 0.75, 0.25, 1, 1],
        }).values
      ).toMatchInlineSnapshot(`
        Array [
          0.25,
          0.25,
          0.75,
          0.25,
          1,
          1,
        ]
      `)
    })
    it('toString', () => {
      expect(
        createCommand({
          type: 'C',
          values: [0.25, 0.25, 0.75, 0.25, 1, 1],
        }).toString()
      ).toMatchInlineSnapshot(`"C0.25 0.25 0.75 0.25 1 1"`)
    })
    it('clone', () => {
      const cmd = createCommand({
        type: 'C',
        values: [0.25, 0.25, 0.75, 0.25, 1, 1],
      })
      const clone = cmd.clone()
      clone.points[2] = new Point(1.5, 1)
      expect(cmd.point.x).toBe(1)
      expect(clone.point.x).toBe(1.5)
    })
    it('scale', () => {
      expect(
        createCommand({
          type: 'C',
          values: [0.25, 0.25, 0.75, 0.25, 1, 1],
        })
          .scale(2)
          .toString()
      ).toMatchInlineSnapshot(`"C0.5 0.5 1.5 0.5 2 2"`)
    })
    it('scaleX', () => {
      expect(
        createCommand({
          type: 'C',
          values: [0.25, 0.25, 0.75, 0.25, 1, 1],
        })
          .scaleX(2)
          .toString()
      ).toMatchInlineSnapshot(`"C0.5 0.25 1.5 0.25 2 1"`)
    })
    it('scaleY', () => {
      expect(
        createCommand({
          type: 'C',
          values: [0.25, 0.25, 0.75, 0.25, 1, 1],
        })
          .scaleY(2)
          .toString()
      ).toMatchInlineSnapshot(`"C0.25 0.5 0.75 0.5 1 2"`)
    })
    it('translate', () => {
      expect(
        createCommand({
          type: 'C',
          values: [0.25, 0.5, 0.75, 0.5, 1, 2],
        })
          .translate({ x: 1, y: 1 })
          .toString()
      ).toMatchInlineSnapshot(`"C1.25 1.5 1.75 1.5 2 3"`)
    })
  })

  describe('ArcCurve `A`', () => {
    it.todo('create command')
    it.todo('point')
    it.todo('points')
    it.todo('values')
    it.todo('clone')
    it.todo('scale')
    it.todo('scaleX')
    it.todo('scaleY')
    it.todo('translate')
  })

  describe('Horizonal `H`', () => {
    it.todo('create command')
    it.todo('point')
    it.todo('points')
    it.todo('values')
    it.todo('clone')
    it.todo('scale')
    it.todo('scaleX')
    it.todo('scaleY')
    it.todo('translate')
  })

  describe('Vertical `V`', () => {
    it.todo('create command')
    it.todo('point')
    it.todo('points')
    it.todo('values')
    it.todo('clone')
    it.todo('scale')
    it.todo('scaleX')
    it.todo('scaleY')
    it.todo('translate')
  })

  describe('RelativeMove `m`', () => {
    it('create command', () => {
      expect(createCommand({ type: 'm', values: [0, 0] }))
        .toMatchInlineSnapshot(`
        RelativeMove {
          "points": Array [
            Point {
              "_x": 0,
              "_y": 0,
            },
          ],
          "relative": false,
          "type": "m",
        }
      `)
    })
    it('point', () => {
      expect(createCommand({ type: 'm', values: [0, 0] }).point)
        .toMatchInlineSnapshot(`
        Point {
          "_x": 0,
          "_y": 0,
        }
      `)
    })
    it('points', () => {
      expect(createCommand({ type: 'm', values: [0, 0] }).points)
        .toMatchInlineSnapshot(`
        Array [
          Point {
            "_x": 0,
            "_y": 0,
          },
        ]
      `)
    })
    it('values', () => {
      expect(createCommand({ type: 'm', values: [0, 0] }).points)
        .toMatchInlineSnapshot(`
        Array [
          Point {
            "_x": 0,
            "_y": 0,
          },
        ]
      `)
    })
    it('toString', () => {
      expect(createCommand({ type: 'm', values: [0, 0] }).toString()).toBe(
        'm0 0'
      )
    })
    it('clone', () => {
      const cmd = createCommand({ type: 'm', values: [1, 1] })
      const clone = cmd.clone()
      clone.points[0] = new Point(2, 2)
      expect(cmd.toString()).toMatchInlineSnapshot(`"m1 1"`)
      expect(clone.toString()).toMatchInlineSnapshot(`"m2 2"`)
    })
    it('scale', () => {
      expect(
        createCommand({ type: 'm', values: [1, 1] })
          .scale(2)
          .toString()
      ).toMatchInlineSnapshot(`"m2 2"`)
    })
    it('scaleX', () => {
      expect(
        createCommand({ type: 'm', values: [1, 1] })
          .scaleX(2)
          .toString()
      ).toMatchInlineSnapshot(`"m2 1"`)
    })
    it('scaleY', () => {
      expect(
        createCommand({ type: 'm', values: [1, 1] })
          .scaleY(2)
          .toString()
      ).toMatchInlineSnapshot(`"m1 2"`)
    })
    it('translate', () => {
      const move = createCommand({ type: 'm', values: [1, 1] }).translate({
        x: 1,
        y: 1,
      })

      expect(move.toString()).toMatchInlineSnapshot(`"m2 2"`)
    })
  })

  describe('RelativeLine `l`', () => {
    it('create command', () => {
      expect(createCommand({ type: 'l', values: [0, 0] }))
        .toMatchInlineSnapshot(`
        RelativeLine {
          "points": Array [
            Point {
              "_x": 0,
              "_y": 0,
            },
          ],
          "type": "l",
        }
      `)
    })
    it('point', () => {
      expect(createCommand({ type: 'l', values: [0, 0] }).point)
        .toMatchInlineSnapshot(`
        Point {
          "_x": 0,
          "_y": 0,
        }
      `)
    })
    it('points', () => {
      expect(createCommand({ type: 'l', values: [0, 0] }).points)
        .toMatchInlineSnapshot(`
        Array [
          Point {
            "_x": 0,
            "_y": 0,
          },
        ]
      `)
    })
    it('values', () => {
      expect(createCommand({ type: 'l', values: [0, 0] }).points)
        .toMatchInlineSnapshot(`
        Array [
          Point {
            "_x": 0,
            "_y": 0,
          },
        ]
      `)
    })
    it('toString', () => {
      expect(
        createCommand({ type: 'l', values: [0, 0] }).toString()
      ).toMatchInlineSnapshot(`"l0 0"`)
    })
    it('clone', () => {
      const cmd = createCommand({ type: 'l', values: [1, 1] })
      const clone = cmd.clone()
      clone.points[0] = new Point(2, 2)
      expect(cmd.toString()).toMatchInlineSnapshot(`"l1 1"`)
      expect(clone.toString()).toMatchInlineSnapshot(`"l2 2"`)
    })
    it('scale', () => {
      expect(
        createCommand({ type: 'l', values: [1, 1] })
          .scale(2)
          .toString()
      ).toMatchInlineSnapshot(`"l2 2"`)
    })
    it('scaleX', () => {
      expect(
        createCommand({ type: 'l', values: [1, 1] })
          .scaleX(2)
          .toString()
      ).toMatchInlineSnapshot(`"l2 1"`)
    })
    it('scaleY', () => {
      expect(
        createCommand({ type: 'l', values: [1, 1] })
          .scaleY(2)
          .toString()
      ).toMatchInlineSnapshot(`"l1 2"`)
    })
    it('translate', () => {
      const move = createCommand({ type: 'l', values: [1, 1] }).translate({
        x: 1,
        y: 1,
      })

      expect(move.toString()).toMatchInlineSnapshot(`"l2 2"`)
    })
  })

  describe('RelativeCurve', () => {
    it('new RelativeCurve()', () => {
      expect(
        createCommand({ type: 'c', values: [0.25, 0.25, 0.75, 0.25, 1, 1] })
      ).toMatchInlineSnapshot(`
        RelativeCurve {
          "points": Array [
            Point {
              "_x": 0.25,
              "_y": 0.25,
            },
            Point {
              "_x": 0.75,
              "_y": 0.25,
            },
            Point {
              "_x": 1,
              "_y": 1,
            },
          ],
          "type": "c",
        }
      `)
    })
    it('point', () => {
      expect(
        createCommand({ type: 'c', values: [0.25, 0.25, 0.75, 0.25, 1, 1] })
          .point
      ).toMatchInlineSnapshot(`
        Point {
          "_x": 1,
          "_y": 1,
        }
      `)
    })
    it('points', () => {
      expect(
        createCommand({ type: 'c', values: [0.25, 0.25, 0.75, 0.25, 1, 1] })
          .points
      ).toMatchInlineSnapshot(`
        Array [
          Point {
            "_x": 0.25,
            "_y": 0.25,
          },
          Point {
            "_x": 0.75,
            "_y": 0.25,
          },
          Point {
            "_x": 1,
            "_y": 1,
          },
        ]
      `)
    })
    it('values', () => {
      expect(
        createCommand({ type: 'c', values: [0.25, 0.25, 0.75, 0.25, 1, 1] })
          .values
      ).toMatchInlineSnapshot(`
        Array [
          0.25,
          0.25,
          0.75,
          0.25,
          1,
          1,
        ]
      `)
    })
    it('toString', () => {
      expect(
        createCommand({
          type: 'c',
          values: [0.25, 0.25, 0.75, 0.25, 1, 1],
        }).toString()
      ).toMatchInlineSnapshot(`"c0.25 0.25 0.75 0.25 1 1"`)
    })
    it('clone', () => {
      const cmd = createCommand({
        type: 'c',
        values: [0.25, 0.25, 0.75, 0.25, 1, 1],
      })

      const clone = cmd.clone()
      clone.points[2] = new Point(1.5, 1)
      expect(cmd.point.x).toBe(1)
      expect(clone.point.x).toBe(1.5)
    })
    it('scale', () => {
      expect(
        createCommand({ type: 'c', values: [0.25, 0.25, 0.75, 0.25, 1, 1] })
          .scale(2)
          .toString()
      ).toMatchInlineSnapshot(`"c0.5 0.5 1.5 0.5 2 2"`)
    })
    it('scaleX', () => {
      expect(
        createCommand({ type: 'c', values: [0.25, 0.25, 0.75, 0.25, 1, 1] })
          .scaleX(2)
          .toString()
      ).toMatchInlineSnapshot(`"c0.5 0.25 1.5 0.25 2 1"`)
    })
    it('scaleY', () => {
      expect(
        createCommand({ type: 'c', values: [0.25, 0.25, 0.75, 0.25, 1, 1] })
          .scaleY(2)
          .toString()
      ).toMatchInlineSnapshot(`"c0.25 0.5 0.75 0.5 1 2"`)
    })
    it('translate', () => {
      const curve = createCommand({
        type: 'c',
        values: [0.25, 0.5, 0.75, 0.5, 1, 2],
      }).translate({ x: 1, y: 1 })

      expect(curve.toString()).toMatchInlineSnapshot(`"c1.25 1.5 1.75 1.5 2 3"`)
    })
  })

  describe('RelativeShortcutCurve `s`', () => {
    it.todo('create command')
    it.todo('point')
    it.todo('points')
    it.todo('values')
    it.todo('clone')
    it.todo('scale')
    it.todo('scaleX')
    it.todo('scaleY')
    it.todo('translate')
  })

  describe('RelativeQuadraticCurve `q`', () => {
    it.todo('create command')
    it.todo('point')
    it.todo('points')
    it.todo('values')
    it.todo('clone')
    it.todo('scale')
    it.todo('scaleX')
    it.todo('scaleY')
    it.todo('translate')
  })

  describe('RelativeArcCurve `a`', () => {
    it.todo('create command')
    it.todo('point')
    it.todo('points')
    it.todo('values')
    it.todo('clone')
    it.todo('scale')
    it.todo('scaleX')
    it.todo('scaleY')
    it.todo('translate')
  })

  describe('RelativeHorizonal `h`', () => {
    it.todo('create command')
    it.todo('point')
    it.todo('points')
    it.todo('values')
    it.todo('clone')
    it.todo('scale')
    it.todo('scaleX')
    it.todo('scaleY')
    it.todo('translate')
  })

  describe('RelativeVertical `v`', () => {
    it.todo('create command')
    it.todo('point')
    it.todo('points')
    it.todo('values')
    it.todo('clone')
    it.todo('scale')
    it.todo('scaleX')
    it.todo('scaleY')
    it.todo('translate')
  })

  describe('Close `z` `Z`', () => {
    it.todo('create command')
    it.todo('point')
    it.todo('points')
    it.todo('values')
    it.todo('clone')
    it.todo('scale')
    it.todo('scaleX')
    it.todo('scaleY')
    it.todo('translate')
  })
})
