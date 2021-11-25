type Point = {
  x: number
  y: number
}

type BezierCurvePoint = [Point, Point, Point, Point]

export const calculateCoefficient = ([p0, p1, p2, p3]: BezierCurvePoint): {
  a: Point
  b: Point
  c: Point
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

export const calculatePoint = (bezierCurve: BezierCurvePoint, range = 10) => {
  const { a, b, c } = calculateCoefficient(bezierCurve)
  const p = bezierCurve[0]

  const calc = (t: number) => ({
    x: a.x * pow(t, 3) + b.x * pow(t, 2) + c.x * t + p.x,
    y: a.y * pow(t, 3) + b.y * pow(t, 2) + c.y * t + p.y,
  })

  const step = 1 / range
  return Array.from({ length: range + 1 }).map((_, i) =>
    calc(i === 0 ? 0 : i === range ? 1 : i * step)
  )
}
