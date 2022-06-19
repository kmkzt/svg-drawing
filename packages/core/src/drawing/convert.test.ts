import { BezierCurve } from './convert'

describe('BezierCurve', () => {
  // TODO: Improve test case.
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
    ).toBe('C1.35777 1.17889 1.64223 1.17889 2 1')
  })
})
