import { BezierCurve } from './bezier'
import { Point } from './svg'

describe('bezier.ts', () => {
  describe('BezierCurve', () => {
    it('createCommand', () => {
      const bezier = new BezierCurve()
      expect(
        bezier
          .createCommand(
            new Point(0, 0),
            new Point(1, 1),
            new Point(2, 1),
            new Point(3, 0)
          )
          .toString()
      ).toBe('C 1.4 1.2 1.6 1.2 2 1')
    })
  })
})
