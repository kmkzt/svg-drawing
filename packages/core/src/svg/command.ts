import { CommandType, PointObject } from '../types'
import { roundUp } from '../utils'
import { Point } from './point'

export class Command {
  public static Types = {
    /**
     * move
     * @description
     * M 0 0
     */
    M: 'M',
    /**
     * move relative
     * @description
     * m 0 0
     */
    m: 'm',
    /**
     * Line
     * @description
     * L 0 0
     */
    L: 'L',
    /**
     * Line relative
     * @description
     * l 0 0
     */
    l: 'l',
    /**
     * Cubic bezier curve
     * @description
     * C 1 1 2 2 3 3
     */
    C: 'C',
    /**
     * Cubic bezier curve relative
     * @description
     * c 1 1 2 2 3 3
     */
    c: 'c',
    /**
     * Close
     * @description
     * 'Z'
     */
    Z: 'Z',
    /**
     * Close
     * @description
     * 'z'
     */
    z: 'z',
    /**
     * Horizontal
     * @description
     * H 10
     */
    H: 'H',
    /**
     * Horizontal relative
     * @description
     * h 10
     */
    h: 'h',
    /**
     * Vertical
     * @description
     * V 10
     */
    V: 'V',
    /**
     * Vertical relative
     * @description
     * v 10
     */
    v: 'v',
    /**
     * Arc curve
     * @description
     *  A 6 4 10 0 1 14 10
     */
    A: 'A',
    /**
     * Arc curve relative
     * @description
     * a 6 4 10 0 1 14 10
     */
    a: 'a',
    /**
     * Quadratic curve
     * @description
     * Q 10 60 10 30
     */
    Q: 'Q',
    /**
     * Quadratic curve relative
     * @description
     *  q 10 60 10 30
     */
    q: 'q',
    /**
     * Shortcut curve
     * @description
     *  S 10 60 10 30
     */
    S: 'S',
    /**
     * Shortcut curve relative
     * @description
     * s 10 60 10 30
     */
    s: 's',
  } as const

  public type: CommandType
  public value: number[]
  // TODO: Convert data format to number array.
  constructor(type: CommandType, value: number[] = []) {
    this.value = value
    this.type = type
  }

  /**
   * @deprecated
   */
  public set cr(po: Point | undefined) {
    if (!po) return
    if (!this.isCubicBezierCurve) {
      return
    }
    this.value.splice(2, 1, po.x)
    this.value.splice(3, 1, po.y)
  }

  /**
   * @deprecated
   */
  public get cr(): Point | undefined {
    if (!this.isCubicBezierCurve) {
      return undefined
    }
    const [x, y] = this.value.slice(2, 4)
    return new Point(x, y)
  }

  /**
   * @deprecated
   */
  public set cl(po: Point | undefined) {
    if (!po) return
    if (!this.isCurve) {
      return
    }
    this.value.splice(0, 1, po.x)
    this.value.splice(1, 1, po.y)
  }

  /**
   * @deprecated
   */
  public get cl(): Point | undefined {
    if (!this.isCurve) {
      return undefined
    }
    const [x, y] = this.value.slice(0, 2)
    return new Point(x, y)
  }

  public set point(po: Point | undefined) {
    if (!po) return
    this.value.splice(this.value.length - 2, 1, po.x)
    this.value.splice(this.value.length - 1, 1, po.y)
  }
  public get point(): Point | undefined {
    const xy = this.value.slice(this.value.length - 2)
    return xy.length === 2 ? new Point(xy[0], xy[1]) : undefined
  }

  public toString(): string {
    if (this.type === Command.Types.Z) return Command.Types.Z
    return `${this.type} ${this.value.map((v) => roundUp(v)).join(' ')}`
  }

  public scale(r: number): Command {
    const upd = new Command(
      this.type,
      this.value.map((p) => p * r)
    )
    return upd
  }

  public scaleX(r: number): Command {
    const point = this.point?.scaleX(r)
    const cl = this.cl?.scaleX(r)
    const cr = this.cr?.scaleX(r)
    return new Command(
      this.type,
      [cl, cr, point].reduce(
        (res: number[], po: Point | undefined) =>
          po ? [...res, po.x, po.y] : res,
        []
      )
    )
  }

  public scaleY(r: number): Command {
    const point = this.point?.scaleY(r)
    const cl = this.cl?.scaleY(r)
    const cr = this.cr?.scaleY(r)
    return new Command(
      this.type,
      [cl, cr, point].reduce(
        (res: number[], po: Point | undefined) =>
          po ? [...res, po.x, po.y] : res,
        []
      )
    )
  }

  public clone(): Command {
    return new Command(this.type, this.value.slice())
  }

  /**
   * @deprecated
   * */
  public get isCubicBezierCurve(): boolean {
    switch (this.type) {
      case Command.Types.C:
      case Command.Types.c:
        return this.value.length === 6
      default:
        return false
    }
  }

  /**
   * @deprecated
   */
  public get isCurve(): boolean {
    switch (this.type) {
      case Command.Types.C:
      case Command.Types.c:
        return this.value.length === 6
      case Command.Types.Q:
      case Command.Types.q:
      case Command.Types.S:
      case Command.Types.s:
        return this.value.length === 4
      default:
        return false
    }
  }

  /**
   * @deprecated
   */
  public get isAbsolute(): boolean {
    return [
      Command.Types.M,
      Command.Types.L,
      Command.Types.C,
      Command.Types.A,
      Command.Types.Q,
      Command.Types.S,
    ].some((type) => type === this.type)
  }

  public translate(p: PointObject) {
    if (!this.isAbsolute) return
    const po = new Point(p.x, p.y)
    this.point = this.point?.add(po)
    this.cr = this.cr?.add(po)
    this.cl = this.cl?.add(po)
  }

  public static validTypes(t: any): t is CommandType {
    return Object.values(Command.Types).some((arg) => arg === t)
  }
}
