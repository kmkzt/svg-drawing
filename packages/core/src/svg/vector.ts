import { Point } from './point'

export class Vector {
  public angle: number
  public value: number
  constructor(v: number, a: number) {
    this.value = v
    this.angle = a
  }

  public toPoint(): Point {
    const x = Math.cos(this.angle) * this.value
    const y = Math.sin(this.angle) * this.value
    return new Point(x, y)
  }

  public scale(r: number): Vector {
    return new Vector(this.value * r, this.angle)
  }
}
