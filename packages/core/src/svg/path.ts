import {
  Close,
  Curve,
  Line,
  Move,
  OtherCommand,
  QuadraticCurve,
  ShortcutCurve,
  RelativeMove,
  RelativeLine,
  RelativeQuadraticCurve,
  RelativeShortcutCurve,
  RelativeCurve,
} from './command'
import { Point } from './point'
import { kebab2camel } from '../utils'
import type { Command, PathObject, PointObject } from '../types'

/**
 * @todo: refactor command. The following commands are not supported.
 *
 * Cannot support commands that use `M` or` z` more than once `M 0 0 L 1 1 Z M 1 1 L 2 2 Z`
 */
export class Path {
  public attrs: PathObject
  public commands: Command[]

  constructor({ d, ...attrs }: PathObject = {}) {
    this.attrs = attrs
    this.commands = []
    if (d) this.parseCommandString(d)
  }

  public scale(r: number): this {
    this.commands = this.commands.map((c: Command) => c.scale(r))
    this.attrs.strokeWidth = String(r * +(this.attrs.strokeWidth || 0))
    return this
  }

  public scaleX(r: number): this {
    this.commands = this.commands.map((c: Command) => c.scaleX(r))
    return this
  }

  public scaleY(r: number): this {
    this.commands = this.commands.map((c: Command) => c.scaleY(r))
    return this
  }

  public addCommand(param: Command | Command[]): this {
    if (Array.isArray(param)) {
      this.commands.push(...param)
    } else {
      this.commands.push(param)
    }
    return this
  }

  public deleteCommand(i: number): this {
    this.commands.splice(i, 1)
    return this
  }

  public getCommandString(): string {
    if (this.commands.length === 0) return ''
    return this.commands
      .map((com: Command, _i: number) => com.toString())
      .join(' ')
      .trim()
  }

  /** @todo Remove basePoint */
  public parseCommandString(d: string): void {
    const commandsTypes = 'mlsqlhvcsqaz'
    // expect ['M 0 0 ', 'M', ' 0 0 ', ...]
    const regexp = new RegExp(
      `([${commandsTypes}])([^${commandsTypes}]*)`,
      'gi'
    )

    this.commands = [...(d.matchAll(regexp) || [])].reduce(
      (acc: Command<any>[], match: RegExpMatchArray, i) => {
        const values =
          match[2]
            .split(/[\,\s]/)
            ?.reduce(
              (acc: number[], str) => (str === '' ? acc : [...acc, +str]),
              []
            ) || []
        switch (match[1]) {
          case 'M': {
            return [...acc, new Move(new Point(values[0], values[1]))]
          }
          case 'm': {
            return [
              ...acc,
              new RelativeMove(
                acc[i - 1].point as Point,
                new Point(values[0], values[1])
              ),
            ]
          }
          case 'L': {
            return [...acc, new Line(new Point(values[0], values[1]))]
          }
          case 'l': {
            return [
              ...acc,
              new RelativeLine(
                acc[i - 1].point as Point,
                new Point(values[0], values[1])
              ),
            ]
          }
          case 'C': {
            return [
              ...acc,
              new Curve([
                new Point(values[0], values[1]),
                new Point(values[2], values[3]),
                new Point(values[4], values[5]),
              ]),
            ]
          }
          case 'c': {
            return [
              ...acc,
              new RelativeCurve(acc[i - 1].point as Point, [
                new Point(values[0], values[1]),
                new Point(values[2], values[3]),
                new Point(values[4], values[5]),
              ]),
            ]
          }
          case 'Q': {
            return [
              ...acc,
              new QuadraticCurve([
                new Point(values[0], values[1]),
                new Point(values[2], values[3]),
              ]),
            ]
          }
          case 'q': {
            return [
              ...acc,
              new RelativeQuadraticCurve(acc[i - 1].point as Point, [
                new Point(values[0], values[1]),
                new Point(values[2], values[3]),
              ]),
            ]
          }
          case 'S': {
            return [
              ...acc,
              new ShortcutCurve([
                new Point(values[0], values[1]),
                new Point(values[2], values[3]),
              ]),
            ]
          }
          case 's': {
            return [
              ...acc,
              new RelativeShortcutCurve(acc[i - 1].point as Point, [
                new Point(values[0], values[1]),
                new Point(values[2], values[3]),
              ]),
            ]
          }
          case 'Z':
          case 'z': {
            return [...acc, new Close()]
          }

          default: {
            return [...acc, new OtherCommand(match[1] as any, values)]
          }
        }
      },
      []
    )
  }

  public parsePathElement(pEl: SVGPathElement): this {
    for (let i = 0; i < pEl.attributes.length; i += 1) {
      const attr: Attr | null = pEl.attributes.item(i)
      if (!attr || !attr.value) continue
      if (attr.name === 'd') {
        this.parseCommandString(attr.value)
        continue
      }
      this.attrs = {
        ...this.attrs,
        [kebab2camel(attr.name)]: attr.value,
      }
    }
    return this
  }

  public toJson(): PathObject {
    return {
      ...this.attrs,
      d: this.getCommandString(),
    }
  }

  public translate(po: PointObject): void {
    for (let i = 0; i < this.commands.length; i += 1) {
      this.commands[i].translate(po)
    }
  }

  public clone(): Path {
    const path = new Path(this.attrs)
    this.commands.map((c) => {
      path.commands.push(c.clone())
    })
    return path
  }
}
