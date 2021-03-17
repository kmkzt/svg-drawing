import { Convert } from './convert'

describe('convert.ts', () => {
  describe('Convert', () => {
    it('bezierCurve', () => {
      const convert = new Convert()
      expect(
        convert
          .bezierCurve(
            { x: 0, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 3, y: 0 }
          )
          .toString()
      ).toBe('C 1.4 1.2 1.6 1.2 2 1')
    })
  })
})
