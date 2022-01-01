import { Point } from './point'

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

  it('absoluteValue', () => {
    expect(new Point(1.0, 1.0).absoluteValue).toBe(1.4142135623730951)
  })

  it('degrees', () => {
    expect(new Point(1.0, 1.0).degrees).toBe(45)
  })

  it('clone', () => {
    const po = new Point(0, 0)
    const clone = po.clone()

    expect(po === clone).toBe(false)
    expect(po.toJson()).toEqual(clone.toJson())
  })

  describe('Point.fromVector', () => {
    it('degrees=45', () => {
      const x = 1
      const y = 1
      const value = Math.sqrt(Math.pow(1, 2.0) + Math.pow(1, 2.0))
      const po = Point.fromVector({
        value,
        degrees: 45,
      })
      expect(po.x).toBe(x)
      expect(po.y).toBe(y)
    })
    it('degrees=0', () => {
      const po = Point.fromVector({
        value: 1,
        degrees: 0,
      })
      expect(po.x).toBe(1)
      expect(po.y).toBe(0)
    })
    it('degrees=90', () => {
      const po = Point.fromVector({
        value: 1.0,
        degrees: 90.0,
      })
      expect(po.x).toBe(0)
      expect(po.y).toBe(1)
    })
  })
})
