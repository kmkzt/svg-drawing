import { Point, Command, COMMAND_TYPE } from './svg'
import { PointObject } from './types'

interface BezierCurveOption {
  ratio?: number
}
export class BezierCurve {
  public ratio: number
  constructor({ ratio }: BezierCurveOption = {}) {
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

  public createCommand(
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

  public convertCommandFromPoint(points: PointObject[]): Command[] {
    const commands: Command[] = []
    // Debugger
    // const debug: any = []
    for (let i = 0; i < points.length; i += 1) {
      const po = points[i]
      if (i === 0) {
        commands.push(new Command(COMMAND_TYPE.MOVE, [po.x, po.y]))
        continue
      }
      const prev = i - 2
      const next = i + 2
      const sliceArg = [prev > 0 ? prev : 0, next]
      const p = points.slice(...sliceArg)
      // Debugger
      // debug.push({
      //   i,
      //   sliceArg,
      //   slicePoints: p,
      //   points,
      // })
      if (p.length === 4) {
        commands.push(this.createCommand(p[0], p[1], p[2], p[3]))
        continue
      }
      if (p.length === 3) {
        commands.push(this.createCommand(p[0], p[1], p[2], p[2]))
        continue
      }
      commands.push(new Command(COMMAND_TYPE.LINE, [po.x, po.y]))
    }
    // Debugger
    // console.log({ commands, points, debug })
    return commands
  }
}
