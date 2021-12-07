import { BezierCurve } from './convert'

describe('BezierCurve', () => {
  it('genCommand', () => {
    const bezierCurve = new BezierCurve()
    expect(
      bezierCurve
        .genCommand(
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 2, y: 1 },
          { x: 3, y: 0 }
        )
        .toString()
    ).toBe('C1.4 1.2 1.6 1.2 2 1')
  })
})
