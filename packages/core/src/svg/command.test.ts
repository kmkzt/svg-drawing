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
    expect(new Move(new Point(0, 0))).toMatchSnapshot()
  })
  it('point', () => {
    expect(new Move(new Point(0, 0)).point).toMatchSnapshot()
  })
  it('points', () => {
    expect(new Move(new Point(0, 0)).points).toMatchSnapshot()
  })
  it('values', () => {
    expect(new Move(new Point(0, 0)).points).toMatchSnapshot()
  })
  it('toString', () => {
    expect(new Move(new Point(0, 0)).toString()).toBe('M0 0')
  })
  it('clone', () => {
    const cmd = new Move(new Point(1, 1))
    const clone = cmd.clone()
    clone.points[0] = new Point(2, 2)
    expect(cmd.toString()).toBe('M1 1')
    expect(clone.toString()).toBe('M2 2')
  })
  it('scale', () => {
    expect(new Move(new Point(1, 1)).scale(2).toString()).toBe('M2 2')
  })
  it('scaleX', () => {
    expect(new Move(new Point(1, 1)).scaleX(2).toString()).toBe('M2 1')
  })
  it('scaleY', () => {
    expect(new Move(new Point(1, 1)).scaleY(2).toString()).toBe('M1 2')
  })
  it('translate', () => {
    const move = new Move(new Point(1, 1))
    move.translate({ x: 1, y: 1 })

    expect(move.toString()).toBe('M2 2')
  })
})

describe('Line', () => {
  it('new Line()', () => {
    expect(new Line(new Point(0, 0))).toMatchSnapshot()
  })
  it('point', () => {
    expect(new Line(new Point(0, 0)).point).toMatchSnapshot()
  })
  it('points', () => {
    expect(new Line(new Point(0, 0)).points).toMatchSnapshot()
  })
  it('values', () => {
    expect(new Line(new Point(0, 0)).values).toMatchSnapshot()
  })
  it('toString', () => {
    expect(new Line(new Point(0, 0)).toString()).toBe('L0 0')
  })
  it('clone', () => {
    const cmd = new Line(new Point(1, 1))
    const clone = cmd.clone()
    clone.points[0] = new Point(2, 2)
    expect(cmd.toString()).toBe('L1 1')
    expect(clone.toString()).toBe('L2 2')
  })
  it('scale', () => {
    expect(new Line(new Point(1, 1)).scale(2).toString()).toBe('L2 2')
  })
  it('scaleX', () => {
    expect(new Line(new Point(1, 1)).scaleX(2).toString()).toBe('L2 1')
  })
  it('scaleY', () => {
    expect(new Line(new Point(1, 1)).scaleY(2).toString()).toBe('L1 2')
  })
  it('translate', () => {
    const line = new Line(new Point(1, 1))
    line.translate({ x: 1, y: 1 })
    expect(line.toString()).toBe('L2 2')
  })
})

describe('Curve', () => {
  it('new Curve()', () => {
    expect(
      new Curve([new Point(0.25, 0.25), new Point(0.75, 0.25), new Point(1, 1)])
    ).toMatchSnapshot()
  })
  it('point', () => {
    expect(
      new Curve([new Point(0.25, 0.25), new Point(0.75, 0.25), new Point(1, 1)])
        .point
    ).toMatchSnapshot()
  })
  it.todo('points', () => {
    expect(
      new Curve([new Point(0.25, 0.25), new Point(0.75, 0.25), new Point(1, 1)])
        .points
    ).toMatchSnapshot()
  })
  it('values', () => {
    expect(
      new Curve([new Point(0.25, 0.25), new Point(0.75, 0.25), new Point(1, 1)])
        .values
    ).toMatchSnapshot()
  })
  it('toString', () => {
    expect(
      new Curve([
        new Point(0.25, 0.25),
        new Point(0.75, 0.25),
        new Point(1, 1),
      ]).toString()
    ).toBe('C0.25 0.25 0.75 0.25 1 1')
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
    ).toBe('C0.5 0.5 1.5 0.5 2 2')
  })
  it('scaleX', () => {
    expect(
      new Curve([new Point(0.25, 0.25), new Point(0.75, 0.25), new Point(1, 1)])
        .scaleX(2)
        .toString()
    ).toBe('C0.5 0.25 1.5 0.25 2 1')
  })
  it('scaleY', () => {
    expect(
      new Curve([new Point(0.25, 0.25), new Point(0.75, 0.25), new Point(1, 1)])
        .scaleY(2)
        .toString()
    ).toBe('C0.25 0.5 0.75 0.5 1 2')
  })
  it.todo('translate', () => {
    const curve = new Curve([
      new Point(0.25, 0.25),
      new Point(0.75, 0.25),
      new Point(1, 1),
    ])
    curve.translate({ x: 1, y: 1 })

    expect(curve.toString()).toBe('C1.25 1.5 1.75 1.5 2 3')
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
    expect(new RelativeMove(new Point(0, 0))).toMatchSnapshot()
  })
  it('point', () => {
    expect(new RelativeMove(new Point(0, 0)).point).toMatchSnapshot()
  })
  it('points', () => {
    expect(new RelativeMove(new Point(0, 0)).points).toMatchSnapshot()
  })
  it('values', () => {
    expect(new RelativeMove(new Point(0, 0)).points).toMatchSnapshot()
  })
  it('toString', () => {
    expect(new RelativeMove(new Point(0, 0)).toString()).toBe('m0 0')
  })
  it('clone', () => {
    const cmd = new RelativeMove(new Point(1, 1))
    const clone = cmd.clone()
    clone.points[0] = new Point(2, 2)
    expect(cmd.toString()).toBe('m1 1')
    expect(clone.toString()).toBe('m2 2')
  })
  it('scale', () => {
    expect(new RelativeMove(new Point(1, 1)).scale(2).toString()).toBe('m2 2')
  })
  it('scaleX', () => {
    expect(new RelativeMove(new Point(1, 1)).scaleX(2).toString()).toBe('m2 1')
  })
  it('scaleY', () => {
    expect(new RelativeMove(new Point(1, 1)).scaleY(2).toString()).toBe('m1 2')
  })
  it.todo('translate', () => {
    const move = new RelativeMove(new Point(1, 1))
    move.translate({ x: 1, y: 1 })

    expect(move.toString()).toBe('m2 2')
  })
})

describe('RelativeLine', () => {
  it('new RelativeLine()', () => {
    expect(new RelativeLine(new Point(0, 0))).toMatchSnapshot()
  })
  it('point', () => {
    expect(new RelativeLine(new Point(0, 0)).point).toMatchSnapshot()
  })
  it('points', () => {
    expect(new RelativeLine(new Point(0, 0)).points).toMatchSnapshot()
  })
  it('values', () => {
    expect(new RelativeLine(new Point(0, 0)).points).toMatchSnapshot()
  })
  it('toString', () => {
    expect(new RelativeLine(new Point(0, 0)).toString()).toBe('l0 0')
  })
  it('clone', () => {
    const cmd = new RelativeLine(new Point(1, 1))
    const clone = cmd.clone()
    clone.points[0] = new Point(2, 2)
    expect(cmd.toString()).toBe('l1 1')
    expect(clone.toString()).toBe('l2 2')
  })
  it('scale', () => {
    expect(new RelativeLine(new Point(1, 1)).scale(2).toString()).toBe('l2 2')
  })
  it('scaleX', () => {
    expect(new RelativeLine(new Point(1, 1)).scaleX(2).toString()).toBe('l2 1')
  })
  it('scaleY', () => {
    expect(new RelativeLine(new Point(1, 1)).scaleY(2).toString()).toBe('l1 2')
  })
  it.todo('translate', () => {
    const move = new RelativeLine(new Point(1, 1))
    move.translate({ x: 1, y: 1 })

    expect(move.toString()).toBe('l2 2')
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
    ).toMatchSnapshot()
  })
  it('point', () => {
    expect(
      new RelativeCurve([
        new Point(0.25, 0.25),
        new Point(0.75, 0.25),
        new Point(1, 1),
      ]).point
    ).toMatchSnapshot()
  })
  it('points', () => {
    expect(
      new RelativeCurve([
        new Point(0.25, 0.25),
        new Point(0.75, 0.25),
        new Point(1, 1),
      ]).points
    ).toMatchSnapshot()
  })
  it('values', () => {
    expect(
      new RelativeCurve([
        new Point(0.25, 0.25),
        new Point(0.75, 0.25),
        new Point(1, 1),
      ]).values
    ).toMatchSnapshot()
  })
  it('toString', () => {
    expect(
      new RelativeCurve([
        new Point(0.25, 0.25),
        new Point(0.75, 0.25),
        new Point(1, 1),
      ]).toString()
    ).toBe('c0.25 0.25 0.75 0.25 1 1')
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
    ).toBe('c0.5 0.5 1.5 0.5 2 2')
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
    ).toBe('c0.5 0.25 1.5 0.25 2 1')
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
    ).toBe('c0.25 0.5 0.75 0.5 1 2')
  })
  it.todo('translate', () => {
    const curve = new RelativeCurve([
      new Point(0.25, 0.25),
      new Point(0.75, 0.25),
      new Point(1, 1),
    ])
    curve.translate({ x: 1, y: 1 })

    expect(curve.toString()).toBe('c1.25 1.5 1.75 1.5 2 3')
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
