import { toAbsoluteCommands, toRelativeCommands } from './command'
import type {
  PathClass,
  CommandClass,
  PathAttributes,
  PointObject,
  PathObject,
} from '../types'

/**
 * Cannot support commands that use `M` or` z` more than once.
 *
 * Not support example: `M 0 0 L 1 1 Z M 1 1 L 2 2 Z`.
 */
export class Path implements PathClass {
  private static index = 0
  private static genIndex = () => (Path.index += 1)
  private _relativeCommands: CommandClass[] = []
  public key: string
  constructor(public attrs: PathAttributes = {}, _key?: string) {
    this.key = _key || `p${Path.genIndex()}`
  }

  get absoluteCommands(): CommandClass[] {
    return toAbsoluteCommands(this._relativeCommands)
  }

  get relativeCommands(): CommandClass[] {
    return this._relativeCommands
  }

  setCommands(commands: ReadonlyArray<CommandClass> | Readonly<CommandClass>) {
    this._relativeCommands = toRelativeCommands([commands].flat())

    return this
  }

  addCommand(command: Readonly<CommandClass>) {
    this.setCommands([...this._relativeCommands, command])

    return this
  }

  updateCommand(
    i: number,
    update: (absoluteCommand: CommandClass) => CommandClass
  ) {
    const commands = this.absoluteCommands
    commands[i] = update(commands[i])

    this.setCommands(commands)
    return this
  }

  deleteCommand(i: number) {
    this.setCommands(this.absoluteCommands.filter((_, index) => index !== i))
    return this
  }

  scale(r: number) {
    this.setCommands(
      this._relativeCommands.map((c: CommandClass) => c.scale(r))
    )
    return this
  }

  scaleX(r: number) {
    this.setCommands(
      this._relativeCommands.map((c: CommandClass) => c.scaleX(r))
    )
    return this
  }

  scaleY(r: number) {
    this.setCommands(
      this._relativeCommands.map((c: CommandClass) => c.scaleY(r))
    )
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
    if (
      this._relativeCommands.length === 0 &&
      this._relativeCommands[0].type !== 'M'
    ) {
      return this
    }

    this._relativeCommands[0] = this._relativeCommands[0].translate(po)

    return this
  }

  clone() {
    return new Path(
      {
        ...this.attrs,
      },
      this.key
    ).setCommands(this._relativeCommands.map((c) => c.clone()))
  }
}
