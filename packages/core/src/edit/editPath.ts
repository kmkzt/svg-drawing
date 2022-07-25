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

export class EditPath {
  constructor(private path: PathClass, private selector: PathSelector) {}

  public toJson(): EditPathObject {
    return {
      key: this.path.key,
      d: this.path.getCommandString(),
      vertex: this.vertex,
    }
  }

  private get vertex(): EditVertex[] {
    const vertex: EditVertex[] = []
    const commands = this.path.absoluteCommands

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
}
