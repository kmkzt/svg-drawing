import { isCurveCommand } from '../svg/command'
import type { PointObject, CommandClass } from '../types'

type BezierCurvePoint = [PointObject, PointObject, PointObject, PointObject]

/**
 * Reference: https://www.moshplant.com/direct-or/bezier/math.html
 *
 * A cubic Bezier curve is defined by four points. Two are endpoints. (x0,y0) is
 * the origin endpoint. (x3,y3) is the destination endpoint. The points (x1,y1)
 * and (x2,y2) are control points.
 *
 * Two equations define the points on the curve. Both are evaluated for an
 * arbitrary number of values of t between 0 and 1. One equation yields values
 * for x, the other yields values for y. As increasing values for t are supplied
 * to the equations, the point defined by x(t),y(t) moves from the origin to the
 * destination. This is how the equations are defined in Adobe's PostScript references.
 *
 * X(t) = A(x) * pow(t, 3) + B(x) * pow(t, 2) + C(x) * t + x0
 *
 * Y(t) = A(y) * pow(t, 3) + B(y) * pow(t, 2) + c(y) * t + y0
 *
 * This method of definition can be reverse-engineered so that it'll give up the
 * coefficient values based on the points described above:
 *
 * C(x) = 3 (x1 - x0)
 *
 * B(x) = 3 (x2 - x1) - cx
 *
 * A(x) = x3 - x0 - cx - bx
 *
 * C(y) = 3 (y1 - y0)
 *
 * B(y) = 3 (y2 - y1) - cy
 *
 * A(y) = y3 - y0 - cy - by
 */
export const calculateCoefficient = ([p0, p1, p2, p3]: BezierCurvePoint): {
  a: PointObject
  b: PointObject
  c: PointObject
} => {
  const c = {
    x: 3 * (p1.x - p0.x),
    y: 3 * (p1.y - p0.y),
  }

  const b = {
    x: 3 * (p2.x - p1.x) - c.x,
    y: 3 * (p2.y - p1.y) - c.y,
  }

  const a = {
    x: p3.x - p0.x - c.x - b.x,
    y: p3.y - p0.y - c.y - b.y,
  }

  return { a, b, c }
}

const { pow } = Math

/** @todo Compatible for Quadratic and shortcut curve. */
export const segmentPoint = (
  bezierCurve: BezierCurvePoint,
  range = 10
): PointObject[] => {
  const { a, b, c } = calculateCoefficient(bezierCurve)
  const p = bezierCurve[0]

  const calc = (t: number): PointObject => ({
    x: a.x * pow(t, 3) + b.x * pow(t, 2) + c.x * t + p.x,
    y: a.y * pow(t, 3) + b.y * pow(t, 2) + c.y * t + p.y,
  })

  const step = 1 / range
  return Array.from({ length: range + 1 }).map((_, i) =>
    calc(i === 0 ? 0 : i === range ? 1 : i * step)
  )
}

/** @todo Compatible for Quadratic and shortcut curve */
export const segmentPointsFromCommand = (
  command: CommandClass,
  {
    base,
    range = 10,
  }: {
    base?: PointObject
    range?: number
  }
): PointObject[] => {
  if (!command.point) return []

  if (isCurveCommand(command)) {
    const basePoint = base || (command.points[0].toJson() as PointObject)
    const commandPoints = command.points.map((p) => p.toJson()) as [
      PointObject,
      PointObject,
      PointObject
    ]

    return segmentPoint([basePoint, ...commandPoints], range)
  }

  return [command.point.toJson()]
}
