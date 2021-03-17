import { Point, Command, COMMAND_TYPE } from './svg'
import { PointObject, ConvertOption } from './types'

export class Convert {
  public ratio: number
  constructor({ ratio }: ConvertOption = {}) {
    this.ratio = ratio ?? 0.2
  }
  private _controlPoint(
    pr: PointObject,
    st: PointObject,
    ne: PointObject
  ): [number, number] {
    const prev = new Point(pr.x, pr.y)
    const start = new Point(st.x, st.y)
    const next = new Point(ne.x, ne.y)
    const vector = next.sub(prev).toVector().scale(this.ratio).toPoint()
    const po = start.add(vector)
    return [po.x, po.y]
  }

  public bezierCurve(
    p1: PointObject,
    p2: PointObject,
    p3: PointObject,
    p4: PointObject
  ): Command {
    const value = [
      ...this._controlPoint(p1, p2, p3),
      ...this._controlPoint(p4, p3, p2),
      p3.x,
      p3.y,
    ]
    return new Command(COMMAND_TYPE.CURVE, value)
  }

  public lineCommands(points: PointObject[]): Command[] {
    return points.map(
      (p, i) =>
        new Command(i === 0 ? COMMAND_TYPE.MOVE : COMMAND_TYPE.LINE, [p.x, p.y])
    )
  }

  public bezierCurveCommands(p: PointObject[]): Command[] {
    const commands: Command[] = []
    if (p.length < 3) {
      return this.lineCommands(p)
    }
    for (let i = 0; i < p.length; i += 1) {
      if (i === 0) {
        commands.push(new Command(COMMAND_TYPE.MOVE, [p[i].x, p[i].y]))
        continue
      }
      commands.push(
        this.bezierCurve(
          p[i - 2 < 0 ? 0 : i - 2],
          p[i - 1],
          p[i],
          i < p.length - 1 ? p[i + 1] : p[i]
        )
      )
    }
    return commands
  }
}
