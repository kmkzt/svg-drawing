import { Point } from './point'
import {
  Command,
  CommandClass,
  CommandType,
  OtherCommandType,
  PointObject,
} from '../types'
import { roundUp } from '../utils'

/** @deprecated */
export class OtherCommand<T extends OtherCommandType> implements Command<T> {
  static Types = {
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
  } as const

  // TODO: Convert data format to number array.
  constructor(public type: T, public values: number[] = []) {}

  public set points(p: Point[]) {
    if (!p) return
    this.values = p.reduce((acc: number[], p) => [...acc, p.x, p.y], [])
  }

  public get points(): Point[] {
    return this.values.reduce(
      (acc: Point[], _, i: number) =>
        i % 2 ? acc : [...acc, new Point(this.values[i - 1], this.values[i])],
      []
    )
  }

  public get point(): Point | undefined {
    return this.points[this.points.length - 1]
  }

  public toString(): string {
    return `${this.type} ${this.values.map((v) => roundUp(v)).join(' ')}`
  }

  public scale(r: number) {
    const upd = new OtherCommand(
      this.type,
      this.values.map((p) => p * r)
    )
    return upd
  }

  public scaleX(r: number) {
    return new OtherCommand(
      this.type,
      this.points.reduce((res: number[], po: Point) => {
        const upd = po.scale(r)
        return [...res, upd.x, upd.y]
      }, [])
    )
  }

  public scaleY(r: number) {
    return new OtherCommand(
      this.type,
      this.points.reduce((res: number[], po: Point) => {
        const upd = po.scaleY(r)
        return [...res, upd.x, upd.y]
      }, [])
    )
  }

  public clone() {
    return new OtherCommand(this.type, this.values.slice())
  }

  /** @deprecated */
  public get relative(): boolean {
    return (
      [OtherCommand.Types.a, OtherCommand.Types.q] as CommandType[]
    ).includes(this.type)
  }

  public translate(p: PointObject) {
    if (this.relative) return
    this.points.map((po) => {
      po.translate(p)
    })
  }

  public static validTypes(t: any): t is OtherCommandType {
    return Object.values(OtherCommand.Types).some((arg) => arg === t)
  }
}

/**
 * Move relative
 *
 * `m 0 0`
 */
export class RelativeMove implements CommandClass<'m'> {
  public readonly type = 'm'
  public readonly relative = false
  constructor(public basePoint: Point, public points: [Point]) {}

  public get values(): number[] {
    return this.points.reduce((acc: number[], po) => [...acc, po.x, po.y], [])
  }

  public get point(): Point {
    return this.points[0]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    this.basePoint = this.basePoint.add(p)
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
export class Move implements CommandClass<'M'> {
  public readonly type = 'M'
  constructor(public points: [Point]) {}

  public get values(): number[] {
    return this.points.reduce((acc: number[], po) => [...acc, po.x, po.y], [])
  }

  public get point(): Point {
    return this.points[0]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    this.points = this.points.map((po) => po.add(p)) as [Point]
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
export class RelativeLine implements CommandClass<'l'> {
  public readonly type = 'l'
  constructor(public basePoint: Point, public points: [Point]) {}

  public get values(): number[] {
    return this.points.reduce((acc: number[], po) => [...acc, po.x, po.y], [])
  }

  public get point(): Point {
    return this.basePoint.add(this.points[0])
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    this.basePoint = this.basePoint.add(p)
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

  public toAbsolute(): CommandClass<'L'> {
    return new Line([this.basePoint.add(this.points[0])])
  }
}

/**
 * Line
 *
 * `L 0 0`
 */

export class Line implements CommandClass<'L'> {
  public readonly type = 'L'
  constructor(public points: [Point]) {}

  public get values(): number[] {
    return this.points.reduce((acc: number[], po) => [...acc, po.x, po.y], [])
  }

  public get point(): Point {
    return this.points[0]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    this.points = this.points.map((po) => po.add(p)) as [Point]
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
export class RelativeCurve implements CommandClass<'c'> {
  public readonly type = 'c'
  constructor(public basePoint: Point, public points: [Point, Point, Point]) {}

  public get values(): number[] {
    return this.points.reduce((acc: number[], po) => [...acc, po.x, po.y], [])
  }

  public get point(): Point {
    return this.basePoint.add(this.points[2])
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    this.basePoint = this.basePoint.add(p)
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
export class Curve implements CommandClass<'C'> {
  public readonly type = 'C'
  constructor(public points: [Point, Point, Point]) {}

  public get values(): [number, number, number, number, number, number] {
    return this.points.reduce(
      (acc: number[], po) => [...acc, po.x, po.y],
      []
    ) as [number, number, number, number, number, number]
  }

  public get point(): Point {
    return this.points[2]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    this.points = this.points.map((po) => po.add(p)) as [Point, Point, Point]
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

/**
 * Shortcut curve
 *
 * `S 10 60 10 30`
 */
export class ShortcutCurve implements CommandClass<'S'> {
  public readonly type = 'S'
  constructor(public points: [Point, Point]) {}

  public get values(): [number, number, number, number] {
    return this.points.reduce(
      (acc: number[], po) => [...acc, po.x, po.y],
      []
    ) as [number, number, number, number]
  }

  public get point(): Point {
    return this.points[1]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    this.points = this.points.map((po) => po.add(p)) as [Point, Point]
  }

  public scale(r: number) {
    return new ShortcutCurve(
      this.points.map((p) => p.scale(r)) as [Point, Point]
    )
  }

  public scaleX(r: number) {
    return new ShortcutCurve(
      this.points.map((p) => p.scaleX(r)) as [Point, Point]
    )
  }

  public scaleY(r: number) {
    return new ShortcutCurve(
      this.points.map((p) => p.scaleY(r)) as [Point, Point]
    )
  }

  public clone() {
    return new ShortcutCurve(
      this.points.map((p) => p.clone()) as [Point, Point]
    )
  }

  public toRelative(base: Point) {
    return new RelativeShortcutCurve(
      base.clone(),
      this.points.map((po) => po.sub(base)) as [Point, Point]
    )
  }
}

/**
 * Shortcut curve relative
 *
 * `s 10 60 10 30`
 */
export class RelativeShortcutCurve implements CommandClass<'s'> {
  public readonly type = 's'
  constructor(public basePoint: Point, public points: [Point, Point]) {}

  public get values(): [number, number, number, number] {
    return this.points.reduce(
      (acc: number[], po) => [...acc, po.x, po.y],
      []
    ) as [number, number, number, number]
  }

  public get point(): Point {
    return this.basePoint.add(this.points[1])
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    this.basePoint = this.basePoint.add(p)
  }

  public scale(r: number) {
    return new RelativeShortcutCurve(
      this.basePoint.clone(),
      this.points.map((p) => p.scaleX(r)) as [Point, Point]
    )
  }

  public scaleX(r: number) {
    return new RelativeShortcutCurve(
      this.basePoint.clone(),
      this.points.map((p) => p.scaleX(r)) as [Point, Point]
    )
  }

  public scaleY(r: number) {
    return new RelativeShortcutCurve(
      this.basePoint.clone(),
      this.points.map((p) => p.scaleY(r)) as [Point, Point]
    )
  }

  public clone() {
    return new RelativeShortcutCurve(
      this.basePoint.clone(),
      this.points.map((po) => po.clone()) as [Point, Point]
    )
  }

  public toAbsolute() {
    return new ShortcutCurve(
      this.points.map((po) => po.add(this.basePoint)) as [Point, Point]
    )
  }
}

/**
 * Quadratic curve
 *
 * Q 10 60 10 30
 */

export class QuadraticCurve implements CommandClass<'Q'> {
  public readonly type = 'Q'
  constructor(public points: [Point, Point]) {}

  public get values(): [number, number, number, number] {
    return this.points.reduce(
      (acc: number[], po) => [...acc, po.x, po.y],
      []
    ) as [number, number, number, number]
  }

  public get point(): Point {
    return this.points[1]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    this.points = this.points.map((po) => po.add(p)) as [Point, Point]
  }

  public scale(r: number) {
    return new QuadraticCurve(
      this.points.map((p) => p.scale(r)) as [Point, Point]
    )
  }

  public scaleX(r: number) {
    return new QuadraticCurve(
      this.points.map((p) => p.scaleX(r)) as [Point, Point]
    )
  }

  public scaleY(r: number) {
    return new QuadraticCurve(
      this.points.map((p) => p.scaleY(r)) as [Point, Point]
    )
  }

  public clone() {
    return new QuadraticCurve(
      this.points.map((p) => p.clone()) as [Point, Point]
    )
  }

  public toRelative(base: Point) {
    return new RelativeQuadraticCurve(
      base.clone(),
      this.points.map((po) => po.sub(base)) as [Point, Point]
    )
  }
}

/**
 * Quadratic curve relative
 *
 * `q 10 60 10 30`
 */
export class RelativeQuadraticCurve implements CommandClass<'q'> {
  public readonly type = 'q'
  constructor(public basePoint: Point, public points: [Point, Point]) {}

  public get values(): [number, number, number, number] {
    return this.points.reduce(
      (acc: number[], po) => [...acc, po.x, po.y],
      []
    ) as [number, number, number, number]
  }

  public get point(): Point {
    return this.basePoint.add(this.points[1])
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    this.basePoint = this.basePoint.add(p)
  }

  public scale(r: number) {
    return new RelativeQuadraticCurve(
      this.basePoint.clone(),
      this.points.map((p) => p.scaleX(r)) as [Point, Point]
    )
  }

  public scaleX(r: number) {
    return new RelativeQuadraticCurve(
      this.basePoint.clone(),
      this.points.map((p) => p.scaleX(r)) as [Point, Point]
    )
  }

  public scaleY(r: number) {
    return new RelativeQuadraticCurve(
      this.basePoint.clone(),
      this.points.map((p) => p.scaleY(r)) as [Point, Point]
    )
  }

  public clone() {
    return new RelativeQuadraticCurve(
      this.basePoint.clone(),
      this.points.map((po) => po.clone()) as [Point, Point]
    )
  }

  public toAbsolute() {
    return new QuadraticCurve(
      this.points.map((po) => po.add(this.basePoint)) as [Point, Point]
    )
  }
}

/**
 * Close
 *
 * 'z'
 */
export class Close implements CommandClass<'z'> {
  public readonly type = 'z'

  public get values(): [] {
    return []
  }

  public get points(): [] {
    return []
  }

  public get point(): undefined {
    return undefined
  }

  public toString() {
    return `${this.type}`
  }

  public translate(_p: PointObject) {
    return
  }

  public scale(_r: number) {
    return new Close()
  }

  public scaleX(r: number) {
    return new Close()
  }

  public scaleY(r: number) {
    return new Close()
  }

  public clone() {
    return new Close()
  }
}
