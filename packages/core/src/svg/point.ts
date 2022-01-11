import type { VectorObject, PointClass, PointObject } from '../types'

/**
 * Maximum number of decimal places is 5
 *
 * @todo Changeable parameter
 */
const coeffecient = 100000
const roundNumber = (num: number) => Math.round(num * coeffecient) / coeffecient

export class Point implements PointClass {
  private _x: number
  private _y: number
  constructor(x: number, y: number) {
    this._x = roundNumber(x)
    this._y = roundNumber(y)
  }

  public get x() {
    return this._x
  }

  public get y() {
    return this._y
  }

  public scale(r: number) {
    return new Point(this._x * r, this._y * r)
  }

  public scaleX(r: number) {
    return new Point(this._x * r, this._y)
  }

  public scaleY(r: number) {
    return new Point(this._x, this._y * r)
  }

  public add(p: PointObject) {
    return new Point(this._x + p.x, this._y + p.y)
  }

  public sub(p: PointObject) {
    return new Point(this._x - p.x, this._y - p.y)
  }

  public eql(p: PointObject) {
    return this._x === p.x && this._y === p.y
  }

  public clone() {
    return new Point(this._x, this._y)
  }

  public toJson() {
    return {
      x: this._x,
      y: this._y,
    }
  }

  /**
   * @example
   *   const point = Point.fromVector({ value: 1, 0 })
   *
   *   console.log(point.x) // 0
   *   console.log(point.y) // 1
   */
  public static fromVector({ value, angle }: VectorObject): Point {
    const theta = (angle * Math.PI) / 180
    return new Point(Math.cos(theta) * value, Math.sin(theta) * value)
  }
}
