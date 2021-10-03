import { Curve, Line, Move } from './command'
import { Point } from './point'

describe('Move', () => {
  it('new Move()', () => {
    expect(new Move(new Point(0, 0)).toString()).toBe('M0 0')
  })
  it.todo('point')
  it.todo('points')
  it.todo('values')
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
  it.todo('translate')
  it.todo('toRelative')
})

describe('Line', () => {
  it('new Line()', () => {
    expect(new Line(new Point(0, 0)).toString()).toBe('L0 0')
  })
  it.todo('point')
  it.todo('points')
  it.todo('values')
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
  it.todo('translate')
  it.todo('toRelative')
})

describe('Curve', () => {
  it('new Curve()', () => {
    expect(
      new Curve([
        new Point(0.25, 0.25),
        new Point(0.75, 0.25),
        new Point(1, 1),
      ]).toString()
    ).toBe('C0.25 0.25 0.75 0.25 1 1')
  })
  it.todo('point')
  it.todo('points')
  it.todo('values')
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
  it.todo('translate')
  it.todo('toRelative')
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
  it.todo('toRelative')
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
  it.todo('toRelative')
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
  it.todo('toRelative')
})

describe('RelativeMove', () => {
  it.todo('new RelativeMove()')
  it.todo('point')
  it.todo('points')
  it.todo('values')
  it.todo('clone')
  it.todo('scale')
  it.todo('scaleX')
  it.todo('scaleY')
  it.todo('translate')
  it.todo('toAbsolute')
})

describe('RelativeLine', () => {
  it.todo('new RelativeLine()')
  it.todo('point')
  it.todo('points')
  it.todo('values')
  it.todo('clone')
  it.todo('scale')
  it.todo('scaleX')
  it.todo('scaleY')
  it.todo('translate')
  it.todo('toAbsolute')
})

describe('RelativeCurve', () => {
  it.todo('new RelativeCurve()')
  it.todo('point')
  it.todo('points')
  it.todo('values')
  it.todo('clone')
  it.todo('scale')
  it.todo('scaleX')
  it.todo('scaleY')
  it.todo('translate')
  it.todo('toAbsolute')
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
  it.todo('toAbsolute')
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
  it.todo('toAbsolute')
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
  it.todo('toAbsolute')
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
  it.todo('toAbsolute')
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
  it.todo('toAbsolute')
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
