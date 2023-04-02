import {
  calculateCoefficient,
  segmentPoint,
  segmentPointsFromCommand,
} from './segment'
import { createCommand } from '../svg/command'
import { Point } from '../svg/point'

describe('segment path', () => {
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
    expect(calculateCoefficient(testData)).toStrictEqual({
      a: {
        x: 140,
        y: 100,
      },
      b: {
        x: -360,
        y: -360,
      },
      c: {
        x: 420,
        y: 360,
      },
    })
  })

  it('segmentPoint', () => {
    const length = 10
    const points = segmentPoint(testData, length)

    expect(points.length).toBe(length)
    expect(points).toStrictEqual([
      {
        x: 0,
        y: 0,
      },
      {
        x: 42.41426611796982,
        y: 35.69272976680384,
      },
      {
        x: 77.09190672153635,
        y: 63.319615912208505,
      },
      {
        x: 105.18518518518519,
        y: 83.7037037037037,
      },
      {
        x: 127.8463648834019,
        y: 97.66803840877915,
      },
      {
        x: 146.22770919067216,
        y: 106.03566529492454,
      },
      {
        x: 161.48148148148147,
        y: 109.62962962962962,
      },
      {
        x: 174.7599451303155,
        y: 109.27297668038409,
      },
      {
        x: 187.21536351165975,
        y: 105.78875171467763,
      },
      {
        x: 200,
        y: 100,
      },
    ])
  })

  describe('segmentPointsFromCommand', () => {
    it('testData example', () => {
      expect(segmentPoint(testData)).toEqual(
        segmentPointsFromCommand(
          createCommand({
            type: 'C',
            values: [
              testData[1].x,
              testData[1].y,
              testData[2].x,
              testData[2].y,
              testData[3].x,
              testData[3].y,
            ],
          }),
          {
            base: new Point(testData[0].x, testData[0].y),
          }
        )
      )
    })
  })
})
