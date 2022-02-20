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
    expect(calculateCoefficient(testData)).toMatchInlineSnapshot(`
      Object {
        "a": Object {
          "x": 140,
          "y": 100,
        },
        "b": Object {
          "x": -360,
          "y": -360,
        },
        "c": Object {
          "x": 420,
          "y": 360,
        },
      }
    `)
  })

  it('segmentPoint', () => {
    const points = segmentPoint(testData)
    expect(points).toMatchInlineSnapshot(`
      Array [
        Object {
          "x": 0,
          "y": 0,
        },
        Object {
          "x": 38.54,
          "y": 32.5,
        },
        Object {
          "x": 70.72,
          "y": 58.4,
        },
        Object {
          "x": 97.38000000000001,
          "y": 78.30000000000001,
        },
        Object {
          "x": 119.35999999999999,
          "y": 92.79999999999998,
        },
        Object {
          "x": 137.5,
          "y": 102.5,
        },
        Object {
          "x": 152.64000000000001,
          "y": 108.00000000000001,
        },
        Object {
          "x": 165.61999999999998,
          "y": 109.9,
        },
        Object {
          "x": 177.27999999999997,
          "y": 108.79999999999998,
        },
        Object {
          "x": 188.45999999999998,
          "y": 105.29999999999998,
        },
        Object {
          "x": 200,
          "y": 100,
        },
      ]
    `)
    expect(
      points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join('')
    ).toMatchInlineSnapshot(
      `"M0 0L38.54 32.5L70.72 58.4L97.38000000000001 78.30000000000001L119.35999999999999 92.79999999999998L137.5 102.5L152.64000000000001 108.00000000000001L165.61999999999998 109.9L177.27999999999997 108.79999999999998L188.45999999999998 105.29999999999998L200 100"`
    )
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
