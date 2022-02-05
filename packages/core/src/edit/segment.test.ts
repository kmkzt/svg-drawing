import {
  calculateCoefficient,
  segmentPoint,
  segmentPointsFromCommand,
} from './segment'
import { Curve } from '../svg/command'
import { Point } from '../svg/point'

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

  it('segmentPoint', () => {
    const points = segmentPoint(testData)
    expect(points).toMatchSnapshot()
    expect(
      points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join('')
    ).toMatchSnapshot()
  })

  describe('segmentPointsFromCommand', () => {
    it('testData example', () => {
      expect(segmentPoint(testData)).toEqual(
        segmentPointsFromCommand(
          new Curve([
            new Point(testData[1].x, testData[1].y),
            new Point(testData[2].x, testData[2].y),
            new Point(testData[3].x, testData[3].y),
          ]),
          {
            base: new Point(testData[0].x, testData[0].y),
          }
        )
      )
    })
  })
})
