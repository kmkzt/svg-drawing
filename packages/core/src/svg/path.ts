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
import type { Command, CommandType, PathObject, PointObject } from '../types'

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

  /**
   * @todo Fix parse 'L' | 'l' | 'M' | 'm' | 'C' | 'c'
   *
   * @todo Remove basePoint ?
   */
  public parseCommandString(d: string): void {
    this.commands = []
    const commandsTypes = 'mlsqlhvcsqaz'
    ;[
      ...(d.matchAll(
        new RegExp(`([${commandsTypes}])([^${commandsTypes}]*)`, 'gi')
      ) || []),
    ].map((match: RegExpMatchArray, i) => {
      const values =
        match[1]
          .split(/[\,\s]/)
          ?.reduce(
            (acc: number[], str) => (str === '' ? acc : [...acc, +str]),
            []
          ) || []
      switch (match[0]) {
        case 'M': {
          this.commands.push(new Move(new Point(values[0], values[1])))
          break
        }
        case 'm': {
          this.commands.push(
            new RelativeMove(
              this.commands[i - 1].point as Point,
              new Point(values[0], values[1])
            )
          )
          break
        }
        case 'L': {
          this.commands.push(new Line(new Point(values[0], values[1])))
          break
        }
        case 'l': {
          this.commands.push(
            new RelativeLine(
              this.commands[i - 1].point as Point,
              new Point(values[0], values[1])
            )
          )
          break
        }
        case 'C': {
          this.commands.push(
            new Curve([
              new Point(values[0], values[1]),
              new Point(values[2], values[3]),
              new Point(values[4], values[5]),
            ])
          )
          break
        }
        case 'c': {
          this.commands.push(
            new RelativeCurve(this.commands[i - 1].point as Point, [
              new Point(values[0], values[1]),
              new Point(values[2], values[3]),
              new Point(values[4], values[5]),
            ])
          )
          break
        }
        case 'Q': {
          this.commands.push(
            new QuadraticCurve([
              new Point(values[0], values[1]),
              new Point(values[2], values[3]),
            ])
          )
          break
        }
        case 'q': {
          this.commands.push(
            new RelativeQuadraticCurve(this.commands[i - 1].point as Point, [
              new Point(values[0], values[1]),
              new Point(values[2], values[3]),
            ])
          )
          break
        }
        case 'S': {
          this.commands.push(
            new ShortcutCurve([
              new Point(values[0], values[1]),
              new Point(values[2], values[3]),
            ])
          )
          break
        }
        case 's': {
          this.commands.push(
            new RelativeShortcutCurve(this.commands[i - 1].point as Point, [
              new Point(values[0], values[1]),
              new Point(values[2], values[3]),
            ])
          )
          break
        }
        case 'Z':
        case 'z': {
          this.commands.push(new Close())
          break
        }

        default: {
          this.commands.push(new OtherCommand(match[0] as any, values))
        }
      }
    })
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
