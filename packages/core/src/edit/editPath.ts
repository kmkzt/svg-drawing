import { segmentPoint } from './segment'
import { isCurveCommand, toAbsolutePath } from '../svg'
import type {
  PointObject,
  EditVertex,
  EditPathObject,
  PathClass,
} from '../types'
import type { PathSelector } from './pathSelector'

const genOutline = (points: PointObject[]) =>
  points.reduce(
    (str, po, i) => (i === 0 ? `M ${po.x} ${po.y}` : str + `L ${po.x} ${po.y}`),
    ''
  )

/** @todo Rename PathEdit ? */
export class EditPath {
  constructor(private path: PathClass, private selector?: PathSelector) {}

  private get absolutePath() {
    return toAbsolutePath(this.path)
  }

  /** @todo Compatible for Quadratic and shortcut curve */
  get points(): PointObject[] {
    const points: PointObject[] = []
    let prev: PointObject | undefined = undefined

    this.absolutePath.commands.forEach((command) => {
      if (!command.point) {
        prev = undefined
        return
      }

      const addPoints: PointObject[] = isCurveCommand(command)
        ? segmentPoint([
            prev || (command.points[0].toJson() as PointObject),
            ...(command.points.map((p) => p.toJson()) as [
              PointObject,
              PointObject,
              PointObject
            ]),
          ])
        : [command.point]

      points.push(...addPoints)

      prev = command.point?.toJson()
    })

    return points
  }

  private get vertex(): EditVertex[] {
    const vertex: EditVertex[] = []
    const commands = this.absolutePath.commands
    for (let c = 0; c < commands.length; c += 1) {
      const curr = commands[c]
      const next = commands[c + 1]

      const outlinePoints: PointObject[] = [
        curr.points[1]?.toJson(),
        curr.points[2]?.toJson(),
        next?.points[0]?.toJson(),
      ].filter((p): p is PointObject => !!p)

      const pointIndex = this.selector?.getPointsIndex(this.path.key, c)

      vertex.push({
        points: curr.points.map((point, pIndex) => ({
          index: {
            path: this.path.key,
            command: c,
            point: pIndex,
          },
          value: point.toJson(),
          selected: pointIndex?.includes(pIndex) ?? false,
        })),
        d: genOutline(outlinePoints),
      })
    }

    return vertex
  }

  public toJson(): EditPathObject {
    return {
      key: this.path.key,
      d: this.path.getCommandString(),
      vertex: this.vertex,
    }
  }
}
