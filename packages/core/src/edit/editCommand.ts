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

  getAnchorPoints(commandIndex: number):
    | {
        prev: AnchorPoint
        point: AnchorPoint
        next?: AnchorPoint
      }
    | undefined {
    const current = this.getCurveAnchorPoint(commandIndex)

    if (!current) return undefined

    return {
      prev: current[1],
      point: current[2],
      next: this.getCurveAnchorPoint(commandIndex + 1)?.[0],
    }
  }

  toJson(): EditCommandObject[] {
    return this.path.absoluteCommands
      .map((command, index): EditCommandObject | undefined => {
        if (!command.point) return undefined

        const anchorPoints = this.getAnchorPoints(index)

        return {
          index,
          value: command.point.toJson(),
          selected: this.isSelected(index),
          anchorPoints: anchorPoints
            ? [
                anchorPoints.prev,
                ...(anchorPoints?.next ? [anchorPoints?.next] : []),
              ]
            : [],
          outline: this.getOutline(index),
        }
      })
      .filter((c): c is EditCommandObject => c !== undefined)
  }

  private getCurveAnchorPoint(
    commandIndex: number
  ): [AnchorPoint, AnchorPoint, AnchorPoint] | undefined {
    const current = this.getCurvePoints(commandIndex)
    if (!current) return undefined

    return current.map((value, pointIndex): AnchorPoint => {
      const index = {
        command: commandIndex,
        point: pointIndex,
      }

      return {
        index,
        value,
        selected: this.selector.isSelected({
          type: 'path/point',
          key: this.path.key,
          index,
        }),
      }
    }) as [AnchorPoint, AnchorPoint, AnchorPoint]
  }

  private getCurvePoints(
    commandIndex: number
  ): [PointObject, PointObject, PointObject] | undefined {
    const command = this.path.absoluteCommands[commandIndex]
    if (!command) return undefined

    if (isCurveCommand(command)) {
      return command.points.map((p) => p.toJson()) as [
        PointObject,
        PointObject,
        PointObject
      ]
    }

    return undefined
  }

  private getOutline(commandIndex: number): string | undefined {
    const prev = this.getCurvePoints(commandIndex)
    const next = this.getCurvePoints(commandIndex + 1)

    if (!prev) return undefined

    return [prev[1], prev[2], next?.[0]]
      .filter((p): p is PointObject => p !== undefined)
      .reduce(
        (str, po, i) =>
          i === 0 ? `M ${po.x} ${po.y}` : str + `L ${po.x} ${po.y}`,
        ''
      )
  }

  private isSelected(commandIndex: number): boolean {
    if (
      this.selector.isSelected({
        type: 'path/command',
        key: this.path.key,
        index: { command: commandIndex },
      })
    ) {
      return true
    }

    const anchorPoints = this.getAnchorPoints(commandIndex)

    if (!anchorPoints) return false

    return Object.values(anchorPoints).some(
      (anchorPoint) => anchorPoint?.selected
    )
  }
}
