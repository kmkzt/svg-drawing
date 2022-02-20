import { toAbsoluteCommands, toRelativeCommands } from './command'
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
  private commands: CommandClass[] = []
  public key: string
  constructor(public attrs: PathAttributes = {}, _key?: string) {
    this.key = _key || `p${Path.genIndex()}`
  }

  get absoluteCommands(): CommandClass[] {
    return toAbsoluteCommands(this.commands)
  }

  get relativeCommands(): CommandClass[] {
    return toRelativeCommands(this.commands)
  }

  updateCommands(commands: CommandClass[]) {
    this.commands = toRelativeCommands(commands)

    return this
  }

  scale(r: number) {
    this.updateCommands(this.commands.map((c: CommandClass) => c.scale(r)))
    return this
  }

  scaleX(r: number) {
    this.updateCommands(this.commands.map((c: CommandClass) => c.scaleX(r)))
    return this
  }

  scaleY(r: number) {
    this.updateCommands(this.commands.map((c: CommandClass) => c.scaleY(r)))
    return this
  }

  addCommand(param: CommandClass | CommandClass[]) {
    this.updateCommands([...this.commands, param].flat())
    return this
  }

  updateCommand(
    i: number,
    update: (absoluteCommand: CommandClass) => CommandClass
  ) {
    const commands = this.absoluteCommands
    commands[i] = update(commands[i])

    this.updateCommands(commands)
    return this
  }

  deleteCommand(i: number) {
    this.updateCommands(this.absoluteCommands.filter((_, index) => index !== i))
    return this
  }

  getCommandString() {
    return (
      this.relativeCommands
        ?.map((com: CommandClass, _i: number) => com.toString())
        .join(' ')
        .trim() || ''
    )
  }

  toJson(): PathObject {
    return {
      key: this.key,
      type: 'path',
      attributes: {
        ...this.attrs,
        d: this.getCommandString(),
      },
    }
  }

  setAttributes(attrs: PathAttributes) {
    this.attrs = attrs

    return this
  }

  updateAttributes(attrs: PathAttributes) {
    this.attrs = {
      ...this.attrs,
      ...attrs,
    }

    return this
  }

  translate(po: PointObject) {
    this.updateCommands(this.absoluteCommands.map((com) => com.translate(po)))

    return this
  }

  clone() {
    return new Path(
      {
        ...this.attrs,
      },
      this.key
    ).addCommand(this.commands.map((c) => c.clone()))
  }
}
