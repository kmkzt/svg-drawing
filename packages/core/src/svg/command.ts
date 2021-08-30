import { CommandType, PointObject } from '../types'
import { roundUp } from '../utils'
import { Point } from './point'

export const COMMAND_TYPE: { [name: string]: CommandType } = {
  MOVE: 'M', // M 0 0
  MOVE_RELATIVE: 'm', // m 0 0
  LINE: 'L', // L 1 1
  LINE_RELATIVE: 'l', // l 1 1
  CUBIC_BEZIER_CURVE: 'C', // C 1 1 2 2 3 3
  CUBIC_BEZIER_CURVE_RELATIVE: 'c', // c 1 1 2 2 3 3
  CLOSE: 'Z', // Z, z
  HORIZONTAL: 'H', // H 10
  HORIZONTAL_RELATIVE: 'h', // h 10
  VERTICAL: 'V', // V 20
  VERTICAL_RELATIVE: 'v', // v 20
  ARC_CURVE: 'A', // A 6 4 10 0 1 14 10
  ARC_CURVE_RELATIVE: 'a', // A 6 4 10 0 1 14 10
  QUADRATIC_CURVE: 'Q', // Q 10 60 10 30
  QUADRATIC_CURVE_RELATIVE: 'q', // q 10 60 10 30
  SHORTCUT_CURVE: 'S', // S 10 60 10 30
  SHORTCUT_CURVE_RELATIVE: 's', // s 10 60 10 30
} as const

// TODO: compatible COMMAND_TYPE
export class Command {
  public type: CommandType
  public value: number[]
  // TODO: Convert data format to number array.
  constructor(type: CommandType, value: number[] = []) {
    this.value = value
    this.type = type
  }

  public set cr(po: Point | undefined) {
    if (!po) return
    if (!this.isCubicBezierCurve) {
      return
    }
    this.value.splice(2, 1, po.x)
    this.value.splice(3, 1, po.y)
  }
  public get cr(): Point | undefined {
    if (!this.isCubicBezierCurve) {
      return undefined
    }
    const [x, y] = this.value.slice(2, 4)
    return new Point(x, y)
  }
  public set cl(po: Point | undefined) {
    if (!po) return
    if (!this.isCurve) {
      return
    }
    this.value.splice(0, 1, po.x)
    this.value.splice(1, 1, po.y)
  }
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
    if (this.type === COMMAND_TYPE.CLOSE) return COMMAND_TYPE.CLOSE
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

  public get isCubicBezierCurve(): boolean {
    switch (this.type) {
      case COMMAND_TYPE.CUBIC_BEZIER_CURVE:
      case COMMAND_TYPE.CUBIC_BEZIER_CURVE_RELATIVE:
        return this.value.length === 6
      default:
        return false
    }
  }
  public get isCurve(): boolean {
    switch (this.type) {
      case COMMAND_TYPE.CUBIC_BEZIER_CURVE:
      case COMMAND_TYPE.CUBIC_BEZIER_CURVE_RELATIVE:
        return this.value.length === 6
      case COMMAND_TYPE.QUADRATIC_CURVE:
      case COMMAND_TYPE.QUADRATIC_CURVE_RELATIVE:
      case COMMAND_TYPE.SHORTCUT_CURVE:
      case COMMAND_TYPE.SHORTCUT_CURVE_RELATIVE:
        return this.value.length === 4
      default:
        return false
    }
  }

  public get isAbsolute(): boolean {
    return [
      COMMAND_TYPE.MOVE,
      COMMAND_TYPE.LINE,
      COMMAND_TYPE.CUBIC_BEZIER_CURVE,
      COMMAND_TYPE.ARC_CURVE,
      COMMAND_TYPE.QUADRATIC_CURVE,
      COMMAND_TYPE.SHORTCUT_CURVE_RELATIVE,
    ].includes(this.type)
  }
  public translate(p: PointObject) {
    if (!this.isAbsolute) return
    const po = new Point(p.x, p.y)
    this.point = this.point?.add(po)
    this.cr = this.cr?.add(po)
    this.cl = this.cl?.add(po)
  }
}
