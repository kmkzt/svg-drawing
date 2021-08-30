import { Point } from './point'

describe('svg/point.ts', () => {
  describe('Point', () => {
    it('add', () => {
      const po = new Point(1.0, 1.0).add(new Point(2.0, 2.0))
      expect(po.x).toBe(3.0)
      expect(po.y).toBe(3.0)
    })

    it('sub', () => {
      const po = new Point(3.0, 3.0).sub(new Point(1.0, 1.0))
      expect(po.x).toBe(2.0)
      expect(po.y).toBe(2.0)
    })

    it('scale', () => {
      const po = new Point(1.0, 1.0).scale(3)
      expect(po.x).toBe(3.0)
      expect(po.y).toBe(3.0)
    })

    it('scaleX', () => {
      const po = new Point(1.0, 1.0).scaleX(3)
      expect(po.x).toBe(3.0)
      expect(po.y).toBe(1.0)
    })

    it('scaleY', () => {
      const po = new Point(1.0, 1.0).scaleY(3)
      expect(po.x).toBe(1.0)
      expect(po.y).toBe(3.0)
    })

    it('toVector', () => {
      const vec = new Point(1.0, 1.0).toVector()
      expect(vec.value).toBe(1.4142135623730951)
      expect(vec.angle).toBe(0.7853981633974483)
    })

    it('clone', () => {
      const po = new Point(0, 0)
      const clone = po.clone()
      clone.translate(new Point(2, 0))
      expect(po.x).toBe(0)
      expect(clone.x).toBe(2)
    })
  })
})
