import {
  isRelativeCommand,
  toAbsoluteCommands,
  toRelativeCommands,
} from './command'
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

  public updateCommand(
    i: number,
    update: (absoluteCommand: CommandClass) => CommandClass
  ) {
    const commands = toAbsoluteCommands(this.commands)
    commands[i] = update(commands[i])

    this.commands = toRelativeCommands(commands)
    return this
  }

  public deleteCommand(i: number) {
    const commands = toAbsoluteCommands(this.commands)
    commands.splice(i, 1)

    this.commands = toRelativeCommands(commands)
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
    this.commands = this.commands.map((com) => {
      return isRelativeCommand(com) ? com : com.translate(po)
    })

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
