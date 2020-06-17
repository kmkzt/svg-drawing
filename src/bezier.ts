import { Point, Command, COMMAND_TYPE } from './svg'
import { roundUp } from './utils/roundUp'
interface BezierCurveOption {
  ratio?: number
}
export class BezierCurve {
  public ratio: number
  constructor({ ratio }: BezierCurveOption = {}) {
    this.ratio = ratio ?? 0.2
  }
  private _controlPoint(
    prev: Point,
    start: Point,
    next: Point
  ): [number, number] {
    const vector = next
      .sub(prev)
      .toVector()
      .scale(this.ratio)
      .toPoint()
    const po = start.add(vector)
    return [roundUp(po.x), roundUp(po.y)]
  }

  public createCommand(p1: Point, p2: Point, p3: Point, p4: Point): Command {
    const value = [
      ...this._controlPoint(p1, p2, p3),
      ...this._controlPoint(p4, p3, p2),
      roundUp(p3.x),
      roundUp(p3.y)
    ]
    return new Command(COMMAND_TYPE.CURVE, value)
  }
}
