import type { PointObject, AnchorPoint, PathClass } from '../types'
import type { Selector } from './selector'

const genOutline = (points: PointObject[]) =>
  points.reduce(
    (str, po, i) => (i === 0 ? `M ${po.x} ${po.y}` : str + `L ${po.x} ${po.y}`),
    ''
  )

export class AnchorPoints {
  constructor(private path: PathClass, private selector: Selector) {}

  toJson(): AnchorPoint[] {
    const vertex: AnchorPoint[] = []
    const commands = this.path.absoluteCommands

    for (let c = 0; c < commands.length; c += 1) {
      const curr = commands[c]
      const next = commands[c + 1]

      if (!curr.points.length) continue

      const outlinePoints: PointObject[] = [
        curr.points[1]?.toJson(),
        curr.points[2]?.toJson(),
        next?.points[0]?.toJson(),
      ].filter((p): p is PointObject => !!p)

      vertex.push({
        points: curr.points.map((point, pIndex) => ({
          index: {
            path: this.path.key,
            command: c,
            point: pIndex,
          },
          value: point.toJson(),
          selected: this.selector.isSelected({
            type: 'path/point',
            key: this.path.key,
            index: { command: c, point: pIndex },
          }),
        })),
        d: genOutline(outlinePoints),
      })
    }

    return vertex
  }
}
