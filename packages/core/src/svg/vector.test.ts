import { Vector } from './vector'

describe('Point', () => {
  it('scale', () => {
    const vector = new Vector(1, 45).scale(2)
    expect(vector.value).toBe(2)
    expect(vector.angle).toBe(45)
  })

  it('rotate', () => {
    const vector = new Vector(1, 45).rotate(15)
    expect(vector.value).toBe(1)
    expect(vector.angle).toBe(60)
  })

  it('toJson', () => {
    const vector = new Vector(1, 45)

    expect(vector.toJson()).toEqual({ value: 1, angle: 45 })
  })

  describe('Vector.fromPoint', () => {
    it('Vector.fromPoint({ x: 1, y: 1 })', () => {
      const vector = Vector.fromPoint({
        x: 1,
        y: 1,
      })
      expect(vector.value).toBe(1.4142135623730951)
      expect(vector.angle).toBe(45)
    })
    it('Vector.fromPoint({ x: 1, y: 0 })', () => {
      const vector = Vector.fromPoint({
        x: 1,
        y: 0,
      })
      expect(vector.value).toBe(1)
      expect(vector.angle).toBe(0)
    })
    it('Vector.fromPoint({ x: 0, y: 1 })', () => {
      const vector = Vector.fromPoint({
        x: 0,
        y: 1,
      })
      expect(vector.value).toBe(1)
      expect(vector.angle).toBe(90)
    })
  })
})
