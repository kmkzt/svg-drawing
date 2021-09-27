import { Point } from './point'
import { AbsoluteCommandType, CommandType, PointObject } from '../types'
import { roundUp } from '../utils'

/**
 * @todo Refactor types
 *
 * @todo Remove other command
 */
export type Command<T extends CommandType = any> = T extends 'M' | 'L' | 'C'
  ? {
      type: T
      values: number[]
      points: Point[]
      toString: () => string
      clone: () => Command<T>
      scale: (r: number) => Command<T>
      scaleX: (r: number) => Command<T>
      scaleY: (r: number) => Command<T>
      translate: (po: PointObject) => void
      toRelative: (base: Point) => Command<Lowercase<T>>
    }
  : T extends 'm' | 'l' | 'c'
  ? {
      basePoint: Point
      type: T
      values: number[]
      points: Point[]
      toString: () => string
      clone: () => Command<T>
      scale: (r: number) => Command<T>
      scaleX: (r: number) => Command<T>
      scaleY: (r: number) => Command<T>
      translate: (po: PointObject) => void
      toAbsolute: () => Command<Uppercase<T>>
    }
  : OtherCommand

/** @deprecated */
export class OtherCommand {
  static Types = {
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
     * `H 10`
     */
    H: 'H',
    /**
     * Horizontal relative
     *
     * `h 10`
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
     * `v 10`
     */
    v: 'v',
    /**
     * Arc curve
     *
     * `A 6 4 10 0 1 14 10`
     */
    A: 'A',
    /**
     * Arc curve relative
     *
     * `a 6 4 10 0 1 14 10`
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
     * `q 10 60 10 30`
     */
    q: 'q',
    /**
     * Shortcut curve
     *
     * `S 10 60 10 30`
     */
    S: 'S',
    /**
     * Shortcut curve relative
     *
     * `s 10 60 10 30`
     */
    s: 's',
  } as const

  // TODO: Convert data format to number array.
  constructor(public type: CommandType, public value: number[] = []) {}

  /** @deprecated */
  public set cr(po: Point | undefined) {
    return
  }

  /** @deprecated */
  public get cr(): Point | undefined {
    return undefined
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
    if (this.type === OtherCommand.Types.Z) return OtherCommand.Types.Z
    return `${this.type} ${this.value.map((v) => roundUp(v)).join(' ')}`
  }

  public scale(r: number): Command {
    const upd = new OtherCommand(
      this.type,
      this.value.map((p) => p * r)
    )
    return upd
  }

  public scaleX(r: number): Command {
    const point = this.point?.scaleX(r)
    const cl = this.cl?.scaleX(r)
    const cr = this.cr?.scaleX(r)
    return new OtherCommand(
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
    return new OtherCommand(
      this.type,
      [cl, cr, point].reduce(
        (res: number[], po: Point | undefined) =>
          po ? [...res, po.x, po.y] : res,
        []
      )
    )
  }

  public clone(): Command {
    return new OtherCommand(this.type, this.value.slice())
  }

  /** @deprecated */
  public get isCubicBezierCurve(): false {
    return false
  }

  /** @deprecated */
  public get isCurve(): boolean {
    switch (this.type) {
      case OtherCommand.Types.Q:
      case OtherCommand.Types.q:
      case OtherCommand.Types.S:
      case OtherCommand.Types.s:
        return this.value.length === 4
      default:
        return false
    }
  }

  /** @deprecated */
  public get relative(): boolean {
    return (
      [
        OtherCommand.Types.a,
        OtherCommand.Types.q,
        OtherCommand.Types.s,
      ] as CommandType[]
    ).includes(this.type)
  }

  public translate(p: PointObject) {
    if (this.relative) return
    const po = new Point(p.x, p.y)
    this.point = this.point?.add(po)
    this.cr = this.cr?.add(po)
    this.cl = this.cl?.add(po)
  }

  public static validTypes(t: any): t is CommandType {
    return Object.values(OtherCommand.Types).some((arg) => arg === t)
  }
}

/**
 * Move relative
 *
 * `m 0 0`
 */
export class RelativeMove implements Command<'m'> {
  public readonly type = 'm'
  public readonly relative = false
  constructor(public basePoint: Point, public points: [Point]) {}

  public get values(): number[] {
    return this.points.reduce((acc: number[], po) => [...acc, po.x, po.y], [])
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    this.basePoint.add(p)
  }

  public scale(r: number) {
    return new RelativeMove(this.basePoint.clone(), [this.points[0].scale(r)])
  }

  public scaleX(r: number) {
    return new RelativeMove(this.basePoint.clone(), [this.points[0].scaleX(r)])
  }

  public scaleY(r: number) {
    return new RelativeMove(this.basePoint.clone(), [this.points[0].scaleY(r)])
  }

  public clone() {
    return new RelativeMove(this.basePoint.clone(), [this.points[0].clone()])
  }

  public toAbsolute(): Move {
    return new Move([this.basePoint.add(this.points[0])])
  }
}

/**
 * Move
 *
 * `M 0 0`
 */
export class Move implements Command<'M'> {
  public readonly type = 'M'
  constructor(public points: [Point]) {}

  public get values(): number[] {
    return this.points.reduce((acc: number[], po) => [...acc, po.x, po.y], [])
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    this.points.map((po) => po.add(p))
  }

  public scale(r: number) {
    return new Move([this.points[0].scale(r)])
  }

  public scaleX(r: number) {
    return new Move([this.points[0].scaleX(r)])
  }

  public scaleY(r: number) {
    return new Move([this.points[0].scaleY(r)])
  }

  public clone() {
    return new Move([this.points[0].clone()])
  }

  public toRelative(base: Point): RelativeMove {
    return new RelativeMove(base.clone(), [this.points[0].sub(base)])
  }
}

/**
 * Line relative
 *
 * `l 0 0`
 */
export class RelativeLine implements Command<'l'> {
  public readonly type = 'l'
  constructor(public basePoint: Point, public points: [Point]) {}

  public get values(): number[] {
    return this.points.reduce((acc: number[], po) => [...acc, po.x, po.y], [])
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    this.basePoint.add(p)
  }

  public scale(r: number) {
    return new RelativeLine(this.basePoint.clone(), [this.points[0].scale(r)])
  }

  public scaleX(r: number) {
    return new RelativeLine(this.basePoint.clone(), [this.points[0].scaleX(r)])
  }

  public scaleY(r: number) {
    return new RelativeLine(this.basePoint.clone(), [this.points[0].scaleY(r)])
  }

  public clone() {
    return new RelativeLine(this.basePoint.clone(), [this.points[0].clone()])
  }

  public toAbsolute(): Command<'L'> {
    return new Line([this.basePoint.add(this.points[0])])
  }
}

/**
 * Line
 *
 * `L 0 0`
 */

export class Line implements Command<'L'> {
  public readonly type = 'L'
  constructor(public points: [Point]) {}

  public get values(): number[] {
    return this.points.reduce((acc: number[], po) => [...acc, po.x, po.y], [])
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    this.points.map((po) => po.add(p))
  }

  public scale(r: number) {
    return new Line([this.points[0].scale(r)])
  }

  public scaleX(r: number) {
    return new Line([this.points[0].scaleX(r)])
  }

  public scaleY(r: number) {
    return new Line([this.points[0].scaleY(r)])
  }

  public clone() {
    return new Line([this.points[0].clone()])
  }

  public toRelative(base: Point) {
    return new RelativeLine(base.clone(), [this.points[0].sub(base)])
  }
}

/**
 * Cubic bezier curve relative
 *
 * `c 1 1 2 2 3 3`
 */
export class RelativeCurve implements Command<'c'> {
  public readonly type = 'c'
  constructor(public basePoint: Point, public points: [Point, Point, Point]) {}

  public get values(): number[] {
    return this.points.reduce((acc: number[], po) => [...acc, po.x, po.y], [])
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    this.basePoint.add(p)
  }

  public scale(r: number) {
    return new RelativeCurve(
      this.basePoint.clone(),
      this.points.map((p) => p.scaleX(r)) as [Point, Point, Point]
    )
  }

  public scaleX(r: number) {
    return new RelativeCurve(
      this.basePoint.clone(),
      this.points.map((p) => p.scaleX(r)) as [Point, Point, Point]
    )
  }

  public scaleY(r: number) {
    return new RelativeCurve(
      this.basePoint.clone(),
      this.points.map((p) => p.scaleY(r)) as [Point, Point, Point]
    )
  }

  public clone() {
    return new RelativeCurve(
      this.basePoint.clone(),
      this.points.map((po) => po.clone()) as [Point, Point, Point]
    )
  }

  public toAbsolute() {
    return new Curve(
      this.points.map((po) => po.add(this.basePoint)) as [Point, Point, Point]
    )
  }
}

/**
 * Cubic bezier curve
 *
 * `C 1 1 2 2 3 3`
 */
export class Curve implements Command<'C'> {
  public readonly type = 'C'
  constructor(public points: [Point, Point, Point]) {}

  public get values(): [number, number, number, number, number, number] {
    return this.points.reduce(
      (acc: number[], po) => [...acc, po.x, po.y],
      []
    ) as [number, number, number, number, number, number]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    this.points.map((po) => po.add(p))
  }

  public scale(r: number) {
    return new Curve(
      this.points.map((p) => p.scale(r)) as [Point, Point, Point]
    )
  }

  public scaleX(r: number) {
    return new Curve(
      this.points.map((p) => p.scaleX(r)) as [Point, Point, Point]
    )
  }

  public scaleY(r: number) {
    return new Curve(
      this.points.map((p) => p.scaleY(r)) as [Point, Point, Point]
    )
  }

  public clone() {
    return new Curve(this.points.map((p) => p.clone()) as [Point, Point, Point])
  }

  public toRelative(base: Point) {
    return new RelativeCurve(
      base.clone(),
      this.points.map((po) => po.sub(base)) as [Point, Point, Point]
    )
  }
}
