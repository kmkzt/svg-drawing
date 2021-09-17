import { Point } from './point'
import { CommandType, PointObject } from '../types'
import { roundUp } from '../utils'

export class Command {
  static Types = {
    /**
     * Move
     *
     * M 0 0
     */
    M: 'M',
    /**
     * Move relative
     *
     * M 0 0
     */
    m: 'm',
    /**
     * Line
     *
     * L 0 0
     */
    L: 'L',
    /**
     * Line relative
     *
     * L 0 0
     */
    l: 'l',
    /**
     * Cubic bezier curve
     *
     * C 1 1 2 2 3 3
     */
    C: 'C',
    /**
     * Cubic bezier curve relative
     *
     * C 1 1 2 2 3 3
     */
    c: 'c',
    /**
     * Close
     *
     * 'Z'
     */
    Z: 'Z',
    /**
     * Close
     *
     * 'z'
     */
    z: 'z',
    /**
     * Horizontal
     *
     * H 10
     */
    H: 'H',
    /**
     * Horizontal relative
     *
     * H 10
     */
    h: 'h',
    /**
     * Vertical
     *
     * V 10
     */
    V: 'V',
    /**
     * Vertical relative
     *
     * V 10
     */
    v: 'v',
    /**
     * Arc curve
     *
     * A 6 4 10 0 1 14 10
     */
    A: 'A',
    /**
     * Arc curve relative
     *
     * A 6 4 10 0 1 14 10
     */
    a: 'a',
    /**
     * Quadratic curve
     *
     * Q 10 60 10 30
     */
    Q: 'Q',
    /**
     * Quadratic curve relative
     *
     * Q 10 60 10 30
     */
    q: 'q',
    /**
     * Shortcut curve
     *
     * S 10 60 10 30
     */
    S: 'S',
    /**
     * Shortcut curve relative
     *
     * S 10 60 10 30
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

  /** @deprecated */
  public set cr(po: Point | undefined) {
    if (!po) return
    if (!this.isCubicBezierCurve) {
      return
    }
    this.value.splice(2, 1, po.x)
    this.value.splice(3, 1, po.y)
  }

  /** @deprecated */
  public get cr(): Point | undefined {
    if (!this.isCubicBezierCurve) {
      return undefined
    }
    const [x, y] = this.value.slice(2, 4)
    return new Point(x, y)
  }

  /** @deprecated */
  public set cl(po: Point | undefined) {
    if (!po) return
    if (!this.isCurve) {
      return
    }
    this.value.splice(0, 1, po.x)
    this.value.splice(1, 1, po.y)
  }

  /** @deprecated */
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

  /** @deprecated */
  public get isCubicBezierCurve(): boolean {
    switch (this.type) {
      case Command.Types.C:
      case Command.Types.c:
        return this.value.length === 6
      default:
        return false
    }
  }

  /** @deprecated */
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

  /** @deprecated */
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
