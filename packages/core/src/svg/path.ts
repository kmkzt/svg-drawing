import { toAbsoluteCommands, toRelativeCommands } from '.'
import { isRelativeCommand } from './command'
import type {
  PathClass,
  CommandClass,
  PathAttributes,
  PointObject,
  PathObject,
} from '../types'

/**
 * @todo: refactor command. The following commands are not supported.
 *
 * Cannot support commands that use `M` or` z` more than once `M 0 0 L 1 1 Z M 1 1 L 2 2 Z`
 */
export class Path implements PathClass {
  private static index = 0
  private static genIndex = () => (Path.index += 1)
  public commands: CommandClass[] = []
  public key: string
  constructor(public attrs: PathAttributes = {}, _key?: string) {
    this.key = _key || `p${Path.genIndex()}`
  }

  public scale(r: number) {
    this.commands = this.commands.map((c: CommandClass) => c.scale(r))
    return this
  }

  public scaleX(r: number) {
    this.commands = this.commands.map((c: CommandClass) => c.scaleX(r))
    return this
  }

  public scaleY(r: number) {
    this.commands = this.commands.map((c: CommandClass) => c.scaleY(r))
    return this
  }

  public addCommand(param: CommandClass | CommandClass[]) {
    if (Array.isArray(param)) {
      this.commands.push(...param)
    } else {
      this.commands.push(param)
    }
    return this
  }

  public deleteCommand(i: number) {
    this.commands.splice(i, 1)
    return this
  }

  public getCommandString() {
    return (
      this.commands
        ?.map((com: CommandClass, _i: number) => com.toString())
        .join(' ')
        .trim() || ''
    )
  }

  public toJson(): PathObject {
    return {
      key: this.key,
      type: 'path',
      attributes: {
        ...this.attrs,
        d: this.getCommandString(),
      },
    }
  }

  public setAttributes(attrs: PathAttributes) {
    this.attrs = attrs

    return this
  }

  public updateAttributes(attrs: PathAttributes) {
    this.attrs = {
      ...this.attrs,
      ...attrs,
    }

    return this
  }

  public translate(po: PointObject) {
    for (let i = 0; i < this.commands.length; i += 1) {
      if (isRelativeCommand(this.commands[i])) continue
      this.commands[i] = this.commands[i].translate(po)
    }
    return this
  }

  public clone() {
    return new Path(
      {
        ...this.attrs,
      },
      this.key
    ).addCommand(this.commands.map((c) => c.clone()))
  }
}

export const toRelativePath = (path: PathClass): PathClass => {
  const upd = path.clone()
  upd.commands = toRelativeCommands(upd.commands)

  return upd
}

export const toAbsolutePath = (path: PathClass): PathClass => {
  const upd = path.clone()
  upd.commands = toAbsoluteCommands(upd.commands)

  return upd
}
