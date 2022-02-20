import {
  Curve,
  Line,
  Move,
  RelativeMove,
  RelativeLine,
  RelativeCurve,
} from './command'
import { Point } from './point'

describe('Move', () => {
  it('new Move()', () => {
    expect(new Move(new Point(0, 0))).toMatchInlineSnapshot(`
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
    expect(new Move(new Point(0, 0)).point).toMatchInlineSnapshot(`
      Point {
        "_x": 0,
        "_y": 0,
      }
    `)
  })
  it('points', () => {
    expect(new Move(new Point(0, 0)).points).toMatchInlineSnapshot(`
      Array [
        Point {
          "_x": 0,
          "_y": 0,
        },
      ]
    `)
  })
  it('values', () => {
    expect(new Move(new Point(0, 0)).points).toMatchInlineSnapshot(`
      Array [
        Point {
          "_x": 0,
          "_y": 0,
        },
      ]
    `)
  })
  it('toString', () => {
    expect(new Move(new Point(0, 0)).toString()).toMatchInlineSnapshot(`"M0 0"`)
  })
  it('clone', () => {
    const cmd = new Move(new Point(1, 1))
    const clone = cmd.clone()
    clone.points[0] = new Point(2, 2)
    expect(cmd.toString()).toMatchInlineSnapshot(`"M1 1"`)
    expect(clone.toString()).toMatchInlineSnapshot(`"M2 2"`)
  })
  it('scale', () => {
    expect(new Move(new Point(1, 1)).scale(2).toString()).toMatchInlineSnapshot(
      `"M2 2"`
    )
  })
  it('scaleX', () => {
    expect(
      new Move(new Point(1, 1)).scaleX(2).toString()
    ).toMatchInlineSnapshot(`"M2 1"`)
  })
  it('scaleY', () => {
    expect(
      new Move(new Point(1, 1)).scaleY(2).toString()
    ).toMatchInlineSnapshot(`"M1 2"`)
  })
  it('translate', () => {
    const move = new Move(new Point(1, 1)).translate({ x: 1, y: 1 })

    expect(move.toString()).toMatchInlineSnapshot(`"M2 2"`)
  })
})

describe('Line', () => {
  it('new Line()', () => {
    expect(new Line(new Point(0, 0))).toMatchInlineSnapshot(`
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
    expect(new Line(new Point(0, 0)).point).toMatchInlineSnapshot(`
      Point {
        "_x": 0,
        "_y": 0,
      }
    `)
  })
  it('points', () => {
    expect(new Line(new Point(0, 0)).points).toMatchInlineSnapshot(`
      Array [
        Point {
          "_x": 0,
          "_y": 0,
        },
      ]
    `)
  })
  it('values', () => {
    expect(new Line(new Point(0, 0)).values).toMatchInlineSnapshot(`
      Array [
        0,
        0,
      ]
    `)
  })
  it('toString', () => {
    expect(new Line(new Point(0, 0)).toString()).toMatchInlineSnapshot(`"L0 0"`)
  })
  it('clone', () => {
    const cmd = new Line(new Point(1, 1))
    const clone = cmd.clone()
    clone.points[0] = new Point(2, 2)
    expect(cmd.toString()).toMatchInlineSnapshot(`"L1 1"`)
    expect(clone.toString()).toMatchInlineSnapshot(`"L2 2"`)
  })
  it('scale', () => {
    expect(new Line(new Point(1, 1)).scale(2).toString()).toMatchInlineSnapshot(
      `"L2 2"`
    )
  })
  it('scaleX', () => {
    expect(
      new Line(new Point(1, 1)).scaleX(2).toString()
    ).toMatchInlineSnapshot(`"L2 1"`)
  })
  it('scaleY', () => {
    expect(
      new Line(new Point(1, 1)).scaleY(2).toString()
    ).toMatchInlineSnapshot(`"L1 2"`)
  })
  it('translate', () => {
    const line = new Line(new Point(1, 1)).translate({ x: 1, y: 1 })
    expect(line.toString()).toMatchInlineSnapshot(`"L2 2"`)
  })
})

describe('Curve', () => {
  it('new Curve()', () => {
    expect(
      new Curve([new Point(0.25, 0.25), new Point(0.75, 0.25), new Point(1, 1)])
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
      new Curve([new Point(0.25, 0.25), new Point(0.75, 0.25), new Point(1, 1)])
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
      new Curve([new Point(0.25, 0.25), new Point(0.75, 0.25), new Point(1, 1)])
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
      new Curve([new Point(0.25, 0.25), new Point(0.75, 0.25), new Point(1, 1)])
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
      new Curve([
        new Point(0.25, 0.25),
        new Point(0.75, 0.25),
        new Point(1, 1),
      ]).toString()
    ).toMatchInlineSnapshot(`"C0.25 0.25 0.75 0.25 1 1"`)
  })
  it('clone', () => {
    const cmd = new Curve([
      new Point(0.25, 0.25),
      new Point(0.75, 0.25),
      new Point(1, 1),
    ])
    const clone = cmd.clone()
    clone.points[2] = new Point(1.5, 1)
    expect(cmd.point.x).toBe(1)
    expect(clone.point.x).toBe(1.5)
  })
  it('scale', () => {
    expect(
      new Curve([new Point(0.25, 0.25), new Point(0.75, 0.25), new Point(1, 1)])
        .scale(2)
        .toString()
    ).toMatchInlineSnapshot(`"C0.5 0.5 1.5 0.5 2 2"`)
  })
  it('scaleX', () => {
    expect(
      new Curve([new Point(0.25, 0.25), new Point(0.75, 0.25), new Point(1, 1)])
        .scaleX(2)
        .toString()
    ).toMatchInlineSnapshot(`"C0.5 0.25 1.5 0.25 2 1"`)
  })
  it('scaleY', () => {
    expect(
      new Curve([new Point(0.25, 0.25), new Point(0.75, 0.25), new Point(1, 1)])
        .scaleY(2)
        .toString()
    ).toMatchInlineSnapshot(`"C0.25 0.5 0.75 0.5 1 2"`)
  })
  it('translate', () => {
    const curve = new Curve([
      new Point(0.25, 0.5),
      new Point(0.75, 0.5),
      new Point(1, 2),
    ]).translate({ x: 1, y: 1 })

    expect(curve.toString()).toMatchInlineSnapshot(`"C1.25 1.5 1.75 1.5 2 3"`)
  })
})

describe('ArcCurve', () => {
  it.todo('new ArcCurve()')
  it.todo('point')
  it.todo('points')
  it.todo('values')
  it.todo('clone')
  it.todo('scale')
  it.todo('scaleX')
  it.todo('scaleY')
  it.todo('translate')
})

describe('Horizonal', () => {
  it.todo('new Horizonal()')
  it.todo('point')
  it.todo('points')
  it.todo('values')
  it.todo('clone')
  it.todo('scale')
  it.todo('scaleX')
  it.todo('scaleY')
  it.todo('translate')
})

describe('Vertical', () => {
  it.todo('new Vertical()')
  it.todo('point')
  it.todo('points')
  it.todo('values')
  it.todo('clone')
  it.todo('scale')
  it.todo('scaleX')
  it.todo('scaleY')
  it.todo('translate')
})

describe('RelativeMove', () => {
  it('new RelativeMove()', () => {
    expect(new RelativeMove(new Point(0, 0))).toMatchInlineSnapshot(`
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
    expect(new RelativeMove(new Point(0, 0)).point).toMatchInlineSnapshot(`
      Point {
        "_x": 0,
        "_y": 0,
      }
    `)
  })
  it('points', () => {
    expect(new RelativeMove(new Point(0, 0)).points).toMatchInlineSnapshot(`
      Array [
        Point {
          "_x": 0,
          "_y": 0,
        },
      ]
    `)
  })
  it('values', () => {
    expect(new RelativeMove(new Point(0, 0)).points).toMatchInlineSnapshot(`
      Array [
        Point {
          "_x": 0,
          "_y": 0,
        },
      ]
    `)
  })
  it('toString', () => {
    expect(new RelativeMove(new Point(0, 0)).toString()).toBe('m0 0')
  })
  it('clone', () => {
    const cmd = new RelativeMove(new Point(1, 1))
    const clone = cmd.clone()
    clone.points[0] = new Point(2, 2)
    expect(cmd.toString()).toMatchInlineSnapshot(`"m1 1"`)
    expect(clone.toString()).toMatchInlineSnapshot(`"m2 2"`)
  })
  it('scale', () => {
    expect(
      new RelativeMove(new Point(1, 1)).scale(2).toString()
    ).toMatchInlineSnapshot(`"m2 2"`)
  })
  it('scaleX', () => {
    expect(
      new RelativeMove(new Point(1, 1)).scaleX(2).toString()
    ).toMatchInlineSnapshot(`"m2 1"`)
  })
  it('scaleY', () => {
    expect(
      new RelativeMove(new Point(1, 1)).scaleY(2).toString()
    ).toMatchInlineSnapshot(`"m1 2"`)
  })
  it('translate', () => {
    const move = new RelativeMove(new Point(1, 1)).translate({ x: 1, y: 1 })

    expect(move.toString()).toMatchInlineSnapshot(`"m2 2"`)
  })
})

describe('RelativeLine', () => {
  it('new RelativeLine()', () => {
    expect(new RelativeLine(new Point(0, 0))).toMatchInlineSnapshot(`
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
    expect(new RelativeLine(new Point(0, 0)).point).toMatchInlineSnapshot(`
      Point {
        "_x": 0,
        "_y": 0,
      }
    `)
  })
  it('points', () => {
    expect(new RelativeLine(new Point(0, 0)).points).toMatchInlineSnapshot(`
      Array [
        Point {
          "_x": 0,
          "_y": 0,
        },
      ]
    `)
  })
  it('values', () => {
    expect(new RelativeLine(new Point(0, 0)).points).toMatchInlineSnapshot(`
      Array [
        Point {
          "_x": 0,
          "_y": 0,
        },
      ]
    `)
  })
  it('toString', () => {
    expect(new RelativeLine(new Point(0, 0)).toString()).toMatchInlineSnapshot(
      `"l0 0"`
    )
  })
  it('clone', () => {
    const cmd = new RelativeLine(new Point(1, 1))
    const clone = cmd.clone()
    clone.points[0] = new Point(2, 2)
    expect(cmd.toString()).toMatchInlineSnapshot(`"l1 1"`)
    expect(clone.toString()).toMatchInlineSnapshot(`"l2 2"`)
  })
  it('scale', () => {
    expect(
      new RelativeLine(new Point(1, 1)).scale(2).toString()
    ).toMatchInlineSnapshot(`"l2 2"`)
  })
  it('scaleX', () => {
    expect(
      new RelativeLine(new Point(1, 1)).scaleX(2).toString()
    ).toMatchInlineSnapshot(`"l2 1"`)
  })
  it('scaleY', () => {
    expect(
      new RelativeLine(new Point(1, 1)).scaleY(2).toString()
    ).toMatchInlineSnapshot(`"l1 2"`)
  })
  it('translate', () => {
    const move = new RelativeLine(new Point(1, 1)).translate({ x: 1, y: 1 })

    expect(move.toString()).toMatchInlineSnapshot(`"l2 2"`)
  })
})

describe('RelativeCurve', () => {
  it('new RelativeCurve()', () => {
    expect(
      new RelativeCurve([
        new Point(0.25, 0.25),
        new Point(0.75, 0.25),
        new Point(1, 1),
      ])
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
      new RelativeCurve([
        new Point(0.25, 0.25),
        new Point(0.75, 0.25),
        new Point(1, 1),
      ]).point
    ).toMatchInlineSnapshot(`
      Point {
        "_x": 1,
        "_y": 1,
      }
    `)
  })
  it('points', () => {
    expect(
      new RelativeCurve([
        new Point(0.25, 0.25),
        new Point(0.75, 0.25),
        new Point(1, 1),
      ]).points
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
      new RelativeCurve([
        new Point(0.25, 0.25),
        new Point(0.75, 0.25),
        new Point(1, 1),
      ]).values
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
      new RelativeCurve([
        new Point(0.25, 0.25),
        new Point(0.75, 0.25),
        new Point(1, 1),
      ]).toString()
    ).toMatchInlineSnapshot(`"c0.25 0.25 0.75 0.25 1 1"`)
  })
  it('clone', () => {
    const cmd = new RelativeCurve([
      new Point(0.25, 0.25),
      new Point(0.75, 0.25),
      new Point(1, 1),
    ])
    const clone = cmd.clone()
    clone.points[2] = new Point(1.5, 1)
    expect(cmd.point.x).toBe(1)
    expect(clone.point.x).toBe(1.5)
  })
  it('scale', () => {
    expect(
      new RelativeCurve([
        new Point(0.25, 0.25),
        new Point(0.75, 0.25),
        new Point(1, 1),
      ])
        .scale(2)
        .toString()
    ).toMatchInlineSnapshot(`"c0.5 0.5 1.5 0.5 2 2"`)
  })
  it('scaleX', () => {
    expect(
      new RelativeCurve([
        new Point(0.25, 0.25),
        new Point(0.75, 0.25),
        new Point(1, 1),
      ])
        .scaleX(2)
        .toString()
    ).toMatchInlineSnapshot(`"c0.5 0.25 1.5 0.25 2 1"`)
  })
  it('scaleY', () => {
    expect(
      new RelativeCurve([
        new Point(0.25, 0.25),
        new Point(0.75, 0.25),
        new Point(1, 1),
      ])
        .scaleY(2)
        .toString()
    ).toMatchInlineSnapshot(`"c0.25 0.5 0.75 0.5 1 2"`)
  })
  it('translate', () => {
    const curve = new RelativeCurve([
      new Point(0.25, 0.5),
      new Point(0.75, 0.5),
      new Point(1, 2),
    ]).translate({ x: 1, y: 1 })

    expect(curve.toString()).toMatchInlineSnapshot(`"c1.25 1.5 1.75 1.5 2 3"`)
  })
})

describe('RelativeShortcutCurve', () => {
  it.todo('new RelativeShortcutCurve()')
  it.todo('point')
  it.todo('points')
  it.todo('values')
  it.todo('clone')
  it.todo('scale')
  it.todo('scaleX')
  it.todo('scaleY')
  it.todo('translate')
})

describe('RelativeQuadraticCurve', () => {
  it.todo('new RelativeQuadraticCurve()')
  it.todo('point')
  it.todo('points')
  it.todo('values')
  it.todo('clone')
  it.todo('scale')
  it.todo('scaleX')
  it.todo('scaleY')
  it.todo('translate')
})

describe('RelativeArcCurve', () => {
  it.todo('new RelativeArcCurve()')
  it.todo('point')
  it.todo('points')
  it.todo('values')
  it.todo('clone')
  it.todo('scale')
  it.todo('scaleX')
  it.todo('scaleY')
  it.todo('translate')
})

describe('RelativeHorizonal', () => {
  it.todo('new RelativeHorizonal()')
  it.todo('point')
  it.todo('points')
  it.todo('values')
  it.todo('clone')
  it.todo('scale')
  it.todo('scaleX')
  it.todo('scaleY')
  it.todo('translate')
})

describe('RelativeVertical', () => {
  it.todo('new RelativeVertical()')
  it.todo('point')
  it.todo('points')
  it.todo('values')
  it.todo('clone')
  it.todo('scale')
  it.todo('scaleX')
  it.todo('scaleY')
  it.todo('translate')
})

describe('Close', () => {
  it.todo('new Close()')
  it.todo('point')
  it.todo('points')
  it.todo('values')
  it.todo('clone')
  it.todo('scale')
  it.todo('scaleX')
  it.todo('scaleY')
  it.todo('translate')
})
