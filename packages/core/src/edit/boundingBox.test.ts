import { BoundingBox } from './boundingBox'
import { Curve, Move } from '../svg/command'
import { Path } from '../svg/path'
import { Point } from '../svg/point'

const exampleData = new Path()
  .addCommand(new Move(new Point(0, 0)))
  .addCommand(
    new Curve([new Point(20, 20), new Point(60, 80), new Point(100, 100)])
  )
  .addCommand(
    new Curve([new Point(140, 120), new Point(160, 120), new Point(200, 100)])
  )
  .addCommand(
    new Curve([new Point(240, 80), new Point(280, 20), new Point(300, 0)])
  )

describe('BoundingBox', () => {
  describe('BoundingBox of Curve Path', () => {
    const boundingBox = new BoundingBox([exampleData])

    const testData = {
      position: {
        x: 0,
        y: 0,
      },
      size: {
        height: 115,
        width: 300,
      },
      vertex: {
        LeftBottom: {
          x: 0,
          y: 115,
        },
        LeftTop: {
          x: 0,
          y: 0,
        },
        RightBottom: {
          x: 300,
          y: 115,
        },
        RightTop: {
          x: 300,
          y: 0,
        },
      },
    }

    it('boundingBox.toJson()', () => {
      expect(boundingBox.toJson()).toStrictEqual(testData)
    })

    describe('boundingBox.resizeParams', () => {
      it('Move the vertex and scale double', () => {
        const scale = {
          x: 2,
          y: 2,
        }

        expect(
          boundingBox.resizeParams('LeftTop', {
            x: -testData.size.width,
            y: -testData.size.height,
          })
        ).toEqual({
          move: {
            x: -testData.size.width,
            y: -testData.size.height,
          },
          scale,
        })

        expect(
          boundingBox.resizeParams('RightTop', {
            x: testData.size.width,
            y: -testData.size.height,
          })
        ).toEqual({
          move: {
            x: -0,
            y: -testData.size.height,
          },
          scale,
        })

        expect(
          boundingBox.resizeParams('RightBottom', {
            x: testData.size.width,
            y: testData.size.height,
          })
        ).toEqual({
          move: {
            x: -0,
            y: -0,
          },
          scale,
        })

        expect(
          boundingBox.resizeParams('LeftBottom', {
            x: -testData.size.width,
            y: testData.size.height,
          })
        ).toEqual({
          move: {
            x: -testData.size.width,
            y: -0,
          },
          scale,
        })
      })
    })
  })
})
