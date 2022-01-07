import { calculateCoefficient, calculatePoint } from './calculatePoint'

describe('BezierCurve calculate point', () => {
  const testData: Parameters<typeof calculateCoefficient>[0] = [
    {
      x: 0,
      y: 0,
    },
    {
      x: 140,
      y: 120,
    },
    {
      x: 160,
      y: 120,
    },
    {
      x: 200,
      y: 100,
    },
  ]
  it('calculateCoefficient', () => {
    expect(calculateCoefficient(testData)).toMatchSnapshot()
  })

  it('calculatePoint', () => {
    const points = calculatePoint(testData)
    expect(points).toMatchSnapshot()
    expect(
      points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join('')
    ).toMatchSnapshot()
  })
})
