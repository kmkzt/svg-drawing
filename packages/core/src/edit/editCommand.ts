import { isCurveCommand } from '../svg/command'
import type {
  EditCommandObject,
  AnchorPoint,
  PathClass,
  PointObject,
} from '../types'
import type { Selector } from './selector'

export class EditCommand {
  constructor(private path: PathClass, private selector: Selector) {}

  private convertAnchorPoint(index: {
    command: number
    point: 0 | 1 | 2
  }): AnchorPoint | undefined {
    const current = this.getPoints(index.command)
    if (!current) return undefined

    return {
      index,
      value: current[index.point],
      selected: this.selector.isSelected({
        type: 'path/point',
        key: this.path.key,
        index,
      }),
    }
  }

  private getPoints(
    commandIndex: number
  ): [PointObject, PointObject, PointObject] | undefined {
    const command = this.path.absoluteCommands[commandIndex]

    if (command && isCurveCommand(command)) {
      return command.points.map((p) => p.toJson()) as [
        PointObject,
        PointObject,
        PointObject
      ]
    }

    return undefined
  }

  private getAnchorPoints(commandIndex: number): AnchorPoint[] {
    const command = this.path.absoluteCommands[commandIndex]
    if (!command || !isCurveCommand(command)) return []

    return [
      this.convertAnchorPoint({ command: commandIndex, point: 1 }),
      this.convertAnchorPoint({ command: commandIndex + 1, point: 0 }),
    ].filter((arg): arg is AnchorPoint => arg !== undefined)
  }

  private getOutline(commandIndex: number): string | undefined {
    const prev = this.getPoints(commandIndex)
    const next = this.getPoints(commandIndex + 1)

    if (!prev) return undefined

    return [prev[1], prev[2], next?.[0]]
      .filter((p): p is PointObject => p !== undefined)
      .reduce(
        (str, po, i) =>
          i === 0 ? `M ${po.x} ${po.y}` : str + `L ${po.x} ${po.y}`,
        ''
      )
  }

  private getSelected(commandIndex: number): boolean {
    if (
      this.selector.isSelected({
        type: 'path/command',
        key: this.path.key,
        index: { command: commandIndex },
      })
    )
      return true

    const anchorPoints = this.getAnchorPoints(commandIndex)

    if (anchorPoints.length === 0) return false

    return anchorPoints.some(({ selected }) => selected)
  }

  toJson(): EditCommandObject[] {
    return this.path.absoluteCommands
      .map((command, index): EditCommandObject | undefined =>
        command.point
          ? {
              index,
              value: command.point.toJson(),
              selected: this.getSelected(index),
              anchorPoints: this.getAnchorPoints(index),
              outline: this.getOutline(index),
            }
          : undefined
      )
      .filter((c): c is EditCommandObject => c !== undefined)
  }
}
