import { Point } from './point'
import { roundUp } from '../utils'
import type {
  CommandClass,
  CommandType,
  OtherCommandType,
  PointObject,
  PointClass,
  AbsoluteCommandType,
  RelativeCommandType,
} from '../types'

/** @deprecated */
export class OtherCommand<T extends OtherCommandType>
  implements CommandClass<OtherCommandType>
{
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
  } as const

  // TODO: Convert data format to number array.
  constructor(public type: T, public values: number[] = []) {}

  public set points(p: PointClass[]) {
    if (!p) return
    this.values = p.reduce((acc: number[], p) => [...acc, p.x, p.y], [])
  }

  public get points() {
    return this.values.reduce(
      (acc: Point[], _, i: number) =>
        i % 2 ? acc : [...acc, new Point(this.values[i - 1], this.values[i])],
      []
    )
  }

  public get point(): undefined {
    return undefined
  }

  public toString(): string {
    return `${this.type}${this.values.map((v) => roundUp(v)).join(' ')}`
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
      this.points.reduce((res: number[], po: PointClass) => {
        const upd = po.scale(r)
        return [...res, upd.x, upd.y]
      }, [])
    )
  }

  public scaleY(r: number) {
    return new OtherCommand(
      this.type,
      this.points.reduce((res: number[], po: PointClass) => {
        const upd = po.scaleY(r)
        return [...res, upd.x, upd.y]
      }, [])
    )
  }

  public clone() {
    return new OtherCommand(this.type, this.values.slice())
  }

  public translate(p: PointObject) {
    if (OtherCommand.Types.a === this.type) return this
    this.points = this.points.map((po) => po.add(p))
    return this
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
  public points: [PointClass]
  constructor(point: PointClass) {
    this.points = [point]
  }

  public get values(): number[] {
    return this.points.reduce((acc: number[], po) => [...acc, po.x, po.y], [])
  }

  public get point(): PointClass {
    return this.points[0]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    return new RelativeMove(this.point.add(p))
  }

  public scale(r: number) {
    return new RelativeMove(this.points[0].scale(r))
  }

  public scaleX(r: number) {
    return new RelativeMove(this.points[0].scaleX(r))
  }

  public scaleY(r: number) {
    return new RelativeMove(this.points[0].scaleY(r))
  }

  public clone() {
    return new RelativeMove(this.points[0].clone())
  }
}

/**
 * Move
 *
 * `M 0 0`
 */
export class Move implements CommandClass<'M'> {
  public readonly type = 'M'
  public points: [PointClass]
  constructor(point: PointClass) {
    this.points = [point]
  }

  public get values(): number[] {
    return this.points.reduce((acc: number[], po) => [...acc, po.x, po.y], [])
  }

  public get point(): PointClass {
    return this.points[0]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    return new Move(this.point.add(p))
  }

  public scale(r: number) {
    return new Move(this.points[0].scale(r))
  }

  public scaleX(r: number) {
    return new Move(this.points[0].scaleX(r))
  }

  public scaleY(r: number) {
    return new Move(this.points[0].scaleY(r))
  }

  public clone() {
    return new Move(this.points[0].clone())
  }
}

/**
 * Line relative
 *
 * `l 0 0`
 */
export class RelativeLine implements CommandClass<'l'> {
  public readonly type = 'l'
  public points: [PointClass]
  constructor(point: PointClass) {
    this.points = [point]
  }

  public get values(): number[] {
    return this.points.reduce((acc: number[], po) => [...acc, po.x, po.y], [])
  }

  public get point(): PointClass {
    return this.points[0]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    return new RelativeLine(this.point.add(p))
  }

  public scale(r: number) {
    return new RelativeLine(this.point.scale(r))
  }

  public scaleX(r: number) {
    return new RelativeLine(this.point.scaleX(r))
  }

  public scaleY(r: number) {
    return new RelativeLine(this.point.scaleY(r))
  }

  public clone() {
    return new RelativeLine(this.point.clone())
  }
}

/**
 * Line
 *
 * `L 0 0`
 */
export class Line implements CommandClass<'L'> {
  public readonly type = 'L'
  public points: [PointClass]
  constructor(point: PointClass) {
    this.points = [point]
  }

  public get values(): number[] {
    return this.points.reduce((acc: number[], po) => [...acc, po.x, po.y], [])
  }

  public get point(): PointClass {
    return this.points[0]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    return new Line(this.point.add(p))
  }

  public scale(r: number) {
    return new Line(this.point.scale(r))
  }

  public scaleX(r: number) {
    return new Line(this.point.scaleX(r))
  }

  public scaleY(r: number) {
    return new Line(this.point.scaleY(r))
  }

  public clone() {
    return new Line(this.point.clone())
  }
}

/**
 * Cubic bezier curve relative
 *
 * `c 1 1 2 2 3 3`
 */
export class RelativeCurve implements CommandClass<'c'> {
  public readonly type = 'c'
  constructor(public points: [PointClass, PointClass, PointClass]) {}

  public get values(): number[] {
    return this.points.reduce((acc: number[], po) => [...acc, po.x, po.y], [])
  }

  public get point(): PointClass {
    return this.points[2]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    return new RelativeCurve(
      this.points.map((po) => po.add(p)) as [PointClass, PointClass, PointClass]
    )
  }

  public scale(r: number) {
    return new RelativeCurve(
      this.points.map((p) => p.scaleX(r)) as [
        PointClass,
        PointClass,
        PointClass
      ]
    )
  }

  public scaleX(r: number) {
    return new RelativeCurve(
      this.points.map((p) => p.scaleX(r)) as [
        PointClass,
        PointClass,
        PointClass
      ]
    )
  }

  public scaleY(r: number) {
    return new RelativeCurve(
      this.points.map((p) => p.scaleY(r)) as [
        PointClass,
        PointClass,
        PointClass
      ]
    )
  }

  public clone() {
    return new RelativeCurve(
      this.points.map((po) => po.clone()) as [
        PointClass,
        PointClass,
        PointClass
      ]
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
  constructor(public points: [PointClass, PointClass, PointClass]) {}

  public get values(): [number, number, number, number, number, number] {
    return this.points.reduce(
      (acc: number[], po) => [...acc, po.x, po.y],
      []
    ) as [number, number, number, number, number, number]
  }

  public get point(): PointClass {
    return this.points[2]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    return new Curve(
      this.points.map((po) => po.add(p)) as [PointClass, PointClass, PointClass]
    )
  }

  public scale(r: number) {
    return new Curve(
      this.points.map((p) => p.scale(r)) as [PointClass, PointClass, PointClass]
    )
  }

  public scaleX(r: number) {
    return new Curve(
      this.points.map((p) => p.scaleX(r)) as [
        PointClass,
        PointClass,
        PointClass
      ]
    )
  }

  public scaleY(r: number) {
    return new Curve(
      this.points.map((p) => p.scaleY(r)) as [
        PointClass,
        PointClass,
        PointClass
      ]
    )
  }

  public clone() {
    return new Curve(
      this.points.map((p) => p.clone()) as [PointClass, PointClass, PointClass]
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
  constructor(public points: [PointClass, PointClass]) {}

  public get values(): [number, number, number, number] {
    return this.points.reduce(
      (acc: number[], po) => [...acc, po.x, po.y],
      []
    ) as [number, number, number, number]
  }

  public get point(): PointClass {
    return this.points[1]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    return new ShortcutCurve(
      this.points.map((po) => po.add(p)) as [PointClass, PointClass]
    )
  }

  public scale(r: number) {
    return new ShortcutCurve(
      this.points.map((p) => p.scale(r)) as [PointClass, PointClass]
    )
  }

  public scaleX(r: number) {
    return new ShortcutCurve(
      this.points.map((p) => p.scaleX(r)) as [PointClass, PointClass]
    )
  }

  public scaleY(r: number) {
    return new ShortcutCurve(
      this.points.map((p) => p.scaleY(r)) as [PointClass, PointClass]
    )
  }

  public clone() {
    return new ShortcutCurve(
      this.points.map((p) => p.clone()) as [PointClass, PointClass]
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
  constructor(public points: [PointClass, PointClass]) {}

  public get values(): [number, number, number, number] {
    return this.points.reduce(
      (acc: number[], po) => [...acc, po.x, po.y],
      []
    ) as [number, number, number, number]
  }

  public get point(): PointClass {
    return this.points[1]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    return new RelativeShortcutCurve(
      this.points.map((po) => po.add(p)) as [PointClass, PointClass]
    )
  }

  public scale(r: number) {
    return new RelativeShortcutCurve(
      this.points.map((p) => p.scaleX(r)) as [PointClass, PointClass]
    )
  }

  public scaleX(r: number) {
    return new RelativeShortcutCurve(
      this.points.map((p) => p.scaleX(r)) as [PointClass, PointClass]
    )
  }

  public scaleY(r: number) {
    return new RelativeShortcutCurve(
      this.points.map((p) => p.scaleY(r)) as [PointClass, PointClass]
    )
  }

  public clone() {
    return new RelativeShortcutCurve(
      this.points.map((po) => po.clone()) as [PointClass, PointClass]
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
  constructor(public points: [PointClass, PointClass]) {}

  public get values(): [number, number, number, number] {
    return this.points.reduce(
      (acc: number[], po) => [...acc, po.x, po.y],
      []
    ) as [number, number, number, number]
  }

  public get point(): PointClass {
    return this.points[1]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    return new QuadraticCurve(
      this.points.map((po) => po.add(p)) as [PointClass, PointClass]
    )
  }

  public scale(r: number) {
    return new QuadraticCurve(
      this.points.map((p) => p.scale(r)) as [PointClass, PointClass]
    )
  }

  public scaleX(r: number) {
    return new QuadraticCurve(
      this.points.map((p) => p.scaleX(r)) as [PointClass, PointClass]
    )
  }

  public scaleY(r: number) {
    return new QuadraticCurve(
      this.points.map((p) => p.scaleY(r)) as [PointClass, PointClass]
    )
  }

  public clone() {
    return new QuadraticCurve(
      this.points.map((p) => p.clone()) as [PointClass, PointClass]
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
  constructor(public points: [PointClass, PointClass]) {}

  public get values(): [number, number, number, number] {
    return this.points.reduce(
      (acc: number[], po) => [...acc, po.x, po.y],
      []
    ) as [number, number, number, number]
  }

  public get point(): PointClass {
    return this.points[1]
  }

  public toString() {
    return `${this.type}${this.values.join(' ')}`
  }

  public translate(p: PointObject) {
    return new RelativeQuadraticCurve(
      this.points.map((po) => po.add(p)) as [PointClass, PointClass]
    )
  }

  public scale(r: number) {
    return new RelativeQuadraticCurve(
      this.points.map((p) => p.scaleX(r)) as [PointClass, PointClass]
    )
  }

  public scaleX(r: number) {
    return new RelativeQuadraticCurve(
      this.points.map((p) => p.scaleX(r)) as [PointClass, PointClass]
    )
  }

  public scaleY(r: number) {
    return new RelativeQuadraticCurve(
      this.points.map((p) => p.scaleY(r)) as [PointClass, PointClass]
    )
  }

  public clone() {
    return new RelativeQuadraticCurve(
      this.points.map((po) => po.clone()) as [PointClass, PointClass]
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
    return new Close()
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

export const createCommand = (
  type: CommandType,
  values: number[] = []
): CommandClass => {
  switch (type) {
    case 'M': {
      return new Move(new Point(values[0], values[1]))
    }
    case 'm': {
      return new RelativeMove(new Point(values[0], values[1]))
    }
    case 'L': {
      return new Line(new Point(values[0], values[1]))
    }
    case 'l': {
      return new RelativeLine(new Point(values[0], values[1]))
    }
    case 'C': {
      return new Curve([
        new Point(values[0], values[1]),
        new Point(values[2], values[3]),
        new Point(values[4], values[5]),
      ])
    }
    case 'c': {
      return new RelativeCurve([
        new Point(values[0], values[1]),
        new Point(values[2], values[3]),
        new Point(values[4], values[5]),
      ])
    }
    case 'Q': {
      return new QuadraticCurve([
        new Point(values[0], values[1]),
        new Point(values[2], values[3]),
      ])
    }
    case 'q': {
      return new RelativeQuadraticCurve([
        new Point(values[0], values[1]),
        new Point(values[2], values[3]),
      ])
    }
    case 'S': {
      return new ShortcutCurve([
        new Point(values[0], values[1]),
        new Point(values[2], values[3]),
      ])
    }
    case 's': {
      return new RelativeShortcutCurve([
        new Point(values[0], values[1]),
        new Point(values[2], values[3]),
      ])
    }
    case 'Z':
    case 'z': {
      return new Close()
    }

    default: {
      return new OtherCommand(type, values)
    }
  }
}

export const isAbsoluteCommand = (
  command: CommandClass
): command is CommandClass<AbsoluteCommandType> =>
  ['M', 'L', 'C', 'Q', 'S'].includes(command.type)

export const isRelativeCommand = (
  command: CommandClass
): command is CommandClass<RelativeCommandType> =>
  ['m', 'l', 'c', 'q', 's'].includes(command.type)

export const isCurveCommand = (
  command: CommandClass
): command is CommandClass<'C' | 'c'> => ['c', 'C'].includes(command.type)

export const isOtherCommand = (
  command: CommandClass
): command is CommandClass<OtherCommandType> =>
  ['h', 'H', 'v', 'V', 'a', 'A', 'z', 'Z'].includes(command.type)

export const toRelativeCommand = (
  command: CommandClass<AbsoluteCommandType>,
  basePoint: PointObject
): CommandClass<RelativeCommandType> => {
  switch (command.type) {
    case 'M':
      return new RelativeMove(command.point.sub(basePoint))
    case 'L':
      return new RelativeLine(command.point.sub(basePoint))
    case 'C':
      return new RelativeCurve(
        command.points.map((p) => p.sub(basePoint)) as [
          PointClass,
          PointClass,
          PointClass
        ]
      )
    case 'Q':
      return new RelativeQuadraticCurve(
        command.points.map((p) => p.sub(basePoint)) as [PointClass, PointClass]
      )
    case 'S':
      return new RelativeShortcutCurve(
        command.points.map((p) => p.sub(basePoint)) as [PointClass, PointClass]
      )
    default:
      throw new Error('toRelativeCommand error')
  }
}

export const toAbsoluteCommand = (
  command: CommandClass<RelativeCommandType>,
  basePoint: PointObject
): CommandClass<AbsoluteCommandType> => {
  switch (command.type) {
    case 'm':
      return new Move(command.point.add(basePoint))
    case 'l':
      return new Line(command.point.add(basePoint))
    case 'c':
      return new Curve(
        command.points.map((p) => p.add(basePoint)) as [
          PointClass,
          PointClass,
          PointClass
        ]
      )
    case 'q':
      return new QuadraticCurve(
        command.points.map((p) => p.add(basePoint)) as [PointClass, PointClass]
      )
    case 's':
      return new ShortcutCurve(
        command.points.map((p) => p.add(basePoint)) as [PointClass, PointClass]
      )
    default:
      throw new Error('toAbsoluteCommand error')
  }
}
