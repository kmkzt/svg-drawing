import type { VectorClass, PointObject } from '../types'

export class Vector implements VectorClass {
  constructor(public readonly value: number, public readonly angle: number) {}

  scale(r: number) {
    return new Vector(this.value * r, this.angle)
  }

  rotate(a: number) {
    return new Vector(this.value, this.angle + a)
  }

  toJson() {
    return {
      value: this.value,
      angle: this.angle,
    }
  }

  /**
   * ### Calculate angle and absolute value from origin of coordinates
   *
   * ```ts
   * const vector = Vector.fromPoint({ x: 1, y: 1 })
   *
   * console.log(vector.angle) // 45
   * console.log(vector.value) // 1.4142135623730951
   * ```
   */
  public static fromPoint({ x, y }: PointObject): Vector {
    return new Vector(
      Math.sqrt(Math.pow(x, 2.0) + Math.pow(y, 2.0)),
      Math.atan2(y, x) * (180 / Math.PI)
    )
  }
}
