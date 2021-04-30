import { Path, Point } from './svg'
import { PointObject, ControlPoint, BoundingBox, PathObject } from './types'

const genOutline = (points: PointObject[]) =>
  points.reduce(
    (str, po, i) => (i === 0 ? `M ${po.x} ${po.y}` : str + `L ${po.x} ${po.y}`),
    ''
  )

export class EditPath {
  constructor(public path: Path) {}

  public edit({ d, ...attrs }: PathObject) {
    this.path.attrs = {
      ...this.path.attrs,
      ...attrs,
    }
    if (d) this.path.parseCommandString(d)
  }

  public translate(
    po: PointObject,
    {
      command,
      value,
    }: {
      command?: number
      value?: number
    } = {}
  ): Path {
    const path = this.path.clone()
    if (command === undefined) {
      path.translate(po)
      return path
    }
    const com = path.commands[command]
    if (value === undefined) {
      com.translate(po)
      return path
    }
    com.value[value] += po.x
    com.value[value + 1] += po.y

    return path
  }
  /**
   * @todo compatible relative point
   */
  public get points(): Point[] {
    const commands = this.path.commands
    return commands.reduce(
      (p, com) => (com.point ? [...p, com.point] : p),
      [] as Point[]
    )
  }

  public get controlPoints(): ControlPoint[] {
    const controlPoints: ControlPoint[] = []
    const commands = this.path.commands
    for (let i = 0; i < commands.length; i += 1) {
      const curr = commands[i]
      const next = commands[i + 1]
      const outlinePoints = [
        curr.cr?.toJson(),
        curr.point?.toJson(),
        next?.cl?.toJson(),
      ].filter(Boolean) as PointObject[]
      const points: PointObject[] = [
        curr.cl?.toJson(),
        curr.cr?.toJson(),
        curr.point?.toJson(),
      ].filter(Boolean) as PointObject[]
      controlPoints.push({
        points,
        d: genOutline(outlinePoints),
      })
    }
    return controlPoints
  }

  public get boundingBox(): BoundingBox {
    const points = this.points
    if (!points.length)
      return {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      }
    let minX = points[0].x
    let minY = points[0].y
    let maxX = points[0].x
    let maxY = points[0].y
    for (let i = 1; i < points.length; i += 1) {
      const po = points[i]
      if (po.x < minX) minX = po.x
      if (po.x > maxX) maxX = po.x
      if (po.y < minY) minY = po.y
      if (po.y > maxY) maxY = po.y
    }

    return {
      width: maxX - minX,
      height: maxY - minY,
      x: minX,
      y: minY,
    }
  }
}
