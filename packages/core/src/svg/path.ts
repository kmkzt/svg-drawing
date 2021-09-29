import { OtherCommand } from './command'
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

  /** @todo Fix parse 'L' | 'l' | 'M' | 'm' | 'C' | 'c' */
  public parseCommandString(d: string): void {
    this.commands = []
    let type: CommandType | null = null
    let value: number[] = []
    const c = d.split(' ')
    for (let i = 0; i < c.length; i += 1) {
      const t = c[i]
      // COMMAND Parse
      if (OtherCommand.validTypes(t)) {
        if (!type) {
          type = t
          continue
        }

        this.commands.push(new OtherCommand(type, value))
        type = t
        value = []
        continue
      }
      if (isNaN(+c[i])) {
        return
      }
      value.push(+c[i])
    }

    if (type !== null) {
      this.commands.push(new OtherCommand(type, value))
    }
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
