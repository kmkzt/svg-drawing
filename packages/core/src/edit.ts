import { Path } from './svg'
import { PointObject, ControlPoint } from './types'

const genOutline = (points: PointObject[]) =>
  points.reduce(
    (str, po, i) => (i === 0 ? `M ${po.x} ${po.y}` : str + `L ${po.x} ${po.y}`),
    ''
  )

export class EditPath {
  constructor(public path: Path) {}

  public controlPoint(): ControlPoint[] {
    const result: ControlPoint[] = []
    const commands = this.path.commands
    for (let i = 0; i < commands.length; i += 1) {
      const curr = commands[i]
      const next = commands[i + 1]
      const outlinePoints = [
        curr.cr?.toJson(),
        curr.point?.toJson(),
        next?.cl?.toJson(),
      ].filter(Boolean) as PointObject[]
      result.push({
        point: curr.point?.toJson(),
        prev: curr.cl?.toJson(),
        next: curr.cr?.toJson(),
        d: genOutline(outlinePoints),
      })
    }
    return result
  }
}
