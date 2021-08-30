import { Vector } from './vector'

describe('svg/vector.ts', () => {
  describe('Vector', () => {
    it('toPoint', () => {
      const po = new Vector(1.4142135623730951, 0.7853981633974483).toPoint()
      expect(po.x).toBe(1.0000000000000002)
      expect(po.y).toBe(1.0)
    })
    it('scale', () => {
      const vec = new Vector(1.0, 0.5).scale(0.3)
      expect(vec.value).toBe(0.3)
      expect(vec.angle).toBe(0.5)
    })
  })
})
