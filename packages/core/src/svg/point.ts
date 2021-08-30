import { PointObject } from '../types'
import { Vector } from './vector'

export class Point {
  constructor(private _x: number, private _y: number) {}

  public get x(): number {
    return this._x
  }

  public get y(): number {
    return this._y
  }

  public toVector(): Vector {
    const value = Math.sqrt(Math.pow(this._x, 2.0) + Math.pow(this._y, 2.0))
    const angle = Math.atan2(this._y, this._x)
    return new Vector(value, angle)
  }

  public scale(r: number): Point {
    return new Point(this._x * r, this._y * r)
  }

  public scaleX(r: number): Point {
    return new Point(this._x * r, this._y)
  }

  public scaleY(r: number): Point {
    return new Point(this._x, this._y * r)
  }

  public add(p: Point): Point {
    return new Point(this._x + p.x, this._y + p.y)
  }

  public sub(p: Point): Point {
    return new Point(this._x - p.x, this._y - p.y)
  }

  public translate(p: Point): void {
    this._x += p.x
    this._y += p.y
  }

  public eql(p: Point): boolean {
    return this._x === p.x && this._y === p.y
  }

  public clone(): Point {
    return new Point(this._x, this._y)
  }

  public toJson(): PointObject {
    return {
      x: this._x,
      y: this._y,
    }
  }
}
